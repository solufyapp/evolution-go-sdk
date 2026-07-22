import type { RequestFn } from "@/transport";
import type {
  DeleteMessageBody,
  DeleteMessageResponse,
  DownloadMediaBody,
  DownloadMediaResponse,
  EditMessageBody,
  EditMessageResponse,
  GetMessageStatusResponse,
  MessageBatchBody,
  MessageBatchResponse,
  ReactBody,
  ReactResponse,
  SetPresenceBody,
} from "./types";
import { Message } from "./entity";

export class MessageModule {
  readonly #request: RequestFn;

  constructor(request: RequestFn) {
    this.#request = request;
  }

  /** Builds a Message handle for a known chat + id — no network call. */
  from(identity: { chat: string; id: string }) {
    return new Message(identity, this.#request);
  }

  delete(body: DeleteMessageBody) {
    return this.#request<DeleteMessageResponse>("POST", "/message/delete", {
      body,
    });
  }

  downloadMedia(body: DownloadMediaBody) {
    return this.#request<DownloadMediaResponse>(
      "POST",
      "/message/downloadmedia",
      { body },
    );
  }

  edit(body: EditMessageBody) {
    return this.#request<EditMessageResponse>("POST", "/message/edit", {
      body,
    });
  }

  markPlayed(body: MessageBatchBody) {
    return this.#request<MessageBatchResponse>("POST", "/message/markplayed", {
      body,
    });
  }

  markRead(body: MessageBatchBody) {
    return this.#request<MessageBatchResponse>("POST", "/message/markread", {
      body,
    });
  }

  setPresence(body: SetPresenceBody) {
    return this.#request<MessageBatchResponse>("POST", "/message/presence", {
      body,
    });
  }

  react(body: ReactBody) {
    return this.#request<ReactResponse>("POST", "/message/react", { body });
  }

  getStatus(id: string) {
    return this.#request<GetMessageStatusResponse>("POST", "/message/status", {
      body: { id },
    });
  }
}
