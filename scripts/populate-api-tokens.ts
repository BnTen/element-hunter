import { PrismaClient, User } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";

const prisma = new PrismaClient();

async function main() {
  // Utiliser une requête SQL brute pour trouver les utilisateurs sans apiToken
  const users = await prisma.$queryRaw<User[]>`
    SELECT * FROM "User" WHERE "apiToken" IS NULL
  `;

  console.log(`Found ${users.length} users without apiToken`);

  for (const user of users) {
    await prisma.user.update({
      where: { id: user.id },
      data: { apiToken: uuidv4() },
    });
    console.log(`Updated user ${user.email}`);
  }

  console.log("All users have been updated with apiTokens");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
