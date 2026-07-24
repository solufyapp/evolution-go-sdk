import type { APITransport } from "@/api";
import type { ChatActionResponse } from "./types";

/**
 * No "get chat" endpoint exists, so there's no cached data or refresh() —
 * this is just a bound handle around the actions that take a chat JID.
 * historySyncRequest isn't chat-scoped (its body has no `chat` field at
 * all — it's a broader app-state resync), so it stays on ChatModule only.
 */
export class Chat {
  constructor(
    public readonly jid: string,
    public readonly api: APITransport,
  ) {}

  async archive() {
    const res = await this.api.json<ChatActionResponse>(
      "POST",
      "/chat/archive",
      { body: { chat: this.jid } },
    );
    return res.data;
  }

  async unarchive() {
    const res = await this.api.json<ChatActionResponse>(
      "POST",
      "/chat/unarchive",
      { body: { chat: this.jid } },
    );
    return res.data;
  }

  async mute() {
    const res = await this.api.json<ChatActionResponse>("POST", "/chat/mute", {
      body: { chat: this.jid },
    });
    return res.data;
  }

  async unmute() {
    const res = await this.api.json<ChatActionResponse>(
      "POST",
      "/chat/unmute",
      { body: { chat: this.jid } },
    );
    return res.data;
  }

  async pin() {
    const res = await this.api.json<ChatActionResponse>("POST", "/chat/pin", {
      body: { chat: this.jid },
    });
    return res.data;
  }

  async unpin() {
    const res = await this.api.json<ChatActionResponse>("POST", "/chat/unpin", {
      body: { chat: this.jid },
    });
    return res.data;
  }
}
