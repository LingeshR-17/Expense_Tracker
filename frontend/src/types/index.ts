export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  currency: string;
  accountType?: 'demo' | 'fresh' | 'custom';
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}

export interface Category {
  id: string;
  name: string;
  icon: string | null;
  color: string | null;
  isCustom: boolean;
}

export interface Transaction {
  id: string;
  categoryId: string;
  categoryName: string;
  amount: number;
  currency: string;
  transactionDate: string;
  description: string;
  paymentMethod?: string;
  type: "INCOME" | "EXPENSE" | "TRANSFER";
  receiptUrl?: string | null;
  createdAt: string;
  podId?: string;
}

export interface Budget {
  id: string;
  categoryId: string;
  categoryName: string;
  monthlyLimit: number;
  period: string; // e.g. "2026-09"
}

export interface PodMember {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  pendingEmail?: string;
}

export interface Pod {
  id: string;
  name: string;
  createdAt: string;
  members: PodMember[];
  totalExpense?: number;
}

export interface RecurringRule {
  id: string;
  transactionId: string;
  description?: string;
  amount?: number;
  categoryName?: string;
  frequency: "WEEKLY" | "MONTHLY" | "YEARLY";
  nextDueDate: string;
  lastRunDate: string | null;
}
