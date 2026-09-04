import { listTopupCategories } from "@/lib/fazercards";
import GameGrid from "@/components/GameGrid";

// This calls a live, key-authenticated API — never prerender it at build
// time (the build environment may not have the secret key available yet).
export const dynamic = "force-dynamic";

export default async function HomePage() {
  const data = await listTopupCategories({ limit: 500 });

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6">
      <header className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight">Game Top-Up</h1>
        <p className="mt-2 text-zinc-500">
          Pick a game, choose a package, and top up instantly.
        </p>
      </header>

      <GameGrid categories={data.items} />
    </div>
  );
}
