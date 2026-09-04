import { notFound } from "next/navigation";
import Link from "next/link";
import { FazercardsError, getOrder } from "@/lib/fazercards";
import OrderDetails from "@/components/OrderDetails";

// This calls a live, key-authenticated API — never prerender it at build
// time (the build environment may not have the secret key available yet).
export const dynamic = "force-dynamic";

export default async function OrderStatusPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;

  let data;
  try {
    data = await getOrder(orderId);
  } catch (err) {
    if (err instanceof FazercardsError && (err.status === 404 || err.status === 400)) {
      notFound();
    }
    throw err;
  }

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-10 sm:px-6">
      <Link
        href="/"
        className="text-sm text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
      >
        ← Back to all games
      </Link>
      <h1 className="mt-4 text-2xl font-semibold tracking-tight">Order {orderId}</h1>
      <div className="mt-6 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <OrderDetails order={data.order} />
      </div>
    </div>
  );
}
