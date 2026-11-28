import { api } from "@/lib/api"
import type { SuccessResponse, WorkspaceDTO } from "@/types/dtos"
import type {
  NewWorkspaceInput,
  UpdateWorkspaceInput,
} from "@help-me-journal/shared/schema"

import { useMutation, useQueryClient } from "@tanstack/react-query"

export function useCreateWorkspace() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (newWorkspace: NewWorkspaceInput) => {
      const { data } = await api.post<SuccessResponse<WorkspaceDTO>>(
        "/workspaces",
        newWorkspace
      )
      return data.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workspaces"] })
    },
  })
}

export function useUpdateWorkspace() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({
      id,
      ...updatedWorkspace
    }: UpdateWorkspaceInput & { id: string }) => {
      const { data } = await api.put<SuccessResponse<WorkspaceDTO>>(
        `/workspaces/${id}`,
        updatedWorkspace
      )
      return data.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workspaces"] })
    },
  })
}

export function useSetDefaultWorkspace() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id }: { id: string }) => {
      const { data } = await api.put<SuccessResponse<WorkspaceDTO>>(
        `/workspaces/${id}/set-default`
      )
      return data.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workspaces"] })
    },
  })
}

export function useDeleteWorkspace() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const { data } = await api.delete<SuccessResponse<WorkspaceDTO>>(
        `/workspaces/${id}`
      )
      return data.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workspaces"] })
    },
  })
}
