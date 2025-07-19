import { generateVerificationCodeByEmail } from "@/db/User.server";
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
    // Generate verification code
    const result = await generateVerificationCodeByEmail(email);

    if (result.status !== 200) {
      return res.status(result.status).json({ 
        success: false, 
        error: result.message 
      });
    }

    return res.status(200).json({
      success: true,
      message: `Verification code sent: ${result.code}`,
      code: result.code
    });

  } catch (error) {
    console.error("Resend verification error:", error);
    res.status(500).json({ 
      success: false, 
      error: "Failed to resend verification code" 
    });
  }
}
