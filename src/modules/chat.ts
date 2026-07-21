type RequestFn = <T>(
  method: string,
  path: string,
  opts?: { body?: unknown },
) => Promise<T>;

export interface HistorySyncRequestBody {
  count?: number;
  messageInfo?: Record<string, unknown>;
}

export class ChatModule {
  readonly #request: RequestFn;

  constructor(request: RequestFn) {
    this.#request = request;
  }

  archive(chat: string) {
    return this.#request("POST", "/chat/archive", { body: { chat } });
  }

  unarchive(chat: string) {
    return this.#request("POST", "/chat/unarchive", { body: { chat } });
  }

  mute(chat: string) {
    return this.#request("POST", "/chat/mute", { body: { chat } });
  }

  unmute(chat: string) {
    return this.#request("POST", "/chat/unmute", { body: { chat } });
  }

  pin(chat: string) {
    return this.#request("POST", "/chat/pin", { body: { chat } });
  }

  unpin(chat: string) {
    return this.#request("POST", "/chat/unpin", { body: { chat } });
  }

  historySyncRequest(body: HistorySyncRequestBody) {
    return this.#request("POST", "/chat/history-sync", { body });
  }
}
