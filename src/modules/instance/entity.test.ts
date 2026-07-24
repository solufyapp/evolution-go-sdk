import { describe, expect, it, vi } from "vitest";

import type { InstanceData } from "./types";
import { InstanceClient } from "./client";
import { Instance } from "./entity";

function makeFetch(body: unknown = { message: "success", data: {} }) {
  return vi.fn().mockResolvedValue({
    ok: true,
    status: 200,
    json: () => Promise.resolve(body),
  });
}

const data: InstanceData = {
  id: "inst-1",
  name: "my-instance",
  token: "tok",
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

describe("Instance", () => {
  it("exposes id and data from construction", () => {
    const instance = new Instance(data, {
      baseUrl: "https://api.example.com",
      fetch: makeFetch(),
    });
    expect(instance.id).toBe("inst-1");
    expect(instance.data).toBe(data);
  });

  it("is an InstanceClient", () => {
    const instance = new Instance(data, {
      baseUrl: "https://api.example.com",
      fetch: makeFetch(),
    });
    expect(instance).toBeInstanceOf(InstanceClient);
  });
});
