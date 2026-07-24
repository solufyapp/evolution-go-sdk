import type { APITransport } from "@/api";
import type { GroupInfo } from "@/shared";
import { jidToString } from "@/jid";
import type { CommunityParticipantResponse } from "./types";

export class Community {
  constructor(
    public readonly data: GroupInfo,
    public readonly api: APITransport,
  ) {}

  get jid() {
    return jidToString(this.data.JID);
  }

  async addParticipants(groupJid: string[]) {
    const res = await this.api.json<CommunityParticipantResponse>(
      "POST",
      "/community/add",
      { body: { communityJid: this.jid, groupJid } },
    );
    return res.data;
  }

  async removeParticipants(groupJid: string[]) {
    const res = await this.api.json<CommunityParticipantResponse>(
      "POST",
      "/community/remove",
      { body: { communityJid: this.jid, groupJid } },
    );
    return res.data;
  }
}
