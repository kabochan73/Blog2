import { useQuery } from "@tanstack/react-query";

import { adminApiFetch } from "@/lib/api";
import type { ApiCollection, Post, PostStatus } from "@/lib/types";

export function usePostsAdmin(status: PostStatus) {
  return useQuery({
    queryKey: ["posts", status],
    queryFn: () => adminApiFetch<ApiCollection<Post>>(`/api/admin/posts?status=${status}`),
  });
}
