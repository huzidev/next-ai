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

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    } catch (jwtError) {
      console.error('JWT verification error:', jwtError);
      return res.status(401).json({ success: false, error: 'Invalid token' });
    }

    const userId = decoded.userId;
    const { requesterId } = req.body;

    if (!requesterId) {
      return res.status(400).json({ success: false, error: 'Requester ID is required' });
    }

    // Find the friendship where requesterId sent request to userId
    const friendship = await prisma.friendship.findFirst({
      where: {
        requesterId: requesterId,
        receiverId: userId,
        status: 'PENDING'
      }
    });

    if (!friendship) {
      return res.status(404).json({ success: false, error: 'Friend request not found' });
    }

    // Delete the friendship (decline the request)
    await prisma.friendship.delete({
      where: { id: friendship.id }
    });

    res.status(200).json({ 
      success: true, 
      message: 'Friend request declined successfully' 
    });

  } catch (error) {
    console.error('Error declining friend request:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
}
