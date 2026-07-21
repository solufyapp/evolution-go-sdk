import { describe, expect, it, vi } from "vitest";

import { ChatModule } from "./chat.js";

function makeRequest() {
  return vi.fn().mockResolvedValue({});
}

describe("ChatModule", () => {
  it("archive", async () => {
    const r = makeRequest();
    await new ChatModule(r).archive("chat@s.whatsapp.net");
    expect(r).toHaveBeenCalledWith("POST", "/chat/archive", {
      body: { chat: "chat@s.whatsapp.net" },
    });
  });

  it("unarchive", async () => {
    const r = makeRequest();
    await new ChatModule(r).unarchive("chat@s.whatsapp.net");
    expect(r).toHaveBeenCalledWith("POST", "/chat/unarchive", {
      body: { chat: "chat@s.whatsapp.net" },
    });
  });

  it("mute", async () => {
    const r = makeRequest();
    await new ChatModule(r).mute("chat@s.whatsapp.net");
    expect(r).toHaveBeenCalledWith("POST", "/chat/mute", {
      body: { chat: "chat@s.whatsapp.net" },
    });
  });

  it("unmute", async () => {
    const r = makeRequest();
    await new ChatModule(r).unmute("chat@s.whatsapp.net");
    expect(r).toHaveBeenCalledWith("POST", "/chat/unmute", {
      body: { chat: "chat@s.whatsapp.net" },
    });
  });

  it("pin", async () => {
    const r = makeRequest();
    await new ChatModule(r).pin("chat@s.whatsapp.net");
    expect(r).toHaveBeenCalledWith("POST", "/chat/pin", {
      body: { chat: "chat@s.whatsapp.net" },
    });
  });

  it("unpin", async () => {
    const r = makeRequest();
    await new ChatModule(r).unpin("chat@s.whatsapp.net");
    expect(r).toHaveBeenCalledWith("POST", "/chat/unpin", {
      body: { chat: "chat@s.whatsapp.net" },
    });
  });

  it("historySyncRequest", async () => {
    const r = makeRequest();
    await new ChatModule(r).historySyncRequest({ count: 50 });
    expect(r).toHaveBeenCalledWith("POST", "/chat/history-sync", {
      body: { count: 50 },
    });
  });
});
