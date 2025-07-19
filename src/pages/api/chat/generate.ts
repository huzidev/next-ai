import { getUserById } from "@/db/User.server";
import { verifyToken } from "@/lib/jwt";
import prisma from "@/utils/prisma";
import { GoogleGenerativeAI } from "@google/generative-ai";
import type { NextApiRequest, NextApiResponse } from "next";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      error: 'Method not allowed' 
    });
  }

  try {
    // Get and verify the auth token
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        success: false, 
        error: 'No token provided' 
      });
    }

    const token = authHeader.substring(7);
    const decoded = verifyToken(token);
    
    if (!decoded || typeof decoded !== 'object' || !decoded.userId) {
      return res.status(401).json({ 
        success: false, 
        error: 'Invalid token' 
      });
    }

    // Get user to check credits for free users
    const user = await getUserById(decoded.userId);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        error: 'User not found' 
      });
    }

    // Check if free user has remaining tries
    if (user.plan?.name === 'free' && user.remainingTries <= 0) {
      return res.status(403).json({ 
        success: false, 
        error: 'No credits remaining. Please upgrade your plan to continue.',
        needsUpgrade: true
      });
    }

    const { message, sessionId, conversationHistory } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ 
        success: false, 
        error: 'Message is required' 
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
      return res.status(404).json({ 
        success: false, 
        error: 'Session not found' 
      });
    }

    // Initialize Gemini model
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Get recent conversation history from database if not provided
    let prompt = message;
    if (!conversationHistory) {
      const recentMessages = await prisma.aiMessage.findMany({
        where: { sessionId },
        orderBy: { createdAt: 'asc' },
        take: 10, // Last 10 messages for context
      });

      if (recentMessages.length > 0) {
        const context = recentMessages.map((msg: any) => 
          `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`
        ).join('\n');
        
        prompt = `Previous conversation:\n${context}\n\nUser: ${message}\n\nPlease respond as a helpful AI assistant:`;
      }
    } else {
      // Use provided conversation history
      const context = conversationHistory.map((msg: any) => 
        `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`
      ).join('\n');
      
      prompt = `Previous conversation:\n${context}\n\nUser: ${message}\n\nPlease respond as a helpful AI assistant:`;
    }

    console.log('Generating response for prompt:', prompt.substring(0, 200) + '...');

    // Generate response using Gemini
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const aiResponseText = response.text();

    // Save both user message and AI response to database
    await prisma.$transaction(async (tx: any) => {
      // Save user message
      const userMessage = await tx.aiMessage.create({
        data: {
          content: message,
          role: 'user',
          sessionId,
          messageType: 'TEXT',
        },
      });

      // Save AI response
      const aiMessage = await tx.aiMessage.create({
        data: {
          content: aiResponseText,
          role: 'assistant',
          sessionId,
          messageType: 'TEXT',
        },
      });

      // Update session's updatedAt and title if this is the first message
      const messageCount = await tx.aiMessage.count({
        where: { sessionId, role: 'user' },
      });

      await tx.chatSession.update({
        where: { id: sessionId },
        data: { 
          updatedAt: new Date(),
          ...(messageCount === 1 && {
            title: message.slice(0, 50) + (message.length > 50 ? '...' : '')
          })
        },
      });

      // Deduct tries for free users
      if (user.plan?.name === 'free') {
        await tx.user.update({
          where: { id: decoded.userId },
          data: {
            remainingTries: {
              decrement: 1,
            },
            lastActiveAt: new Date(),
          },
        });
      }
    });

    res.status(200).json({ 
      success: true,
      message: aiResponseText,
      sessionId: sessionId
    });

  } catch (error: any) {
    console.error("Gemini API error:", error);
    
    // Handle specific Gemini API errors
    if (error.message?.includes('API key')) {
      return res.status(500).json({ 
        success: false, 
        error: 'AI service configuration error' 
      });
    }
    
    if (error.message?.includes('quota') || error.message?.includes('limit')) {
      return res.status(429).json({ 
        success: false, 
        error: 'AI service temporarily unavailable. Please try again later.' 
      });
    }

    res.status(500).json({ 
      success: false, 
      error: 'Failed to generate response. Please try again.' 
    });
  }
}
