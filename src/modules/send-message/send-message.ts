import type { Jid, MessageSendResult } from "@/shared";
import type { RequestFn, RequestFormFn } from "@/transport";
import { jidToString } from "@/jid";
import { Message } from "@/modules/message/entity";
import type {
  SendButtonBody,
  SendCarouselBody,
  SendContactBody,
  SendLinkBody,
  SendListBody,
  SendLocationBody,
  SendMediaBody,
  SendMessageResponse,
  SendPollBody,
  SendStatusMediaBody,
  SendStatusTextBody,
  SendStickerBody,
  SendTextBody,
} from "./types";

export class SendMessageModule {
  readonly #request: RequestFn;
  readonly #requestForm: RequestFormFn;

  constructor(request: RequestFn, requestForm: RequestFormFn) {
    this.#request = request;
    this.#requestForm = requestForm;
  }

  /**
   * Info has no json tags upstream (see MessageSendResult), so its
   * fields are the raw Go names: Chat (a Jid object) and ID (string).
   */
  #toMessage(result: MessageSendResult) {
    const info = result.Info as { Chat?: Jid; ID?: string };
    return new Message(
      { chat: info.Chat ? jidToString(info.Chat) : "", id: info.ID ?? "" },
      this.#request,
      result,
    );
  }

  async text(body: SendTextBody) {
    const res = await this.#request<SendMessageResponse>("POST", "/send/text", {
      body,
    });
    return this.#toMessage(res.data);
  }

  async media(body: SendMediaBody) {
    const res = await this.#request<SendMessageResponse>(
      "POST",
      "/send/media",
      { body },
    );
    return this.#toMessage(res.data);
  }

  async sticker(body: SendStickerBody) {
    const res = await this.#request<SendMessageResponse>(
      "POST",
      "/send/sticker",
      { body },
    );
    return this.#toMessage(res.data);
  }

  async location(body: SendLocationBody) {
    const res = await this.#request<SendMessageResponse>(
      "POST",
      "/send/location",
      { body },
    );
    return this.#toMessage(res.data);
  }

  async contact(body: SendContactBody) {
    const res = await this.#request<SendMessageResponse>(
      "POST",
      "/send/contact",
      { body },
    );
    return this.#toMessage(res.data);
  }

  async link(body: SendLinkBody) {
    const res = await this.#request<SendMessageResponse>("POST", "/send/link", {
      body,
    });
    return this.#toMessage(res.data);
  }

  async button(body: SendButtonBody) {
    const res = await this.#request<SendMessageResponse>(
      "POST",
      "/send/button",
      { body },
    );
    return this.#toMessage(res.data);
  }

  async carousel(body: SendCarouselBody) {
    const res = await this.#request<SendMessageResponse>(
      "POST",
      "/send/carousel",
      { body },
    );
    return this.#toMessage(res.data);
  }

  async list(body: SendListBody) {
    const res = await this.#request<SendMessageResponse>("POST", "/send/list", {
      body,
    });
    return this.#toMessage(res.data);
  }

  async poll(body: SendPollBody) {
    const res = await this.#request<SendMessageResponse>("POST", "/send/poll", {
      body,
    });
    return this.#toMessage(res.data);
  }

  async statusText(body: SendStatusTextBody) {
    const res = await this.#request<SendMessageResponse>(
      "POST",
      "/send/status/text",
      { body },
    );
    return this.#toMessage(res.data);
  }

  async statusMedia(body: SendStatusMediaBody) {
    const form = new FormData();
    form.set("type", body.type);
    if (body.file !== undefined) form.set("file", body.file);
    if (body.url !== undefined) form.set("url", body.url);
    if (body.caption !== undefined) form.set("caption", body.caption);
    if (body.id !== undefined) form.set("id", body.id);
    const res = await this.#requestForm<SendMessageResponse>(
      "POST",
      "/send/status/media",
      form,
    );
    return this.#toMessage(res.data);
  }
}
