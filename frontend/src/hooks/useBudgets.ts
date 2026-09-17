import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/axios';
import type { Budget } from '../types';

export function useBudgets() {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery<Budget[]>({
    queryKey: ['budgets'],
    queryFn: async () => {
      const response = await api.get('/budgets');
      return response.data;
    },
  });

  const saveBudget = useMutation({
    mutationFn: async (budgetData: { categoryId: string; monthlyLimit: number }) => {
      const response = await api.post('/budgets', budgetData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
    },
  });

  const deleteBudget = useMutation({
    mutationFn: async (budgetId: string) => {
      await api.delete(`/budgets/${budgetId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
    },
  });

  return {
    budgets: data || [],
    isLoading,
    error,
    saveBudget,
    deleteBudget,
  };
}
