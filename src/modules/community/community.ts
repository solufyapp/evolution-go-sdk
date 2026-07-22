import type { RequestFn } from "@/transport";
import type {
  CommunityParticipantBody,
  CommunityParticipantResponse,
  CreateCommunityResponse,
} from "./types";
import { Community } from "./entity";

export class CommunityModule {
  readonly #request: RequestFn;

  constructor(request: RequestFn) {
    this.#request = request;
  }

  async create(communityName: string) {
    const res = await this.#request<CreateCommunityResponse>(
      "POST",
      "/community/create",
      { body: { communityName } },
    );
    return new Community(res.data, this.#request);
  }

  async addParticipants(body: CommunityParticipantBody) {
    const res = await this.#request<CommunityParticipantResponse>(
      "POST",
      "/community/add",
      { body },
    );
    return res.data;
  }

  async removeParticipants(body: CommunityParticipantBody) {
    const res = await this.#request<CommunityParticipantResponse>(
      "POST",
      "/community/remove",
      { body },
    );
    return res.data;
  }
}
