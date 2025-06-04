import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";

const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({
    where: {
      apiToken: null,
    },
  });

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
