import type { RequestFn } from "@/transport";
import { parseJid } from "@/jid";
import type {
  CreateGroupBody,
  CreateGroupResponse,
  GetGroupInfoResponse,
  GetGroupInviteLinkBody,
  GetGroupInviteLinkResponse,
  GroupActionResponse,
  ListGroupsResponse,
  SetGroupDescriptionBody,
  SetGroupNameBody,
  SetGroupPhotoBody,
  SetGroupPhotoResponse,
  UpdateGroupSettingsBody,
  UpdateParticipantsBody,
} from "./types";

export class GroupModule {
  readonly #request: RequestFn;

  constructor(request: RequestFn) {
    this.#request = request;
  }

  create(body: CreateGroupBody) {
    return this.#request<CreateGroupResponse>("POST", "/group/create", {
      body,
    });
  }

  setDescription(body: SetGroupDescriptionBody) {
    return this.#request<GroupActionResponse>("POST", "/group/description", {
      body,
    });
  }

  getInfo(groupJid: string) {
    return this.#request<GetGroupInfoResponse>("POST", "/group/info", {
      body: { groupJid },
    });
  }

  getInviteLink(body: GetGroupInviteLinkBody) {
    return this.#request<GetGroupInviteLinkResponse>(
      "POST",
      "/group/invitelink",
      { body },
    );
  }

  join(code: string) {
    return this.#request<GroupActionResponse>("POST", "/group/join", {
      body: { code },
    });
  }

  leave(groupJid: string) {
    return this.#request<GroupActionResponse>("POST", "/group/leave", {
      body: { groupJid: parseJid(groupJid) },
    });
  }

  list() {
    return this.#request<ListGroupsResponse>("GET", "/group/list");
  }

  myGroups() {
    return this.#request<ListGroupsResponse>("GET", "/group/myall");
  }

  setName(body: SetGroupNameBody) {
    return this.#request<GroupActionResponse>("POST", "/group/name", {
      body,
    });
  }

  updateParticipants(body: UpdateParticipantsBody) {
    return this.#request<GroupActionResponse>("POST", "/group/participant", {
      body,
    });
  }

  setPhoto(body: SetGroupPhotoBody) {
    return this.#request<SetGroupPhotoResponse>("POST", "/group/photo", {
      body,
    });
  }

  updateSettings(body: UpdateGroupSettingsBody) {
    return this.#request<GroupActionResponse>("POST", "/group/settings", {
      body,
    });
  }
}
