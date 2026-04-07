import { PrismaClient, AddType } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

async function main() {
  console.log('--- Iniciando Migração de Dados ---');

  const sqlPath = path.join(__dirname, '../../SeguiFacilBR.sql');
  if (!fs.existsSync(sqlPath)) {
    console.error('Erro: Arquivo SeguiFacilBR.sql não encontrado em:', sqlPath);
    return;
  }

  const sqlContent = fs.readFileSync(sqlPath, 'utf8');

  // Helper para extrair valores de INSERT INTO
  function extractValues(tableName: string) {
    const regex = new RegExp(`INSERT INTO \`${tableName}\` [^;]*VALUES\\s*([\\s\\S]+?);`, 'g');
    let match;
    const allValues: any[] = [];
    
    while ((match = regex.exec(sqlContent)) !== null) {
      const valuesStr = match[1];
      // Tentar quebrar por ), ( mas ignorando virgulas dentro de strings
      // Forma simplificada: Split by "), ("
      const rows = valuesStr.split(/\),\s*\(/);
      
      rows.forEach(row => {
        // Limpar os parenteses das extremidades
        let cleanRow = row.trim();
        if (cleanRow.startsWith('(')) cleanRow = cleanRow.substring(1);
        if (cleanRow.endsWith(')')) cleanRow = cleanRow.substring(0, cleanRow.length - 1);
        
        // Parsear os valores (tratando strings com aspas e NULL)
        const parts: any[] = [];
        let current = '';
        let inString = false;
        let stringChar = '';
        
        for (let i = 0; i < cleanRow.length; i++) {
          const char = cleanRow[i];
          if ((char === "'" || char === '"') && cleanRow[i-1] !== '\\') {
            if (!inString) {
              inString = true;
              stringChar = char;
            } else if (char === stringChar) {
              inString = false;
            } else {
              current += char;
            }
          } else if (char === ',' && !inString) {
            parts.push(parseValue(current.trim()));
            current = '';
          } else {
            current += char;
          }
        }
        parts.push(parseValue(current.trim()));
        allValues.push(parts);
      });
    }
    return allValues;
  }

  function parseValue(val: string) {
    if (val.toUpperCase() === 'NULL') return null;
    if (val.startsWith("'") && val.endsWith("'")) return val.slice(1, -1).replace(/\\'/g, "'");
    if (val.startsWith('"') && val.endsWith('"')) return val.slice(1, -1).replace(/\\"/g, '"');
    if (!isNaN(Number(val)) && val !== '') return Number(val);
    return val;
  }

  // 1. Limpar dados existentes
  console.log('Limpando tabelas atuais...');
  await prisma.service.deleteMany();
  await prisma.category.deleteMany();
  await prisma.socialNetwork.deleteMany();
  await prisma.apiProvider.deleteMany();

  // 2. Migrar ApiProviders
  console.log('Migrando ApiProviders...');
  const providersData = extractValues('api_providers');
  for (const row of providersData) {
      // Structure: id, ids, uid, name, url, key, type, balance, currency_code, description, status, changed, created
      await prisma.apiProvider.create({
          data: {
              id: row[0],
              name: row[3],
              url: row[4],
              apiKey: row[5],
              type: row[6] || 'standard',
              balance: row[7] ? Number(row[7]) : null,
              currencyCode: row[8],
              description: row[9],
              status: row[10] || 1,
              createdAt: row[12] ? new Date(row[12]) : new Date(),
          }
      });
  }

  // 3. Migrar SocialNetworks (da tabela social_network_categories)
  console.log('Migrando SocialNetworks...');
  const snData = extractValues('social_network_categories');
  for (const row of snData) {
      // id, ids, uid, name, desc, image, sort, status, created, changed, url_slug, page_title, meta_keywords, meta_description
      await prisma.socialNetwork.create({
          data: {
              id: row[0],
              name: row[3],
              description: row[4],
              image: row[5],
              sortOrder: row[6] || 0,
              status: row[7] || 1,
              urlSlug: row[10],
              pageTitle: row[11],
              metaKeywords: row[12],
              metaDescription: row[13],
              createdAt: row[8] ? new Date(row[8]) : new Date(),
          }
      });
  }

  // 4. Migrar Categories
  console.log('Migrando Categorias...');
  const catData = extractValues('categories');
  for (const row of catData) {
      // id, ids, sncate_id, uid, name, desc, required_field, video_tutorial, sort, status, created, changed
      await prisma.category.create({
          data: {
              id: row[0],
              socialNetworkId: row[2],
              name: row[4],
              description: row[5],
              requiredField: row[6],
              videoTutorial: row[7],
              sortOrder: row[8] || 0,
              status: row[9] || 1,
              createdAt: row[10] ? new Date(row[10]) : new Date(),
          }
      });
  }

  // 5. Migrar Services
  console.log('Migrando Serviços...');
  const servicesData = extractValues('services');
  for (const row of servicesData) {
      // id, ids, uid, cate_id, name, quantity, desc, price, original_price, discount, min, max, add_type, type, api_service_id, api_provider_id, status, changed, created
      await prisma.service.create({
          data: {
              id: row[0],
              categoryId: row[3],
              name: row[4],
              quantity: row[5]?.toString(),
              description: row[6],
              price: row[7] ? Number(row[7]) : 0,
              originalPrice: row[8] ? Number(row[8]) : null,
              discount: row[9] || 0,
              minOrder: row[10] ? Number(row[10]) : null,
              maxOrder: row[11] ? Number(row[11]) : null,
              addType: (row[12] || 'manual').toUpperCase() as AddType,
              type: row[13] || 'default',
              apiServiceId: row[14]?.toString(),
              apiProviderId: row[15],
              status: row[16] || 1,
              createdAt: row[18] ? new Date(row[18]) : new Date(),
          }
      });
  }

  console.log('--- Migração Concluída com Sucesso! ---');
}

main()
  .catch((e) => {
    console.error('Erro na migração:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
