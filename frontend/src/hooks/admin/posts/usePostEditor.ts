import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

import type { PostFormValues } from "@/components/admin/PostForm";
import { adminApiFetch } from "@/lib/api";
import type { ApiResource, Post } from "@/lib/types";

export function usePostEditor(slug: string) {
  const queryClient = useQueryClient();
  const router = useRouter();

  const postQuery = useQuery({
    queryKey: ["posts", "detail", slug],
    queryFn: () => adminApiFetch<ApiResource<Post>>(`/api/admin/posts/${slug}`),
  });

  const updatePost = useMutation({
    mutationFn: (values: PostFormValues) =>
      adminApiFetch<ApiResource<Post>>(`/api/admin/posts/${slug}`, {
        method: "PUT",
        body: values,
      }),
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      if (result.data.slug !== slug) {
        router.replace(`/admin/posts/${result.data.slug}/edit`);
      }
    },
  });

  const deletePost = useMutation({
    mutationFn: () => adminApiFetch<void>(`/api/admin/posts/${slug}`, { method: "DELETE" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      router.push("/admin/posts");
    },
  });

  return { postQuery, updatePost, deletePost };
}
