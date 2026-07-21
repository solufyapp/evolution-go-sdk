import type { GroupSettingsAction, ParticipantChange } from "../shared.js";

type RequestFn = <T>(
  method: string,
  path: string,
  opts?: { body?: unknown },
) => Promise<T>;

export interface CreateGroupBody {
  groupName: string;
  participants?: string[];
}

export interface SetGroupDescriptionBody {
  groupJid: string;
  description: string;
}

export interface GetGroupInviteLinkBody {
  groupJid: string;
  reset?: boolean;
}

export interface SetGroupNameBody {
  groupJid: string;
  name: string;
}

export interface UpdateParticipantsBody {
  groupJid: string;
  participants: string[];
  action: ParticipantChange;
}

export interface SetGroupPhotoBody {
  groupJid: string;
  image: string;
}

export interface UpdateGroupSettingsBody {
  groupJid: string;
  action: GroupSettingsAction;
}

export class GroupModule {
  readonly #request: RequestFn;

  constructor(request: RequestFn) {
    this.#request = request;
  }

  create(body: CreateGroupBody) {
    return this.#request("POST", "/group/create", { body });
  }

  setDescription(body: SetGroupDescriptionBody) {
    return this.#request("POST", "/group/description", { body });
  }

  getInfo(groupJid: string) {
    return this.#request("POST", "/group/info", { body: { groupJid } });
  }

  getInviteLink(body: GetGroupInviteLinkBody) {
    return this.#request("POST", "/group/invitelink", { body });
  }

  join(code: string) {
    return this.#request("POST", "/group/join", { body: { code } });
  }

  leave(groupJid: string) {
    return this.#request("POST", "/group/leave", { body: { groupJid } });
  }

  list() {
    return this.#request("GET", "/group/list");
  }

  myGroups() {
    return this.#request("GET", "/group/myall");
  }

  setName(body: SetGroupNameBody) {
    return this.#request("POST", "/group/name", { body });
  }

  updateParticipants(body: UpdateParticipantsBody) {
    return this.#request("POST", "/group/participant", { body });
  }

  setPhoto(body: SetGroupPhotoBody) {
    return this.#request("POST", "/group/photo", { body });
  }

  updateSettings(body: UpdateGroupSettingsBody) {
    return this.#request("POST", "/group/settings", { body });
  }
}
