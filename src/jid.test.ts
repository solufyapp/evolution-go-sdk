import { describe, expect, it } from "vitest";

import { parseJid } from "./jid";

describe("parseJid", () => {
  it("parses a plain user@server JID", () => {
    expect(parseJid("5511999999999@s.whatsapp.net")).toEqual({
      User: "5511999999999",
      Server: "s.whatsapp.net",
      Device: 0,
      RawAgent: 0,
      Integrator: 0,
    });
  });

  it("parses a JID with a device id", () => {
    expect(parseJid("5511999999999:5@s.whatsapp.net")).toEqual({
      User: "5511999999999",
      Server: "s.whatsapp.net",
      Device: 5,
      RawAgent: 0,
      Integrator: 0,
    });
  });

  it("parses a JID with a raw agent and device id", () => {
    expect(parseJid("5511999999999.3:5@s.whatsapp.net")).toEqual({
      User: "5511999999999",
      Server: "s.whatsapp.net",
      Device: 5,
      RawAgent: 3,
      Integrator: 0,
    });
  });

  it("parses a group JID", () => {
    expect(parseJid("123456789-987654321@g.us")).toEqual({
      User: "123456789-987654321",
      Server: "g.us",
      Device: 0,
      RawAgent: 0,
      Integrator: 0,
    });
  });
});
