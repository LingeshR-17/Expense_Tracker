import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import api from "../lib/axios"
import type { Category } from "../types"

export function useCategories() {
  const queryClient = useQueryClient()

  const { data, isLoading, error } = useQuery<Category[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data } = await api.get("/categories")
      return data
    },
  })

  const createCategory = useMutation({
    mutationFn: async (newCategory: Partial<Category>) => {
      const { data } = await api.post("/categories", newCategory)
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["categories"] })
    },
  })

  return { categories: data, isLoading, error, createCategory }
}
