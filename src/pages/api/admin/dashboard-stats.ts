import prisma from '@/utils/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    // Get users statistics
    const totalUsers = await prisma.user.count();
    const verifiedUsers = await prisma.user.count({
      where: { isVerified: true }
    });
    const bannedUsers = await prisma.user.count({
      where: { isBan: true }
    });
    const activeUsers = await prisma.user.count({
      where: { isVerified: true, isBan: false }
    });

    // Get users active in the last 24 hours
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    
    const activeToday = await prisma.user.count({
      where: {
        lastActiveAt: {
          gte: yesterday
        }
      }
    });

    // Get admins statistics
    const totalAdmins = await prisma.admin.count();
    const activeAdmins = await prisma.admin.count({
      where: { isActive: true }
    });
    const superAdmins = await prisma.admin.count({
      where: { role: 'SUPER_ADMIN' }
    });
    const regularAdmins = await prisma.admin.count({
      where: { role: 'ADMIN' }
    });

    // Get recent users (last 10)
    const recentUsers = await prisma.user.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        username: true,
        email: true,
        isVerified: true,
        isBan: true,
        remainingTries: true,
        createdAt: true,
        lastActiveAt: true,
        plan: {
          select: {
            name: true
          }
        }
      }
    });

    // Get all admins
    const admins = await prisma.admin.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        createdBy: true,
        creator: {
          select: {
            username: true
          }
        }
      }
    });

    // Get chat sessions count
    const totalChatSessions = await prisma.chatSession.count();
    const activeChatSessions = await prisma.chatSession.count({
      where: { isActive: true }
    });

    // Get messages count
    const totalMessages = await prisma.aiMessage.count();
    const todayMessages = await prisma.aiMessage.count({
      where: {
        createdAt: {
          gte: new Date(new Date().setHours(0, 0, 0, 0))
        }
      }
    });

    return res.status(200).json({
      success: true,
      data: {
        users: {
          total: totalUsers,
          verified: verifiedUsers,
          banned: bannedUsers,
          active: activeUsers,
          activeToday: activeToday,
          recent: recentUsers
        },
        admins: {
          total: totalAdmins,
          active: activeAdmins,
          superAdmins: superAdmins,
          regularAdmins: regularAdmins,
          current: admins[0] ? {
            id: admins[0].id,
            username: admins[0].username,
            email: admins[0].email,
            role: admins[0].role,
            isActive: admins[0].isActive
          } : undefined,
          list: admins
        },
        chat: {
          totalSessions: totalChatSessions,
          activeSessions: activeChatSessions,
          totalMessages: totalMessages,
          todayMessages: todayMessages
        }
      }
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to fetch dashboard statistics'
    });
  }
}
