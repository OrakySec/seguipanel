import { getSessionFromCookies } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { CopyButton } from "@/components/ui/CopyButton";
import { Card, CardContent, CardHeader, CardTitle, Badge } from "@/components/ui/affiliate-ui";
import { formatCurrency, formatDate } from "@/lib/utils";
import { LinkIcon, Users, CheckCircle, Clock, DollarSign } from "lucide-react";

export default async function AffiliateDashboardPage() {
  const session = await getSessionFromCookies();
  if (!session) redirect("/afiliados/login");

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { balance: true, affiliateCode: true, pixKey: true },
  });

  if (!user) redirect("/afiliados/login");

  const affiliateLink = `https://seguifacil.com/?ref=${user.affiliateCode}`;

  const clicksCount = await prisma.affiliateClick.count({
    where: { affiliateId: session.userId },
  });

  const completedOrdersAgg = await prisma.order.aggregate({
    where: { affiliateId: session.userId, commissionPaid: true },
    _count: { id: true },
    _sum: { commissionAmount: true },
  });

  const pendingOrdersAgg = await prisma.order.aggregate({
    where: { affiliateId: session.userId, commissionPaid: false },
    _count: { id: true },
    _sum: { commissionAmount: true },
  });

  const recentOrders = await prisma.order.findMany({
    where: { affiliateId: session.userId },
    orderBy: { createdAt: "desc" },
    take: 10,
    select: {
      id: true,
      status: true,
      commissionAmount: true,
      commissionPaid: true,
      createdAt: true,
    },
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Visão Geral</h1>
        <p className="text-slate-500 mt-1">Acompanhe seus ganhos e comissões.</p>
      </div>

      {/* Affiliate Link Section */}
      <Card className="bg-gradient-to-r from-primary/5 to-pink-500/5 border-primary/20">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <LinkIcon className="w-5 h-5 text-primary" />
                Seu Link de Afiliado
              </h2>
              <p className="text-sm text-slate-500 mt-1">
                Compartilhe este link. As compras feitas através dele geram comissões para você (Cookie de 90 dias).
              </p>
            </div>
            <div className="flex items-center gap-2 w-full md:w-auto bg-white border border-slate-200 rounded-lg p-1 pr-2">
              <code className="text-sm px-3 py-2 text-slate-700 bg-slate-50 rounded select-all flex-1 md:flex-none">
                {affiliateLink}
              </code>
              <CopyButton text={affiliateLink} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saldo Disponível</CardTitle>
            <DollarSign className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">
              {formatCurrency(Number(user.balance))}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Mínimo para saque: R$ 10,00
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vendas Concluídas</CardTitle>
            <CheckCircle className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {completedOrdersAgg._count.id}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Ganhos: {formatCurrency(Number(completedOrdersAgg._sum.commissionAmount || 0))}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vendas Pendentes</CardTitle>
            <Clock className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {pendingOrdersAgg._count.id}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              A receber: {formatCurrency(Number(pendingOrdersAgg._sum.commissionAmount || 0))}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cliques no Link</CardTitle>
            <Users className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {clicksCount}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Visitantes únicos tracking
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <CardTitle>Últimas Vendas</CardTitle>
        </CardHeader>
        <CardContent>
          {recentOrders.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              Nenhuma venda registrada ainda. Divulgue seu link para começar a ganhar!
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-slate-500 uppercase bg-slate-50">
                  <tr>
                    <th className="px-4 py-3 font-medium">Data</th>
                    <th className="px-4 py-3 font-medium">ID Pedido</th>
                    <th className="px-4 py-3 font-medium">Comissão</th>
                    <th className="px-4 py-3 font-medium">Status do Pedido</th>
                    <th className="px-4 py-3 font-medium">Status Comissão</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3">{formatDate(order.createdAt)}</td>
                      <td className="px-4 py-3 text-slate-500">#{order.id}</td>
                      <td className="px-4 py-3 font-medium text-emerald-600">
                        {formatCurrency(Number(order.commissionAmount || 0))}
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={
                          order.status === "completed" ? "success" :
                          order.status === "canceled" ? "destructive" :
                          order.status === "partial" ? "warning" : "secondary"
                        }>
                          {order.status === "completed" ? "Concluído" :
                           order.status === "canceled" ? "Cancelado" :
                           order.status === "partial" ? "Parcial" : "Em Andamento"}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        {order.commissionPaid ? (
                          <span className="flex items-center gap-1 text-emerald-600 text-xs font-medium">
                            <CheckCircle className="w-3 h-3" /> Liberado
                          </span>
                        ) : order.status === "canceled" || order.status === "partial" ? (
                          <span className="text-red-500 text-xs font-medium">Cancelada</span>
                        ) : (
                          <span className="flex items-center gap-1 text-amber-500 text-xs font-medium">
                            <Clock className="w-3 h-3" /> Aguardando Conclusão
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
