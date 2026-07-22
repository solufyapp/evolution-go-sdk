import type { RequestFn } from "@/transport";
import { jidToString, parseJid } from "@/jid";
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
import { Group } from "./entity";

export class GroupModule {
  readonly #request: RequestFn;

  constructor(request: RequestFn) {
    this.#request = request;
  }

  /**
   * The create endpoint only returns {jid, name, owner, added, failed} —
   * not a full GroupInfo — so this makes one extra getInfo() call to seed
   * a fully-populated Group entity. A one-time construction cost, not a
   * recurring auto-refresh pattern.
   */
  async create(body: CreateGroupBody) {
    const res = await this.#request<CreateGroupResponse>(
      "POST",
      "/group/create",
      { body },
    );
    const info = await this.#request<GetGroupInfoResponse>(
      "POST",
      "/group/info",
      { body: { groupJid: jidToString(res.data.jid) } },
    );
    return {
      message: res.message,
      data: new Group(info.data, this.#request),
    };
  }

  setDescription(body: SetGroupDescriptionBody) {
    return this.#request<GroupActionResponse>("POST", "/group/description", {
      body,
    });
  }

  async getInfo(groupJid: string) {
    const res = await this.#request<GetGroupInfoResponse>(
      "POST",
      "/group/info",
      { body: { groupJid } },
    );
    return { message: res.message, data: new Group(res.data, this.#request) };
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

  async list() {
    const res = await this.#request<ListGroupsResponse>("GET", "/group/list");
    return {
      message: res.message,
      data: res.data.map((d) => new Group(d, this.#request)),
    };
  }

  async myGroups() {
    const res = await this.#request<ListGroupsResponse>("GET", "/group/myall");
    return {
      message: res.message,
      data: res.data.map((d) => new Group(d, this.#request)),
    };
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
