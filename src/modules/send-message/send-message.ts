import type { RequestFn, RequestFormFn } from "@/transport";
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

  text(body: SendTextBody) {
    return this.#request<SendMessageResponse>("POST", "/send/text", { body });
  }

  media(body: SendMediaBody) {
    return this.#request<SendMessageResponse>("POST", "/send/media", {
      body,
    });
  }

  sticker(body: SendStickerBody) {
    return this.#request<SendMessageResponse>("POST", "/send/sticker", {
      body,
    });
  }

  location(body: SendLocationBody) {
    return this.#request<SendMessageResponse>("POST", "/send/location", {
      body,
    });
  }

  contact(body: SendContactBody) {
    return this.#request<SendMessageResponse>("POST", "/send/contact", {
      body,
    });
  }

  link(body: SendLinkBody) {
    return this.#request<SendMessageResponse>("POST", "/send/link", { body });
  }

  button(body: SendButtonBody) {
    return this.#request<SendMessageResponse>("POST", "/send/button", {
      body,
    });
  }

  carousel(body: SendCarouselBody) {
    return this.#request<SendMessageResponse>("POST", "/send/carousel", {
      body,
    });
  }

  list(body: SendListBody) {
    return this.#request<SendMessageResponse>("POST", "/send/list", { body });
  }

  poll(body: SendPollBody) {
    return this.#request<SendMessageResponse>("POST", "/send/poll", { body });
  }

  statusText(body: SendStatusTextBody) {
    return this.#request<SendMessageResponse>("POST", "/send/status/text", {
      body,
    });
  }

  statusMedia(body: SendStatusMediaBody) {
    const form = new FormData();
    form.set("type", body.type);
    if (body.file !== undefined) form.set("file", body.file);
    if (body.url !== undefined) form.set("url", body.url);
    if (body.caption !== undefined) form.set("caption", body.caption);
    if (body.id !== undefined) form.set("id", body.id);
    return this.#requestForm<SendMessageResponse>(
      "POST",
      "/send/status/media",
      form,
    );
  }
}
