import type { APITransport } from "@/api";
import type {
  ChatLabelBody,
  EditLabelBody,
  LabelActionResponse,
  LabelData,
  MessageLabelBody,
} from "./types";
import { Label } from "./entity";

export class LabelModule {
  constructor(private readonly api: APITransport) {}

  async list() {
    const data = await this.api.json<LabelData[]>("GET", "/label/list");
    return data.map((d) => new Label(d, this.api));
  }

  async edit(body: EditLabelBody) {
    await this.api.json<LabelActionResponse>("POST", "/label/edit", {
      body,
    });
  }

  async addToChat(body: ChatLabelBody) {
    await this.api.json<LabelActionResponse>("POST", "/label/chat", {
      body,
    });
  }

  async removeFromChat(body: ChatLabelBody) {
    await this.api.json<LabelActionResponse>("POST", "/unlabel/chat", {
      body,
    });
  }

  async addToMessage(body: MessageLabelBody) {
    await this.api.json<LabelActionResponse>("POST", "/label/message", {
      body,
    });
  }

  async removeFromMessage(body: MessageLabelBody) {
    await this.api.json<LabelActionResponse>("POST", "/unlabel/message", {
      body,
    });
  }
}
