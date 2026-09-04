import type { ReactNode } from "react";
import { humanizeKey } from "@/lib/utils";

function renderValue(value: unknown): ReactNode {
  if (value === null || value === undefined || value === "") {
    return <span className="text-zinc-400">—</span>;
  }
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }
  return (
    <pre className="max-w-full overflow-x-auto whitespace-pre-wrap break-all text-left text-xs text-zinc-500">
      {JSON.stringify(value, null, 2)}
    </pre>
  );
}

export default function OrderDetails({ order }: { order: Record<string, unknown> }) {
  const entries = Object.entries(order);

  if (entries.length === 0) {
    return <p className="text-sm text-zinc-500">No order details available.</p>;
  }

  return (
    <dl className="divide-y divide-zinc-100 dark:divide-zinc-800">
      {entries.map(([key, value]) => (
        <div key={key} className="flex flex-col gap-1 py-2 sm:flex-row sm:justify-between sm:gap-4">
          <dt className="text-sm font-medium text-zinc-500">{humanizeKey(key)}</dt>
          <dd className="text-sm text-zinc-900 dark:text-zinc-100 sm:text-right">
            {renderValue(value)}
          </dd>
        </div>
      ))}
    </dl>
  );
}
