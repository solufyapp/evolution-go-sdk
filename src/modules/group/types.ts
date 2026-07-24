import type { GroupInfo, Jid, SuccessMessage, SuccessResponse } from "@/shared";

export type ParticipantChange = "add" | "remove" | "promote" | "demote";

export type GroupSettingsAction =
  | "announcement"
  | "not_announcement"
  | "locked"
  | "unlocked"
  | "approval_on"
  | "approval_off"
  | "admin_add"
  | "all_member_add";

export interface CreateGroupBody {
  groupName: string;
  participants?: string[];
}

export interface SetGroupDescriptionBody {
  groupJid: string;
  description: string;
}

export interface GetGroupInviteLinkBody {
  groupJid: string;
  reset?: boolean;
}

export interface SetGroupNameBody {
  groupJid: string;
  name: string;
}

export interface UpdateParticipantsBody {
  groupJid: string;
  participants: string[];
  action: ParticipantChange;
}

export interface SetGroupPhotoBody {
  groupJid: string;
  image: string;
}

export interface UpdateGroupSettingsBody {
  groupJid: string;
  action: GroupSettingsAction;
}

export type CreateGroupResponse = SuccessResponse<{
  jid: Jid;
  name: string;
  owner: Jid;
  added: Jid[];
  failed: Jid[];
}>;

export type GetGroupInfoResponse = SuccessResponse<GroupInfo>;

export type GetGroupInviteLinkResponse = SuccessResponse<string>;

export type ListGroupsResponse = SuccessResponse<GroupInfo[]>;

export type SetGroupPhotoResponse = SuccessResponse<string>;

export type GroupActionResponse = SuccessMessage;
