import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    // Verify JWT token
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ success: false, error: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    
    // Check if user is admin (this endpoint is for admin use)
    const admin = await prisma.admin.findUnique({
      where: { id: decoded.userId }
    });

    if (!admin) {
      return res.status(403).json({ success: false, error: 'Admin access required' });
    }

    // Get all contact requests
    const contacts = await prisma.contact.findMany({
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true
          }
        },
        resolver: {
          select: {
            id: true,
            username: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Format the response
    const formattedContacts = contacts.map(contact => ({
      id: contact.id,
      name: contact.name,
      username: contact.username,
      email: contact.email,
      subject: contact.subject,
      message: contact.message,
      isResolved: contact.isResolved,
      createdAt: contact.createdAt.toISOString(),
      updatedAt: contact.updatedAt.toISOString(),
      resolvedAt: contact.resolvedAt?.toISOString() || null,
      user: contact.user,
      resolver: contact.resolver
    }));

    return res.status(200).json({ 
      success: true, 
      contacts: formattedContacts,
      total: formattedContacts.length,
      unresolved: formattedContacts.filter(c => !c.isResolved).length
    });

  } catch (error) {
    console.error('Contacts API error:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Internal server error' 
    });
  } finally {
    await prisma.$disconnect();
  }
}
