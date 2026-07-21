import type { QuotedStruct, VCardStruct } from "@/shared";

export interface SendMessageBase {
  number: string;
  delay?: number;
  formatJid?: boolean;
  quoted?: QuotedStruct;
}

export interface MentionableMessageBase extends SendMessageBase {
  mentionAll?: boolean;
  mentionedJid?: string[];
}

export interface IdentifiableMessageBase extends MentionableMessageBase {
  id?: string;
}

export interface SendTextBody extends IdentifiableMessageBase {
  text: string;
  forwardingScore?: number;
}

export interface SendMediaBody extends IdentifiableMessageBase {
  url: string;
  type: "image" | "video" | "audio" | "document";
  caption?: string;
  filename?: string;
  forwardingScore?: number;
}

export interface SendStickerBody extends IdentifiableMessageBase {
  sticker: string;
}

export interface SendLocationBody extends IdentifiableMessageBase {
  latitude: number;
  longitude: number;
  name?: string;
  address?: string;
}

export interface SendContactBody extends IdentifiableMessageBase {
  vcard: VCardStruct;
}

export interface SendLinkBody extends IdentifiableMessageBase {
  url: string;
  text?: string;
  title?: string;
  description?: string;
  imgUrl?: string;
}

export interface SendPollBody extends IdentifiableMessageBase {
  question: string;
  options: string[];
  maxAnswer?: number;
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

export interface SendButtonBody extends MentionableMessageBase {
  title: string;
  description: string;
  footer: string;
  buttons: Button[];
  imageUrl?: string;
  videoUrl?: string;
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

export interface SendCarouselBody extends SendMessageBase {
  cards: CarouselCard[];
  body?: string;
  footer?: string;
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

export interface SendListBody extends MentionableMessageBase {
  title: string;
  description: string;
  footerText: string;
  sections: Section[];
  buttonText?: string;
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
