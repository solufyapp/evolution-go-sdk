import type { GroupInfo } from "@/shared";
import type { RequestFn } from "@/transport";
import { jidToString } from "@/jid";
import type { CommunityParticipantResponse } from "./types";

/** No GET endpoint exists for communities, so there's no refresh(). */
export class Community {
  readonly #request: RequestFn;
  data: GroupInfo;

  constructor(data: GroupInfo, request: RequestFn) {
    this.data = data;
    this.#request = request;
  }

  get jid() {
    return jidToString(this.data.JID);
  }

  async addParticipants(groupJid: string[]) {
    const res = await this.#request<CommunityParticipantResponse>(
      "POST",
      "/community/add",
      { body: { communityJid: this.jid, groupJid } },
    );
    return res.data;
  }

  async removeParticipants(groupJid: string[]) {
    const res = await this.#request<CommunityParticipantResponse>(
      "POST",
      "/community/remove",
      { body: { communityJid: this.jid, groupJid } },
    );
    return res.data;
  }
}
