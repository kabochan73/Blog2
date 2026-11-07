import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useTagsList } from "@/hooks/admin/tags/useTagsList";
import { adminApiFetch } from "@/lib/api";
import type { ApiResource, Tag } from "@/lib/types";

export function useTagsAdmin() {
  const queryClient = useQueryClient();
  const tagsQuery = useTagsList();

  const invalidateTags = () => queryClient.invalidateQueries({ queryKey: ["tags"] });

  const createTag = useMutation({
    mutationFn: (name: string) =>
      adminApiFetch<ApiResource<Tag>>("/api/admin/tags", {
        method: "POST",
        body: { name },
      }),
    onSuccess: invalidateTags,
  });

  const updateTag = useMutation({
    mutationFn: ({ id, name }: { id: number; name: string }) =>
      adminApiFetch<ApiResource<Tag>>(`/api/admin/tags/${id}`, {
        method: "PUT",
        body: { name },
      }),
    onSuccess: invalidateTags,
  });

  const deleteTag = useMutation({
    mutationFn: (id: number) => adminApiFetch<void>(`/api/admin/tags/${id}`, { method: "DELETE" }),
    onSuccess: invalidateTags,
  });

  return { tagsQuery, createTag, updateTag, deleteTag };
}
