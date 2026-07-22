import { describe, expect, it, vi } from "vitest";

import type { InstanceData } from "./types";
import { Instance } from "./entity";

function makeRequest() {
  return vi.fn().mockResolvedValue({});
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

describe("Instance entity", () => {
  it("exposes id from the underlying data", () => {
    const instance = new Instance(data, makeRequest());
    expect(instance.id).toBe("inst-1");
  });

  it("refresh() re-fetches and replaces data", async () => {
    const request = vi.fn().mockResolvedValue({
      message: "success",
      data: { ...data, name: "renamed" },
    });
    const instance = new Instance(data, request);
    await instance.refresh();
    expect(request).toHaveBeenCalledWith("GET", "/instance/info/inst-1");
    expect(instance.data.name).toBe("renamed");
  });

  it("delete() targets this instance's id", async () => {
    const request = makeRequest();
    const instance = new Instance(data, request);
    await instance.delete();
    expect(request).toHaveBeenCalledWith("DELETE", "/instance/delete/inst-1");
  });

  it("setProxy() targets this instance's id", async () => {
    const request = makeRequest();
    const instance = new Instance(data, request);
    await instance.setProxy({ host: "proxy.example.com", port: "8080" });
    expect(request).toHaveBeenCalledWith("POST", "/instance/proxy/inst-1", {
      body: { host: "proxy.example.com", port: "8080" },
    });
  });

  it("deleteProxy() targets this instance's id", async () => {
    const request = makeRequest();
    const instance = new Instance(data, request);
    await instance.deleteProxy();
    expect(request).toHaveBeenCalledWith("DELETE", "/instance/proxy/inst-1");
  });

  it("forceReconnect() targets this instance's id", async () => {
    const request = makeRequest();
    const instance = new Instance(data, request);
    await instance.forceReconnect();
    expect(request).toHaveBeenCalledWith(
      "POST",
      "/instance/forcereconnect/inst-1",
      {},
    );
  });

  it("getLogs() targets this instance's id", async () => {
    const request = makeRequest();
    const instance = new Instance(data, request);
    await instance.getLogs({ limit: 10 });
    expect(request).toHaveBeenCalledWith("GET", "/instance/logs/inst-1", {
      query: { limit: 10 },
    });
  });

  it("getAdvancedSettings() targets this instance's id", async () => {
    const request = makeRequest();
    const instance = new Instance(data, request);
    await instance.getAdvancedSettings();
    expect(request).toHaveBeenCalledWith(
      "GET",
      "/instance/inst-1/advanced-settings",
    );
  });

  it("updateAdvancedSettings() targets this instance's id", async () => {
    const request = makeRequest();
    const instance = new Instance(data, request);
    await instance.updateAdvancedSettings({ rejectCall: true });
    expect(request).toHaveBeenCalledWith(
      "PUT",
      "/instance/inst-1/advanced-settings",
      { body: { rejectCall: true } },
    );
  });

  it("connect() authenticates with this instance's own token", async () => {
    const request = makeRequest();
    const instance = new Instance(data, request);
    await instance.connect({ phone: "5511999999999" });
    expect(request).toHaveBeenCalledWith("POST", "/instance/connect", {
      body: { phone: "5511999999999" },
      apiKey: "tok",
    });
  });

  it("disconnect() authenticates with this instance's own token", async () => {
    const request = makeRequest();
    const instance = new Instance(data, request);
    await instance.disconnect();
    expect(request).toHaveBeenCalledWith("POST", "/instance/disconnect", {
      apiKey: "tok",
    });
  });

  it("reconnect() authenticates with this instance's own token", async () => {
    const request = makeRequest();
    const instance = new Instance(data, request);
    await instance.reconnect();
    expect(request).toHaveBeenCalledWith("POST", "/instance/reconnect", {
      apiKey: "tok",
    });
  });

  it("logout() authenticates with this instance's own token", async () => {
    const request = makeRequest();
    const instance = new Instance(data, request);
    await instance.logout();
    expect(request).toHaveBeenCalledWith("DELETE", "/instance/logout", {
      apiKey: "tok",
    });
  });

  it("getStatus() authenticates with this instance's own token", async () => {
    const request = makeRequest();
    const instance = new Instance(data, request);
    await instance.getStatus();
    expect(request).toHaveBeenCalledWith("GET", "/instance/status", {
      apiKey: "tok",
    });
  });

  it("getQr() authenticates with this instance's own token", async () => {
    const request = makeRequest();
    const instance = new Instance(data, request);
    await instance.getQr();
    expect(request).toHaveBeenCalledWith("GET", "/instance/qr", {
      apiKey: "tok",
    });
  });

  it("pair() authenticates with this instance's own token", async () => {
    const request = makeRequest();
    const instance = new Instance(data, request);
    await instance.pair({ phone: "5511999999999" });
    expect(request).toHaveBeenCalledWith("POST", "/instance/pair", {
      body: { phone: "5511999999999" },
      apiKey: "tok",
    });
  });
});
