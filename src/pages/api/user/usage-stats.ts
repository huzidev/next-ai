import { verifyToken } from '@/lib/jwt';
import { NextApiRequest, NextApiResponse } from 'next';

// Force recompilation with comment change
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
    
    const decoded = verifyToken(token) as any;
    console.log('Token decoded:', decoded);
    
    if (!decoded || !decoded.id) {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid token' 
      });
    }

    const userId = decoded.id;
    console.log('User ID from token:', userId);

    // For now, return mock data to test if authentication works
    const mockUsageStats = {
      totalChatSessions: 8,
      totalMessages: 45,
      recentMessages: 23,
      recentSessions: 5,
      todayMessages: 3,
      remainingTries: 95,
      planName: 'Free',
      chartData: [
        { date: '2025-07-21', messages: 2, day: 'Mon' },
        { date: '2025-07-22', messages: 5, day: 'Tue' },
        { date: '2025-07-23', messages: 8, day: 'Wed' },
        { date: '2025-07-24', messages: 3, day: 'Thu' },
        { date: '2025-07-25', messages: 7, day: 'Fri' },
        { date: '2025-07-26', messages: 6, day: 'Sat' },
        { date: '2025-07-27', messages: 3, day: 'Sun' }
      ],
      usageThisMonth: 23,
      averageDaily: 4
    };

    console.log('Returning mock usage stats for user:', userId);

    res.status(200).json({
      success: true,
      data: mockUsageStats
    });

  } catch (error) {
    console.error('Usage stats fetch error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
