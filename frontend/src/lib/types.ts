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

/** Shape of a single Laravel API Resource response: { data: T }. */
export type ApiResource<T> = {
  data: T;
};
