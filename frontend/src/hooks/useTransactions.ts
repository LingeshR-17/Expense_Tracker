import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import api from "../lib/axios"
import type { Transaction } from "../types"

export interface TransactionSearchParams {
  keyword?: string;
  startDate?: string;
  endDate?: string;
  categoryId?: string;
  page?: number;
  size?: number;
}

export interface PageResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  number: number;
}

export function useTransactions(params?: TransactionSearchParams) {
  const queryClient = useQueryClient()

  const { data, isLoading, error } = useQuery<PageResponse<Transaction> | Transaction[]>({
    queryKey: ["transactions", params],
    queryFn: async () => {
      if (params) {
        // Remove undefined values
        const cleanParams = Object.fromEntries(Object.entries(params).filter(([_, v]) => v != null && v !== ''));
        const { data } = await api.get("/transactions/search", { params: cleanParams })
        return data as PageResponse<Transaction>;
      } else {
        const { data } = await api.get("/transactions")
        return data as Transaction[];
      }
    },
  })

  const createTransaction = useMutation({
    mutationFn: async (newTransaction: Partial<Transaction>) => {
      const { data } = await api.post("/transactions", newTransaction)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] })
    },
  })

  const deleteTransaction = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/transactions/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["transactions"] })
    },
  })

  return { transactions: data, isLoading, error, createTransaction, deleteTransaction }
}
