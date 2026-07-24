import type { APITransport } from "@/api";
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
  constructor(private readonly api: APITransport) {}

  /**
   * The create endpoint only returns {jid, name, owner, added, failed} —
   * not a full GroupInfo — so this makes one extra getInfo() call to seed
   * a fully-populated Group entity. A one-time construction cost, not a
   * recurring auto-refresh pattern.
   */
  async create(body: CreateGroupBody) {
    const created = await this.api.json<CreateGroupResponse>(
      "POST",
      "/group/create",
      { body },
    );
    const info = await this.api.json<GetGroupInfoResponse>(
      "POST",
      "/group/info",
      { body: { groupJid: jidToString(created.data.jid) } },
    );
    return new Group(info.data, this.api);
  }

  async setDescription(body: SetGroupDescriptionBody) {
    await this.api.json<GroupActionResponse>("POST", "/group/description", {
      body,
    });
  }

  async getInfo(groupJid: string) {
    const res = await this.api.json<GetGroupInfoResponse>(
      "POST",
      "/group/info",
      { body: { groupJid } },
    );
    return new Group(res.data, this.api);
  }

  async getInviteLink(body: GetGroupInviteLinkBody) {
    const res = await this.api.json<GetGroupInviteLinkResponse>(
      "POST",
      "/group/invitelink",
      { body },
    );
    return res.data;
  }

  async join(code: string) {
    await this.api.json<GroupActionResponse>("POST", "/group/join", {
      body: { code },
    });
  }

  async leave(groupJid: string) {
    await this.api.json<GroupActionResponse>("POST", "/group/leave", {
      body: { groupJid: parseJid(groupJid) },
    });
  }

  async list() {
    const res = await this.api.json<ListGroupsResponse>("GET", "/group/list");
    return res.data.map((d) => new Group(d, this.api));
  }

  async myGroups() {
    const res = await this.api.json<ListGroupsResponse>("GET", "/group/myall");
    return res.data.map((d) => new Group(d, this.api));
  }

  async setName(body: SetGroupNameBody) {
    await this.api.json<GroupActionResponse>("POST", "/group/name", { body });
  }

  async updateParticipants(body: UpdateParticipantsBody) {
    await this.api.json<GroupActionResponse>("POST", "/group/participant", {
      body: { ...body, groupJid: parseJid(body.groupJid) },
    });
  }

  async setPhoto(body: SetGroupPhotoBody) {
    const res = await this.api.json<SetGroupPhotoResponse>(
      "POST",
      "/group/photo",
      { body },
    );
    return res.data;
  }

  async updateSettings(body: UpdateGroupSettingsBody) {
    await this.api.json<GroupActionResponse>("POST", "/group/settings", {
      body,
    });
  }
}
