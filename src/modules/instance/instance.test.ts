import { describe, expect, it, vi } from "vitest";

import { APITransport } from "@/api";
import type { InstanceData } from "./types";
import { Instance } from "./entity";
import { InstanceModule } from "./instance";

function makeFetch(status: number, body: unknown) {
  return vi.fn().mockResolvedValue({
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(body),
  });
}

function makeApi(fetch: ReturnType<typeof makeFetch>) {
  return new APITransport({
    baseUrl: "https://api.example.com",
    apiKey: "admin-key",
    fetch,
  });
}

const instanceData: InstanceData = {
  id: "inst-123",
  name: "my-instance",
  token: "tok",
  webhook: "",
  rabbitmqEnable: "",
  websocketEnable: "",
  natsEnable: "",
  jid: "",
  qrcode: "",
  connected: false,
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

describe("InstanceModule", () => {
  it("getAll -> GET /instance/all, wraps each item in an Instance client", async () => {
    const fetch = makeFetch(200, { message: "success", data: [instanceData] });
    const result = await new InstanceModule(makeApi(fetch)).getAll();
    expect(fetch).toHaveBeenCalledWith(
      "https://api.example.com/instance/all",
      expect.anything(),
    );
    expect(result[0]).toBeInstanceOf(Instance);
    expect(result[0]?.id).toBe("inst-123");
  });

  it("create -> POST /instance/create, returns an Instance client", async () => {
    const fetch = makeFetch(200, { message: "success", data: instanceData });
    const result = await new InstanceModule(makeApi(fetch)).create({
      name: "my-instance",
    });
    expect(fetch).toHaveBeenCalledWith(
      "https://api.example.com/instance/create",
      expect.objectContaining({
        body: JSON.stringify({ name: "my-instance" }),
      }),
    );
    expect(result).toBeInstanceOf(Instance);
    expect(result.id).toBe("inst-123");
  });

  it("getInfo -> GET /instance/info/{id}, returns an Instance client", async () => {
    const fetch = makeFetch(200, { message: "success", data: instanceData });
    const result = await new InstanceModule(makeApi(fetch)).getInfo("inst-123");
    expect(fetch).toHaveBeenCalledWith(
      "https://api.example.com/instance/info/inst-123",
      expect.anything(),
    );
    expect(result).toBeInstanceOf(Instance);
    expect(result.id).toBe("inst-123");
  });

  it("delete -> DELETE /instance/delete/{id}", async () => {
    const fetch = makeFetch(200, {});
    await new InstanceModule(makeApi(fetch)).delete("inst-123");
    expect(fetch).toHaveBeenCalledWith(
      "https://api.example.com/instance/delete/inst-123",
      expect.objectContaining({ method: "DELETE" }),
    );
  });

  it("setProxy -> POST /instance/proxy/{id}", async () => {
    const fetch = makeFetch(200, {
      message: "success",
      data: {
        protocol: "http",
        host: "proxy.example.com",
        port: "8080",
        hasAuth: false,
      },
    });
    await new InstanceModule(makeApi(fetch)).setProxy("inst-123", {
      host: "proxy.example.com",
      port: "8080",
    });
    expect(fetch).toHaveBeenCalledWith(
      "https://api.example.com/instance/proxy/inst-123",
      expect.objectContaining({
        body: JSON.stringify({ host: "proxy.example.com", port: "8080" }),
      }),
    );
  });

  it("deleteProxy -> DELETE /instance/proxy/{id}", async () => {
    const fetch = makeFetch(200, {});
    await new InstanceModule(makeApi(fetch)).deleteProxy("inst-123");
    expect(fetch).toHaveBeenCalledWith(
      "https://api.example.com/instance/proxy/inst-123",
      expect.objectContaining({ method: "DELETE" }),
    );
  });

  it("forceReconnect -> POST /instance/forcereconnect/{id}", async () => {
    const fetch = makeFetch(200, {});
    await new InstanceModule(makeApi(fetch)).forceReconnect("inst-123");
    expect(fetch).toHaveBeenCalledWith(
      "https://api.example.com/instance/forcereconnect/inst-123",
      expect.objectContaining({ method: "POST" }),
    );
  });

  it("getLogs passes query params", async () => {
    const fetch = makeFetch(200, []);
    await new InstanceModule(makeApi(fetch)).getLogs("inst-123", {
      level: "error",
      limit: 50,
    });
    const url = vi.mocked(fetch).mock.calls[0][0] as string;
    expect(url).toContain("/instance/logs/inst-123");
    expect(url).toContain("level=error");
    expect(url).toContain("limit=50");
  });
});
