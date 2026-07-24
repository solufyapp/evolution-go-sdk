import { describe, expect, it, vi } from "vitest";

import type { GroupInfo } from "@/shared";
import { makeApi } from "@/test-utils";
import { CommunityModule } from "./community";
import { Community } from "./entity";

describe("CommunityModule", () => {
  it("create returns a Community entity", async () => {
    const data = {
      JID: {
        User: "123",
        Server: "newsletter",
        Device: 0,
        RawAgent: 0,
        Integrator: 0,
      },
    } as GroupInfo;
    const api = makeApi();
    vi.mocked(api.json).mockResolvedValue({ message: "success", data });
    const community = await new CommunityModule(api).create("My Community");
    expect(api.json).toHaveBeenCalledWith("POST", "/community/create", {
      body: { communityName: "My Community" },
    });
    expect(community).toBeInstanceOf(Community);
    expect(community.jid).toBe("123@newsletter");
  });

  it("addParticipants", async () => {
    const api = makeApi();
    const body = { communityJid: "123@newsletter", groupJid: ["g1@g.us"] };
    await new CommunityModule(api).addParticipants(body);
    expect(api.json).toHaveBeenCalledWith("POST", "/community/add", { body });
  });

  it("removeParticipants", async () => {
    const api = makeApi();
    const body = { communityJid: "123@newsletter", groupJid: ["g1@g.us"] };
    await new CommunityModule(api).removeParticipants(body);
    expect(api.json).toHaveBeenCalledWith("POST", "/community/remove", {
      body,
    });
  });
});
