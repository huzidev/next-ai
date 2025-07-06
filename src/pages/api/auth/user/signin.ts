import { authenticateUser } from "@/db/User.server";
import { setCookie } from "@/lib/cookie";
import { generateToken } from "@/lib/jwt";
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

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ 
      success: false, 
      error: 'Email and password are required' 
    });
  }

  try {
    const { user, message } = await authenticateUser(email, password);

    if (!user) {
      return res.status(400).json({ 
        success: false, 
        error: message 
      });
    }

    // Generate JWT token
    const token = generateToken(user.id);
    setCookie(token, res);

    return res.status(200).json({ 
      success: true,
      data: {
        id: user.id,
        username: user.username,
        email: user.email,
        isVerified: user.isVerified,
      },
      message: "Signed in successfully"
    });

  } catch (error) {
    console.error("Signin error:", error);
    return res.status(500).json({ 
      success: false, 
      error: "Internal server error" 
    });
  }
}
