import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/axios';
import type { RecurringRule } from '../types';

export type { RecurringRule };

export const useRules = () => {
  const queryClient = useQueryClient();

  const rulesQuery = useQuery({
    queryKey: ['rules'],
    queryFn: async () => {
      const response = await api.get<RecurringRule[]>('/rules');
      return response.data;
    },
  });

  const createRuleMutation = useMutation({
    mutationFn: async (data: { transactionId: string; frequency: string; nextDueDate: string }) => {
      const response = await api.post<RecurringRule>('/rules', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rules'] });
    },
  });

  const deleteRuleMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/rules/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rules'] });
    },
  });

  return {
    rules: rulesQuery.data || [],
    isLoading: rulesQuery.isLoading,
    createRule: createRuleMutation.mutate,
    isCreating: createRuleMutation.isPending,
    deleteRule: deleteRuleMutation.mutate,
    isDeleting: deleteRuleMutation.isPending,
  };
};
