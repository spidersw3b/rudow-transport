import { NextResponse } from "next/server";

export type ApiErrorPayload = {
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
};

export function apiError(
  status: number,
  code: string,
  message: string,
  details?: unknown
) {
  return NextResponse.json<ApiErrorPayload>(
    {
      error: {
        code,
        message,
        ...(details !== undefined ? { details } : {}),
      },
    },
    { status }
  );
}

export function apiOk<T>(payload: T, init?: ResponseInit) {
  return NextResponse.json(payload, init);
}
