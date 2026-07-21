import type { RequestFn } from "../../transport.js";
import type { HistorySyncRequestBody } from "./types.js";

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
