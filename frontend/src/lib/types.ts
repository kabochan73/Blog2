export type LoginResponse = {
  token: string;
};

export type ImageUploadResponse = {
  url: string;
};

export type Tag = {
  id: number;
  name: string;
  count: number;
};

/** Public TagResource shape: no `id` (unlike the admin Tag type above). */
export type PublicTag = {
  name: string;
  count: number;
};

export type PostStatus = "draft" | "published";

export type Post = {
  slug: string;
  title: string;
  status: PostStatus;
  excerpt: string | null;
  content: string;
  thumbnail: string | null;
  tags: string[];
  created_at: string;
  updated_at: string;
};

/** Public PostResource shape: no `status`; `content`/`updated_at` are present only on the detail (show) endpoint. */
export type PublicPost = {
  slug: string;
  title: string;
  excerpt: string | null;
  thumbnail: string | null;
  tags: string[];
  created_at: string;
  content?: string;
  updated_at?: string;
};

/** Shape of a Laravel API Resource collection response: { data: T[] }. */
export type ApiCollection<T> = {
  data: T[];
};

/** Laravel paginator's `meta` block, as returned by `paginate()`-backed resource collections. */
export type PaginationMeta = {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
};

/** Shape of a paginated Laravel API Resource collection response: { data: T[], meta }. */
export type PaginatedCollection<T> = {
  data: T[];
  meta: PaginationMeta;
};

/** Shape of a single Laravel API Resource response: { data: T }. */
export type ApiResource<T> = {
  data: T;
};
