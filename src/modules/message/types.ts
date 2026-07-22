import type { MessageSendResult, SuccessResponse } from "@/shared";

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

/** Persisted message record (message_model.Message). */
export interface MessageRecord {
  id: string;
  message_id: string;
  timestamp: string;
  status: string;
  source: string;
  referral?: unknown;
}

export type DeleteMessageResponse = SuccessResponse<{
  messageId: string;
  timestamp: string;
}>;

export type EditMessageResponse = SuccessResponse<{
  messageId: string;
  timestamp: string;
}>;

export type DownloadMediaResponse = SuccessResponse<{
  base64: string;
  timestamp: string;
}>;

export type MessageBatchResponse = SuccessResponse<{ timestamp: string }>;

export type ReactResponse = SuccessResponse<MessageSendResult>;

export type GetMessageStatusResponse = SuccessResponse<{
  result: MessageRecord;
  timestamp: string;
}>;
