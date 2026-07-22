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
    return {
      message: res.message,
      data: new Community(res.data, this.#request),
    };
  }

  addParticipants(body: CommunityParticipantBody) {
    return this.#request<CommunityParticipantResponse>(
      "POST",
      "/community/add",
      { body },
    );
  }

  removeParticipants(body: CommunityParticipantBody) {
    return this.#request<CommunityParticipantResponse>(
      "POST",
      "/community/remove",
      { body },
    );
  }
}
