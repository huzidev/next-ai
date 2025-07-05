import { loginUser } from "@/db/Auth.server";
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
    const response = await loginUser({
      email,
      password,
    });

    // Check if response has a status property indicating success/failure
    if (response && typeof response === 'object' && 'status' in response) {
      const responseWithStatus = response as Record<string, any>;
      
      if (responseWithStatus.status === 200) {
        // Successful login - response contains user data
        const token = generateToken(responseWithStatus.id);
        setCookie(token, res);

        return res.status(200).json({ 
          success: true,
          data: responseWithStatus,
          message: "Signed in successfully"
        });
      } else {
        // Error response
        return res.status(responseWithStatus.status).json({ 
          success: false,
          error: responseWithStatus.message
        });
      }
    } else {
      return res.status(401).json({ 
        success: false,
        error: "Invalid email or password"
      });
    }
  } catch (error) {
    console.error("Signin error:", error);
    return res.status(500).json({ 
      success: false, 
      error: "Internal server error" 
    });
  }
}
