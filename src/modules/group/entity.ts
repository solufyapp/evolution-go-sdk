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

  setName(name: string) {
    return this.#request<GroupActionResponse>("POST", "/group/name", {
      body: { groupJid: this.jid, name },
    });
  }

  setDescription(description: string) {
    return this.#request<GroupActionResponse>("POST", "/group/description", {
      body: { groupJid: this.jid, description },
    });
  }

  setPhoto(image: string) {
    return this.#request<SetGroupPhotoResponse>("POST", "/group/photo", {
      body: { groupJid: this.jid, image },
    });
  }

  updateParticipants(participants: string[], action: ParticipantChange) {
    return this.#request<GroupActionResponse>("POST", "/group/participant", {
      body: { groupJid: this.jid, participants, action },
    });
  }

  updateSettings(action: GroupSettingsAction) {
    return this.#request<GroupActionResponse>("POST", "/group/settings", {
      body: { groupJid: this.jid, action },
    });
  }

  getInviteLink(reset?: boolean) {
    return this.#request<GetGroupInviteLinkResponse>(
      "POST",
      "/group/invitelink",
      { body: { groupJid: this.jid, reset } },
    );
  }

  leave() {
    return this.#request<GroupActionResponse>("POST", "/group/leave", {
      body: { groupJid: this.data.JID },
    });
  }
}
