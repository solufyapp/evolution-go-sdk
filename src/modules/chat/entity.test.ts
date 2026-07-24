import { describe, expect, it } from "vitest";

import { makeApi } from "@/test-utils";
import { Chat } from "./entity";

describe("Chat entity", () => {
  it("exposes the jid it was constructed with", () => {
    const chat = new Chat("chat@s.whatsapp.net", makeApi());
    expect(chat.jid).toBe("chat@s.whatsapp.net");
  });

  it("archive() targets this chat's jid", async () => {
    const api = makeApi();
    const chat = new Chat("chat@s.whatsapp.net", api);
    await chat.archive();
    expect(api.json).toHaveBeenCalledWith("POST", "/chat/archive", {
      body: { chat: "chat@s.whatsapp.net" },
    });
  });

  it("unarchive() targets this chat's jid", async () => {
    const api = makeApi();
    const chat = new Chat("chat@s.whatsapp.net", api);
    await chat.unarchive();
    expect(api.json).toHaveBeenCalledWith("POST", "/chat/unarchive", {
      body: { chat: "chat@s.whatsapp.net" },
    });
  });

  it("mute() targets this chat's jid", async () => {
    const api = makeApi();
    const chat = new Chat("chat@s.whatsapp.net", api);
    await chat.mute();
    expect(api.json).toHaveBeenCalledWith("POST", "/chat/mute", {
      body: { chat: "chat@s.whatsapp.net" },
    });
  });

  it("unmute() targets this chat's jid", async () => {
    const api = makeApi();
    const chat = new Chat("chat@s.whatsapp.net", api);
    await chat.unmute();
    expect(api.json).toHaveBeenCalledWith("POST", "/chat/unmute", {
      body: { chat: "chat@s.whatsapp.net" },
    });
  });

  it("pin() targets this chat's jid", async () => {
    const api = makeApi();
    const chat = new Chat("chat@s.whatsapp.net", api);
    await chat.pin();
    expect(api.json).toHaveBeenCalledWith("POST", "/chat/pin", {
      body: { chat: "chat@s.whatsapp.net" },
    });
  });

  it("unpin() targets this chat's jid", async () => {
    const api = makeApi();
    const chat = new Chat("chat@s.whatsapp.net", api);
    await chat.unpin();
    expect(api.json).toHaveBeenCalledWith("POST", "/chat/unpin", {
      body: { chat: "chat@s.whatsapp.net" },
    });
  });
});
