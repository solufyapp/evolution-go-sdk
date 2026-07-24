import { describe, expect, it } from "vitest";

import { makeApi } from "@/test-utils";
import { CallModule } from "./call";

describe("CallModule", () => {
  it("reject sends POST /call/reject with the JID serialized as a Jid object", async () => {
    const api = makeApi();
    const m = new CallModule(api);
    await m.reject({ callId: "abc123", callCreator: "1234@s.whatsapp.net" });
    expect(api.json).toHaveBeenCalledWith("POST", "/call/reject", {
      body: {
        callId: "abc123",
        callCreator: {
          User: "1234",
          Server: "s.whatsapp.net",
          Device: 0,
          RawAgent: 0,
          Integrator: 0,
        },
      },
    });
  });

  it("reject omits callCreator when not provided", async () => {
    const api = makeApi();
    const m = new CallModule(api);
    await m.reject({ callId: "abc123" });
    expect(api.json).toHaveBeenCalledWith("POST", "/call/reject", {
      body: { callId: "abc123", callCreator: undefined },
    });
  });
});
