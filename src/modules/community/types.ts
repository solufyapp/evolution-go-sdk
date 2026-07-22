import type { GroupInfo, SuccessResponse } from "@/shared";

export interface CommunityParticipantBody {
  communityJid?: string;
  groupJid?: string[];
}

export type CreateCommunityResponse = SuccessResponse<GroupInfo>;

export type CommunityParticipantResponse = SuccessResponse<{
  success: string[];
  failed: string[];
}>;
