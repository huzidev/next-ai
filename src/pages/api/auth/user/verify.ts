import { generateVerificationCode, getUserByEmail, verifyUserCode } from "@/db/User.server";
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

  const { email, code, action } = req.body;

  if (!email) {
    return res.status(400).json({ 
      success: false, 
      error: 'Email is required' 
    });
  }

  try {
    // Find user by email
    const user = await getUserByEmail(email);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        error: 'User not found' 
      });
    }

    // Handle resend verification code
    if (action === "resend") {
      const verificationResult = await generateVerificationCode(user.id);

      if (verificationResult.status !== 200) {
        return res.status(verificationResult.status).json({ 
          success: false, 
          error: verificationResult.message 
        });
      }

      return res.status(200).json({
        success: true,
        message: `New verification code sent: ${verificationResult.code}`,
      });
    }

    // Handle verify code
    if (!code) {
      return res.status(400).json({ 
        success: false, 
        error: 'Verification code is required' 
      });
    }

    const verificationResult = await verifyUserCode(user.id, code);

    if (!verificationResult.success) {
      return res.status(400).json({ 
        success: false, 
        error: verificationResult.message 
      });
    }

    return res.status(200).json({
      success: true,
      message: verificationResult.message,
    });

  } catch (error) {
    console.error("Verification error:", error);
    return res.status(500).json({ 
      success: false, 
      error: "Internal server error" 
    });
  }
}
