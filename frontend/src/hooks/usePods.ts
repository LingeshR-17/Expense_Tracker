import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/axios';

export interface PodMember {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  pendingEmail: string;
}

export interface Pod {
  id: string;
  name: string;
  createdAt: string;
  members: PodMember[];
}

export interface SettlementTransaction {
  fromUserId: string;
  toUserId: string;
  amount: number;
}

export const usePods = () => {
  const queryClient = useQueryClient();

  const podsQuery = useQuery({
    queryKey: ['pods'],
    queryFn: async () => {
      const response = await api.get<Pod[]>('/pods');
      return response.data;
    },
  });

  const createPodMutation = useMutation({
    mutationFn: async (name: string) => {
      const response = await api.post<Pod>('/pods', { name });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pods'] });
    },
  });

  const inviteMemberMutation = useMutation({
    mutationFn: async ({ podId, email }: { podId: string; email: string }) => {
      await api.post(`/pods/${podId}/invite`, { email });
    },
  });

  const getSettlementPlan = async (podId: string) => {
    const response = await api.get<SettlementTransaction[]>(`/pods/${podId}/settlement-plan`);
    return response.data;
  };

  const settleUpMutation = useMutation({
    mutationFn: async (podId: string) => {
      await api.post(`/pods/${podId}/settle`);
    },
    onSuccess: () => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: ['pods'] });
    },
  });

  return {
    pods: podsQuery.data || [],
    isLoading: podsQuery.isLoading,
    isError: podsQuery.isError,
    createPod: createPodMutation.mutate,
    isCreating: createPodMutation.isPending,
    inviteMember: inviteMemberMutation.mutate,
    isInviting: inviteMemberMutation.isPending,
    getSettlementPlan,
    settleUp: settleUpMutation.mutate,
    isSettling: settleUpMutation.isPending,
  };
};
