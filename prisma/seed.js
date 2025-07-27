const { PrismaClient } = require("@prisma/client");
const bcryptjs = require("bcryptjs");

async function seed() {
  const prisma = new PrismaClient();

  try {
    // Check if admin exists
    const existingAdmin = await prisma.admin.findUnique({
      where: { username: "huzidev" }
    });

    if (!existingAdmin) {
      // Create Super Admin
      await prisma.admin.create({
        data: {
          username: "huzidev",
          email: "huzaifa.iqdev@gmail.com",
          password: await bcryptjs.hash("huzaifa.iqdev@gmail.com", 10),
          role: "SUPER_ADMIN",
        },
      });
      console.log("Super admin created successfully.");
    } else {
      console.log("Super admin already exists.");
    }

    // Create Plans
    const plans = [
      {
        name: "free",
        tries: 50,
        price: 0.0,
      },
      {
        name: "pro",
        tries: 500,
        price: 9.99,
      },
      {
        name: "premium",
        tries: -1, // -1 represents unlimited
        price: 19.99,
      },
    ];

    for (const plan of plans) {
      const { name } = plan;
      const existingPlan = await prisma.plan.findUnique({
        where: { name }
      });

      if (!existingPlan) {
        await prisma.plan.create({
          data: plan,
        });
        console.log(`Plan "${name}" created successfully.`);
      } else {
        console.log(`Plan "${name}" already exists.`);
      }
    }

    console.log("Seeding completed successfully.");
  } catch (error) {
    console.error("Error seeding data:", error);
  } finally {
    await prisma.$disconnect();
  }
}

seed();
