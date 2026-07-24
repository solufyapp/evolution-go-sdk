import { describe, expect, it, vi } from "vitest";

import { Message } from "@/modules/message/entity";
import { makeApi } from "@/test-utils";
import { SendMessageModule } from "./send-message";

const sendResult = {
  Info: {
    Chat: {
      User: "5511999999999",
      Server: "s.whatsapp.net",
      Device: 0,
      RawAgent: 0,
      Integrator: 0,
    },
    ID: "msg-1",
  },
  Message: null,
  MessageContextInfo: null,
};

function makeSpies() {
  const api = makeApi();
  vi.mocked(api.json).mockResolvedValue({
    message: "success",
    data: sendResult,
  });
  vi.mocked(api.formData).mockResolvedValue({
    message: "success",
    data: sendResult,
  });
  return { api, module: new SendMessageModule(api) };
}

describe("SendMessageModule", () => {
  it("text -> POST /send/text, returns a Message entity", async () => {
    const { api, module } = makeSpies();
    const message = await module.text({ number: "5511999999999", text: "hi" });
    expect(api.json).toHaveBeenCalledWith("POST", "/send/text", {
      body: { number: "5511999999999", text: "hi" },
    });
    expect(message).toBeInstanceOf(Message);
    expect(message.chat).toBe("5511999999999@s.whatsapp.net");
    expect(message.id).toBe("msg-1");
    expect(message.data).toBe(sendResult);
  });

  it("media -> POST /send/media", async () => {
    const { api, module } = makeSpies();
    await module.media({
      number: "5511999999999",
      url: "https://example.com/img.jpg",
      type: "image",
    });
    expect(api.json).toHaveBeenCalledWith("POST", "/send/media", {
      body: {
        number: "5511999999999",
        url: "https://example.com/img.jpg",
        type: "image",
      },
    });
  });

  it("sticker -> POST /send/sticker", async () => {
    const { api, module } = makeSpies();
    await module.sticker({
      number: "5511999999999",
      sticker: "https://example.com/s.webp",
    });
    expect(api.json).toHaveBeenCalledWith("POST", "/send/sticker", {
      body: { number: "5511999999999", sticker: "https://example.com/s.webp" },
    });
  });

  it("location -> POST /send/location", async () => {
    const { api, module } = makeSpies();
    await module.location({
      number: "5511999999999",
      latitude: -23.5,
      longitude: -46.6,
    });
    expect(api.json).toHaveBeenCalledWith("POST", "/send/location", {
      body: { number: "5511999999999", latitude: -23.5, longitude: -46.6 },
    });
  });

  it("contact -> POST /send/contact", async () => {
    const { api, module } = makeSpies();
    await module.contact({
      number: "5511999999999",
      vcard: { fullName: "Alice", phone: "5511888888888" },
    });
    expect(api.json).toHaveBeenCalledWith("POST", "/send/contact", {
      body: {
        number: "5511999999999",
        vcard: { fullName: "Alice", phone: "5511888888888" },
      },
    });
  });

  it("link -> POST /send/link", async () => {
    const { api, module } = makeSpies();
    await module.link({
      number: "5511999999999",
      url: "https://example.com",
      text: "Check this",
    });
    expect(api.json).toHaveBeenCalledWith("POST", "/send/link", {
      body: {
        number: "5511999999999",
        url: "https://example.com",
        text: "Check this",
      },
    });
  });

  it("button -> POST /send/button", async () => {
    const { api, module } = makeSpies();
    await module.button({
      number: "5511999999999",
      title: "Title",
      description: "Desc",
      footer: "Footer",
      buttons: [{ type: "reply", displayText: "Yes", id: "yes" }],
    });
    expect(api.json).toHaveBeenCalledWith(
      "POST",
      "/send/button",
      expect.objectContaining({
        body: expect.objectContaining({
          number: "5511999999999",
          title: "Title",
        }),
      }),
    );
  });

  it("carousel -> POST /send/carousel", async () => {
    const { api, module } = makeSpies();
    await module.carousel({
      number: "5511999999999",
      cards: [{ body: { text: "Card 1" } }],
    });
    expect(api.json).toHaveBeenCalledWith("POST", "/send/carousel", {
      body: { number: "5511999999999", cards: [{ body: { text: "Card 1" } }] },
    });
  });

  it("list -> POST /send/list", async () => {
    const { api, module } = makeSpies();
    await module.list({
      number: "5511999999999",
      title: "Menu",
      description: "Pick one",
      footerText: "Footer",
      sections: [
        { title: "Options", rows: [{ title: "Option 1", rowId: "opt1" }] },
      ],
    });
    expect(api.json).toHaveBeenCalledWith(
      "POST",
      "/send/list",
      expect.objectContaining({
        body: expect.objectContaining({
          number: "5511999999999",
          title: "Menu",
        }),
      }),
    );
  });

  it("poll -> POST /send/poll", async () => {
    const { api, module } = makeSpies();
    await module.poll({
      number: "5511999999999",
      question: "Fav?",
      options: ["A", "B"],
    });
    expect(api.json).toHaveBeenCalledWith("POST", "/send/poll", {
      body: { number: "5511999999999", question: "Fav?", options: ["A", "B"] },
    });
  });

  it("statusText -> POST /send/status/text", async () => {
    const { api, module } = makeSpies();
    await module.statusText({ text: "Good morning!" });
    expect(api.json).toHaveBeenCalledWith("POST", "/send/status/text", {
      body: { text: "Good morning!" },
    });
  });

  it("statusMedia uses formData with FormData, returns a Message entity", async () => {
    const { api, module } = makeSpies();
    const message = await module.statusMedia({
      type: "image",
      url: "https://example.com/img.jpg",
    });
    expect(api.formData).toHaveBeenCalledWith(
      "POST",
      "/send/status/media",
      expect.any(FormData),
    );
    const form: FormData = vi.mocked(api.formData).mock.calls[0][2];
    expect(form.get("type")).toBe("image");
    expect(form.get("url")).toBe("https://example.com/img.jpg");
    expect(message).toBeInstanceOf(Message);
  });

  it("statusMedia with file uses file in FormData", async () => {
    const { api, module } = makeSpies();
    const file = new Blob(["data"], { type: "image/jpeg" });
    await module.statusMedia({ type: "image", file });
    const form: FormData = vi.mocked(api.formData).mock.calls[0][2];
    const got = form.get("file") as Blob;
    expect(got.size).toBe(file.size);
    expect(got.type).toBe(file.type);
  });
});
