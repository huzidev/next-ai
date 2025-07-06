import prisma from "@/utils/prisma";
import { Admin } from "@prisma/client";
import bcrypt from "bcryptjs";

interface CreateAdminParams {
  username: string;
  email: string;
  password: string;
  role?: "ADMIN" | "SUPER_ADMIN";
  createdBy?: string;
}

interface VerificationCodeResponse {
  code: string;
  message: string;
  status: number;
}

export async function getAdminById(id: string) {
  try {
    const response = await prisma.admin.findUnique({
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

export async function getAdminByEmail(email: string): Promise<Admin | null> {
  try {
    const response = await prisma.admin.findUnique({
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

export async function generateAdminPasswordResetCode(email: string): Promise<VerificationCodeResponse> {
  try {
    // Check if admin exists
    const admin = await getAdminByEmail(email);
    if (!admin) {
      return {
        code: "",
        message: "No admin account found with this email address",
        status: 404,
      };
    }

    // Check if admin is active
    if (!admin.isActive) {
      return {
        code: "",
        message: "Admin account is not active",
        status: 403,
      };
    }

    // Generate 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    
    // Set expiration time (10 minutes from now)
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 10);

    // Delete any existing unused codes for this admin
    await prisma.verificationCode.deleteMany({
      where: {
        adminId: admin.id,
        isUsed: false,
      },
    });

    // Create new verification code
    await prisma.verificationCode.create({
      data: {
        code,
        adminId: admin.id,
        expiresAt,
      },
    });

    return {
      code,
      message: "Password reset code generated successfully",
      status: 200,
    };
  } catch (e: unknown) {
    console.log("Error generating admin password reset code:", (e as Error).stack);
    return {
      code: "",
      message: "Failed to generate password reset code",
      status: 500,
    };
  }
}

export async function resetAdminPassword(email: string, code: string, newPassword: string): Promise<{ success: boolean; message: string }> {
  try {
    // Find admin by email
    const admin = await getAdminByEmail(email);
    if (!admin) {
      return { success: false, message: "Admin not found" };
    }

    // Find the verification code
    const verificationCode = await prisma.verificationCode.findFirst({
      where: {
        adminId: admin.id,
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
      prisma.admin.update({
        where: { id: admin.id },
        data: { password: hashedPassword },
      }),
    ]);

    return { success: true, message: "Password reset successfully" };
  } catch (e: unknown) {
    console.log("Error resetting admin password:", (e as Error).stack);
    return { success: false, message: "Failed to reset password" };
  }
}

export async function authenticateAdmin(email: string, password: string): Promise<{ admin: Admin | null; message: string }> {
  try {
    // Find admin by email
    const admin = await getAdminByEmail(email);
    if (!admin) {
      return { admin: null, message: "Invalid email or password" };
    }

    // Check if admin is active
    if (!admin.isActive) {
      return { admin: null, message: "Admin account is not active" };
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, admin.password);
    if (!isValidPassword) {
      return { admin: null, message: "Invalid email or password" };
    }

    return { admin, message: "Authentication successful" };
  } catch (e: unknown) {
    console.log("Error authenticating admin:", (e as Error).stack);
    return { admin: null, message: "Authentication failed" };
  }
}
