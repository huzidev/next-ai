import prisma from "@/utils/prisma";
import { User } from "@prisma/client";

interface UserParams {
  email: string;
  confirmPassword?: string;
  password: string;
}

interface UserCheckResponse {
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
    return { message: "Internal Server Error", user: null };
  }
}


export async function getUser(values: UserParams): Promise<User | null> {
  try {
    const response = await prisma.user.findUnique({
      where: {
        ...values,
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