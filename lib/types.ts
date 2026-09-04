export interface TopupCategory {
  category_id: string;
  name: string;
  note?: string;
  imageurl?: string | null;
}

export interface TopupCategoriesResponse {
  ok: true;
  kind: "topup";
  items: TopupCategory[];
  meta: {
    total: number;
    limit: number;
    next_cursor: string | null;
    has_more: boolean;
  };
}

export interface TopupOffer {
  offer_id: string | null;
  name: string;
  price_usd: string;
}

export interface TopupFieldOption {
  value?: string;
  label?: string;
  [key: string]: unknown;
}

export interface TopupField {
  key: string;
  label: string;
  type: string;
  options?: TopupFieldOption[];
  [key: string]: unknown;
}

export interface TopupOffersResponse {
  ok: true;
  kind: "topup";
  category_id: string;
  name: string;
  note?: string;
  imageurl?: string | null;
  offers: TopupOffer[];
  fields: TopupField[];
}

export interface ValidateIdCategory {
  category_id: string;
  name: string;
  fields: TopupField[];
}

export interface ValidateIdListResponse {
  ok: true;
  kind: "topup";
  items: ValidateIdCategory[];
}

export interface ValidateIdResult {
  ok: true;
  category_id: string;
  valid: boolean;
  player_name: string | null;
  player_id?: string | null;
  region?: string | null;
}

export type OrderRecord = Record<string, unknown>;

export interface OrderResponse {
  ok: true;
  order: OrderRecord;
}
