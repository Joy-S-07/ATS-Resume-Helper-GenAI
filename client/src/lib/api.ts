const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

interface RequestOptions extends Omit<RequestInit, "body"> {
  body?: Record<string, unknown>;
}

/**
 * Thin fetch wrapper for the Express backend.
 * - Always sends cookies (credentials: "include") for JWT auth
 * - Always sends JSON content type
 * - Throws ApiError with the server's message on non-2xx responses
 */
export async function apiClient<T = Record<string, unknown>>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<T> {
  const { body, headers, ...rest } = options;

  const res = await fetch(`${API_BASE_URL}${endpoint}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
    ...rest,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new ApiError(
      data.message || "Something went wrong",
      res.status
    );
  }

  return data as T;
}
