import { describe, expect, it } from "vitest";

import { makeApi } from "@/test-utils";
import { Message } from "./entity";

describe("Message entity", () => {
  it("exposes chat and id it was constructed with", () => {
    const message = new Message("msg-1", "1@s.whatsapp.net", makeApi());
    expect(message.chat).toBe("1@s.whatsapp.net");
    expect(message.id).toBe("msg-1");
  });

  it("react() targets this message", async () => {
    const api = makeApi();
    const message = new Message("msg-1", "1@s.whatsapp.net", api);
    await message.react("👍");
    expect(api.json).toHaveBeenCalledWith("POST", "/message/react", {
      body: { number: "1@s.whatsapp.net", id: "msg-1", reaction: "👍" },
    });
  });

  it("react() forwards fromMe/participant", async () => {
    const api = makeApi();
    const message = new Message("msg-1", "1@s.whatsapp.net", api);
    await message.react("👍", {
      fromMe: true,
      participant: "2@s.whatsapp.net",
    });
    expect(api.json).toHaveBeenCalledWith("POST", "/message/react", {
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
    const api = makeApi();
    const message = new Message("msg-1", "1@s.whatsapp.net", api);
    await message.markRead();
    expect(api.json).toHaveBeenCalledWith("POST", "/message/markread", {
      body: { number: "1@s.whatsapp.net", id: ["msg-1"] },
    });
  });

  it("markPlayed() targets this message", async () => {
    const api = makeApi();
    const message = new Message("msg-1", "1@s.whatsapp.net", api);
    await message.markPlayed();
    expect(api.json).toHaveBeenCalledWith("POST", "/message/markplayed", {
      body: { number: "1@s.whatsapp.net", id: ["msg-1"] },
    });
  });

  it("edit() targets this message", async () => {
    const api = makeApi();
    const message = new Message("msg-1", "1@s.whatsapp.net", api);
    await message.edit("new text");
    expect(api.json).toHaveBeenCalledWith("POST", "/message/edit", {
      body: {
        chat: "1@s.whatsapp.net",
        messageId: "msg-1",
        message: "new text",
      },
    });
  });

  it("delete() targets this message", async () => {
    const api = makeApi();
    const message = new Message("msg-1", "1@s.whatsapp.net", api);
    await message.delete();
    expect(api.json).toHaveBeenCalledWith("POST", "/message/delete", {
      body: { chat: "1@s.whatsapp.net", messageId: "msg-1" },
    });
  });

  it("getStatus() targets this message's id", async () => {
    const api = makeApi();
    const message = new Message("msg-1", "1@s.whatsapp.net", api);
    await message.getStatus();
    expect(api.json).toHaveBeenCalledWith("POST", "/message/status", {
      body: { id: "msg-1" },
    });
  });
});
