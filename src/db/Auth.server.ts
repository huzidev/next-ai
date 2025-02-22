import { sendEmail } from "@/lib/email";
import prisma from "@/utils/prisma";
import { User } from "@prisma/client";
import bcrypt from "bcryptjs";
import { getUser, getUserByEmail, getUserByEmailOrUsername, getUserById } from "./User.server";

interface UserParams {
  email: string;
  username?: string;
  confirmPassword?: string;
  password: string;
}

const userNotExistsMessage = {
  message: "User does not exist",
  status: 404,
}

const emailOrPasswordIncorrect = {
  message: "Email or Password is incorrect",
  status: 400,
};

const passwordMismatchMessage = {
  message: "Passwords do not match",
  status: 400,
};

const errorMessage = {
  message: "Something went wrong",
  status: 500,
};

const userNotFoundMessage = {
  message: "User not found",
  status: 404,
}

const userNotVerifiedMessage = {
  message: "User not verified",
  status: 400,
}

const userBannedMessage = {
  message: "User is banned",
  status: 400,
}

async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

async function checkVerificationCode(code: number) {
  const response = await prisma.verificationCode.findFirst({
    where: {
      code,
    },
  });

  if (!response) {
    return { isValid: false, message: "Invalid verification code" };
  }

  if (!response?.isActive) {
    return { isValid: false, message: "Verification code is no longer active" };
  }

  const currentTime = new Date();
  if (currentTime > response?.expiresAt) {
    return { isValid: false, message: "Verification code has expired" };
  }

  return {
    isValid: true,
    message: "Code is valid",
  };
}

async function updateVerificationCode(code: number) {
  await prisma.verificationCode.update({
    where: {
      code,
    },
    data: {
      isActive: false,
    },
  });
}

export async function verifyUser(userId: string, code: number) {
  try {
    const user = await getUserById(userId);

    if (!user) {
      return { message: "User not found", status: 404 };
    }

    const codeStatus = await checkVerificationCode(code);
    if (!codeStatus?.isValid) {
      return { 
        message: codeStatus?.message, 
        status: 400 
      };
    }

    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        isVerified: true,
      },
    });

    await updateVerificationCode(code);

    return { 
      message: "User verified successfully", 
      status: 200 
    };
  } catch (e: unknown) {
    console.log("Error :", (e as Error).stack);
    return null;
  }
}

async function generateVerificationCode(userId: string): Promise<number | null> {
  try {
    // Generate 6 digit random code
    const code = Math.floor(100000 + Math.random() * 900000);

    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 15);

    const response = await prisma.verificationCode.create({
      data: {
        userId,
        code,
        expiresAt,
        isActive: true,
      },
    });

    console.log("SW response for verification code", response);

    return code;
  } catch (e: unknown) {
    console.log("Error generating verification code:", (e as Error).stack);
    return null;
  }
}

export async function createUser(values: UserParams) {
  try {
    const { email, username, password, confirmPassword } = values;

    const { message, status } = await getUserByEmailOrUsername(email, username!);
    
    if (status === 400) {
      return {
        message,
        status
      };
    }

    if (password !== confirmPassword) {
      return passwordMismatchMessage;
    }

    const response = await prisma.user.create({
      data: {
        email,
        username,
        password: hashPassword(password),
      },
    });

    if (!response) {
      return errorMessage;
    }

    const verificationCode = await generateVerificationCode(response?.id);

    await sendEmail({
      to: response?.email,
      subject: "Welcome to our platform",
      html: `
        <p>Welcome to our platform! Your account has been successfully created. Your verification code is <strong>${verificationCode}</strong>.</p>
        <p>To verify your email, click the button below:</p>
        <a href="https://yourwebsite.com/verify?code=${verificationCode}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Verify Your Email</a>
        <p>If the button doesn't work, copy and paste the following link in your browser:</p>
        <p><a href="https://yourwebsite.com/verify?code=${verificationCode}">https://yourwebsite.com/verify?code=${verificationCode}</a></p>
      `,
    });

    return {
      message: "User registered successfully",
      status: 200,
    };
  } catch (e: unknown) {
    console.log("Error :", (e as Error).stack);
    return errorMessage;
  }
}


export async function loginUser(values: UserParams): Promise<User | Object> {
  try {
    const { email, password } = values;

    const user = await getUserByEmail(email);

    if (!user) {
      return userNotExistsMessage;
    }

    const isPasswordMatch: boolean = await bcrypt.compare(
      password,
      user.password
    );

    if (!isPasswordMatch) {
      return emailOrPasswordIncorrect;
    }

    const { isVerified, isBan } = user;

    if (!isVerified) {
      return userNotVerifiedMessage;
    }

    if (isBan) {
      return userBannedMessage;
    }

    return {
      message: "User logged in successfully",
      status: 200,
    };
  } catch (e: unknown) {
    console.log("Error :", (e as Error).stack);
    return errorMessage;
  }
}

export async function logout() {
  try {
    return {
      message: "User logged out successfully",
      status: 200,
    };
  } catch (e: unknown) {
    console.log("Error :", (e as Error).stack);
    return errorMessage;
  }
}

export async function forgotPassword(email: string) {
  try {
    const user = await getUserByEmail(email);

    if (!user) {
      return userNotFoundMessage;
    }

    const verificationCode = await generateVerificationCode(user.id);

    await sendEmail({
      to: user.email,
      subject: "Reset your password",
      html: `
        <p>You have requested to reset your password. Your verification code is <strong>${verificationCode}</strong>.</p>
        <p>To reset your password, click the button below:</p>
        <a href="https://yourwebsite.com/reset-password?code=${verificationCode}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">Reset Password</a>
        <p>If the button doesn't work, copy and paste the following link in your browser:</p>
        <p><a href="https://yourwebsite.com/reset-password?code=${verificationCode}">https://yourwebsite.com/reset-password?code=${verificationCode}</a></p>
      `,
    });

    return {
      message: "Verification code sent successfully",
      status: 200,
    };
  } catch (e: unknown) {
    console.log("Error :", (e as Error).stack);
    return errorMessage;
  }
}