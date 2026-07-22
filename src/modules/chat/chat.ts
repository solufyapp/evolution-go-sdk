import type { RequestFn } from "@/transport";
import type {
  ChatActionResponse,
  HistorySyncRequestBody,
  HistorySyncRequestResponse,
} from "./types";

export class ChatModule {
  readonly #request: RequestFn;

  constructor(request: RequestFn) {
    this.#request = request;
  }

  archive(chat: string) {
    return this.#request<ChatActionResponse>("POST", "/chat/archive", {
      body: { chat },
    });
  }

  unarchive(chat: string) {
    return this.#request<ChatActionResponse>("POST", "/chat/unarchive", {
      body: { chat },
    });
  }

  mute(chat: string) {
    return this.#request<ChatActionResponse>("POST", "/chat/mute", {
      body: { chat },
    });
  }

  unmute(chat: string) {
    return this.#request<ChatActionResponse>("POST", "/chat/unmute", {
      body: { chat },
    });
  }

  pin(chat: string) {
    return this.#request<ChatActionResponse>("POST", "/chat/pin", {
      body: { chat },
    });
  }

  unpin(chat: string) {
    return this.#request<ChatActionResponse>("POST", "/chat/unpin", {
      body: { chat },
    });
  }

  historySyncRequest(body: HistorySyncRequestBody) {
    return this.#request<HistorySyncRequestResponse>(
      "POST",
      "/chat/history-sync",
      { body },
    );
  }
}
