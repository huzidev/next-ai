import { verifyToken } from '@/lib/jwt';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    console.log('Debug - Token received:', token ? `${token.substring(0, 20)}...` : 'No token');
    
    if (!token) {
      return res.status(200).json({ 
        success: true,
        debug: {
          token: 'No token provided',
          headers: req.headers.authorization || 'No auth header'
        }
      });
    }

    const decoded = verifyToken(token);
    console.log('Debug - Token decoded:', decoded);
    
    return res.status(200).json({
      success: true,
      debug: {
        token: `${token.substring(0, 20)}...`,
        decoded: decoded,
        isValid: !!decoded
      }
    });

  } catch (error) {
    console.error('Debug endpoint error:', error);
    res.status(200).json({ 
      success: true,
      debug: {
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    });
  }
}
