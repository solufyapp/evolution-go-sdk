import { describe, expect, it, vi } from "vitest";

import { Message } from "./entity";

function makeRequest() {
  return vi.fn().mockResolvedValue({});
}

describe("Message entity", () => {
  it("exposes chat and id it was constructed with", () => {
    const message = new Message(
      { chat: "1@s.whatsapp.net", id: "msg-1" },
      makeRequest(),
    );
    expect(message.chat).toBe("1@s.whatsapp.net");
    expect(message.id).toBe("msg-1");
  });

  it("react() targets this message", async () => {
    const request = makeRequest();
    const message = new Message(
      { chat: "1@s.whatsapp.net", id: "msg-1" },
      request,
    );
    await message.react("👍");
    expect(request).toHaveBeenCalledWith("POST", "/message/react", {
      body: { number: "1@s.whatsapp.net", id: "msg-1", reaction: "👍" },
    });
  });

  it("react() forwards fromMe/participant", async () => {
    const request = makeRequest();
    const message = new Message(
      { chat: "1@s.whatsapp.net", id: "msg-1" },
      request,
    );
    await message.react("👍", {
      fromMe: true,
      participant: "2@s.whatsapp.net",
    });
    expect(request).toHaveBeenCalledWith("POST", "/message/react", {
      body: {
        number: "1@s.whatsapp.net",
        id: "msg-1",
        reaction: "👍",
        fromMe: true,
        participant: "2@s.whatsapp.net",
      },
    });
  });

  it("markRead() targets this message", async () => {
    const request = makeRequest();
    const message = new Message(
      { chat: "1@s.whatsapp.net", id: "msg-1" },
      request,
    );
    await message.markRead();
    expect(request).toHaveBeenCalledWith("POST", "/message/markread", {
      body: { number: "1@s.whatsapp.net", id: ["msg-1"] },
    });
  });

  it("markPlayed() targets this message", async () => {
    const request = makeRequest();
    const message = new Message(
      { chat: "1@s.whatsapp.net", id: "msg-1" },
      request,
    );
    await message.markPlayed();
    expect(request).toHaveBeenCalledWith("POST", "/message/markplayed", {
      body: { number: "1@s.whatsapp.net", id: ["msg-1"] },
    });
  });

  it("edit() targets this message", async () => {
    const request = makeRequest();
    const message = new Message(
      { chat: "1@s.whatsapp.net", id: "msg-1" },
      request,
    );
    await message.edit("new text");
    expect(request).toHaveBeenCalledWith("POST", "/message/edit", {
      body: {
        chat: "1@s.whatsapp.net",
        messageId: "msg-1",
        message: "new text",
      },
    });
  });

  it("delete() targets this message", async () => {
    const request = makeRequest();
    const message = new Message(
      { chat: "1@s.whatsapp.net", id: "msg-1" },
      request,
    );
    await message.delete();
    expect(request).toHaveBeenCalledWith("POST", "/message/delete", {
      body: { chat: "1@s.whatsapp.net", messageId: "msg-1" },
    });
  });

  it("getStatus() targets this message's id", async () => {
    const request = makeRequest();
    const message = new Message(
      { chat: "1@s.whatsapp.net", id: "msg-1" },
      request,
    );
    await message.getStatus();
    expect(request).toHaveBeenCalledWith("POST", "/message/status", {
      body: { id: "msg-1" },
    });
  });
});
