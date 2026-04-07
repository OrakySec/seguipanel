import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const result = await prisma.service.updateMany({
    where: { id: 1 },
    data: {
      isBestSeller: true
    }
  });

  console.log(`Updated ${result.count} service(s).`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
