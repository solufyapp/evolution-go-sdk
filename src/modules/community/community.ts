import type { APITransport } from "@/api";
import type {
  CommunityParticipantBody,
  CommunityParticipantResponse,
  CreateCommunityResponse,
} from "./types";
import { Community } from "./entity";

export class CommunityModule {
  constructor(private readonly api: APITransport) {}

  async create(communityName: string) {
    const res = await this.api.json<CreateCommunityResponse>(
      "POST",
      "/community/create",
      { body: { communityName } },
    );
    return new Community(res.data, this.api);
  }

  async addParticipants(body: CommunityParticipantBody) {
    const res = await this.api.json<CommunityParticipantResponse>(
      "POST",
      "/community/add",
      { body },
    );
    return res.data;
  }

  async removeParticipants(body: CommunityParticipantBody) {
    const res = await this.api.json<CommunityParticipantResponse>(
      "POST",
      "/community/remove",
      { body },
    );
    return res.data;
  }
}
