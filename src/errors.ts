export class EvolutionGoApiError extends Error {
  readonly status: number;
  readonly body: unknown;

  constructor(status: number, body: unknown) {
    const msg =
      body !== null &&
      typeof body === "object" &&
      ("message" in body || "error" in body)
        ? String(
            (body as Record<string, unknown>).message ??
              (body as Record<string, unknown>).error,
          )
        : `Request failed with status ${status}`;
    super(msg);
    this.name = "EvolutionGoApiError";
    this.status = status;
    this.body = body;
  }
}
