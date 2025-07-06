import { generatePasswordResetCode } from "@/db/User.server";
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

  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ 
      success: false, 
      error: 'Email is required' 
    });
  }

  try {
    // Generate password reset code
    const resetResult = await generatePasswordResetCode(email);

    if (resetResult.status !== 200) {
      return res.status(resetResult.status).json({ 
        success: false, 
        error: resetResult.message 
      });
    }

    return res.status(200).json({
      success: true,
      message: `Password reset code sent: ${resetResult.code}`,
    });

  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({ 
      success: false, 
      error: "Failed to process forgot password request" 
    });
  }
}
