import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import type { PostFormValues } from "@/components/admin/PostForm";
import { adminApiFetch } from "@/lib/api";
import type { ApiResource, Post } from "@/lib/types";

export function useUpdatePost(currentSlug: string) {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (values: PostFormValues) =>
      adminApiFetch<ApiResource<Post>>(`/api/admin/posts/${currentSlug}`, {
        method: "PUT",
        body: values,
      }),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      if (result.data.slug !== currentSlug) {
        router.replace(`/admin/posts/${result.data.slug}/edit`);
      }
    },
  });
}
