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
