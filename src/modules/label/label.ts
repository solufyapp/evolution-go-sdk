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

  edit(body: EditLabelBody) {
    return this.#request<LabelActionResponse>("POST", "/label/edit", {
      body,
    });
  }

  addToChat(body: ChatLabelBody) {
    return this.#request<LabelActionResponse>("POST", "/label/chat", {
      body,
    });
  }

  removeFromChat(body: ChatLabelBody) {
    return this.#request<LabelActionResponse>("POST", "/unlabel/chat", {
      body,
    });
  }

  addToMessage(body: MessageLabelBody) {
    return this.#request<LabelActionResponse>("POST", "/label/message", {
      body,
    });
  }

  removeFromMessage(body: MessageLabelBody) {
    return this.#request<LabelActionResponse>("POST", "/unlabel/message", {
      body,
    });
  }
}
