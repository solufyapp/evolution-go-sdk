import { describe, expect, it } from "vitest";

import type { GroupInfo } from "@/shared";
import { makeApi } from "@/test-utils";
import { Community } from "./entity";

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
    const community = new Community(data, makeApi());
    expect(community.jid).toBe("123456789@newsletter");
  });

  it("addParticipants() targets this community's jid", async () => {
    const api = makeApi();
    const community = new Community(data, api);
    await community.addParticipants(["g1@g.us"]);
    expect(api.json).toHaveBeenCalledWith("POST", "/community/add", {
      body: { communityJid: "123456789@newsletter", groupJid: ["g1@g.us"] },
    });
  });

  it("removeParticipants() targets this community's jid", async () => {
    const api = makeApi();
    const community = new Community(data, api);
    await community.removeParticipants(["g1@g.us"]);
    expect(api.json).toHaveBeenCalledWith("POST", "/community/remove", {
      body: { communityJid: "123456789@newsletter", groupJid: ["g1@g.us"] },
    });
  });
});
