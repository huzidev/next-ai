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
    // TODO: Implement actual resend verification logic
    // 1. Check if user exists and is not verified
    // 2. Generate new verification code
    // 3. Send verification email
    // 4. Update verification code in database

    console.log("Resend verification request for:", email);

    // Simulate success response
    res.status(200).json({ 
      success: true,
      message: "Verification code resent successfully"
    });
  } catch (error) {
    console.error("Resend verification error:", error);
    res.status(500).json({ 
      success: false, 
      error: "Failed to resend verification code" 
    });
  }
}
