import type { APITransport } from "@/api";
import type { MessageSendResult } from "@/shared";
import type {
  DeleteMessageResponse,
  EditMessageResponse,
  GetMessageStatusResponse,
  MessageBatchResponse,
  ReactResponse,
} from "./types";

/**
 * Identifies a message by its chat and id. No refresh() — a message's
 * own data (when known, e.g. from a send result) never goes stale in a
 * way a re-fetch would fix; call getStatus() for delivery/read state.
 */
export class Message {
  constructor(
    public readonly id: string,
    public readonly chat: string,
    public readonly api: APITransport,
    public readonly data?: MessageSendResult,
  ) {}

  async react(
    reaction: string,
    opts: { fromMe?: boolean; participant?: string } = {},
  ) {
    const res = await this.api.json<ReactResponse>("POST", "/message/react", {
      body: { number: this.chat, id: this.id, reaction, ...opts },
    });
    return res.data;
  }

  async markRead() {
    const res = await this.api.json<MessageBatchResponse>(
      "POST",
      "/message/markread",
      { body: { number: this.chat, id: [this.id] } },
    );
    return res.data;
  }

  async markPlayed() {
    const res = await this.api.json<MessageBatchResponse>(
      "POST",
      "/message/markplayed",
      { body: { number: this.chat, id: [this.id] } },
    );
    return res.data;
  }

  async edit(message: string) {
    const res = await this.api.json<EditMessageResponse>(
      "POST",
      "/message/edit",
      { body: { chat: this.chat, messageId: this.id, message } },
    );
    return res.data;
  }

  async delete() {
    const res = await this.api.json<DeleteMessageResponse>(
      "POST",
      "/message/delete",
      { body: { chat: this.chat, messageId: this.id } },
    );
    return res.data;
  }

  async getStatus() {
    const res = await this.api.json<GetMessageStatusResponse>(
      "POST",
      "/message/status",
      { body: { id: this.id } },
    );
    return res.data;
  }
}
