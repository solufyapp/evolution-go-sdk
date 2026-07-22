import type { RequestFn } from "@/transport";
import type {
  ChatLabelBody,
  EditLabelBody,
  LabelActionResponse,
  LabelData,
  MessageLabelBody,
} from "./types";
import { Label } from "./entity";

export class LabelModule {
  readonly #request: RequestFn;

  constructor(request: RequestFn) {
    this.#request = request;
  }

  async list() {
    const data = await this.#request<LabelData[]>("GET", "/label/list");
    return data.map((d) => new Label(d, this.#request));
  }

  async edit(body: EditLabelBody) {
    await this.#request<LabelActionResponse>("POST", "/label/edit", {
      body,
    });
  }

  async addToChat(body: ChatLabelBody) {
    await this.#request<LabelActionResponse>("POST", "/label/chat", {
      body,
    });
  }

  async removeFromChat(body: ChatLabelBody) {
    await this.#request<LabelActionResponse>("POST", "/unlabel/chat", {
      body,
    });
  }

  async addToMessage(body: MessageLabelBody) {
    await this.#request<LabelActionResponse>("POST", "/label/message", {
      body,
    });
  }

  async removeFromMessage(body: MessageLabelBody) {
    await this.#request<LabelActionResponse>("POST", "/unlabel/message", {
      body,
    });
  }
}
