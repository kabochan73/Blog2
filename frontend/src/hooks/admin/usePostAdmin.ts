import { useQuery } from "@tanstack/react-query";

import { adminApiFetch } from "@/lib/api";
import type { ApiResource, Post } from "@/lib/types";

export function usePostAdmin(slug: string) {
  return useQuery({
    queryKey: ["posts", "detail", slug],
    queryFn: () => adminApiFetch<ApiResource<Post>>(`/api/admin/posts/${slug}`),
  });
}
