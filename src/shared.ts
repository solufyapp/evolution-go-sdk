export interface QuotedStruct {
  messageId?: string;
  participant?: string;
}

export interface VCardStruct {
  fullName?: string;
  organization?: string;
  phone?: string;
}

export interface AdvancedSettings {
  alwaysOnline?: boolean;
  ignoreGroups?: boolean;
  ignoreStatus?: boolean;
  msgRejectCall?: string;
  readMessages?: boolean;
  rejectCall?: boolean;
}

export interface ProxyConfig {
  host: string;
  port: string;
  protocol?: string;
  username?: string;
  password?: string;
}

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
