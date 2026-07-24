import type { APITransport } from "@/api";
import type {
  GroupInfo,
  GroupSettingsAction,
  ParticipantChange,
} from "@/shared";
import { jidToString } from "@/jid";
import type {
  GetGroupInfoResponse,
  GetGroupInviteLinkResponse,
  GroupActionResponse,
  SetGroupPhotoResponse,
} from "./types";

export class Group {
  constructor(
    public readonly data: GroupInfo,
    public readonly api: APITransport,
  ) {}

  get jid() {
    return jidToString(this.data.JID);
  }

  async refresh() {
    const res = await this.api.json<GetGroupInfoResponse>(
      "POST",
      "/group/info",
      { body: { groupJid: this.jid } },
    );

    Reflect.set(this, "data", res.data);
    return this;
  }

  async setName(name: string) {
    await this.api.json<GroupActionResponse>("POST", "/group/name", {
      body: { groupJid: this.jid, name },
    });
  }

  async setDescription(description: string) {
    await this.api.json<GroupActionResponse>("POST", "/group/description", {
      body: { groupJid: this.jid, description },
    });
  }

  async setPhoto(image: string) {
    const res = await this.api.json<SetGroupPhotoResponse>(
      "POST",
      "/group/photo",
      { body: { groupJid: this.jid, image } },
    );
    return res.data;
  }

  async updateParticipants(participants: string[], action: ParticipantChange) {
    await this.api.json<GroupActionResponse>("POST", "/group/participant", {
      body: { groupJid: this.data.JID, participants, action },
    });
  }

  async updateSettings(action: GroupSettingsAction) {
    await this.api.json<GroupActionResponse>("POST", "/group/settings", {
      body: { groupJid: this.jid, action },
    });
  }

  async getInviteLink(reset?: boolean) {
    const res = await this.api.json<GetGroupInviteLinkResponse>(
      "POST",
      "/group/invitelink",
      { body: { groupJid: this.jid, reset } },
    );
    return res.data;
  }

  async leave() {
    await this.api.json<GroupActionResponse>("POST", "/group/leave", {
      body: { groupJid: this.data.JID },
    });
  }
}
