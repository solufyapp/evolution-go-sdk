import type { APITransport } from "@/api";
import type { LabelActionResponse, LabelData } from "./types";

export class Label {
  constructor(
    public readonly data: LabelData,
    public readonly api: APITransport,
  ) {}

  get id() {
    return this.data.label_id;
  }

  async edit(fields: { name?: string; color?: number; deleted?: boolean }) {
    await this.api.json<LabelActionResponse>("POST", "/label/edit", {
      body: { labelId: this.id, ...fields },
    });
  }

  async addToChat(jid: string) {
    await this.api.json<LabelActionResponse>("POST", "/label/chat", {
      body: { jid, labelId: this.id },
    });
  }

  async removeFromChat(jid: string) {
    await this.api.json<LabelActionResponse>("POST", "/unlabel/chat", {
      body: { jid, labelId: this.id },
    });
  }

  async addToMessage(jid: string, messageId: string) {
    await this.api.json<LabelActionResponse>("POST", "/label/message", {
      body: { jid, labelId: this.id, messageId },
    });
  }

  async removeFromMessage(jid: string, messageId: string) {
    await this.api.json<LabelActionResponse>("POST", "/unlabel/message", {
      body: { jid, labelId: this.id, messageId },
    });
  }
}
