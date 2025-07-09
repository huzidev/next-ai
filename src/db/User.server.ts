import prisma from "@/utils/prisma";
import { User } from "@prisma/client";
import bcrypt from "bcryptjs";

interface UserParams {
  email: string;
  confirmPassword?: string;
  password: string;
}

interface UserCheckResponse {
  message: string;
  status: number;
}

interface CreateUserParams {
  username: string;
  email: string;
  password: string;
}

interface VerificationCodeResponse {
  code: string;
  message: string;
  status: number;
}

export async function getUserById(id: string) {
  try {
    const response = await prisma.user.findUnique({
      where: {
        id,
      },
    });

    if (!response) {
      return null;
    }

    return response;
  } catch (e: unknown) {
    console.log("Error :", (e as Error).stack);
    return null;
  }
}

export async function getUserByEmail(email: string): Promise<User | null> {
  try {
    const response = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!response) {
      return null;
    }

    return response;
  } catch (e: unknown) {
    console.log("Error :", (e as Error).stack);
    return null;
  }
}

export async function getUserByEmailOrUsername(email: string, username: string): Promise<UserCheckResponse> {
  try {
    const emailExists = await getUserByEmail(email);

    // If email exists
    if (emailExists) {
      return { message: "Email already exists", status: 400 };
    }

    const usernameExists = await prisma.user.findUnique({
      where: {
        username,
      },
    });

    // If username exists
    if (usernameExists) {
      return { message: "Username already exists", status: 400 };
    }

    return { 
      message: "Available", 
      status: 200 
    };
  } catch (e: unknown) {
    console.log("Error :", (e as Error).stack);
    return { message: "Internal Server Error", status: 500 };
  }
}

export async function createUser(userData: CreateUserParams): Promise<{ user: User | null; error?: string }> {
  try {
    // Check if email or username already exists
    const existingCheck = await getUserByEmailOrUsername(userData.email, userData.username);
    if (existingCheck.status !== 200) {
      return { user: null, error: existingCheck.message };
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(userData.password, 12);

    // Create user
    const user = await prisma.user.create({
      data: {
        username: userData.username,
        email: userData.email,
        password: hashedPassword,
        isVerified: false,
      },
    });

    return { user };
  } catch (e: unknown) {
    console.log("Error creating user:", (e as Error).stack);
    return { user: null, error: "Failed to create user" };
  }
}

export async function generateVerificationCode(userId: string): Promise<VerificationCodeResponse> {
  try {
    // Generate 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Set expiration time (10 minutes from now)
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 10);

    // Delete any existing unused codes for this user
    await prisma.verificationCode.deleteMany({
      where: {
        userId,
        isUsed: false,
      },
    });

    // Create new verification code
    await prisma.verificationCode.create({
      data: {
        code,
        userId,
        expiresAt,
      },
    });

    return {
      code,
      message: "Verification code generated successfully",
      status: 200,
    };
  } catch (e: unknown) {
    console.log("Error generating verification code:", (e as Error).stack);
    return {
      code: "",
      message: "Failed to generate verification code",
      status: 500,
    };
  }
}

export async function verifyUserCode(userId: string, code: string): Promise<{ success: boolean; message: string }> {
  try {
    // Find the verification code
    const verificationCode = await prisma.verificationCode.findFirst({
      where: {
        userId,
        code,
        isUsed: false,
        expiresAt: {
          gt: new Date(),
        },
      },
    });

    if (!verificationCode) {
      return { success: false, message: "Invalid or expired verification code" };
    }

    // Mark code as used and verify the user
    await prisma.$transaction([
      prisma.verificationCode.update({
        where: { id: verificationCode.id },
        data: { isUsed: true },
      }),
      prisma.user.update({
        where: { id: userId },
        data: { isVerified: true },
      }),
    ]);

    return { success: true, message: "Email verified successfully" };
  } catch (e: unknown) {
    console.log("Error verifying code:", (e as Error).stack);
    return { success: false, message: "Failed to verify code" };
  }
}

export async function generatePasswordResetCode(email: string): Promise<VerificationCodeResponse> {
  try {
    // Check if user exists
    const user = await getUserByEmail(email);
    if (!user) {
      return {
        code: "",
        message: "No account found with this email address",
        status: 404,
      };
    }

    // Generate 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Set expiration time (10 minutes from now)
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 10);

    // Delete any existing unused codes for this user
    await prisma.verificationCode.deleteMany({
      where: {
        userId: user.id,
        isUsed: false,
      },
    });

    // Create new verification code
    await prisma.verificationCode.create({
      data: {
        code,
        userId: user.id,
        expiresAt,
      },
    });

    return {
      code,
      message: "Password reset code generated successfully",
      status: 200,
    };
  } catch (e: unknown) {
    console.log("Error generating password reset code:", (e as Error).stack);
    return {
      code: "",
      message: "Failed to generate password reset code",
      status: 500,
    };
  }
}

export async function resetPassword(email: string, code: string, newPassword: string): Promise<{ success: boolean; message: string }> {
  try {
    // Find user by email
    const user = await getUserByEmail(email);
    if (!user) {
      return { success: false, message: "User not found" };
    }

    // Find the verification code
    const verificationCode = await prisma.verificationCode.findFirst({
      where: {
        userId: user.id,
        code,
        isUsed: false,
        expiresAt: {
          gt: new Date(),
        },
      },
    });

    if (!verificationCode) {
      return { success: false, message: "Invalid or expired verification code" };
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Update password and mark code as used
    await prisma.$transaction([
      prisma.verificationCode.update({
        where: { id: verificationCode.id },
        data: { isUsed: true },
      }),
      prisma.user.update({
        where: { id: user.id },
        data: { password: hashedPassword },
      }),
    ]);

    return { success: true, message: "Password reset successfully" };
  } catch (e: unknown) {
    console.log("Error resetting password:", (e as Error).stack);
    return { success: false, message: "Failed to reset password" };
  }
}

export async function authenticateUser(email: string, password: string): Promise<{ user: User | null; message: string }> {
  try {
    // Find user by email
    const user = await getUserByEmail(email);
    if (!user) {
      return { user: null, message: "Invalid email or password" };
    }

    // Check if user is verified
    if (!user.isVerified) {
      return { user: null, message: "Please verify your email address before signing in" };
    }

    // Check if user is banned
    if (user.isBan) {
      return { user: null, message: "Your account has been suspended" };
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return { user: null, message: "Invalid email or password" };
    }

    // Update last active timestamp
    await prisma.user.update({
      where: { id: user.id },
      data: { lastActiveAt: new Date() },
    });

    return { user, message: "Authentication successful" };
  } catch (e: unknown) {
    console.log("Error authenticating user:", (e as Error).stack);
    return { user: null, message: "Authentication failed" };
  }
}