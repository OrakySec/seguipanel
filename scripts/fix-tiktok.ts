import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('--- Fixing TikTok Data ---');
  
  // Update TikTok network slug
  const tiktok = await prisma.socialNetwork.updateMany({
    where: { 
      name: { contains: 'Tiktok', mode: 'insensitive' },
      urlSlug: null
    },
    data: { urlSlug: 'tiktok' }
  });
  console.log(`Updated ${tiktok.count} network slug(s).`);

  // Update new TikTok service to be BestSeller so it shows on home
  const service = await prisma.service.updateMany({
    where: {
      name: '100 Seguidores',
      category: { socialNetwork: { urlSlug: 'tiktok' } }
    },
    data: { isBestSeller: true }
  });
  console.log(`Updated ${service.count} service(s) to BestSeller.`);
}

main()
  .catch(e => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });
