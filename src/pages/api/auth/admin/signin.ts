import { authenticateAdmin } from "@/db/Admin.server";
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
    const { admin, message } = await authenticateAdmin(email, password);

    if (!admin) {
      return res.status(400).json({ 
        success: false, 
        error: message 
      });
    }

    const { id, username, email: adminEmail, role, isActive } = admin;

    const token = generateToken(id);
    setCookie(token, res);

    return res.status(200).json({ 
      success: true,
      data: {
        id,
        username,
        email: adminEmail,
        role,
        isActive,
      },
      message: "Admin signed in successfully"
    });

  } catch (error) {
    console.error("Admin signin error:", error);
    return res.status(500).json({ 
      success: false, 
      error: "Internal server error" 
    });
  }
}