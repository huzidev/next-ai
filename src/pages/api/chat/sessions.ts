import { verifyToken } from '@/lib/jwt';
import prisma from '@/utils/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = verifyToken(token) as any;
    if (!decoded || !decoded.userId) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    if (req.method === 'GET') {
      // Get all chat sessions for the user
      const sessions = await prisma.chatSession.findMany({
        where: { 
          userId: decoded.userId,
          isActive: true,
        },
        include: {
          messages: {
            orderBy: { createdAt: 'asc' }
          }
        },
        orderBy: { updatedAt: 'desc' }
      });

      return res.status(200).json({
        success: true,
        sessions,
      });
    }

    if (req.method === 'POST') {
      // Create a new chat session
      const { title = 'New Chat' } = req.body;

      const newSession = await prisma.chatSession.create({
        data: {
          title,
          userId: decoded.userId,
        },
        include: {
          messages: true
        }
      });

      return res.status(201).json({
        success: true,
        session: newSession,
      });
    }

    if (req.method === 'DELETE') {
      // Delete a chat session
      const { sessionId } = req.body;

      if (!sessionId) {
        return res.status(400).json({ message: 'Session ID is required' });
      }

      // Verify the session belongs to the user
      const session = await prisma.chatSession.findFirst({
        where: {
          id: sessionId,
          userId: decoded.userId,
        },
      });

      if (!session) {
        return res.status(404).json({ message: 'Session not found' });
      }

      // Soft delete - set isActive to false
      await prisma.chatSession.update({
        where: { id: sessionId },
        data: { isActive: false },
      });

      return res.status(200).json({
        success: true,
        message: 'Session deleted successfully',
      });
    }

    return res.status(405).json({ message: 'Method not allowed' });
  } catch (error) {
    console.error('Chat sessions API error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
