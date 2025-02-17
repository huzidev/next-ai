import { PrismaClient } from "@prisma/client";
import bcryptjs from "bcryptjs";

async function seed() {
  const prisma = new PrismaClient();

  try {
    await prisma.admin.create({
      data: {
        username: "huzidev",
        email: "huzaifa.iqdev@gmail.com",
        password: await bcryptjs.hash("huzaifa.iqdev@gmail.com", 10),
        role: "super-admin",
      },
    });

    console.log("Super admin generated successfully.");
  } catch (error) {
    console.error("Error seeding data:", error);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
