import { NextRequest, NextResponse } from "next/server";
import { placeTopupOrder } from "@/lib/fazercards";
import { errorResponse } from "@/lib/api-utils";

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON body" }, { status: 400 });
  }

  const { category_id, offer_id, fields, idempotencyKey } = (body ?? {}) as {
    category_id?: unknown;
    offer_id?: unknown;
    fields?: unknown;
    idempotencyKey?: unknown;
  };

  if (typeof category_id !== "string" || !category_id) {
    return NextResponse.json(
      { ok: false, error: "category_id is required" },
      { status: 400 }
    );
  }
  if (typeof offer_id !== "string" || !offer_id) {
    return NextResponse.json(
      { ok: false, error: "offer_id is required" },
      { status: 400 }
    );
  }
  if (typeof fields !== "object" || fields === null || Array.isArray(fields)) {
    return NextResponse.json(
      { ok: false, error: "fields must be an object" },
      { status: 400 }
    );
  }

  try {
    const data = await placeTopupOrder(
      category_id,
      offer_id,
      fields as Record<string, string>,
      typeof idempotencyKey === "string" ? idempotencyKey : undefined
    );
    return NextResponse.json(data, { status: 201 });
  } catch (err) {
    return errorResponse(err);
  }
}
