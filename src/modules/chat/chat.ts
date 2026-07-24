import type { APITransport } from "@/api";
import type {
  ChatActionResponse,
  HistorySyncRequestBody,
  HistorySyncRequestResponse,
} from "./types";
import { Chat } from "./entity";

export class ChatModule {
  constructor(private readonly api: APITransport) {}

  /** Builds a Chat handle for a known JID — no network call. */
  from(jid: string) {
    return new Chat(jid, this.api);
  }

  async archive(chat: string) {
    const res = await this.api.json<ChatActionResponse>(
      "POST",
      "/chat/archive",
      { body: { chat } },
    );
    return res.data;
  }

  async unarchive(chat: string) {
    const res = await this.api.json<ChatActionResponse>(
      "POST",
      "/chat/unarchive",
      { body: { chat } },
    );
    return res.data;
  }

  async mute(chat: string) {
    const res = await this.api.json<ChatActionResponse>("POST", "/chat/mute", {
      body: { chat },
    });
    return res.data;
  }

  async unmute(chat: string) {
    const res = await this.api.json<ChatActionResponse>(
      "POST",
      "/chat/unmute",
      { body: { chat } },
    );
    return res.data;
  }

  async pin(chat: string) {
    const res = await this.api.json<ChatActionResponse>("POST", "/chat/pin", {
      body: { chat },
    });
    return res.data;
  }

  async unpin(chat: string) {
    const res = await this.api.json<ChatActionResponse>("POST", "/chat/unpin", {
      body: { chat },
    });
    return res.data;
  }

  async historySyncRequest(body: HistorySyncRequestBody) {
    const res = await this.api.json<HistorySyncRequestResponse>(
      "POST",
      "/chat/history-sync",
      { body },
    );
    return res.data;
  }
}
