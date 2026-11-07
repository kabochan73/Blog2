export const POSTS_PER_PAGE = 20;

/** URL for a given 1-based page number; page 1 lives at `/`, not `/page/1`. */
export function pageHref(page: number): string {
  return page <= 1 ? "/" : `/page/${page}`;
}
