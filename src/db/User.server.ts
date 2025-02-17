import { sendEmail } from "@/lib/email";
import prisma from "@/utils/prisma";
import { User } from "@prisma/client";
import bcrypt from "bcryptjs";

interface UserParams {
  email: string;
  confirmPassword: string;
  password: string;
}

const emailExistsMessage = {
  message: 'Invalid credentials',
  status: 400,
}

const passwordMismatchMessage = {
  message: 'Passwords do not match',
  status: 400,
}

const errorMessage = {
  message: 'Something went wrong',
  status: 500,
}

async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

async function generateVerificationCode(userId: string): Promise<number | null> {
  try {
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

async function getVerificationCode(code: number) {
  const response = await prisma.verificationCode.findFirst({
    where: {
      code,
    },
  })

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
    message: "Code is valid" 
  };
}

async function verifyUser(userId: string, code: number) {
  try {
    const user = await getUserById(userId);
    if (!user) {
      return { message: "User not found", status: 404 };
    }

    const codeStatus = await getVerificationCode(code);
    if (!codeStatus?.isValid) {
      return { message: codeStatus?.message, status: 400 };
    }

    await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        isVerified: true,
      },
    });

    await prisma.verificationCode.update({
      where: {
        code,
      },
      data: {
        isActive: false,
      },
    });

    return { message: "User verified successfully", status: 200 };
  } catch (e: unknown) {
    console.log("Error :", (e as Error).stack);
    return null;
  }
}

export async function createUser(values: UserParams) {
  try {
    const { email, confirmPassword, password } = values;

    const emailExists = await getUserByEmail(email);

    if (emailExists) {
      return emailExistsMessage;
    }

    if (password !== confirmPassword) {
      return passwordMismatchMessage;
    }

    const response = await prisma.user.create({
      data: {
        email,
        password: hashPassword(password),
        isVerified: false,
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
      message: 'User registered successfully',
      status: 200,
    };
  } catch (e: unknown) {
    console.log("Error :", (e as Error).stack);
    return errorMessage;
  }
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

export async function getUser(params: UserParams) {
  try {
    const response = await prisma.user.findFirst({
      where: {
        ...params,
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