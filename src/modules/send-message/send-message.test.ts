import { describe, expect, it, vi } from "vitest";

import { SendMessageModule } from "./send-message.js";

function makeSpies() {
  const request = vi.fn().mockResolvedValue({});
  const requestForm = vi.fn().mockResolvedValue({});
  return {
    request,
    requestForm,
    module: new SendMessageModule(request, requestForm),
  };
}

describe("SendMessageModule", () => {
  it("text -> POST /send/text", async () => {
    const { request, module } = makeSpies();
    await module.text({ number: "5511999999999", text: "hi" });
    expect(request).toHaveBeenCalledWith("POST", "/send/text", {
      body: { number: "5511999999999", text: "hi" },
    });
  });

  it("media -> POST /send/media", async () => {
    const { request, module } = makeSpies();
    await module.media({
      number: "5511999999999",
      url: "https://example.com/img.jpg",
      type: "image",
    });
    expect(request).toHaveBeenCalledWith("POST", "/send/media", {
      body: {
        number: "5511999999999",
        url: "https://example.com/img.jpg",
        type: "image",
      },
    });
  });

  it("sticker -> POST /send/sticker", async () => {
    const { request, module } = makeSpies();
    await module.sticker({
      number: "5511999999999",
      sticker: "https://example.com/s.webp",
    });
    expect(request).toHaveBeenCalledWith("POST", "/send/sticker", {
      body: { number: "5511999999999", sticker: "https://example.com/s.webp" },
    });
  });

  it("location -> POST /send/location", async () => {
    const { request, module } = makeSpies();
    await module.location({
      number: "5511999999999",
      latitude: -23.5,
      longitude: -46.6,
    });
    expect(request).toHaveBeenCalledWith("POST", "/send/location", {
      body: { number: "5511999999999", latitude: -23.5, longitude: -46.6 },
    });
  });

  it("contact -> POST /send/contact", async () => {
    const { request, module } = makeSpies();
    await module.contact({
      number: "5511999999999",
      vcard: { fullName: "Alice", phone: "5511888888888" },
    });
    expect(request).toHaveBeenCalledWith("POST", "/send/contact", {
      body: {
        number: "5511999999999",
        vcard: { fullName: "Alice", phone: "5511888888888" },
      },
    });
  });

  it("link -> POST /send/link", async () => {
    const { request, module } = makeSpies();
    await module.link({
      number: "5511999999999",
      url: "https://example.com",
      text: "Check this",
    });
    expect(request).toHaveBeenCalledWith("POST", "/send/link", {
      body: {
        number: "5511999999999",
        url: "https://example.com",
        text: "Check this",
      },
    });
  });

  it("button -> POST /send/button", async () => {
    const { request, module } = makeSpies();
    await module.button({
      number: "5511999999999",
      title: "Title",
      description: "Desc",
      footer: "Footer",
      buttons: [{ type: "reply", displayText: "Yes", id: "yes" }],
    });
    expect(request).toHaveBeenCalledWith(
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
    const { request, module } = makeSpies();
    await module.carousel({
      number: "5511999999999",
      cards: [{ body: { text: "Card 1" } }],
    });
    expect(request).toHaveBeenCalledWith("POST", "/send/carousel", {
      body: { number: "5511999999999", cards: [{ body: { text: "Card 1" } }] },
    });
  });

  it("list -> POST /send/list", async () => {
    const { request, module } = makeSpies();
    await module.list({
      number: "5511999999999",
      title: "Menu",
      description: "Pick one",
      footerText: "Footer",
      sections: [
        { title: "Options", rows: [{ title: "Option 1", rowId: "opt1" }] },
      ],
    });
    expect(request).toHaveBeenCalledWith(
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
    const { request, module } = makeSpies();
    await module.poll({
      number: "5511999999999",
      question: "Fav?",
      options: ["A", "B"],
    });
    expect(request).toHaveBeenCalledWith("POST", "/send/poll", {
      body: { number: "5511999999999", question: "Fav?", options: ["A", "B"] },
    });
  });

  it("statusText -> POST /send/status/text", async () => {
    const { request, module } = makeSpies();
    await module.statusText({ text: "Good morning!" });
    expect(request).toHaveBeenCalledWith("POST", "/send/status/text", {
      body: { text: "Good morning!" },
    });
  });

  it("statusMedia uses requestForm with FormData", async () => {
    const { requestForm, module } = makeSpies();
    await module.statusMedia({
      type: "image",
      url: "https://example.com/img.jpg",
    });
    expect(requestForm).toHaveBeenCalledWith(
      "POST",
      "/send/status/media",
      expect.any(FormData),
    );
    const form: FormData = requestForm.mock.calls[0][2];
    expect(form.get("type")).toBe("image");
    expect(form.get("url")).toBe("https://example.com/img.jpg");
  });

  it("statusMedia with file uses file in FormData", async () => {
    const { requestForm, module } = makeSpies();
    const file = new Blob(["data"], { type: "image/jpeg" });
    await module.statusMedia({ type: "image", file });
    const form: FormData = requestForm.mock.calls[0][2];
    const got = form.get("file") as Blob;
    expect(got.size).toBe(file.size);
    expect(got.type).toBe(file.type);
  });
});
