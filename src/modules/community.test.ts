import { describe, expect, it, vi } from "vitest";

import { CommunityModule } from "./community.js";

function makeRequest() {
  return vi.fn().mockResolvedValue({});
}

describe("CommunityModule", () => {
  it("create", async () => {
    const r = makeRequest();
    await new CommunityModule(r).create("My Community");
    expect(r).toHaveBeenCalledWith("POST", "/community/create", {
      body: { communityName: "My Community" },
    });
  });

  it("addParticipants", async () => {
    const r = makeRequest();
    const body = { communityJid: "123@newsletter", groupJid: ["g1@g.us"] };
    await new CommunityModule(r).addParticipants(body);
    expect(r).toHaveBeenCalledWith("POST", "/community/add", { body });
  });

  it("removeParticipants", async () => {
    const r = makeRequest();
    const body = { communityJid: "123@newsletter", groupJid: ["g1@g.us"] };
    await new CommunityModule(r).removeParticipants(body);
    expect(r).toHaveBeenCalledWith("POST", "/community/remove", { body });
  });
});
