import type { MessageSendResult } from "@/shared";
import type { RequestFn } from "@/transport";
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
  readonly #request: RequestFn;
  readonly chat: string;
  readonly id: string;
  /** Raw send result, present when this Message was returned by sendMessage.*. */
  readonly data?: MessageSendResult;

  constructor(
    identity: { chat: string; id: string },
    request: RequestFn,
    data?: MessageSendResult,
  ) {
    this.chat = identity.chat;
    this.id = identity.id;
    this.#request = request;
    this.data = data;
  }

  async react(
    reaction: string,
    opts: { fromMe?: boolean; participant?: string } = {},
  ) {
    const res = await this.#request<ReactResponse>("POST", "/message/react", {
      body: { number: this.chat, id: this.id, reaction, ...opts },
    });
    return res.data;
  }

  async markRead() {
    const res = await this.#request<MessageBatchResponse>(
      "POST",
      "/message/markread",
      { body: { number: this.chat, id: [this.id] } },
    );
    return res.data;
  }

  async markPlayed() {
    const res = await this.#request<MessageBatchResponse>(
      "POST",
      "/message/markplayed",
      { body: { number: this.chat, id: [this.id] } },
    );
    return res.data;
  }

  async edit(message: string) {
    const res = await this.#request<EditMessageResponse>(
      "POST",
      "/message/edit",
      { body: { chat: this.chat, messageId: this.id, message } },
    );
    return res.data;
  }

  async delete() {
    const res = await this.#request<DeleteMessageResponse>(
      "POST",
      "/message/delete",
      { body: { chat: this.chat, messageId: this.id } },
    );
    return res.data;
  }

  async getStatus() {
    const res = await this.#request<GetMessageStatusResponse>(
      "POST",
      "/message/status",
      { body: { id: this.id } },
    );
    return res.data;
  }
}
