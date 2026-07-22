import { describe, expect, it, vi } from "vitest";

import type { GroupInfo } from "@/shared";
import { Community } from "./entity";

function makeRequest() {
  return vi.fn().mockResolvedValue({});
}

const jid = {
  User: "123456789",
  Server: "newsletter",
  Device: 0,
  RawAgent: 0,
  Integrator: 0,
};

const data = {
  JID: jid,
  Name: "My Community",
} as GroupInfo;

describe("Community entity", () => {
  it("exposes jid formatted from the underlying JID object", () => {
    const community = new Community(data, makeRequest());
    expect(community.jid).toBe("123456789@newsletter");
  });

  it("addParticipants() targets this community's jid", async () => {
    const request = makeRequest();
    const community = new Community(data, request);
    await community.addParticipants(["g1@g.us"]);
    expect(request).toHaveBeenCalledWith("POST", "/community/add", {
      body: { communityJid: "123456789@newsletter", groupJid: ["g1@g.us"] },
    });
  });

  it("removeParticipants() targets this community's jid", async () => {
    const request = makeRequest();
    const community = new Community(data, request);
    await community.removeParticipants(["g1@g.us"]);
    expect(request).toHaveBeenCalledWith("POST", "/community/remove", {
      body: { communityJid: "123456789@newsletter", groupJid: ["g1@g.us"] },
    });
  });
});
