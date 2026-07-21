import type { RequestFn } from "@/transport";
import type {
  DeleteMessageBody,
  DownloadMediaBody,
  EditMessageBody,
  MessageBatchBody,
  ReactBody,
  SetPresenceBody,
} from "./types";

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

  markPlayed(body: MessageBatchBody) {
    return this.#request("POST", "/message/markplayed", { body });
  }

  markRead(body: MessageBatchBody) {
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
