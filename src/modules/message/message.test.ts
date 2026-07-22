import { describe, expect, it, vi } from "vitest";

import { Message } from "./entity";
import { MessageModule } from "./message";

function makeRequest() {
  return vi.fn().mockResolvedValue({});
}

describe("MessageModule", () => {
  it("from() builds a Message handle without a network call", () => {
    const r = makeRequest();
    const message = new MessageModule(r).from({
      chat: "1@s.whatsapp.net",
      id: "msg-1",
    });
    expect(message).toBeInstanceOf(Message);
    expect(message.chat).toBe("1@s.whatsapp.net");
    expect(message.id).toBe("msg-1");
    expect(r).not.toHaveBeenCalled();
  });

  it("delete -> POST /message/delete", async () => {
    const r = makeRequest();
    await new MessageModule(r).delete({
      chat: "1@s.whatsapp.net",
      messageId: "msg-1",
    });
    expect(r).toHaveBeenCalledWith("POST", "/message/delete", {
      body: { chat: "1@s.whatsapp.net", messageId: "msg-1" },
    });
  });

  it("downloadMedia -> POST /message/downloadmedia", async () => {
    const r = makeRequest();
    const message = { id: "msg-1", mimetype: "image/jpeg" };
    await new MessageModule(r).downloadMedia({ message });
    expect(r).toHaveBeenCalledWith("POST", "/message/downloadmedia", {
      body: { message },
    });
  });

  it("edit -> POST /message/edit", async () => {
    const r = makeRequest();
    await new MessageModule(r).edit({
      chat: "1@s.whatsapp.net",
      messageId: "msg-1",
      message: "new text",
    });
    expect(r).toHaveBeenCalledWith("POST", "/message/edit", {
      body: {
        chat: "1@s.whatsapp.net",
        messageId: "msg-1",
        message: "new text",
      },
    });
  });

  it("markPlayed -> POST /message/markplayed", async () => {
    const r = makeRequest();
    await new MessageModule(r).markPlayed({
      number: "5511999999999",
      id: ["msg-1"],
    });
    expect(r).toHaveBeenCalledWith("POST", "/message/markplayed", {
      body: { number: "5511999999999", id: ["msg-1"] },
    });
  });

  it("markRead -> POST /message/markread", async () => {
    const r = makeRequest();
    await new MessageModule(r).markRead({
      number: "5511999999999",
      id: ["msg-1"],
    });
    expect(r).toHaveBeenCalledWith("POST", "/message/markread", {
      body: { number: "5511999999999", id: ["msg-1"] },
    });
  });

  it("setPresence -> POST /message/presence", async () => {
    const r = makeRequest();
    await new MessageModule(r).setPresence({
      number: "5511999999999",
      state: "composing",
    });
    expect(r).toHaveBeenCalledWith("POST", "/message/presence", {
      body: { number: "5511999999999", state: "composing" },
    });
  });

  it("react -> POST /message/react", async () => {
    const r = makeRequest();
    await new MessageModule(r).react({
      number: "5511999999999",
      id: "msg-1",
      reaction: "👍",
    });
    expect(r).toHaveBeenCalledWith("POST", "/message/react", {
      body: { number: "5511999999999", id: "msg-1", reaction: "👍" },
    });
  });

  it("getStatus -> POST /message/status", async () => {
    const r = makeRequest();
    await new MessageModule(r).getStatus("msg-1");
    expect(r).toHaveBeenCalledWith("POST", "/message/status", {
      body: { id: "msg-1" },
    });
  });
});
