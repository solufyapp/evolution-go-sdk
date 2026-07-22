import type { RequestFn } from "@/transport";
import type {
  ChatLabelBody,
  EditLabelBody,
  Label,
  LabelActionResponse,
  MessageLabelBody,
} from "./types";

export class LabelModule {
  readonly #request: RequestFn;

  constructor(request: RequestFn) {
    this.#request = request;
  }

  list() {
    return this.#request<Label[]>("GET", "/label/list");
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
