import { ZodError } from "zod";

export class HttpError extends Error {
  constructor(
    public status: 400 | 401 | 403 | 404,
    message: string,
  ) {
    super(message);
  }
}

export function jsonError(status: number, message: string) {
  return Response.json({ error: message }, { status });
}

export function withApi<Args extends unknown[]>(
  handler: (...args: Args) => Promise<Response>,
): (...args: Args) => Promise<Response> {
  return async (...args) => {
    try {
      return await handler(...args);
    } catch (err) {
      if (err instanceof HttpError) return jsonError(err.status, err.message);
      if (err instanceof ZodError) {
        const message = err.issues[0]?.message ?? "Invalid input";
        return jsonError(400, message);
      }
      console.error("[api]", err);
      return jsonError(500, "Internal server error");
    }
  };
}

export function parsePage(url: URL, fallback = 1) {
  const raw = url.searchParams.get("page");
  const page = raw ? Number.parseInt(raw, 10) : fallback;
  if (!Number.isInteger(page) || page < 1) {
    throw new HttpError(400, "Invalid page parameter");
  }
  return page;
}
