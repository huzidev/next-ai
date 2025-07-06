import { createUser, generateVerificationCode } from "@/db/User.server";
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

  // Validate password length
  if (password.length < 6) {
    return res.status(400).json({ 
      success: false, 
      error: 'Password must be at least 6 characters long' 
    });
  }

  try {
    // Create user
    const { user, error } = await createUser({ username, email, password });

    if (error) {
      return res.status(400).json({ 
        success: false, 
        error 
      });
    }

    if (!user) {
      return res.status(500).json({ 
        success: false, 
        error: "Failed to create user" 
      });
    }

    // Generate verification code
    const verificationResult = await generateVerificationCode(user.id);

    if (verificationResult.status !== 200) {
      return res.status(verificationResult.status).json({ 
        success: false, 
        error: verificationResult.message 
      });
    }

    return res.status(201).json({
      success: true,
      message: `Account created successfully! Your verification code is: ${verificationResult.code}`,
      data: {
        userId: user.id,
        email: user.email,
      },
    });

  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).json({ 
      success: false, 
      error: "Internal server error" 
    });
  }
}
