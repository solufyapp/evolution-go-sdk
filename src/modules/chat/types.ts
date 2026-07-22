import type { Jid, SuccessResponse } from "@/shared";

export interface HistorySyncRequestBody {
  count?: number;
  messageInfo?: Record<string, unknown>;
}

export type ChatActionResponse = SuccessResponse<{ timestamp: string }>;

export type HistorySyncRequestResponse = SuccessResponse<{
  Timestamp: string;
  ID: string;
  ServerID: number;
  DebugTimings: Record<string, unknown>;
  Sender: Jid;
}>;
