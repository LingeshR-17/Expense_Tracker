import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number, currency: string = 'INR'): string {
  const currencySymbols: Record<string, string> = {
    INR: '₹',
    USD: '$',
    EUR: '€',
    GBP: '£',
    CAD: 'CA$',
    AUD: 'A$',
    JPY: '¥',
  };

  const symbol = currencySymbols[currency] || '₹';
  const locale = currency === 'INR' ? 'en-IN' : 'en-US';
  return `${symbol}${Math.abs(amount).toLocaleString(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
