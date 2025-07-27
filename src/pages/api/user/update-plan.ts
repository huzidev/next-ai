import { verifyToken } from '@/lib/jwt';
import prisma from '@/utils/prisma';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const decoded = verifyToken(token) as any;
    if (!decoded || decoded.role !== 'user') {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { planId } = req.body;
    if (!planId) {
      return res.status(400).json({ message: 'Plan ID is required' });
    }

    // Verify plan exists
    const plan = await prisma.plan.findUnique({
      where: { id: planId }
    });

    if (!plan) {
      return res.status(404).json({ message: 'Plan not found' });
    }

    // Update user's plan
    const updatedUser = await prisma.user.update({
      where: { id: decoded.id },
      data: {
        planId: planId,
        remainingTries: plan.tries === -1 ? 999999 : plan.tries // Use large number for unlimited
      },
      include: {
        plan: true
      }
    });

    res.status(200).json({ 
      message: 'Plan updated successfully',
      user: updatedUser
    });
  } catch (error) {
    console.error('Error updating plan:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
