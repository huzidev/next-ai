import { verifyToken } from '@/lib/jwt';
import prisma from '@/utils/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    console.log('Token received for account deletion:', token.substring(0, 20) + '...');

    // Verify the JWT token
    const decoded = verifyToken(token) as { id: string; iat: number; exp: number };
    if (!decoded || !decoded.id) {
      console.log('Invalid token for account deletion');
      return res.status(401).json({ message: 'Invalid token' });
    }

    console.log('SW JWT verification successful for account deletion:', token.substring(0, 20) + '...');
    console.log('User ID to delete:', decoded.id);

    const userId = decoded.id;

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, username: true, email: true }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    console.log('Deleting account for user:', user.username, user.email);

    // Delete user and all related data (cascade will handle related records)
    // Note: Make sure your Prisma schema has proper cascade delete configured
    await prisma.user.delete({
      where: { id: userId }
    });

    console.log('Account successfully deleted for user:', userId);

    res.status(200).json({
      message: 'Account deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting account:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
