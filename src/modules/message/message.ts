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

  async delete(body: DeleteMessageBody) {
    const res = await this.#request<DeleteMessageResponse>(
      "POST",
      "/message/delete",
      { body },
    );
    return res.data;
  }

  async downloadMedia(body: DownloadMediaBody) {
    const res = await this.#request<DownloadMediaResponse>(
      "POST",
      "/message/downloadmedia",
      { body },
    );
    return res.data;
  }

  async edit(body: EditMessageBody) {
    const res = await this.#request<EditMessageResponse>(
      "POST",
      "/message/edit",
      { body },
    );
    return res.data;
  }

  async markPlayed(body: MessageBatchBody) {
    const res = await this.#request<MessageBatchResponse>(
      "POST",
      "/message/markplayed",
      { body },
    );
    return res.data;
  }

  async markRead(body: MessageBatchBody) {
    const res = await this.#request<MessageBatchResponse>(
      "POST",
      "/message/markread",
      { body },
    );
    return res.data;
  }

  async setPresence(body: SetPresenceBody) {
    const res = await this.#request<MessageBatchResponse>(
      "POST",
      "/message/presence",
      { body },
    );
    return res.data;
  }

  async react(body: ReactBody) {
    const res = await this.#request<ReactResponse>("POST", "/message/react", {
      body,
    });
    return res.data;
  }

  async getStatus(id: string) {
    const res = await this.#request<GetMessageStatusResponse>(
      "POST",
      "/message/status",
      { body: { id } },
    );
    return res.data;
  }
}
