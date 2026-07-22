import type { RequestFn } from "@/transport";
import type {
  CommunityParticipantBody,
  CommunityParticipantResponse,
  CreateCommunityResponse,
} from "./types";

export class CommunityModule {
  readonly #request: RequestFn;

  constructor(request: RequestFn) {
    this.#request = request;
  }

  create(communityName: string) {
    return this.#request<CreateCommunityResponse>("POST", "/community/create", {
      body: { communityName },
    });
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
