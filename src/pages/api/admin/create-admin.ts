import prisma from '@/utils/prisma';
import bcrypt from 'bcryptjs';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { username, email, password, role } = req.body;

    // Validate required fields
    if (!username || !email || !password || !role) {
      return res.status(400).json({
        success: false,
        error: 'Username, email, password, and role are required'
      });
    }

    // Validate role
    if (!['ADMIN', 'SUPER_ADMIN'].includes(role)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid role. Must be ADMIN or SUPER_ADMIN'
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid email format'
      });
    }

    // Validate password length
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        error: 'Password must be at least 8 characters long'
      });
    }

    // Validate username length
    if (username.length < 3) {
      return res.status(400).json({
        success: false,
        error: 'Username must be at least 3 characters long'
      });
    }

    // Check if username already exists
    const existingUsername = await prisma.admin.findUnique({
      where: { username }
    });

    if (existingUsername) {
      return res.status(409).json({
        success: false,
        error: 'Username already exists'
      });
    }

    // Check if email already exists in both Admin and User tables
    const [existingAdminEmail, existingUserEmail] = await Promise.all([
      prisma.admin.findUnique({ where: { email } }),
      prisma.user.findUnique({ where: { email } })
    ]);

    if (existingAdminEmail || existingUserEmail) {
      return res.status(409).json({
        success: false,
        error: 'Email already exists'
      });
    }

    // Hash the password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // In a real application, you would get the creator ID from the authenticated session
    // For now, we'll get the first super admin as the creator
    const creatorAdmin = await prisma.admin.findFirst({
      where: { role: 'SUPER_ADMIN', isActive: true }
    });

    // Create the new admin
    const newAdmin = await prisma.admin.create({
      data: {
        username: username.trim(),
        email: email.trim().toLowerCase(),
        password: hashedPassword,
        role: role as 'ADMIN' | 'SUPER_ADMIN',
        createdBy: creatorAdmin?.id || null,
        isActive: true
      },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        creator: {
          select: {
            username: true
          }
        }
      }
    });

    return res.status(201).json({
      success: true,
      message: 'Admin created successfully',
      data: {
        admin: newAdmin
      }
    });

  } catch (error) {
    console.error('Create admin error:', error);
    
    // Handle Prisma unique constraint violations
    if (error instanceof Error && error.message.includes('Unique constraint')) {
      if (error.message.includes('username')) {
        return res.status(409).json({
          success: false,
          error: 'Username already exists'
        });
      }
      if (error.message.includes('email')) {
        return res.status(409).json({
          success: false,
          error: 'Email already exists'
        });
      }
    }

    return res.status(500).json({
      success: false,
      error: 'Internal server error occurred while creating admin'
    });
  }
}
