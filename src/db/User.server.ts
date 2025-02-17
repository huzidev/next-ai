import prisma from "@/utils/prisma";

interface UserParams {}

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

export async function getUserByEmail(email: string) {
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