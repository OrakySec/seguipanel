"use client";

import React from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { formatBRL } from "@/lib/utils";

interface RevenueData {
  date: string;
  amount: number;
}

interface RevenueChartProps {
  data: RevenueData[];
}

export function RevenueChart({ data }: RevenueChartProps) {
  return (
    <div className="w-full h-48 md:h-72 mt-6">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#d946ef" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#d946ef" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-border opacity-50" />
          <XAxis 
            dataKey="date" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 10 }} 
            className="text-muted"
            minTickGap={20}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tickFormatter={(val) => `R$${val}`} 
            tick={{ fontSize: 10 }} 
            className="text-muted"
            width={60}
          />
          <Tooltip 
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="bg-card border border-border shadow-lg p-3 rounded-2xl animate-fade-in-up">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted mb-1">{label}</p>
                    <p className="text-lg font-black text-foreground">
                      {formatBRL(payload[0].value as number)}
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Area 
            type="monotone" 
            dataKey="amount" 
            stroke="#d946ef" 
            strokeWidth={4}
            fillOpacity={1} 
            fill="url(#colorAmount)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
