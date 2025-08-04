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

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    } catch (jwtError) {
      console.error('JWT verification error:', jwtError);
      return res.status(401).json({ success: false, error: 'Invalid token' });
    }

    const userId = decoded.userId;

    const mockFriends = [
      {
        id: 'mock-1',
        username: 'johnDoe',
        email: 'john@example.com',
        isVerified: true,
        lastActiveAt: new Date().toISOString(),
        status: 'accepted',
        friendshipId: 'friendship-1'
      }
    ];

    return res.status(200).json({ 
      success: true, 
      friends: mockFriends
    });

  } catch (error) {
    console.error('Friends list API error:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Internal server error' 
    });
  } finally {
    await prisma.$disconnect();
  }
}
