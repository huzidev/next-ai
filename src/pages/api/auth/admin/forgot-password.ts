import { generateAdminPasswordResetCode } from "@/db/Admin.server";
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
    // Generate admin password reset code
    const resetResult = await generateAdminPasswordResetCode(email);

    if (resetResult.status !== 200) {
      return res.status(resetResult.status).json({ 
        success: false, 
        error: resetResult.message 
      });
    }

    return res.status(200).json({
      success: true,
      message: `Admin password reset code sent: ${resetResult.code}`,
      code: resetResult.code
    });

  } catch (error) {
    console.error("Admin forgot password error:", error);
    return res.status(500).json({ 
      success: false, 
      error: "Internal server error" 
    });
  }
}
