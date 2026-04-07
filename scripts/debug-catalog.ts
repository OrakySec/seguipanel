import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('--- Social Networks ---');
  const networks = await prisma.socialNetwork.findMany({
    include: {
      categories: {
        include: {
          services: true
        }
      }
    }
  });

  networks.forEach(n => {
    console.log(`Network: ${n.name} | Slug: ${n.urlSlug} | Status: ${n.status}`);
    n.categories.forEach(c => {
      console.log(`  Category: ${c.name} | Status: ${c.status}`);
      c.services.forEach(s => {
        console.log(`    Service: ${s.name} | Price: ${s.price} | Status: ${s.status} | BestSeller: ${s.isBestSeller}`);
      });
    });
  });
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
