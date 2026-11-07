import type { TocHeading } from "@/lib/markdown";

export function TableOfContents({ headings }: { headings: TocHeading[] }) {
  if (headings.length === 0) {
    return null;
  }

  return (
    <nav className="rounded-lg border border-gray-200 p-4 text-sm">
      <p className="mb-2 font-semibold">目次</p>
      <ul className="flex flex-col gap-1">
        {headings.map((heading) => (
          <li key={heading.id} className={heading.depth === 3 ? "pl-4" : undefined}>
            <a href={`#${heading.id}`} className="text-gray-600 hover:text-gray-950 hover:underline">
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
