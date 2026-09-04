"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { TopupCategory } from "@/lib/types";

export default function GameGrid({ categories }: { categories: TopupCategory[] }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return categories;
    return categories.filter((c) => c.name.toLowerCase().includes(q));
  }, [categories, query]);

  return (
    <div>
      <input
        type="search"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search games…"
        className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm shadow-sm outline-none focus:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-900 dark:focus:border-zinc-600"
      />

      {filtered.length === 0 ? (
        <p className="mt-10 text-center text-sm text-zinc-500">
          No games match &ldquo;{query}&rdquo;.
        </p>
      ) : (
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {filtered.map((game) => (
            <Link
              key={game.category_id}
              href={`/games/${encodeURIComponent(game.category_id)}`}
              className="group flex flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
            >
              <div className="aspect-square w-full overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                {game.imageurl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={game.imageurl}
                    alt=""
                    className="h-full w-full object-cover transition group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-2xl font-semibold text-zinc-400">
                    {game.name.slice(0, 1)}
                  </div>
                )}
              </div>
              <div className="p-3">
                <p className="line-clamp-2 text-sm font-medium text-zinc-900 dark:text-zinc-100">
                  {game.name}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
