import type { RequestFn } from "../../transport.js";
import type { CommunityParticipantBody } from "./types.js";

export class CommunityModule {
  readonly #request: RequestFn;

  constructor(request: RequestFn) {
    this.#request = request;
  }

  create(communityName: string) {
    return this.#request("POST", "/community/create", {
      body: { communityName },
    });
  }

  addParticipants(body: CommunityParticipantBody) {
    return this.#request("POST", "/community/add", { body });
  }

  removeParticipants(body: CommunityParticipantBody) {
    return this.#request("POST", "/community/remove", { body });
  }
}
