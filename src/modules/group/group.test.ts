import { describe, expect, it, vi } from "vitest";

import type { GroupInfo } from "@/shared";
import { makeApi } from "@/test-utils";
import { Group } from "./entity";
import { GroupModule } from "./group";

const jid = {
  User: "123456789-987654321",
  Server: "g.us",
  Device: 0,
  RawAgent: 0,
  Integrator: 0,
};

const groupInfo: GroupInfo = {
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

describe("GroupModule", () => {
  it("create posts the group then fetches full info to seed a Group entity", async () => {
    const api = makeApi();
    vi.mocked(api.json)
      .mockResolvedValueOnce({
        message: "success",
        data: { jid, name: "Dev Team", owner: jid, added: [], failed: [] },
      })
      .mockResolvedValueOnce({ message: "success", data: groupInfo });
    const result = await new GroupModule(api).create({
      groupName: "Dev Team",
      participants: ["1@s.whatsapp.net"],
    });
    expect(api.json).toHaveBeenNthCalledWith(1, "POST", "/group/create", {
      body: { groupName: "Dev Team", participants: ["1@s.whatsapp.net"] },
    });
    expect(api.json).toHaveBeenNthCalledWith(2, "POST", "/group/info", {
      body: { groupJid: "123456789-987654321@g.us" },
    });
    expect(result).toBeInstanceOf(Group);
    expect(result.jid).toBe("123456789-987654321@g.us");
  });

  it("setDescription", async () => {
    const api = makeApi();
    await new GroupModule(api).setDescription({
      groupJid: "g@g.us",
      description: "hi",
    });
    expect(api.json).toHaveBeenCalledWith("POST", "/group/description", {
      body: { groupJid: "g@g.us", description: "hi" },
    });
  });

  it("getInfo returns a Group entity", async () => {
    const api = makeApi();
    vi.mocked(api.json).mockResolvedValue({
      message: "success",
      data: groupInfo,
    });
    const result = await new GroupModule(api).getInfo("g@g.us");
    expect(api.json).toHaveBeenCalledWith("POST", "/group/info", {
      body: { groupJid: "g@g.us" },
    });
    expect(result).toBeInstanceOf(Group);
  });

  it("getInviteLink", async () => {
    const api = makeApi();
    await new GroupModule(api).getInviteLink({
      groupJid: "g@g.us",
      reset: true,
    });
    expect(api.json).toHaveBeenCalledWith("POST", "/group/invitelink", {
      body: { groupJid: "g@g.us", reset: true },
    });
  });

  it("join", async () => {
    const api = makeApi();
    await new GroupModule(api).join("ABC123");
    expect(api.json).toHaveBeenCalledWith("POST", "/group/join", {
      body: { code: "ABC123" },
    });
  });

  it("leave sends groupJid serialized as a Jid object", async () => {
    const api = makeApi();
    await new GroupModule(api).leave("123456789-987654321@g.us");
    expect(api.json).toHaveBeenCalledWith("POST", "/group/leave", {
      body: {
        groupJid: {
          User: "123456789-987654321",
          Server: "g.us",
          Device: 0,
          RawAgent: 0,
          Integrator: 0,
        },
      },
    });
  });

  it("list wraps each item in a Group entity", async () => {
    const api = makeApi();
    vi.mocked(api.json).mockResolvedValue({
      message: "success",
      data: [groupInfo],
    });
    const result = await new GroupModule(api).list();
    expect(api.json).toHaveBeenCalledWith("GET", "/group/list");
    expect(result[0]).toBeInstanceOf(Group);
  });

  it("myGroups wraps each item in a Group entity", async () => {
    const api = makeApi();
    vi.mocked(api.json).mockResolvedValue({
      message: "success",
      data: [groupInfo],
    });
    const result = await new GroupModule(api).myGroups();
    expect(api.json).toHaveBeenCalledWith("GET", "/group/myall");
    expect(result[0]).toBeInstanceOf(Group);
  });

  it("setName", async () => {
    const api = makeApi();
    await new GroupModule(api).setName({
      groupJid: "g@g.us",
      name: "New Name",
    });
    expect(api.json).toHaveBeenCalledWith("POST", "/group/name", {
      body: { groupJid: "g@g.us", name: "New Name" },
    });
  });

  it("updateParticipants", async () => {
    const api = makeApi();
    await new GroupModule(api).updateParticipants({
      groupJid: "g@g.us",
      participants: ["1@s.whatsapp.net"],
      action: "promote",
    });
    expect(api.json).toHaveBeenCalledWith("POST", "/group/participant", {
      body: {
        groupJid: {
          User: "g",
          Server: "g.us",
          Device: 0,
          RawAgent: 0,
          Integrator: 0,
        },
        participants: ["1@s.whatsapp.net"],
        action: "promote",
      },
    });
  });

  it("setPhoto", async () => {
    const api = makeApi();
    await new GroupModule(api).setPhoto({
      groupJid: "g@g.us",
      image: "base64...",
    });
    expect(api.json).toHaveBeenCalledWith("POST", "/group/photo", {
      body: { groupJid: "g@g.us", image: "base64..." },
    });
  });

  it("updateSettings", async () => {
    const api = makeApi();
    await new GroupModule(api).updateSettings({
      groupJid: "g@g.us",
      action: "locked",
    });
    expect(api.json).toHaveBeenCalledWith("POST", "/group/settings", {
      body: { groupJid: "g@g.us", action: "locked" },
    });
  });
});
