import type { GroupSettingsAction, ParticipantChange } from "@/shared";

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
