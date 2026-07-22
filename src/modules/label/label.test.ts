import { describe, expect, it, vi } from "vitest";

import { Label } from "./entity";
import { LabelModule } from "./label";

function makeRequest() {
  return vi.fn().mockResolvedValue({});
}

describe("LabelModule", () => {
  it("list -> GET /label/list, wraps each item in a Label entity", async () => {
    const r = vi.fn().mockResolvedValue([
      {
        id: "row-1",
        instance_id: "inst-1",
        label_id: "lbl-1",
        label_name: "Urgent",
        label_color: "2",
        predefined_id: "",
      },
    ]);
    const result = await new LabelModule(r).list();
    expect(r).toHaveBeenCalledWith("GET", "/label/list");
    expect(result[0]).toBeInstanceOf(Label);
    expect(result[0]?.id).toBe("lbl-1");
  });

  it("edit -> POST /label/edit", async () => {
    const r = makeRequest();
    await new LabelModule(r).edit({
      labelId: "lbl-1",
      name: "Urgent",
      color: 2,
    });
    expect(r).toHaveBeenCalledWith("POST", "/label/edit", {
      body: { labelId: "lbl-1", name: "Urgent", color: 2 },
    });
  });

  it("addToChat -> POST /label/chat", async () => {
    const r = makeRequest();
    await new LabelModule(r).addToChat({
      jid: "1@s.whatsapp.net",
      labelId: "lbl-1",
    });
    expect(r).toHaveBeenCalledWith("POST", "/label/chat", {
      body: { jid: "1@s.whatsapp.net", labelId: "lbl-1" },
    });
  });

  it("removeFromChat -> POST /unlabel/chat", async () => {
    const r = makeRequest();
    await new LabelModule(r).removeFromChat({
      jid: "1@s.whatsapp.net",
      labelId: "lbl-1",
    });
    expect(r).toHaveBeenCalledWith("POST", "/unlabel/chat", {
      body: { jid: "1@s.whatsapp.net", labelId: "lbl-1" },
    });
  });

  it("addToMessage -> POST /label/message", async () => {
    const r = makeRequest();
    await new LabelModule(r).addToMessage({
      jid: "1@s.whatsapp.net",
      labelId: "lbl-1",
      messageId: "msg-1",
    });
    expect(r).toHaveBeenCalledWith("POST", "/label/message", {
      body: { jid: "1@s.whatsapp.net", labelId: "lbl-1", messageId: "msg-1" },
    });
  });

  it("removeFromMessage -> POST /unlabel/message", async () => {
    const r = makeRequest();
    await new LabelModule(r).removeFromMessage({
      jid: "1@s.whatsapp.net",
      labelId: "lbl-1",
      messageId: "msg-1",
    });
    expect(r).toHaveBeenCalledWith("POST", "/unlabel/message", {
      body: { jid: "1@s.whatsapp.net", labelId: "lbl-1", messageId: "msg-1" },
    });
  });
});
