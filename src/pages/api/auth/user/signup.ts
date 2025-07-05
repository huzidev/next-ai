import { createUser } from "@/db/Auth.server";
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

  const { email, username, password, confirmPassword } = req.body;

  if (!email || !username || !password || !confirmPassword) {
    return res.status(400).json({ 
      success: false, 
      error: 'All fields are required' 
    });
  }

  if (password !== confirmPassword) {
    return res.status(400).json({ 
      success: false, 
      error: 'Passwords do not match' 
    });
  }

  try {
    const response = await createUser({
      email,
      username,
      password,
      confirmPassword,
    });

    if (response) {
      return res.status(200).json({ 
        success: true,
        data: response,
        message: "Account created successfully. Please check your email for verification."
      });
    } else {
      return res.status(400).json({ 
        success: false, 
        error: "Failed to create account" 
      });
    }
  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).json({ 
      success: false, 
      error: "Internal server error" 
    });
  }
}
