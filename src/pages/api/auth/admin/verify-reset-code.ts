import { getAdminByEmail } from "@/db/Admin.server";
import prisma from "@/utils/prisma";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      error: 'Method not allowed' 
    });
  }

  const { email, code } = req.body;

  if (!email || !code) {
    return res.status(400).json({ 
      success: false, 
      error: 'Email and code are required' 
    });
  }

  try {
    // Find admin by email
    const admin = await getAdminByEmail(email);
    if (!admin) {
      return res.status(404).json({ 
        success: false, 
        error: 'Admin not found' 
      });
    }

    // Find the verification code
    const verificationCode = await prisma.verificationCode.findFirst({
      where: {
        adminId: admin.id,
        code,
        isUsed: false,
        expiresAt: {
          gt: new Date(),
        },
      },
    });

    if (!verificationCode) {
      return res.status(400).json({ 
        success: false, 
        error: 'Invalid or expired verification code' 
      });
    }

    return res.status(200).json({
      success: true,
      message: "Code verified successfully"
    });

  } catch (error) {
    console.error("Admin verify reset code error:", error);
    return res.status(500).json({ 
      success: false, 
      error: "Internal server error" 
    });
  }
}
