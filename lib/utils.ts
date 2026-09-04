export function humanizeKey(key: string): string {
  return key
    .replace(/_/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export function formatUsd(value: string | number): string {
  const num = typeof value === "string" ? Number(value) : value;
  if (Number.isNaN(num)) return String(value);
  return num.toLocaleString(undefined, {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
  });
}

export function optionValue(opt: Record<string, unknown>): string {
  const v = opt.value ?? opt.id ?? opt.key ?? opt.code;
  return v === undefined || v === null ? "" : String(v);
}

export function optionLabel(opt: Record<string, unknown>): string {
  const l = opt.label ?? opt.name ?? opt.title;
  if (l !== undefined && l !== null) return String(l);
  return optionValue(opt);
}

export function normalizeGameName(name: string): string {
  return name
    .replace(/\s*\([^)]*\)\s*$/, "")
    .trim()
    .toLowerCase();
}

/**
 * Matches a catalog game to a validate-id category by name rather than
 * category_id: this reseller's catalog splits games into region/variant
 * SKUs (e.g. "Mobile Legends (Indonesia)") that don't share an id with the
 * generic validate-id entry ("mobile_legends" / "Mobile Legends"), even
 * though the underlying player-lookup is the same regardless of region.
 * Exact name match is tried first so entries that legitimately differ only
 * by a trailing "(Region)" — e.g. Magic Chess Go Go (Global) vs (RU) — are
 * kept distinct; only when that fails do we strip the suffix and retry.
 */
export function findValidateCategory<T extends { name: string }>(
  gameName: string,
  candidates: T[]
): T | null {
  const lower = gameName.trim().toLowerCase();
  const exact = candidates.find((c) => c.name.trim().toLowerCase() === lower);
  if (exact) return exact;

  const normalized = normalizeGameName(gameName);
  const stripped = candidates.find((c) => c.name.trim().toLowerCase() === normalized);
  return stripped ?? null;
}

export function findOrderId(value: unknown): string | null {
  if (typeof value === "string" && /^ord-\d+$/.test(value)) return value;
  if (Array.isArray(value)) {
    for (const item of value) {
      const found = findOrderId(item);
      if (found) return found;
    }
    return null;
  }
  if (value && typeof value === "object") {
    for (const v of Object.values(value)) {
      const found = findOrderId(v);
      if (found) return found;
    }
  }
  return null;
}
