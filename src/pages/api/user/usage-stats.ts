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

    const decoded = verifyToken(token) as any;
    
    // Handle mock token for development
    if (token === 'mock-token-for-development') {
      console.log('Using mock token, returning mock usage stats');
      
      const mockUsageStats = {
        totalChatSessions: 8,
        totalMessages: 45,
        recentMessages: 23,
        recentSessions: 5,
        todayMessages: 3,
        remainingTries: 95,
        planName: 'Free',
        chartData: [
          { date: '2025-07-13', messages: 2, day: 'Sun' },
          { date: '2025-07-14', messages: 5, day: 'Mon' },
          { date: '2025-07-15', messages: 8, day: 'Tue' },
          { date: '2025-07-16', messages: 3, day: 'Wed' },
          { date: '2025-07-17', messages: 7, day: 'Thu' },
          { date: '2025-07-18', messages: 6, day: 'Fri' },
          { date: '2025-07-19', messages: 3, day: 'Sat' }
        ],
        usageThisMonth: 23,
        averageDaily: 4
      };

      return res.status(200).json({
        success: true,
        data: mockUsageStats
      });
    }
    
    if (!decoded || !decoded.id) {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid token' 
      });
    }

    const userId = decoded.id;

    // Get user's chat sessions count
    const totalChatSessions = await prisma.chatSession.count({
      where: { userId: userId }
    });

    // Get user's total messages count
    const totalMessages = await prisma.aiMessage.count({
      where: {
        chatSession: {
          userId: userId
        }
      }
    });

    // Get messages from last 7 days for chart
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const dailyUsage = await prisma.aiMessage.groupBy({
      by: ['createdAt'],
      where: {
        chatSession: {
          userId: userId
        },
        createdAt: {
          gte: sevenDaysAgo
        }
      },
      _count: {
        id: true
      }
    });

    // Process daily usage for chart (last 7 days)
    const chartData = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const messagesForDay = dailyUsage.filter((item: any) => 
        item.createdAt.toISOString().split('T')[0] === dateStr
      ).reduce((sum: number, item: any) => sum + item._count.id, 0);

      chartData.push({
        date: dateStr,
        messages: messagesForDay,
        day: date.toLocaleDateString('en-US', { weekday: 'short' })
      });
    }

    // Get user's recent activity (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentMessages = await prisma.aiMessage.count({
      where: {
        chatSession: {
          userId: userId
        },
        createdAt: {
          gte: thirtyDaysAgo
        }
      }
    });

    const recentSessions = await prisma.chatSession.count({
      where: {
        userId: userId,
        createdAt: {
          gte: thirtyDaysAgo
        }
      }
    });

    // Get today's usage
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayMessages = await prisma.aiMessage.count({
      where: {
        chatSession: {
          userId: userId
        },
        createdAt: {
          gte: today
        }
      }
    });

    // Get user info for remaining tries and plan
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        plan: true
      }
    });

    const usageStats = {
      totalChatSessions,
      totalMessages,
      recentMessages,
      recentSessions,
      todayMessages,
      remainingTries: user?.remainingTries || 0,
      planName: user?.plan?.name || 'Free',
      chartData,
      usageThisMonth: recentMessages,
      averageDaily: Math.round(recentMessages / 30)
    };

    res.status(200).json({
      success: true,
      data: usageStats
    });

  } catch (error) {
    console.error('Usage stats fetch error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Internal server error' 
    });
  }
}
