type RequestFn = <T>(
  method: string,
  path: string,
  opts?: { body?: unknown },
) => Promise<T>;

export interface CommunityParticipantBody {
  communityJid?: string;
  groupJid?: string[];
}

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
