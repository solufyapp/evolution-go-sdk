export interface RequestOptions {
  body?: unknown;
  query?: Record<string, string | number | boolean | undefined>;
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
) => Promise<T>;
