import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    // Verify JWT token
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ success: false, error: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    const userId = decoded.userId;

    // Get all friendships for the user
    const friendships = await prisma.friendship.findMany({
      where: {
        OR: [
          { requesterId: userId },
          { receiverId: userId }
        ]
      },
      include: {
        requester: {
          select: {
            id: true,
            username: true
          }
        },
        receiver: {
          select: {
            id: true,
            username: true
          }
        }
      }
    });

    // Format friendship statuses
    const friendshipStatuses: { [userId: string]: string } = {};

    friendships.forEach(friendship => {
      const otherUserId = friendship.requesterId === userId ? friendship.receiverId : friendship.requesterId;
      const isRequester = friendship.requesterId === userId;

      switch (friendship.status) {
        case 'PENDING':
          friendshipStatuses[otherUserId] = isRequester ? 'pending_sent' : 'pending_received';
          break;
        case 'ACCEPTED':
          friendshipStatuses[otherUserId] = 'accepted';
          break;
        case 'DECLINED':
          friendshipStatuses[otherUserId] = 'none';
          break;
        case 'BLOCKED':
          friendshipStatuses[otherUserId] = 'blocked';
          break;
      }
    });

    return res.status(200).json({ 
      success: true, 
      friendships: friendshipStatuses
    });

  } catch (error) {
    console.error('Friendship status API error:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Internal server error' 
    });
  } finally {
    await prisma.$disconnect();
  }
}
