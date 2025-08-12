import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { username, email, subject, message } = req.body;

    // Validate required fields
    if (!username || !email || !message) {
      return res.status(400).json({ 
        success: false, 
        error: 'Username, email, and message are required' 
      });
    }

    // Check if user is authenticated (optional)
    let userId = null;
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
        userId = decoded.userId;
      } catch (jwtError) {
        console.log('Invalid token for contact form, proceeding without user ID');
      }
    }

    // Create contact record
    const contact = await prisma.contact.create({
      data: {
        name: username, // Use username as name
        username: username || '',
        email,
        subject: subject || '',
        message,
        userId: userId || undefined,
      }
    });

    return res.status(201).json({ 
      success: true, 
      message: 'Contact request submitted successfully',
      contactId: contact.id
    });

  } catch (error) {
    console.error('Contact API error:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Internal server error' 
    });
  } finally {
    await prisma.$disconnect();
  }
}
