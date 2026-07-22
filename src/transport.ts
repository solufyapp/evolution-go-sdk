export interface RequestOptions {
  body?: unknown;
  query?: Record<string, string | number | boolean | undefined>;
  /** Overrides the client's own apikey header for this one call. */
  apiKey?: string;
}

export type RequestFn = <T>(
  method: string,
  path: string,
  options?: RequestOptions,
) => Promise<T>;

export type RequestFormFn = <T>(
  method: string,
  path: string,
  form: FormData,
  apiKey?: string,
) => Promise<T>;
