import { generateToken, verifyToken } from '@/lib/jwt';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Test JWT token generation and verification
    const testUserId = '12345';
    
    // Generate a token
    const token = generateToken(testUserId);
    console.log('Generated token:', token);
    
    // Verify the token
    const decoded = verifyToken(token);
    console.log('Decoded token:', decoded);
    
    const isValid = decoded && (decoded as any).id === testUserId;
    
    res.status(200).json({
      success: true,
      data: {
        token,
        decoded,
        isValid,
        message: isValid ? 'JWT working correctly' : 'JWT verification failed'
      }
    });
    
  } catch (error) {
    console.error('JWT test error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
