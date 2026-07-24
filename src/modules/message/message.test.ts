import { describe, expect, it } from "vitest";

import { makeApi } from "@/test-utils";
import { Message } from "./entity";
import { MessageModule } from "./message";

describe("MessageModule", () => {
  it("from() builds a Message handle without a network call", () => {
    const api = makeApi();
    const message = new MessageModule(api).from("msg-1", "1@s.whatsapp.net");
    expect(message).toBeInstanceOf(Message);
    expect(message.chat).toBe("1@s.whatsapp.net");
    expect(message.id).toBe("msg-1");
    expect(api.json).not.toHaveBeenCalled();
  });

  it("delete -> POST /message/delete", async () => {
    const api = makeApi();
    await new MessageModule(api).delete({
      chat: "1@s.whatsapp.net",
      messageId: "msg-1",
    });
    expect(api.json).toHaveBeenCalledWith("POST", "/message/delete", {
      body: { chat: "1@s.whatsapp.net", messageId: "msg-1" },
    });
  });

  it("downloadMedia -> POST /message/downloadmedia", async () => {
    const api = makeApi();
    const message = { id: "msg-1", mimetype: "image/jpeg" };
    await new MessageModule(api).downloadMedia({ message });
    expect(api.json).toHaveBeenCalledWith("POST", "/message/downloadmedia", {
      body: { message },
    });
  });

  it("edit -> POST /message/edit", async () => {
    const api = makeApi();
    await new MessageModule(api).edit({
      chat: "1@s.whatsapp.net",
      messageId: "msg-1",
      message: "new text",
    });
    expect(api.json).toHaveBeenCalledWith("POST", "/message/edit", {
      body: {
        chat: "1@s.whatsapp.net",
        messageId: "msg-1",
        message: "new text",
      },
    });
  });

  it("markPlayed -> POST /message/markplayed", async () => {
    const api = makeApi();
    await new MessageModule(api).markPlayed({
      number: "5511999999999",
      id: ["msg-1"],
    });
    expect(api.json).toHaveBeenCalledWith("POST", "/message/markplayed", {
      body: { number: "5511999999999", id: ["msg-1"] },
    });
  });

  it("markRead -> POST /message/markread", async () => {
    const api = makeApi();
    await new MessageModule(api).markRead({
      number: "5511999999999",
      id: ["msg-1"],
    });
    expect(api.json).toHaveBeenCalledWith("POST", "/message/markread", {
      body: { number: "5511999999999", id: ["msg-1"] },
    });
  });

  it("setPresence -> POST /message/presence", async () => {
    const api = makeApi();
    await new MessageModule(api).setPresence({
      number: "5511999999999",
      state: "composing",
    });
    expect(api.json).toHaveBeenCalledWith("POST", "/message/presence", {
      body: { number: "5511999999999", state: "composing" },
    });
  });

  it("react -> POST /message/react", async () => {
    const api = makeApi();
    await new MessageModule(api).react({
      number: "5511999999999",
      id: "msg-1",
      reaction: "👍",
    });
    expect(api.json).toHaveBeenCalledWith("POST", "/message/react", {
      body: { number: "5511999999999", id: "msg-1", reaction: "👍" },
    });
  });

  it("getStatus -> POST /message/status", async () => {
    const api = makeApi();
    await new MessageModule(api).getStatus("msg-1");
    expect(api.json).toHaveBeenCalledWith("POST", "/message/status", {
      body: { id: "msg-1" },
    });
  });
});
