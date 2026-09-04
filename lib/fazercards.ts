import "server-only";
import type {
  OrderResponse,
  TopupCategoriesResponse,
  TopupOffersResponse,
  ValidateIdListResponse,
  ValidateIdResult,
} from "./types";

const BASE_URL = (process.env.FAZERCARDS_BASE_URL ?? "https://api.fzr.cards").replace(
  /\/$/,
  ""
);
const API_KEY = process.env.FAZERCARDS_API_KEY;

export class FazercardsError extends Error {
  status: number;
  code?: string;

  constructor(message: string, status: number, code?: string) {
    super(message);
    this.name = "FazercardsError";
    this.status = status;
    this.code = code;
  }
}

async function request<T>(
  path: string,
  init: RequestInit & { extraHeaders?: Record<string, string> } = {}
): Promise<T> {
  if (!API_KEY) {
    throw new FazercardsError(
      "Server is missing the FAZERCARDS_API_KEY environment variable",
      500
    );
  }

  const { extraHeaders, ...rest } = init;

  const res = await fetch(`${BASE_URL}${path}`, {
    ...rest,
    headers: {
      "X-API-Key": API_KEY,
      "Content-Type": "application/json",
      ...extraHeaders,
    },
    cache: "no-store",
  });

  const data = await res.json().catch(() => null);

  if (!res.ok || !data || data.ok === false) {
    throw new FazercardsError(
      data?.error ?? `FazerCards request failed with status ${res.status}`,
      res.status,
      data?.code
    );
  }

  return data as T;
}

export function listTopupCategories(
  params: { limit?: number; cursor?: string } = {}
) {
  const qs = new URLSearchParams();
  qs.set("include_ui", "1");
  qs.set("limit", String(params.limit ?? 500));
  if (params.cursor) qs.set("cursor", params.cursor);
  return request<TopupCategoriesResponse>(`/api/v2/topups?${qs.toString()}`);
}

export function getTopupOffers(categoryId: string) {
  const qs = new URLSearchParams({ include_ui: "1", category_id: categoryId });
  return request<TopupOffersResponse>(`/api/v2/topups/offers?${qs.toString()}`);
}

export function listValidateIdCategories() {
  return request<ValidateIdListResponse>(`/api/v2/topups/validate-id`);
}

export function validateTopupId(categoryId: string, fields: Record<string, string>) {
  return request<ValidateIdResult>(`/api/v2/topups/validate-id`, {
    method: "POST",
    body: JSON.stringify({ category_id: categoryId, fields }),
  });
}

export function placeTopupOrder(
  categoryId: string,
  offerId: string,
  fields: Record<string, string>,
  idempotencyKey?: string
) {
  return request<OrderResponse>(`/api/v2/topups/order`, {
    method: "POST",
    body: JSON.stringify({ category_id: categoryId, offer_id: offerId, fields }),
    extraHeaders: idempotencyKey ? { "idempotency-key": idempotencyKey } : undefined,
  });
}

export function getOrder(orderId: string) {
  return request<OrderResponse>(`/api/v2/orders/${encodeURIComponent(orderId)}`);
}
