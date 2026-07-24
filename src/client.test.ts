import { describe, expect, it, vi } from "vitest";

import { EvolutionGoClient } from "./client";
import { Instance } from "./modules/instance";

function makeFetch(status: number, body: unknown) {
  return vi.fn().mockResolvedValue({
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(body),
  });
}

const instanceData = {
  id: "inst-1",
  name: "my-instance",
  token: "instance-token",
  webhook: "",
  rabbitmqEnable: "",
  websocketEnable: "",
  natsEnable: "",
  jid: "",
  qrcode: "",
  connected: true,
  expiration: 0,
  disconnect_reason: "",
  events: "",
  os_name: "",
  proxy: "",
  client_name: "",
  createdAt: "",
  alwaysOnline: false,
  rejectCall: false,
  msgRejectCall: "",
  readMessages: false,
  ignoreGroups: false,
  ignoreStatus: false,
};

describe("EvolutionGoClient", () => {
  it("only exposes the admin-key-scoped instance module", () => {
    const client = new EvolutionGoClient({
      baseUrl: "https://api.example.com",
      apiKey: "admin-key",
    });
    expect(client).not.toHaveProperty("chat");
    expect(client).not.toHaveProperty("group");
    expect(client).not.toHaveProperty("sendMessage");
    expect(client.instance).toBeDefined();
  });

  it("sends the admin apikey on instance lifecycle requests", async () => {
    const fetch = makeFetch(200, { message: "success", data: instanceData });
    const client = new EvolutionGoClient({
      baseUrl: "https://api.example.com/",
      apiKey: "admin-key",
      fetch,
    });
    await client.instance.getInfo("inst-1");
    expect(fetch).toHaveBeenCalledWith(
      "https://api.example.com/instance/info/inst-1",
      expect.objectContaining({
        headers: expect.objectContaining({ apikey: "admin-key" }),
      }),
    );
  });

  it("instance.create()/getInfo()/getAll() return Instance clients scoped to their own token", async () => {
    const fetch = makeFetch(200, { message: "success", data: instanceData });
    const client = new EvolutionGoClient({
      baseUrl: "https://api.example.com",
      apiKey: "admin-key",
      fetch,
    });
    const instance = await client.instance.create({ name: "my-instance" });
    expect(instance).toBeInstanceOf(Instance);

    await instance.chat.archive("chat@s.whatsapp.net");
    expect(fetch).toHaveBeenCalledWith(
      "https://api.example.com/chat/archive",
      expect.objectContaining({
        headers: expect.objectContaining({ apikey: "instance-token" }),
      }),
    );
  });
});
