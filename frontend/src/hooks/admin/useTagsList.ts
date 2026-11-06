import { useQuery } from "@tanstack/react-query";

import { adminApiFetch } from "@/lib/api";
import type { ApiCollection, Tag } from "@/lib/types";

export function useTagsList() {
  return useQuery({
    queryKey: ["tags"],
    queryFn: () => adminApiFetch<ApiCollection<Tag>>("/api/admin/tags"),
  });
}
