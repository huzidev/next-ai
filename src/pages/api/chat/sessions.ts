import { verifyToken } from '@/lib/jwt';
import prisma from '@/utils/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

async function getAuthenticatedUser(req: NextApiRequest) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  
  if (!token) {
    return null;
  }

  try {
    const decoded = verifyToken(token) as any;
    if (!decoded || !decoded.userId) {
      return null;
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: {
        plan: true,
      },
    });

    return user;
  } catch (error) {
    return null;
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const user = await getAuthenticatedUser(req);
    
    if (!user) {
      return res.status(401).json({ 
        success: false,
        error: 'Unauthorized' 
      });
    }

    if (req.method === 'GET') {
      // Get all chat sessions for the user
      const sessions = await prisma.chatSession.findMany({
        where: { 
          userId: user.id,
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
      // Check if user has remaining tries for free plan
      if (user.plan?.name === 'free' && user.remainingTries <= 0) {
        return res.status(403).json({
          success: false,
          error: 'No remaining tries. Please upgrade your plan.',
          needsUpgrade: true,
        });
      }

      // Create a new chat session
      const { title = 'New Chat' } = req.body;

      const newSession = await prisma.chatSession.create({
        data: {
          title,
          userId: user.id,
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
        return res.status(400).json({ 
          success: false,
          error: 'Session ID is required' 
        });
      }

      // Verify the session belongs to the user
      const session = await prisma.chatSession.findFirst({
        where: {
          id: sessionId,
          userId: user.id,
        },
      });

      if (!session) {
        return res.status(404).json({ 
          success: false,
          error: 'Session not found' 
        });
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

    return res.status(405).json({ 
      success: false,
      error: 'Method not allowed' 
    });
  } catch (error) {
    console.error('Chat sessions API error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Internal server error' 
    });
  }
}
