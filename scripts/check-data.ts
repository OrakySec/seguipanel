import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const networks = await prisma.socialNetwork.findMany({
    include: {
      categories: {
        include: {
          services: true
        }
      }
    }
  });

  console.log('--- SOCIAL NETWORKS ---');
  console.log(JSON.stringify(networks, null, 2));

  const services = await prisma.service.findMany({
    take: 5
  });

  console.log('--- RECENT SERVICES ---');
  console.log(JSON.stringify(services, null, 2));
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
