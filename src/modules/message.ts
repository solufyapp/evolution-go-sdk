type RequestFn = <T>(
  method: string,
  path: string,
  opts?: { body?: unknown },
) => Promise<T>;

export interface DeleteMessageBody {
  chat: string;
  messageId: string;
}

export interface DownloadMediaBody {
  message: Record<string, unknown>;
}

export interface EditMessageBody {
  chat: string;
  messageId: string;
  message: string;
}

export interface MarkPlayedBody {
  number: string;
  id: string[];
}

export interface MarkReadBody {
  number: string;
  id: string[];
}

export interface SetPresenceBody {
  number: string;
  state: string;
  isAudio?: boolean;
  delay?: number;
}

export interface ReactBody {
  number: string;
  id: string;
  reaction: string;
  fromMe?: boolean;
  participant?: string;
}

export class MessageModule {
  readonly #request: RequestFn;

  constructor(request: RequestFn) {
    this.#request = request;
  }

  delete(body: DeleteMessageBody) {
    return this.#request("POST", "/message/delete", { body });
  }

  downloadMedia(body: DownloadMediaBody) {
    return this.#request("POST", "/message/downloadmedia", { body });
  }

  edit(body: EditMessageBody) {
    return this.#request("POST", "/message/edit", { body });
  }

  markPlayed(body: MarkPlayedBody) {
    return this.#request("POST", "/message/markplayed", { body });
  }

  markRead(body: MarkReadBody) {
    return this.#request("POST", "/message/markread", { body });
  }

  setPresence(body: SetPresenceBody) {
    return this.#request("POST", "/message/presence", { body });
  }

  react(body: ReactBody) {
    return this.#request("POST", "/message/react", { body });
  }

  getStatus(id: string) {
    return this.#request("POST", "/message/status", { body: { id } });
  }
}
