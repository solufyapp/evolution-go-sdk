import type { RequestFn } from "@/transport";
import type { LabelActionResponse, LabelData } from "./types";

export class Label {
  readonly #request: RequestFn;
  data: LabelData;

  constructor(data: LabelData, request: RequestFn) {
    this.data = data;
    this.#request = request;
  }

  get id() {
    return this.data.label_id;
  }

  async edit(fields: { name?: string; color?: number; deleted?: boolean }) {
    await this.#request<LabelActionResponse>("POST", "/label/edit", {
      body: { labelId: this.id, ...fields },
    });
  }

  async addToChat(jid: string) {
    await this.#request<LabelActionResponse>("POST", "/label/chat", {
      body: { jid, labelId: this.id },
    });
  }

  async removeFromChat(jid: string) {
    await this.#request<LabelActionResponse>("POST", "/unlabel/chat", {
      body: { jid, labelId: this.id },
    });
  }

  async addToMessage(jid: string, messageId: string) {
    await this.#request<LabelActionResponse>("POST", "/label/message", {
      body: { jid, labelId: this.id, messageId },
    });
  }

  async removeFromMessage(jid: string, messageId: string) {
    await this.#request<LabelActionResponse>("POST", "/unlabel/message", {
      body: { jid, labelId: this.id, messageId },
    });
  }
}
