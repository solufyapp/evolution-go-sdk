import { describe, expect, it, vi } from "vitest";

import { Chat } from "./entity";

function makeRequest() {
  return vi.fn().mockResolvedValue({});
}

describe("Chat entity", () => {
  it("exposes the jid it was constructed with", () => {
    const chat = new Chat("chat@s.whatsapp.net", makeRequest());
    expect(chat.jid).toBe("chat@s.whatsapp.net");
  });

  it("archive() targets this chat's jid", async () => {
    const request = makeRequest();
    const chat = new Chat("chat@s.whatsapp.net", request);
    await chat.archive();
    expect(request).toHaveBeenCalledWith("POST", "/chat/archive", {
      body: { chat: "chat@s.whatsapp.net" },
    });
  });

  it("unarchive() targets this chat's jid", async () => {
    const request = makeRequest();
    const chat = new Chat("chat@s.whatsapp.net", request);
    await chat.unarchive();
    expect(request).toHaveBeenCalledWith("POST", "/chat/unarchive", {
      body: { chat: "chat@s.whatsapp.net" },
    });
  });

  it("mute() targets this chat's jid", async () => {
    const request = makeRequest();
    const chat = new Chat("chat@s.whatsapp.net", request);
    await chat.mute();
    expect(request).toHaveBeenCalledWith("POST", "/chat/mute", {
      body: { chat: "chat@s.whatsapp.net" },
    });
  });

  it("unmute() targets this chat's jid", async () => {
    const request = makeRequest();
    const chat = new Chat("chat@s.whatsapp.net", request);
    await chat.unmute();
    expect(request).toHaveBeenCalledWith("POST", "/chat/unmute", {
      body: { chat: "chat@s.whatsapp.net" },
    });
  });

  it("pin() targets this chat's jid", async () => {
    const request = makeRequest();
    const chat = new Chat("chat@s.whatsapp.net", request);
    await chat.pin();
    expect(request).toHaveBeenCalledWith("POST", "/chat/pin", {
      body: { chat: "chat@s.whatsapp.net" },
    });
  });

  it("unpin() targets this chat's jid", async () => {
    const request = makeRequest();
    const chat = new Chat("chat@s.whatsapp.net", request);
    await chat.unpin();
    expect(request).toHaveBeenCalledWith("POST", "/chat/unpin", {
      body: { chat: "chat@s.whatsapp.net" },
    });
  });
});
