import { verifyToken } from '@/lib/jwt';
import prisma from '@/utils/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const decoded = verifyToken(token) as any;
    if (!decoded || !decoded.userId) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    const { sessionId, content, role, imageUrl } = req.body;

    if (!sessionId || !content || !role) {
      return res.status(400).json({ 
        message: 'Session ID, content, and role are required' 
      });
    }

    // Verify the session belongs to the user
    const session = await prisma.chatSession.findFirst({
      where: {
        id: sessionId,
        userId: decoded.userId,
        isActive: true,
      },
    });

    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    // Create the message
    const message = await prisma.aiMessage.create({
      data: {
        content,
        role,
        sessionId,
        imageUrl: imageUrl || null,
        messageType: imageUrl ? 'IMAGE' : 'TEXT',
      },
    });

    // Update session's updatedAt timestamp
    await prisma.chatSession.update({
      where: { id: sessionId },
      data: { updatedAt: new Date() },
    });

    // If it's the first user message, update the session title
    if (role === 'user') {
      const messageCount = await prisma.aiMessage.count({
        where: { sessionId, role: 'user' },
      });

      if (messageCount === 1) {
        await prisma.chatSession.update({
          where: { id: sessionId },
          data: { 
            title: content.slice(0, 50) + (content.length > 50 ? '...' : '') 
          },
        });
      }

      // Deduct tries for the user
      await prisma.user.update({
        where: { id: decoded.userId },
        data: {
          remainingTries: {
            decrement: 1,
          },
          lastActiveAt: new Date(),
        },
      });
    }

    res.status(201).json({
      success: true,
      message,
    });
  } catch (error) {
    console.error('Message creation error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
