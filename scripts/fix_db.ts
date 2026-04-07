import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function decodeHtml(html: string | null) {
  if (!html) return html;
  return html
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/\\\\\\"/g, '"')
    .replace(/\\"/g, '"');
}

async function main() {
  console.log('Correção de dados migrados...');

  // 1. Corrigir Slugs (remover "social-")
  const networks = await prisma.socialNetwork.findMany();
  for (const net of networks) {
    if (net.urlSlug?.startsWith('social-')) {
      const newSlug = net.urlSlug.replace('social-', '');
      await prisma.socialNetwork.update({
        where: { id: net.id },
        data: { urlSlug: newSlug }
      });
      console.log(`Atualizado slug: ${net.urlSlug} -> ${newSlug}`);
    }
  }

  // 2. Corrigir HTML Entities nas descrições de Categoria
  const categories = await prisma.category.findMany();
  for (const cat of categories) {
    const newDesc = decodeHtml(cat.description);
    if (newDesc !== cat.description) {
      await prisma.category.update({
        where: { id: cat.id },
        data: { description: newDesc }
      });
    }
  }
  console.log('Descrições de Categoria atualizadas.');

  // 3. Corrigir HTML Entities nas descrições de Serviços
  const services = await prisma.service.findMany();
  for (const srv of services) {
    const newDesc = decodeHtml(srv.description);
    if (newDesc !== srv.description) {
      await prisma.service.update({
        where: { id: srv.id },
        data: { description: newDesc }
      });
    }
  }
  console.log('Descrições de Serviço atualizadas.');

  console.log('Pronto!');
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
