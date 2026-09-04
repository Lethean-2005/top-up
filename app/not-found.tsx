import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center px-4 py-20 text-center">
      <h1 className="text-xl font-semibold">Not found</h1>
      <p className="mt-2 text-sm text-zinc-500">
        We couldn&apos;t find what you were looking for.
      </p>
      <Link href="/" className="mt-6 text-sm font-medium underline">
        Back to games
      </Link>
    </div>
  );
}
