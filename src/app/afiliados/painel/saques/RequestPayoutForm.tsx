"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/affiliate-ui";
import { useToast } from "@/components/ui/Toast";

export function RequestPayoutForm({ balance }: { balance: number }) {
  const [amount, setAmount] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(amount.replace(",", "."));

    if (isNaN(val) || val < 10) {
      toast("error", "Valor inválido", "O valor mínimo para saque é R$ 10,00");
      return;
    }

    if (val > balance) {
      toast("error", "Saldo insuficiente", `Seu saldo é R$ ${balance.toFixed(2)}`);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/afiliados/payouts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: val }),
      });

      const data = await res.json();

      if (res.ok) {
        toast("success", "Saque solicitado!", "Aguarde a aprovação. Você receberá via PIX.");
        setAmount("");
        router.refresh();
      } else {
        toast("error", "Erro ao solicitar saque", data.error || "Tente novamente.");
      }
    } catch {
      toast("error", "Erro de conexão", "Não foi possível enviar a solicitação.");
    } finally {
      setLoading(false);
    }
  };

  const canWithdraw = balance >= 10;

  return (
    <form onSubmit={handleSubmit} className="space-y-4 pt-4 border-t border-slate-100">
      <div className="space-y-2">
        <Label htmlFor="amount">Valor do Saque (R$)</Label>
        <Input
          id="amount"
          type="number"
          step="0.01"
          min="10"
          max={balance}
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Ex: 50.00"
          required
          disabled={loading || !canWithdraw}
        />
      </div>

      <Button
        type="submit"
        className="w-full"
        isLoading={loading}
        disabled={loading || !canWithdraw}
      >
        {loading ? "Solicitando..." : "Solicitar Saque"}
      </Button>

      {!canWithdraw && (
        <p className="text-xs text-center text-slate-500 mt-2">
          Saldo mínimo de R$ 10,00 ainda não atingido.
        </p>
      )}
    </form>
  );
}
