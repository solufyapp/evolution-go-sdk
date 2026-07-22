import type { SuccessResponse } from "@/shared";

export interface HistorySyncRequestBody {
  count?: number;
  messageInfo?: Record<string, unknown>;
}

export type ChatActionResponse = SuccessResponse<{ timestamp: string }>;

/** whatsmeow.SendResponse — no json tags, passed through as-is. */
export type HistorySyncRequestResponse = SuccessResponse<
  Record<string, unknown>
>;
