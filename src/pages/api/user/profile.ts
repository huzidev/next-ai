import { verifyToken } from '@/lib/jwt';
import prisma from '@/utils/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ 
        success: false,
        message: 'No token provided' 
      });
    }

    console.log('Token received:', token.substring(0, 20) + '...');
    
    // Handle mock token for development
    if (token === 'mock-token-for-development') {
      console.log('Using mock token, returning mock user');
      
      const mockUser = {
        id: 'mock-user-id',
        email: 'test@example.com',
        username: 'testuser',
        isVerified: true,
        remainingTries: 95,
        createdAt: new Date().toISOString(),
        lastActiveAt: new Date().toISOString(),
        plan: {
          id: '1',
          name: 'free',
          tries: 100,
          price: 0
        },
        _count: {
          chatSessions: 8
        }
      };

      return res.status(200).json({
        success: true,
        user: mockUser,
      });
    }
    
    const decoded = verifyToken(token) as any;
    console.log('Token decoded:', decoded);
    
    if (!decoded || !decoded.id) {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid token' 
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      include: {
        plan: true,
        _count: {
          select: {
            chatSessions: true,
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Remove password from response
    const { password, ...userWithoutPassword } = user;

    res.status(200).json({
      success: true,
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
