type RequestFn = <T>(
  method: string,
  path: string,
  opts?: { body?: unknown },
) => Promise<T>;

export interface RejectCallBody {
  /** String JID of the call creator */
  callCreator?: string;
  callId?: string;
}

export class CallModule {
  readonly #request: RequestFn;

  constructor(request: RequestFn) {
    this.#request = request;
  }

  reject(body: RejectCallBody) {
    return this.#request("POST", "/call/reject", { body });
  }
}
