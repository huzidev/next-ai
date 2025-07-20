import { authenticateUser } from "@/db/User.server";
import { setCookie } from "@/lib/cookie";
import { generateToken } from "@/lib/jwt";
import prisma from "@/utils/prisma";
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
    const { user, message, state } = await authenticateUser(email, password);

    if (!user) {
      // Check if the error is specifically about unverified email
      if (state === "not-verified") {
        return res.status(403).json({ 
          success: false, 
          error: message,
          needsVerification: true,
          email: email
        });
      }
      
      // Check if user is banned
      if (state === "banned") {
        return res.status(403).json({ 
          success: false, 
          error: message,
          userBanned: true
        });
      }
      
      return res.status(400).json({ 
        success: false, 
        error: message 
      });
    }

    console.log("SW what is userId for signin", user.id);

    // Generate JWT token
    const token = generateToken(user.id);
    console.log("SW what is token when signedIn", token);
    setCookie(token, res);

    // Get user with plan information
    const userWithPlan = await prisma.user.findUnique({
      where: { id: user.id },
      include: {
        plan: true,
        _count: {
          select: {
            chatSessions: true,
          },
        },
      },
    });

    console.log("SW what is userWithPlan when signedIn", userWithPlan);

    return res.status(200).json({ 
      success: true,
      data: {
        user: userWithPlan,
        token,
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
