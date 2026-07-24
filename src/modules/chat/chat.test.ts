import { describe, expect, it } from "vitest";

import { makeApi } from "@/test-utils";
import { ChatModule } from "./chat";
import { Chat } from "./entity";

describe("ChatModule", () => {
  it("from() builds a Chat handle without a network call", () => {
    const api = makeApi();
    const chat = new ChatModule(api).from("chat@s.whatsapp.net");
    expect(chat).toBeInstanceOf(Chat);
    expect(chat.jid).toBe("chat@s.whatsapp.net");
    expect(api.json).not.toHaveBeenCalled();
  });

  it("archive", async () => {
    const api = makeApi();
    await new ChatModule(api).archive("chat@s.whatsapp.net");
    expect(api.json).toHaveBeenCalledWith("POST", "/chat/archive", {
      body: { chat: "chat@s.whatsapp.net" },
    });
  });

  it("unarchive", async () => {
    const api = makeApi();
    await new ChatModule(api).unarchive("chat@s.whatsapp.net");
    expect(api.json).toHaveBeenCalledWith("POST", "/chat/unarchive", {
      body: { chat: "chat@s.whatsapp.net" },
    });
  });

  it("mute", async () => {
    const api = makeApi();
    await new ChatModule(api).mute("chat@s.whatsapp.net");
    expect(api.json).toHaveBeenCalledWith("POST", "/chat/mute", {
      body: { chat: "chat@s.whatsapp.net" },
    });
  });

  it("unmute", async () => {
    const api = makeApi();
    await new ChatModule(api).unmute("chat@s.whatsapp.net");
    expect(api.json).toHaveBeenCalledWith("POST", "/chat/unmute", {
      body: { chat: "chat@s.whatsapp.net" },
    });
  });

  it("pin", async () => {
    const api = makeApi();
    await new ChatModule(api).pin("chat@s.whatsapp.net");
    expect(api.json).toHaveBeenCalledWith("POST", "/chat/pin", {
      body: { chat: "chat@s.whatsapp.net" },
    });
  });

  it("unpin", async () => {
    const api = makeApi();
    await new ChatModule(api).unpin("chat@s.whatsapp.net");
    expect(api.json).toHaveBeenCalledWith("POST", "/chat/unpin", {
      body: { chat: "chat@s.whatsapp.net" },
    });
  });

  it("historySyncRequest", async () => {
    const api = makeApi();
    await new ChatModule(api).historySyncRequest({ count: 50 });
    expect(api.json).toHaveBeenCalledWith("POST", "/chat/history-sync", {
      body: { count: 50 },
    });
  });
});
