import { verifyToken } from '@/lib/jwt';
import prisma from '@/utils/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    console.log('Token received:', token.substring(0, 20) + '...');

    // Verify the JWT token
    const decoded = verifyToken(token) as { id: string; iat: number; exp: number };
    if (!decoded || !decoded.id) {
      console.log('Invalid token');
      return res.status(401).json({ message: 'Invalid token' });
    }

    console.log('SW JWT verification successful for token:', token.substring(0, 20) + '...');
    console.log('Token decoded:', decoded);

    const userId = decoded.id;
    const { username, email } = req.body;

    // Validate input
    if (!username || !email) {
      return res.status(400).json({ message: 'Username and email are required' });
    }

    if (username.length < 3) {
      return res.status(400).json({ message: 'Username must be at least 3 characters' });
    }

    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    // Check if username or email already exists (excluding current user)
    const existingUser = await prisma.user.findFirst({
      where: {
        AND: [
          { id: { not: userId } },
          {
            OR: [
              { username: username },
              { email: email }
            ]
          }
        ]
      }
    });

    if (existingUser) {
      if (existingUser.username === username) {
        return res.status(400).json({ message: 'Username already taken' });
      }
      if (existingUser.email === email) {
        return res.status(400).json({ message: 'Email already in use' });
      }
    }

    // Update user profile
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        username,
        email,
        updatedAt: new Date()
      },
      include: {
        plan: true,
        _count: {
          select: {
            chatSessions: true
          }
        }
      }
    });

    console.log('User profile updated successfully:', updatedUser.id);

    // Return updated user data (excluding sensitive fields)
    const { password, ...userWithoutPassword } = updatedUser;
    res.status(200).json({
      message: 'Profile updated successfully',
      user: userWithoutPassword
    });

  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
