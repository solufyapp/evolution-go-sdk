import type { APITransport } from "@/api";
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
  constructor(private readonly api: APITransport) {}

  /** Builds a Message handle for a known chat + id — no network call. */
  from(id: string, chat: string) {
    return new Message(id, chat, this.api);
  }

  async delete(body: DeleteMessageBody) {
    const res = await this.api.json<DeleteMessageResponse>(
      "POST",
      "/message/delete",
      { body },
    );
    return res.data;
  }

  async downloadMedia(body: DownloadMediaBody) {
    const res = await this.api.json<DownloadMediaResponse>(
      "POST",
      "/message/downloadmedia",
      { body },
    );
    return res.data;
  }

  async edit(body: EditMessageBody) {
    const res = await this.api.json<EditMessageResponse>(
      "POST",
      "/message/edit",
      { body },
    );
    return res.data;
  }

  async markPlayed(body: MessageBatchBody) {
    const res = await this.api.json<MessageBatchResponse>(
      "POST",
      "/message/markplayed",
      { body },
    );
    return res.data;
  }

  async markRead(body: MessageBatchBody) {
    const res = await this.api.json<MessageBatchResponse>(
      "POST",
      "/message/markread",
      { body },
    );
    return res.data;
  }

  async setPresence(body: SetPresenceBody) {
    const res = await this.api.json<MessageBatchResponse>(
      "POST",
      "/message/presence",
      { body },
    );
    return res.data;
  }

  async react(body: ReactBody) {
    const res = await this.api.json<ReactResponse>("POST", "/message/react", {
      body,
    });
    return res.data;
  }

  async getStatus(id: string) {
    const res = await this.api.json<GetMessageStatusResponse>(
      "POST",
      "/message/status",
      { body: { id } },
    );
    return res.data;
  }
}
