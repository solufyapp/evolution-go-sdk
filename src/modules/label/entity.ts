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

  edit(fields: { name?: string; color?: number; deleted?: boolean }) {
    return this.#request<LabelActionResponse>("POST", "/label/edit", {
      body: { labelId: this.id, ...fields },
    });
  }

  addToChat(jid: string) {
    return this.#request<LabelActionResponse>("POST", "/label/chat", {
      body: { jid, labelId: this.id },
    });
  }

  removeFromChat(jid: string) {
    return this.#request<LabelActionResponse>("POST", "/unlabel/chat", {
      body: { jid, labelId: this.id },
    });
  }

  addToMessage(jid: string, messageId: string) {
    return this.#request<LabelActionResponse>("POST", "/label/message", {
      body: { jid, labelId: this.id, messageId },
    });
  }

  removeFromMessage(jid: string, messageId: string) {
    return this.#request<LabelActionResponse>("POST", "/unlabel/message", {
      body: { jid, labelId: this.id, messageId },
    });
  }
}
