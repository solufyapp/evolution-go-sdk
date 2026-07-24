import { EvolutionGoApiError } from "./errors";

export interface APIConfig {
  baseUrl: string;
  apiKey: string;
  fetch?: typeof globalThis.fetch;
}

export class APITransport {
  doFetch = globalThis.fetch;
  baseUrl: string;
  apiKey: string;

  constructor(public config: APIConfig) {
    if (config.fetch) this.doFetch = config.fetch;
    this.baseUrl = config.baseUrl.replace(/\/$/, "");
    this.apiKey = config.apiKey;
  }

  async json<T>(
    method: string,
    path: string,
    options: RequestOptions = {},
  ): Promise<T> {
    const url = new URL(this.baseUrl + path);
    if (options.query) {
      for (const [k, v] of Object.entries(options.query)) {
        if (v !== undefined) {
          url.searchParams.set(k, String(v));
        }
      }
    }

    const res = await this.doFetch(url.toString(), {
      method,
      headers: {
        apikey: this.apiKey,
        ...(options.body !== undefined
          ? { "Content-Type": "application/json" }
          : {}),
      },
      ...(options.body !== undefined
        ? { body: JSON.stringify(options.body) }
        : {}),
    });

    const json = await res.json().catch(() => null);
    if (!res.ok) {
      throw new EvolutionGoApiError(res.status, json);
    }
    return json as T;
  }

  async formData<T>(method: string, path: string, form: FormData): Promise<T> {
    const res = await this.doFetch(this.baseUrl + path, {
      method,
      headers: { apikey: this.apiKey },
      body: form,
    });

    const json = await res.json().catch(() => null);
    if (!res.ok) {
      throw new EvolutionGoApiError(res.status, json);
    }
    return json as T;
  }
}

export interface RequestOptions {
  body?: unknown;
  query?: Record<string, string | number | boolean | undefined>;
}
