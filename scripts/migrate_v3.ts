import { PrismaClient, AddType } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const prisma = new PrismaClient();

async function main() {
  console.log('--- Iniciando Migração de Dados via Script (V3) ---');
  
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const sqlPath = path.resolve(__dirname, '../../SeguiFacilBR.sql');
  
  if (!fs.existsSync(sqlPath)) {
    console.error(`Arquivo SeguiFacilBR.sql não encontrado em: ${sqlPath}`);
    process.exit(1);
  }

  console.log(`Lendo arquivo SQL em: ${sqlPath}`);
  const sqlContent = fs.readFileSync(sqlPath, 'utf8');
  console.log(`Arquivo lido. Tamanho: ${sqlContent.length} bytes.`);

  function getModelData(tableName: string) {
    const results: any[] = [];
    const searchStr = `INSERT INTO \`${tableName}\``;
    let pos = 0;

    while (true) {
      pos = sqlContent.indexOf(searchStr, pos);
      if (pos === -1) break;

      let valuesStart = sqlContent.indexOf('VALUES', pos);
      if (valuesStart === -1) break;
      valuesStart += 6;

      let endPos = -1;
      let inString = false;
      let quoteChar = '';
      for (let i = valuesStart; i < sqlContent.length; i++) {
        const char = sqlContent[i];
        if ((char === "'" || char === '"') && sqlContent[i - 1] !== '\\') {
          if (!inString) {
            inString = true;
            quoteChar = char;
          } else if (char === quoteChar) {
            inString = false;
          }
        }
        if (!inString && char === ';') {
          endPos = i;
          break;
        }
      }

      if (endPos === -1) break;

      const valuesPart = sqlContent.substring(valuesStart, endPos);
      
      let currentRow = '';
      let braceLevel = 0;
      inString = false;
      for (let i = 0; i < valuesPart.length; i++) {
        const char = valuesPart[i];
        if ((char === "'" || char === '"') && valuesPart[i - 1] !== '\\') {
          if (!inString) {
            inString = true;
            quoteChar = char;
          } else if (char === quoteChar) {
            inString = false;
          }
        }

        if (!inString) {
          if (char === '(') {
            braceLevel++;
            if (braceLevel === 1) {
              currentRow = '';
              continue;
            }
          }
          if (char === ')') {
            braceLevel--;
            if (braceLevel === 0) {
              results.push(parseRow(currentRow));
              continue;
            }
          }
        }
        
        if (braceLevel > 0) {
          currentRow += char;
        }
      }

      pos = endPos + 1;
    }
    return results;
  }

  function parseRow(rowStr: string) {
    const parts: any[] = [];
    let current = '';
    let inString = false;
    let quoteChar = '';
    for (let i = 0; i < rowStr.length; i++) {
      const char = rowStr[i];
      if ((char === "'" || char === '"') && rowStr[i - 1] !== '\\') {
        if (!inString) {
          inString = true;
          quoteChar = char;
        } else if (char === quoteChar) {
          inString = false;
        }
      }

      if (!inString && char === ',') {
        parts.push(parseValue(current.trim()));
        current = '';
      } else {
        current += char;
      }
    }
    parts.push(parseValue(current.trim()));
    return parts;
  }

  function parseValue(val: string) {
    if (val.toUpperCase() === 'NULL') return null;
    if (val.startsWith("'") && val.endsWith("'")) return val.slice(1, -1).replace(/\\'/g, "'").replace(/\\r\\n/g, '\n').replace(/\\n/g, '\n').replace(/\\"/g, '"');
    if (val.startsWith('"') && val.endsWith('"')) return val.slice(1, -1).replace(/\\"/g, '"').replace(/\\r\\n/g, '\n').replace(/\\n/g, '\n').replace(/\\'/g, "'");
    if (!isNaN(Number(val)) && val !== '') return Number(val);
    return val;
  }

  // 1. Limpar
  console.log('Limpando tabelas atuais...');
  await prisma.service.deleteMany();
  await prisma.category.deleteMany();
  await prisma.socialNetwork.deleteMany();
  await prisma.apiProvider.deleteMany();

  // 2. Migrar ApiProviders
  console.log('Processando ApiProviders...');
  const providersData = getModelData('api_providers');
  console.log(`Extraídos ${providersData.length} ApiProviders.`);
  for (const row of providersData) {
      try {
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
      } catch (e: any) {
          console.log(`Erro ao criar ApiProvider ${row[0]}: ${e.message}`);
      }
  }

  // 3. Migrar SocialNetworks
  console.log('Processando SocialNetworks...');
  const snData = getModelData('social_network_categories');
  console.log(`Extraídas ${snData.length} SocialNetworks.`);
  for (const row of snData) {
      try {
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
      } catch (e: any) {
          console.log(`Erro ao criar SocialNetwork ${row[0]}: ${e.message}`);
      }
  }

  // 4. Migrar Categorias
  console.log('Processando Categorias...');
  const catData = getModelData('categories');
  console.log(`Extraídas ${catData.length} Categorias.`);
  const createdCatIds = new Set<number>();
  for (const row of catData) {
      try {
          await prisma.category.create({
              data: {
                  id: row[0],
                  socialNetworkId: row[2],
                  name: row[4],
                  description: row[5],
                  // Remove first and last quotes explicitly if present (safeguard)
                  requiredField: typeof row[6] === 'string' ? row[6].replace(/^"+|"+$/g, '').replace(/^'+|'+$/g, '') : null,
                  videoTutorial: row[7],
                  sortOrder: row[8] || 0,
                  status: row[9] || 1,
                  createdAt: row[10] ? new Date(row[10]) : new Date(),
              }
          });
          createdCatIds.add(row[0]);
      } catch (e: any) {
          console.log(`Erro ao criar Categoria ${row[0]} (SN ID: ${row[2]}): ${e.message}`);
      }
  }

  // 5. Migrar Serviços
  console.log('Processando Serviços...');
  const servicesData = getModelData('services');
  console.log(`Extraídos ${servicesData.length} Serviços.`);
  let successCount = 0;
  let failCount = 0;
  for (const row of servicesData) {
      const catId = row[3];
      if (!createdCatIds.has(catId)) {
          console.log(`Pulando serviço ${row[0]} - Categoria ${catId} não existe.`);
          failCount++;
          continue;
      }

      try {
          await prisma.service.create({
              data: {
                  id: row[0],
                  categoryId: catId,
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
                  apiProviderId: typeof row[15] === 'number' && row[15] > 0 ? row[15] : null,
                  status: row[16] || 1,
                  createdAt: row[18] ? new Date(row[18]) : new Date(),
              }
          });
          successCount++;
      } catch (e: any) {
          console.log(`Erro ao criar Serviço ${row[0]}: ${e.message}`);
          failCount++;
      }
  }

  console.log(`Migração finalizada: ${successCount} sucessos, ${failCount} falhas.`);
  console.log('--- Fim do Processo ---');
}

main()
  .catch((e) => {
    console.error('Erro na migração:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
