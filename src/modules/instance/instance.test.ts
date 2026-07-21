import { describe, expect, it, vi } from "vitest";

import { InstanceModule } from "./instance";

function makeRequest() {
  return vi.fn().mockResolvedValue({});
}

describe("InstanceModule", () => {
  it("getAll -> GET /instance/all", async () => {
    const r = makeRequest();
    await new InstanceModule(r).getAll();
    expect(r).toHaveBeenCalledWith("GET", "/instance/all");
  });

  it("connect -> POST /instance/connect", async () => {
    const r = makeRequest();
    await new InstanceModule(r).connect({ phone: "5511999999999" });
    expect(r).toHaveBeenCalledWith("POST", "/instance/connect", {
      body: { phone: "5511999999999" },
    });
  });

  it("create -> POST /instance/create", async () => {
    const r = makeRequest();
    await new InstanceModule(r).create({ name: "my-instance" });
    expect(r).toHaveBeenCalledWith("POST", "/instance/create", {
      body: { name: "my-instance" },
    });
  });

  it("delete -> DELETE /instance/delete/{id}", async () => {
    const r = makeRequest();
    await new InstanceModule(r).delete("inst-123");
    expect(r).toHaveBeenCalledWith("DELETE", "/instance/delete/inst-123");
  });

  it("disconnect -> POST /instance/disconnect", async () => {
    const r = makeRequest();
    await new InstanceModule(r).disconnect();
    expect(r).toHaveBeenCalledWith("POST", "/instance/disconnect");
  });

  it("forceReconnect -> POST /instance/forcereconnect/{id}", async () => {
    const r = makeRequest();
    await new InstanceModule(r).forceReconnect("inst-123");
    expect(r).toHaveBeenCalledWith(
      "POST",
      "/instance/forcereconnect/inst-123",
      {},
    );
  });

  it("getInfo -> GET /instance/info/{id}", async () => {
    const r = makeRequest();
    await new InstanceModule(r).getInfo("inst-123");
    expect(r).toHaveBeenCalledWith("GET", "/instance/info/inst-123");
  });

  it("logout -> DELETE /instance/logout", async () => {
    const r = makeRequest();
    await new InstanceModule(r).logout();
    expect(r).toHaveBeenCalledWith("DELETE", "/instance/logout");
  });

  it("getLogs passes query params", async () => {
    const r = makeRequest();
    await new InstanceModule(r).getLogs("inst-123", {
      level: "error",
      limit: 50,
    });
    expect(r).toHaveBeenCalledWith("GET", "/instance/logs/inst-123", {
      query: { level: "error", limit: 50 },
    });
  });

  it("pair -> POST /instance/pair", async () => {
    const r = makeRequest();
    await new InstanceModule(r).pair({ phone: "5511999999999" });
    expect(r).toHaveBeenCalledWith("POST", "/instance/pair", {
      body: { phone: "5511999999999" },
    });
  });

  it("setProxy -> POST /instance/proxy/{id}", async () => {
    const r = makeRequest();
    await new InstanceModule(r).setProxy("inst-123", {
      host: "proxy.example.com",
      port: "8080",
    });
    expect(r).toHaveBeenCalledWith("POST", "/instance/proxy/inst-123", {
      body: { host: "proxy.example.com", port: "8080" },
    });
  });

  it("deleteProxy -> DELETE /instance/proxy/{id}", async () => {
    const r = makeRequest();
    await new InstanceModule(r).deleteProxy("inst-123");
    expect(r).toHaveBeenCalledWith("DELETE", "/instance/proxy/inst-123");
  });

  it("getQr -> GET /instance/qr", async () => {
    const r = makeRequest();
    await new InstanceModule(r).getQr();
    expect(r).toHaveBeenCalledWith("GET", "/instance/qr");
  });

  it("reconnect -> POST /instance/reconnect", async () => {
    const r = makeRequest();
    await new InstanceModule(r).reconnect();
    expect(r).toHaveBeenCalledWith("POST", "/instance/reconnect");
  });

  it("getStatus -> GET /instance/status", async () => {
    const r = makeRequest();
    await new InstanceModule(r).getStatus();
    expect(r).toHaveBeenCalledWith("GET", "/instance/status");
  });

  it("getAdvancedSettings -> GET /instance/{id}/advanced-settings", async () => {
    const r = makeRequest();
    await new InstanceModule(r).getAdvancedSettings("inst-123");
    expect(r).toHaveBeenCalledWith(
      "GET",
      "/instance/inst-123/advanced-settings",
    );
  });

  it("updateAdvancedSettings -> PUT /instance/{id}/advanced-settings", async () => {
    const r = makeRequest();
    await new InstanceModule(r).updateAdvancedSettings("inst-123", {
      rejectCall: true,
    });
    expect(r).toHaveBeenCalledWith(
      "PUT",
      "/instance/inst-123/advanced-settings",
      {
        body: { rejectCall: true },
      },
    );
  });
});
