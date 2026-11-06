import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import type { PostFormValues } from "@/components/admin/PostForm";
import { adminApiFetch } from "@/lib/api";
import type { ApiResource, Post } from "@/lib/types";

export function useCreatePost() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (values: PostFormValues) =>
      adminApiFetch<ApiResource<Post>>("/api/admin/posts", {
        method: "POST",
        body: values,
      }),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      router.push(`/admin/posts/${result.data.slug}/edit`);
    },
  });
}
