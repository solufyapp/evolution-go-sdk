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

export interface SuccessMessage {
  message: string;
}

export interface SuccessResponse<T> {
  message: string;
  data: T;
}

/**
 * whatsmeow's types.JID has no custom JSON (un)marshaling, so it serializes
 * as this raw struct (capitalized keys, since the Go fields carry no `json`
 * tag) rather than the "user@server" string every other JID-shaped field in
 * this API uses.
 */
export interface Jid {
  User: string;
  RawAgent: number;
  Device: number;
  Integrator: number;
  Server: string;
}

/** whatsmeow's types.GroupParticipant — same no-json-tag caveat as Jid. */
export interface GroupParticipant {
  JID: Jid;
  PhoneNumber: Jid;
  LID: Jid;
  IsAdmin: boolean;
  IsSuperAdmin: boolean;
  DisplayName: string;
  Error: number;
  AddRequest: { Code: string; Expiration: string } | null;
}

/** whatsmeow's types.GroupInfo — same no-json-tag caveat as Jid. */
export interface GroupInfo {
  JID: Jid;
  OwnerJID: Jid;
  OwnerPN: Jid;
  Name: string;
  NameSetAt: string;
  NameSetBy: Jid;
  NameSetByPN: Jid;
  Topic: string;
  TopicID: string;
  TopicSetAt: string;
  TopicSetBy: Jid;
  TopicSetByPN: Jid;
  TopicDeleted: boolean;
  IsLocked: boolean;
  IsAnnounce: boolean;
  AnnounceVersionID: string;
  IsEphemeral: boolean;
  DisappearingTimer: number;
  IsIncognito: boolean;
  IsParent: boolean;
  DefaultMembershipApprovalMode: string;
  LinkedParentJID: Jid;
  IsDefaultSubGroup: boolean;
  IsJoinApprovalRequired: boolean;
  AddressingMode: string;
  GroupCreated: string;
  CreatorCountryCode: string;
  ParticipantVersionID: string;
  Participants: GroupParticipant[];
  ParticipantCount: number;
  MemberAddMode: string;
  Suspended: boolean;
}

/**
 * whatsmeow's types.MessageInfo and waE2E.Message/ContextInfo are deep,
 * unstable (no json tags, no semver contract) internal payloads — passed
 * through as-is rather than re-declared field by field.
 */
export interface MessageSendResult {
  Info: Record<string, unknown>;
  Message: Record<string, unknown> | null;
  MessageContextInfo: Record<string, unknown> | null;
}
