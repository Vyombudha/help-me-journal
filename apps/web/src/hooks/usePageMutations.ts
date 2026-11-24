import { api } from "@/lib/api"
import { type PageDTO, type SuccessResponse } from "@/types/dtos"
import type {
  NewPageInput,
  UpdatePageContentInput,
  UpdatePageIconInput,
  UpdatePageNameInput,
} from "@help-me-journal/shared/schema"
import { useMutation, useQueryClient } from "@tanstack/react-query"

export function useCreatePage(workspaceId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (newPage: NewPageInput) => {
      const { data } = await api.post<SuccessResponse<PageDTO>>(
        `/workspaces/${workspaceId}/pages`,
        newPage
      )
      return data.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pages", workspaceId] })
    },
  })
}

export function useUpdatePageTitle() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({
      pageId,
      ...updatedPageData
    }: UpdatePageNameInput & { pageId: string }) => {
      const { data } = await api.patch<SuccessResponse<PageDTO>>(
        `/pages/${pageId}/title`,
        updatedPageData
      )
      return data.data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["pages", data.workspaceId],
      })
      queryClient.invalidateQueries({
        queryKey: ["page", data.id],
      })
    },
  })
}

export function useUpdatePageContent() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({
      pageId,
      ...updatedPageData
    }: UpdatePageContentInput & { pageId: string }) => {
      const { data } = await api.patch<SuccessResponse<PageDTO>>(
        `/pages/${pageId}/content`,
        updatedPageData
      )
      return data.data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["page", data.id],
      })
    },
  })
}

export function useUpdatePageIcon() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({
      pageId,
      ...updatedPageData
    }: UpdatePageIconInput & { pageId: string }) => {
      const { data } = await api.patch<SuccessResponse<PageDTO>>(
        `/pages/${pageId}/icon`,
        updatedPageData
      )
      return data.data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["page", data.id],
      })
    },
  })
}

export function useDeletePage(workspaceId: string) {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (pageId: string) => {
      const { data } = await api.delete<SuccessResponse<PageDTO>>(
        `/pages/${pageId}`
      )
      return data.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["pages", workspaceId],
      })
    },
  })
}
