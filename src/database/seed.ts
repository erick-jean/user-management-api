import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../generated/prisma/client";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  const count = await prisma.user.count();

  if (count > 0) {
    console.log("Seed ignorado: já existem usuários");
    return;
  }

  await prisma.user.createMany({
    data: [
      {
        name: "Admin",
        email: "admin@email.com",
        password: "123456",
        role: "admin",
      },
      {
        name: "User",
        email: "user@email.com",
        password: "123456",
        role: "user",
      },
    ],
  });

  console.log("Seed executado com sucesso");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
