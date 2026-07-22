import { describe, expect, it, vi } from "vitest";

import { CallModule } from "./call";

function makeRequest() {
  return vi.fn().mockResolvedValue({});
}

describe("CallModule", () => {
  it("reject sends POST /call/reject with the JID serialized as a Jid object", async () => {
    const request = makeRequest();
    const m = new CallModule(request);
    await m.reject({ callId: "abc123", callCreator: "1234@s.whatsapp.net" });
    expect(request).toHaveBeenCalledWith("POST", "/call/reject", {
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
    const request = makeRequest();
    const m = new CallModule(request);
    await m.reject({ callId: "abc123" });
    expect(request).toHaveBeenCalledWith("POST", "/call/reject", {
      body: { callId: "abc123", callCreator: undefined },
    });
  });
});
