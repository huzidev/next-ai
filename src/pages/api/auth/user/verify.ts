import { verifyUser } from "@/db/Auth.server";
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
      error: 'Email and verification code are required' 
    });
  }

  try {
    // TODO: Update verifyUser to accept email parameter
    const response = await verifyUser(email, code);

    if (response) {
      return res.status(200).json({ 
        success: true,
        data: response,
        message: "Account verified successfully"
      });
    } else {
      return res.status(400).json({ 
        success: false, 
        error: "Invalid verification code" 
      });
    }
  } catch (error) {
    console.error("Verification error:", error);
    return res.status(500).json({ 
      success: false, 
      error: "Internal server error" 
    });
  }
}
