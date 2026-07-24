import { describe, expect, it, vi } from "vitest";

import type { GroupInfo } from "@/shared";
import { makeApi } from "@/test-utils";
import { Group } from "./entity";

const jid = {
  User: "123456789-987654321",
  Server: "g.us",
  Device: 0,
  RawAgent: 0,
  Integrator: 0,
};

const data: GroupInfo = {
  JID: jid,
  OwnerJID: jid,
  OwnerPN: jid,
  Name: "Dev Team",
  NameSetAt: "",
  NameSetBy: jid,
  NameSetByPN: jid,
  Topic: "",
  TopicID: "",
  TopicSetAt: "",
  TopicSetBy: jid,
  TopicSetByPN: jid,
  TopicDeleted: false,
  IsLocked: false,
  IsAnnounce: false,
  AnnounceVersionID: "",
  IsEphemeral: false,
  DisappearingTimer: 0,
  IsIncognito: false,
  IsParent: false,
  DefaultMembershipApprovalMode: "",
  LinkedParentJID: jid,
  IsDefaultSubGroup: false,
  IsJoinApprovalRequired: false,
  AddressingMode: "",
  GroupCreated: "",
  CreatorCountryCode: "",
  ParticipantVersionID: "",
  Participants: [],
  ParticipantCount: 0,
  MemberAddMode: "",
  Suspended: false,
};

describe("Group entity", () => {
  it("exposes jid formatted from the underlying JID object", () => {
    const group = new Group(data, makeApi());
    expect(group.jid).toBe("123456789-987654321@g.us");
  });

  it("refresh() re-fetches and replaces data", async () => {
    const api = makeApi();
    vi.mocked(api.json).mockResolvedValue({
      message: "success",
      data: { ...data, Name: "Renamed" },
    });
    const group = new Group(data, api);
    await group.refresh();
    expect(api.json).toHaveBeenCalledWith("POST", "/group/info", {
      body: { groupJid: "123456789-987654321@g.us" },
    });
    expect(group.data.Name).toBe("Renamed");
  });

  it("setName() targets this group's jid", async () => {
    const api = makeApi();
    const group = new Group(data, api);
    await group.setName("New Name");
    expect(api.json).toHaveBeenCalledWith("POST", "/group/name", {
      body: { groupJid: "123456789-987654321@g.us", name: "New Name" },
    });
  });

  it("setDescription() targets this group's jid", async () => {
    const api = makeApi();
    const group = new Group(data, api);
    await group.setDescription("New description");
    expect(api.json).toHaveBeenCalledWith("POST", "/group/description", {
      body: {
        groupJid: "123456789-987654321@g.us",
        description: "New description",
      },
    });
  });

  it("setPhoto() targets this group's jid", async () => {
    const api = makeApi();
    const group = new Group(data, api);
    await group.setPhoto("base64...");
    expect(api.json).toHaveBeenCalledWith("POST", "/group/photo", {
      body: { groupJid: "123456789-987654321@g.us", image: "base64..." },
    });
  });

  it("updateParticipants() targets this group's jid", async () => {
    const api = makeApi();
    const group = new Group(data, api);
    await group.updateParticipants(["1@s.whatsapp.net"], "promote");
    expect(api.json).toHaveBeenCalledWith("POST", "/group/participant", {
      body: {
        groupJid: jid,
        participants: ["1@s.whatsapp.net"],
        action: "promote",
      },
    });
  });

  it("updateSettings() targets this group's jid", async () => {
    const api = makeApi();
    const group = new Group(data, api);
    await group.updateSettings("locked");
    expect(api.json).toHaveBeenCalledWith("POST", "/group/settings", {
      body: { groupJid: "123456789-987654321@g.us", action: "locked" },
    });
  });

  it("getInviteLink() targets this group's jid", async () => {
    const api = makeApi();
    const group = new Group(data, api);
    await group.getInviteLink(true);
    expect(api.json).toHaveBeenCalledWith("POST", "/group/invitelink", {
      body: { groupJid: "123456789-987654321@g.us", reset: true },
    });
  });

  it("leave() sends the raw Jid object (the server requires the object shape here)", async () => {
    const api = makeApi();
    const group = new Group(data, api);
    await group.leave();
    expect(api.json).toHaveBeenCalledWith("POST", "/group/leave", {
      body: { groupJid: jid },
    });
  });
});
