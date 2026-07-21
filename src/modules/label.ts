type RequestFn = <T>(
  method: string,
  path: string,
  opts?: { body?: unknown },
) => Promise<T>;

export interface ChatLabelBody {
  jid: string;
  labelId: string;
}

export interface MessageLabelBody {
  jid: string;
  labelId: string;
  messageId: string;
}

export interface EditLabelBody {
  labelId: string;
  name?: string;
  color?: number;
  deleted?: boolean;
}

export class LabelModule {
  readonly #request: RequestFn;

  constructor(request: RequestFn) {
    this.#request = request;
  }

  list() {
    return this.#request("GET", "/label/list");
  }

  edit(body: EditLabelBody) {
    return this.#request("POST", "/label/edit", { body });
  }

  addToChat(body: ChatLabelBody) {
    return this.#request("POST", "/label/chat", { body });
  }

  removeFromChat(body: ChatLabelBody) {
    return this.#request("POST", "/unlabel/chat", { body });
  }

  addToMessage(body: MessageLabelBody) {
    return this.#request("POST", "/label/message", { body });
  }

  removeFromMessage(body: MessageLabelBody) {
    return this.#request("POST", "/unlabel/message", { body });
  }
}
