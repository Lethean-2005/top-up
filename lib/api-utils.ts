import { NextResponse } from "next/server";
import { FazercardsError } from "./fazercards";

export function errorResponse(err: unknown) {
  if (err instanceof FazercardsError) {
    const status = err.status >= 400 && err.status < 600 ? err.status : 502;
    return NextResponse.json({ ok: false, error: err.message, code: err.code }, { status });
  }
  console.error(err);
  return NextResponse.json({ ok: false, error: "Unexpected server error" }, { status: 500 });
}
