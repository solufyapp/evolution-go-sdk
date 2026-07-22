import type {
  GroupInfo,
  GroupSettingsAction,
  ParticipantChange,
} from "@/shared";
import type { RequestFn } from "@/transport";
import { jidToString } from "@/jid";
import type {
  GetGroupInfoResponse,
  GetGroupInviteLinkResponse,
  GroupActionResponse,
  SetGroupPhotoResponse,
} from "./types";

export class Group {
  readonly #request: RequestFn;
  data: GroupInfo;

  constructor(data: GroupInfo, request: RequestFn) {
    this.data = data;
    this.#request = request;
  }

  get jid() {
    return jidToString(this.data.JID);
  }

  async refresh() {
    const res = await this.#request<GetGroupInfoResponse>(
      "POST",
      "/group/info",
      { body: { groupJid: this.jid } },
    );
    this.data = res.data;
    return this;
  }

  async setName(name: string) {
    await this.#request<GroupActionResponse>("POST", "/group/name", {
      body: { groupJid: this.jid, name },
    });
  }

  async setDescription(description: string) {
    await this.#request<GroupActionResponse>("POST", "/group/description", {
      body: { groupJid: this.jid, description },
    });
  }

  async setPhoto(image: string) {
    const res = await this.#request<SetGroupPhotoResponse>(
      "POST",
      "/group/photo",
      { body: { groupJid: this.jid, image } },
    );
    return res.data;
  }

  async updateParticipants(participants: string[], action: ParticipantChange) {
    await this.#request<GroupActionResponse>("POST", "/group/participant", {
      body: { groupJid: this.data.JID, participants, action },
    });
  }

  async updateSettings(action: GroupSettingsAction) {
    await this.#request<GroupActionResponse>("POST", "/group/settings", {
      body: { groupJid: this.jid, action },
    });
  }

  async getInviteLink(reset?: boolean) {
    const res = await this.#request<GetGroupInviteLinkResponse>(
      "POST",
      "/group/invitelink",
      { body: { groupJid: this.jid, reset } },
    );
    return res.data;
  }

  async leave() {
    await this.#request<GroupActionResponse>("POST", "/group/leave", {
      body: { groupJid: this.data.JID },
    });
  }
}
