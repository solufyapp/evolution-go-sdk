import { describe, expect, it, vi } from "vitest";

import { makeApi } from "@/test-utils";
import { Label } from "./entity";
import { LabelModule } from "./label";

describe("LabelModule", () => {
  it("list -> GET /label/list, wraps each item in a Label entity", async () => {
    const api = makeApi();
    vi.mocked(api.json).mockResolvedValue([
      {
        id: "row-1",
        instance_id: "inst-1",
        label_id: "lbl-1",
        label_name: "Urgent",
        label_color: "2",
        predefined_id: "",
      },
    ]);
    const result = await new LabelModule(api).list();
    expect(api.json).toHaveBeenCalledWith("GET", "/label/list");
    expect(result[0]).toBeInstanceOf(Label);
    expect(result[0]?.id).toBe("lbl-1");
  });

  it("edit -> POST /label/edit", async () => {
    const api = makeApi();
    await new LabelModule(api).edit({
      labelId: "lbl-1",
      name: "Urgent",
      color: 2,
    });
    expect(api.json).toHaveBeenCalledWith("POST", "/label/edit", {
      body: { labelId: "lbl-1", name: "Urgent", color: 2 },
    });
  });

  it("addToChat -> POST /label/chat", async () => {
    const api = makeApi();
    await new LabelModule(api).addToChat({
      jid: "1@s.whatsapp.net",
      labelId: "lbl-1",
    });
    expect(api.json).toHaveBeenCalledWith("POST", "/label/chat", {
      body: { jid: "1@s.whatsapp.net", labelId: "lbl-1" },
    });
  });

  it("removeFromChat -> POST /unlabel/chat", async () => {
    const api = makeApi();
    await new LabelModule(api).removeFromChat({
      jid: "1@s.whatsapp.net",
      labelId: "lbl-1",
    });
    expect(api.json).toHaveBeenCalledWith("POST", "/unlabel/chat", {
      body: { jid: "1@s.whatsapp.net", labelId: "lbl-1" },
    });
  });

  it("addToMessage -> POST /label/message", async () => {
    const api = makeApi();
    await new LabelModule(api).addToMessage({
      jid: "1@s.whatsapp.net",
      labelId: "lbl-1",
      messageId: "msg-1",
    });
    expect(api.json).toHaveBeenCalledWith("POST", "/label/message", {
      body: { jid: "1@s.whatsapp.net", labelId: "lbl-1", messageId: "msg-1" },
    });
  });

  it("removeFromMessage -> POST /unlabel/message", async () => {
    const api = makeApi();
    await new LabelModule(api).removeFromMessage({
      jid: "1@s.whatsapp.net",
      labelId: "lbl-1",
      messageId: "msg-1",
    });
    expect(api.json).toHaveBeenCalledWith("POST", "/unlabel/message", {
      body: { jid: "1@s.whatsapp.net", labelId: "lbl-1", messageId: "msg-1" },
    });
  });
});
