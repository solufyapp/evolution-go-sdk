import { describe, expect, it } from "vitest";

import { makeApi } from "@/test-utils";
import type { LabelData } from "./types";
import { Label } from "./entity";

const data: LabelData = {
  id: "row-1",
  instance_id: "inst-1",
  label_id: "lbl-1",
  label_name: "Urgent",
  label_color: "2",
  predefined_id: "",
};

describe("Label entity", () => {
  it("exposes id from label_id", () => {
    const label = new Label(data, makeApi());
    expect(label.id).toBe("lbl-1");
  });

  it("edit() targets this label's id", async () => {
    const api = makeApi();
    const label = new Label(data, api);
    await label.edit({ name: "Renamed" });
    expect(api.json).toHaveBeenCalledWith("POST", "/label/edit", {
      body: { labelId: "lbl-1", name: "Renamed" },
    });
  });

  it("addToChat() targets this label's id", async () => {
    const api = makeApi();
    const label = new Label(data, api);
    await label.addToChat("1@s.whatsapp.net");
    expect(api.json).toHaveBeenCalledWith("POST", "/label/chat", {
      body: { jid: "1@s.whatsapp.net", labelId: "lbl-1" },
    });
  });

  it("removeFromChat() targets this label's id", async () => {
    const api = makeApi();
    const label = new Label(data, api);
    await label.removeFromChat("1@s.whatsapp.net");
    expect(api.json).toHaveBeenCalledWith("POST", "/unlabel/chat", {
      body: { jid: "1@s.whatsapp.net", labelId: "lbl-1" },
    });
  });

  it("addToMessage() targets this label's id", async () => {
    const api = makeApi();
    const label = new Label(data, api);
    await label.addToMessage("1@s.whatsapp.net", "msg-1");
    expect(api.json).toHaveBeenCalledWith("POST", "/label/message", {
      body: { jid: "1@s.whatsapp.net", labelId: "lbl-1", messageId: "msg-1" },
    });
  });

  it("removeFromMessage() targets this label's id", async () => {
    const api = makeApi();
    const label = new Label(data, api);
    await label.removeFromMessage("1@s.whatsapp.net", "msg-1");
    expect(api.json).toHaveBeenCalledWith("POST", "/unlabel/message", {
      body: { jid: "1@s.whatsapp.net", labelId: "lbl-1", messageId: "msg-1" },
    });
  });
});
