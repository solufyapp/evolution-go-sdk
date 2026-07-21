import type { QuotedStruct, VCardStruct } from "../shared.js";

type RequestFn = <T>(
  method: string,
  path: string,
  opts?: { body?: unknown },
) => Promise<T>;

type RequestFormFn = <T>(
  method: string,
  path: string,
  form: FormData,
) => Promise<T>;

export interface SendTextBody {
  number: string;
  text: string;
  delay?: number;
  formatJid?: boolean;
  id?: string;
  mentionAll?: boolean;
  mentionedJid?: string[];
  forwardingScore?: number;
  quoted?: QuotedStruct;
}

export interface SendMediaBody {
  number: string;
  url: string;
  type: "image" | "video" | "audio" | "document";
  caption?: string;
  filename?: string;
  delay?: number;
  formatJid?: boolean;
  id?: string;
  mentionAll?: boolean;
  mentionedJid?: string[];
  forwardingScore?: number;
  quoted?: QuotedStruct;
}

export interface SendStickerBody {
  number: string;
  sticker: string;
  delay?: number;
  formatJid?: boolean;
  id?: string;
  mentionAll?: boolean;
  mentionedJid?: string[];
  quoted?: QuotedStruct;
}

export interface SendLocationBody {
  number: string;
  latitude: number;
  longitude: number;
  name?: string;
  address?: string;
  delay?: number;
  formatJid?: boolean;
  id?: string;
  mentionAll?: boolean;
  mentionedJid?: string[];
  quoted?: QuotedStruct;
}

export interface SendContactBody {
  number: string;
  vcard: VCardStruct;
  delay?: number;
  formatJid?: boolean;
  id?: string;
  mentionAll?: boolean;
  mentionedJid?: string[];
  quoted?: QuotedStruct;
}

export interface SendLinkBody {
  number: string;
  url: string;
  text?: string;
  title?: string;
  description?: string;
  imgUrl?: string;
  delay?: number;
  formatJid?: boolean;
  id?: string;
  mentionAll?: boolean;
  mentionedJid?: string[];
  quoted?: QuotedStruct;
}

export type ButtonType = "reply" | "copy" | "url" | "call" | "pix";

export type PixKeyType = "phone" | "email" | "cpf" | "cnpj" | "random";

export interface Button {
  type: ButtonType;
  displayText?: string;
  id?: string;
  url?: string;
  phoneNumber?: string;
  copyCode?: string;
  key?: string;
  keyType?: PixKeyType;
  name?: string;
  currency?: string;
}

export interface SendButtonBody {
  number: string;
  title: string;
  description: string;
  footer: string;
  buttons: Button[];
  delay?: number;
  formatJid?: boolean;
  imageUrl?: string;
  videoUrl?: string;
  mentionAll?: boolean;
  mentionedJid?: string[];
  quoted?: QuotedStruct;
}

export type CarouselButtonType = "REPLY" | "URL" | "CALL" | "COPY";

export interface CarouselButton {
  type?: CarouselButtonType;
  displayText?: string;
  id?: string;
  copyCode?: string;
}

export interface CarouselCard {
  header?: {
    imageUrl?: string;
    videoUrl?: string;
    title?: string;
    subtitle?: string;
  };
  body: { text: string };
  footer?: string;
  buttons?: CarouselButton[];
}

export interface SendCarouselBody {
  number: string;
  cards: CarouselCard[];
  body?: string;
  footer?: string;
  delay?: number;
  formatJid?: boolean;
  quoted?: QuotedStruct;
}

export interface Row {
  rowId?: string;
  title: string;
  description?: string;
}

export interface Section {
  title?: string;
  rows: Row[];
}

export interface SendListBody {
  number: string;
  title: string;
  description: string;
  footerText: string;
  sections: Section[];
  buttonText?: string;
  delay?: number;
  formatJid?: boolean;
  mentionAll?: boolean;
  mentionedJid?: string[];
  quoted?: QuotedStruct;
}

export interface SendPollBody {
  number: string;
  question: string;
  options: string[];
  maxAnswer?: number;
  delay?: number;
  formatJid?: boolean;
  id?: string;
  mentionAll?: boolean;
  mentionedJid?: string[];
  quoted?: QuotedStruct;
}

export interface SendStatusTextBody {
  text: string;
  id?: string;
}

export interface SendStatusMediaBody {
  type: "image" | "video";
  file?: Blob;
  url?: string;
  caption?: string;
  id?: string;
}

export class SendMessageModule {
  readonly #request: RequestFn;
  readonly #requestForm: RequestFormFn;

  constructor(request: RequestFn, requestForm: RequestFormFn) {
    this.#request = request;
    this.#requestForm = requestForm;
  }

  text(body: SendTextBody) {
    return this.#request("POST", "/send/text", { body });
  }

  media(body: SendMediaBody) {
    return this.#request("POST", "/send/media", { body });
  }

  sticker(body: SendStickerBody) {
    return this.#request("POST", "/send/sticker", { body });
  }

  location(body: SendLocationBody) {
    return this.#request("POST", "/send/location", { body });
  }

  contact(body: SendContactBody) {
    return this.#request("POST", "/send/contact", { body });
  }

  link(body: SendLinkBody) {
    return this.#request("POST", "/send/link", { body });
  }

  button(body: SendButtonBody) {
    return this.#request("POST", "/send/button", { body });
  }

  carousel(body: SendCarouselBody) {
    return this.#request("POST", "/send/carousel", { body });
  }

  list(body: SendListBody) {
    return this.#request("POST", "/send/list", { body });
  }

  poll(body: SendPollBody) {
    return this.#request("POST", "/send/poll", { body });
  }

  statusText(body: SendStatusTextBody) {
    return this.#request("POST", "/send/status/text", { body });
  }

  statusMedia(body: SendStatusMediaBody) {
    const form = new FormData();
    form.set("type", body.type);
    if (body.file !== undefined) form.set("file", body.file);
    if (body.url !== undefined) form.set("url", body.url);
    if (body.caption !== undefined) form.set("caption", body.caption);
    if (body.id !== undefined) form.set("id", body.id);
    return this.#requestForm("POST", "/send/status/media", form);
  }
}
