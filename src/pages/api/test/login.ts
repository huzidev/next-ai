import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { username, password } = req.body;

    // For testing - create a simple user check
    if (username === 'test' && password === 'test') {
      // Create a test token
      const token = 'test-token-123';
      
      return res.status(200).json({
        success: true,
        user: {
          id: '1',
          username: 'test',
          email: 'test@example.com',
          isVerified: true,
          remainingTries: 100,
          createdAt: new Date().toISOString(),
          plan: {
            id: '1',
            name: 'free',
            tries: 100,
            price: 0
          },
          _count: {
            chatSessions: 5
          }
        },
        token
      });
    }

    return res.status(401).json({
      success: false,
      message: 'Invalid credentials'
    });

  } catch (error) {
    console.error('Test login error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Internal server error' 
    });
  }
}
