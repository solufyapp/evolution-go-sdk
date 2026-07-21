export interface DeleteMessageBody {
  chat: string;
  messageId: string;
}

export interface DownloadMediaBody {
  message: Record<string, unknown>;
}

export interface EditMessageBody {
  chat: string;
  messageId: string;
  message: string;
}

/** Shared shape for markRead/markPlayed: a batch of message ids for one chat. */
export interface MessageBatchBody {
  number: string;
  id: string[];
}

export interface SetPresenceBody {
  number: string;
  state: string;
  isAudio?: boolean;
  delay?: number;
}

export interface ReactBody {
  number: string;
  id: string;
  reaction: string;
  fromMe?: boolean;
  participant?: string;
}
