import { describe, expect, it, vi } from "vitest";

import type { GroupInfo } from "@/shared";
import { CommunityModule } from "./community";
import { Community } from "./entity";

function makeRequest() {
  return vi.fn().mockResolvedValue({});
}

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
    const r = vi.fn().mockResolvedValue({ message: "success", data });
    const result = await new CommunityModule(r).create("My Community");
    expect(r).toHaveBeenCalledWith("POST", "/community/create", {
      body: { communityName: "My Community" },
    });
    expect(result.data).toBeInstanceOf(Community);
    expect(result.data.jid).toBe("123@newsletter");
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
