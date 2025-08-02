import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    // Verify JWT token
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ success: false, error: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    const requesterId = decoded.userId;
    
    const { receiverId } = req.body;

    if (!receiverId) {
      return res.status(400).json({ success: false, error: 'Receiver ID is required' });
    }

    if (requesterId === receiverId) {
      return res.status(400).json({ success: false, error: 'Cannot send friend request to yourself' });
    }

    // Check if friendship already exists
    const existingFriendship = await prisma.friendship.findFirst({
      where: {
        OR: [
          { requesterId, receiverId },
          { requesterId: receiverId, receiverId: requesterId }
        ]
      }
    });

    if (existingFriendship) {
      return res.status(400).json({ 
        success: false, 
        error: 'Friendship request already exists or you are already friends' 
      });
    }

    // Create friend request
    const friendship = await prisma.friendship.create({
      data: {
        requesterId,
        receiverId,
        status: 'PENDING'
      }
    });

    return res.status(201).json({ 
      success: true, 
      message: 'Friend request sent successfully',
      friendshipId: friendship.id
    });

  } catch (error) {
    console.error('Friend request API error:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Internal server error' 
    });
  } finally {
    await prisma.$disconnect();
  }
}
