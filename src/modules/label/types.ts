import type { SuccessMessage } from "@/shared";

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

export interface Label {
  id: string;
  instance_id: string;
  label_id: string;
  label_name: string;
  label_color: string;
  predefined_id: string;
}

export type LabelActionResponse = SuccessMessage;
