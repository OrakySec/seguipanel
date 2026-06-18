import { getSessionFromCookies } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, Badge } from "@/components/ui/affiliate-ui";
import { formatCurrency, formatDate } from "@/lib/utils";
import { RequestPayoutForm } from "./RequestPayoutForm";

export default async function AffiliatePayoutsPage() {
  const session = await getSessionFromCookies();
  if (!session) redirect("/afiliados/login");

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { balance: true, pixKey: true },
  });

  if (!user) redirect("/afiliados/login");

  const payouts = await prisma.payout.findMany({
    where: { affiliateId: session.userId },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Meus Saques</h1>
        <p className="text-slate-500 mt-1">Solicite pagamentos via PIX e acompanhe o histórico.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Solicitar Saque</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <p className="text-sm text-slate-500 mb-1">Saldo Disponível</p>
                <p className="text-3xl font-bold text-emerald-600">
                  {formatCurrency(Number(user.balance))}
                </p>
              </div>

              {!user.pixKey ? (
                <div className="p-4 bg-amber-50 text-amber-800 rounded-lg text-sm border border-amber-200">
                  Você precisa cadastrar uma chave PIX para solicitar saque. Entre em contato com o suporte.
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-sm text-slate-600">
                    Sua Chave PIX: <strong className="text-slate-800">{user.pixKey}</strong>
                  </div>
                  
                  <RequestPayoutForm balance={Number(user.balance)} />
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Histórico de Solicitações</CardTitle>
            </CardHeader>
            <CardContent>
              {payouts.length === 0 ? (
                <div className="text-center py-8 text-slate-500 text-sm">
                  Nenhum saque solicitado ainda.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead className="text-xs text-slate-500 uppercase bg-slate-50">
                      <tr>
                        <th className="px-4 py-3 font-medium">Data</th>
                        <th className="px-4 py-3 font-medium">Valor</th>
                        <th className="px-4 py-3 font-medium">Chave PIX</th>
                        <th className="px-4 py-3 font-medium">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {payouts.map((payout) => (
                        <tr key={payout.id} className="hover:bg-slate-50">
                          <td className="px-4 py-3">{formatDate(payout.createdAt)}</td>
                          <td className="px-4 py-3 font-medium text-slate-700">
                            {formatCurrency(Number(payout.amount))}
                          </td>
                          <td className="px-4 py-3 text-slate-500 text-xs truncate max-w-[150px]">
                            {payout.pixKey}
                          </td>
                          <td className="px-4 py-3">
                            <Badge variant={
                              payout.status === "completed" ? "success" :
                              payout.status === "rejected" ? "destructive" : "secondary"
                            }>
                              {payout.status === "completed" ? "Aprovado" :
                               payout.status === "rejected" ? "Rejeitado" : "Pendente"}
                            </Badge>
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
      </div>
    </div>
  );
}
