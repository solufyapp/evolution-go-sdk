import { describe, expect, it, vi } from "vitest";

import { CallModule } from "./call.js";

function makeRequest() {
  return vi.fn().mockResolvedValue({});
}

describe("CallModule", () => {
  it("reject sends POST /call/reject with body", async () => {
    const request = makeRequest();
    const m = new CallModule(request);
    await m.reject({ callId: "abc123", callCreator: "1234@s.whatsapp.net" });
    expect(request).toHaveBeenCalledWith("POST", "/call/reject", {
      body: { callId: "abc123", callCreator: "1234@s.whatsapp.net" },
    });
  });
});
