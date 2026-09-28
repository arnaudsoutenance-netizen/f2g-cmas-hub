import { clearSession, getSessionToken } from "@/lib/stores/session-store";

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api/v1";

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    message: string,
    public readonly detail?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

type Query = Record<string, string | number | boolean | undefined>;

interface RequestOptions {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  query?: Query;
  json?: unknown;
  form?: URLSearchParams;
  signal?: AbortSignal;
}

function buildUrl(path: string, query?: Query): string {
  const url = new URL(`${API_BASE_URL}${path}`);
  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined && value !== "") url.searchParams.set(key, String(value));
    }
  }
  return url.toString();
}

/** FastAPI returns `detail` as a string or as a list of validation errors. */
function messageFromDetail(detail: unknown, fallback: string): string {
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail)) {
    const messages = detail
      .map((d: unknown) => (typeof d === "object" && d !== null && "msg" in d ? String(d.msg) : null))
      .filter((m): m is string => m !== null);
    if (messages.length > 0) return messages.join(" · ");
  }
  return fallback;
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const headers = new Headers({ Accept: "application/json" });
  const token = getSessionToken();
  if (token) headers.set("Authorization", `Bearer ${token}`);

  let body: BodyInit | undefined;
  if (options.json !== undefined) {
    headers.set("Content-Type", "application/json");
    body = JSON.stringify(options.json);
  } else if (options.form) {
    body = options.form;
  }

  let response: Response;
  try {
    response = await fetch(buildUrl(path, options.query), {
      method: options.method ?? "GET",
      headers,
      body,
      signal: options.signal,
    });
  } catch (cause) {
    if (cause instanceof DOMException && cause.name === "AbortError") throw cause;
    throw new ApiError(0, "Cannot reach the CMAS Hub server. Check that the backend is running.");
  }

  if (response.status === 401 && token) clearSession();

  if (!response.ok) {
    const payload: unknown = await response.json().catch(() => null);
    const detail = typeof payload === "object" && payload !== null && "detail" in payload ? payload.detail : payload;
    throw new ApiError(response.status, messageFromDetail(detail, `Request failed (${response.status})`), detail);
  }

  if (response.status === 204) return undefined as T;
  return (await response.json()) as T;
}
