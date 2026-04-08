/**
 * Limpa dados de teste:
 * - Apaga todos os TransactionLogs
 * - Apaga todos os Orders
 * - Apaga todos os UserLogs
 * - Apaga todos os Users onde role != ADMIN
 * - Reseta totalOrders e totalSpent do admin
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🧹 Iniciando limpeza de dados de teste...\n");

  // 1. Apagar transaction_logs (FK para orders e users)
  const txDel = await prisma.transactionLog.deleteMany({});
  console.log(`✅ TransactionLogs apagados: ${txDel.count}`);

  // 2. Apagar orders
  const orderDel = await prisma.order.deleteMany({});
  console.log(`✅ Orders apagados: ${orderDel.count}`);

  // 3. Apagar user_logs de não-admins
  const userLogDel = await prisma.userLog.deleteMany({
    where: { user: { role: { not: "ADMIN" } } },
  });
  console.log(`✅ UserLogs de clientes apagados: ${userLogDel.count}`);

  // 4. Apagar usuários não-admin (user_logs restantes cascadeiam)
  const userDel = await prisma.user.deleteMany({
    where: { role: { not: "ADMIN" } },
  });
  console.log(`✅ Usuários apagados: ${userDel.count}`);

  // 5. Resetar contadores do admin
  const adminReset = await prisma.user.updateMany({
    where: { role: "ADMIN" },
    data: { totalOrders: 0, totalSpent: 0 },
  });
  console.log(`✅ Admin resetado: ${adminReset.count} conta(s)`);

  console.log("\n🎉 Limpeza concluída com sucesso!");
}

main()
  .catch((e) => {
    console.error("❌ Erro:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
