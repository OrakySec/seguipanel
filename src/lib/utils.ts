import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(
  value: number,
  symbol = "R$",
  decimals = 2
): string {
  return `${symbol} ${Number(value).toFixed(decimals).replace(".", ",")}`;
}

export function formatBRL(value: number | string | any): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(Number(value));
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function generateId(length = 32): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  return Array.from({ length }, () =>
    chars.charAt(Math.floor(Math.random() * chars.length))
  ).join("");
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

export function apiResponse<T>(
  data: T,
  message?: string,
  status = 200
): Response {
  return Response.json(
    {
      success: true,
      message,
      data,
    },
    { status }
  );
}

/**
 * Remove todas as tags HTML de uma string, retornando texto puro.
 * Usado antes de dangerouslySetInnerHTML para evitar XSS.
 */
export function stripHtml(html: string): string {
  if (!html) return "";
  return html.replace(/<[^>]*>/g, "").trim();
}

export function apiError(message: string, status = 400): Response {
  return Response.json(
    {
      success: false,
      message, // Using message instead of error for consistency with frontend
      error: message, // keeping error for backward compatibility if needed
    },
    { status }
  );
}
