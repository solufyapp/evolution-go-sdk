import { describe, expect, it, vi } from "vitest";

import { CallModule } from "@/modules/call";
import { ChatModule } from "@/modules/chat";
import { CommunityModule } from "@/modules/community";
import { GroupModule } from "@/modules/group";
import { LabelModule } from "@/modules/label";
import { MessageModule } from "@/modules/message";
import { SendMessageModule } from "@/modules/send-message";
import type { InstanceData } from "./types";
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

describe("Instance client", () => {
  it("exposes id and data from construction", () => {
    const instance = new Instance(data, {
      baseUrl: "https://api.example.com",
      fetch: makeFetch(),
    });
    expect(instance.id).toBe("inst-1");
    expect(instance.data).toBe(data);
  });

  it("wires up one submodule per messaging tag", () => {
    const instance = new Instance(data, {
      baseUrl: "https://api.example.com",
      fetch: makeFetch(),
    });
    expect(instance.call).toBeInstanceOf(CallModule);
    expect(instance.chat).toBeInstanceOf(ChatModule);
    expect(instance.community).toBeInstanceOf(CommunityModule);
    expect(instance.group).toBeInstanceOf(GroupModule);
    expect(instance.label).toBeInstanceOf(LabelModule);
    expect(instance.message).toBeInstanceOf(MessageModule);
    expect(instance.sendMessage).toBeInstanceOf(SendMessageModule);
  });

  it("authenticates every request with its own token, not an admin key", async () => {
    const fetch = makeFetch();
    const instance = new Instance(data, {
      baseUrl: "https://api.example.com",
      fetch,
    });
    await instance.chat.archive("chat@s.whatsapp.net");
    expect(fetch).toHaveBeenCalledWith(
      "https://api.example.com/chat/archive",
      expect.objectContaining({
        headers: expect.objectContaining({ apikey: "tok" }),
      }),
    );
  });

  it("connect() -> POST /instance/connect", async () => {
    const fetch = makeFetch();
    const instance = new Instance(data, {
      baseUrl: "https://api.example.com",
      fetch,
    });
    await instance.connect({ phone: "5511999999999" });
    expect(fetch).toHaveBeenCalledWith(
      "https://api.example.com/instance/connect",
      expect.objectContaining({
        body: JSON.stringify({ phone: "5511999999999" }),
        headers: expect.objectContaining({ apikey: "tok" }),
      }),
    );
  });

  it("disconnect() -> POST /instance/disconnect", async () => {
    const fetch = makeFetch();
    const instance = new Instance(data, {
      baseUrl: "https://api.example.com",
      fetch,
    });
    await instance.disconnect();
    expect(fetch).toHaveBeenCalledWith(
      "https://api.example.com/instance/disconnect",
      expect.objectContaining({
        headers: expect.objectContaining({ apikey: "tok" }),
      }),
    );
  });

  it("reconnect() -> POST /instance/reconnect", async () => {
    const fetch = makeFetch();
    const instance = new Instance(data, {
      baseUrl: "https://api.example.com",
      fetch,
    });
    await instance.reconnect();
    expect(fetch).toHaveBeenCalledWith(
      "https://api.example.com/instance/reconnect",
      expect.anything(),
    );
  });

  it("logout() -> DELETE /instance/logout", async () => {
    const fetch = makeFetch();
    const instance = new Instance(data, {
      baseUrl: "https://api.example.com",
      fetch,
    });
    await instance.logout();
    expect(fetch).toHaveBeenCalledWith(
      "https://api.example.com/instance/logout",
      expect.objectContaining({ method: "DELETE" }),
    );
  });

  it("getStatus() -> GET /instance/status", async () => {
    const fetch = makeFetch();
    const instance = new Instance(data, {
      baseUrl: "https://api.example.com",
      fetch,
    });
    await instance.getStatus();
    expect(fetch).toHaveBeenCalledWith(
      "https://api.example.com/instance/status",
      expect.anything(),
    );
  });

  it("getQr() -> GET /instance/qr", async () => {
    const fetch = makeFetch();
    const instance = new Instance(data, {
      baseUrl: "https://api.example.com",
      fetch,
    });
    await instance.getQr();
    expect(fetch).toHaveBeenCalledWith(
      "https://api.example.com/instance/qr",
      expect.anything(),
    );
  });

  it("pair() -> POST /instance/pair", async () => {
    const fetch = makeFetch();
    const instance = new Instance(data, {
      baseUrl: "https://api.example.com",
      fetch,
    });
    await instance.pair({ phone: "5511999999999" });
    expect(fetch).toHaveBeenCalledWith(
      "https://api.example.com/instance/pair",
      expect.objectContaining({
        body: JSON.stringify({ phone: "5511999999999" }),
      }),
    );
  });

  it("getAdvancedSettings() targets this instance's own id", async () => {
    const fetch = makeFetch();
    const instance = new Instance(data, {
      baseUrl: "https://api.example.com",
      fetch,
    });
    await instance.getAdvancedSettings();
    expect(fetch).toHaveBeenCalledWith(
      "https://api.example.com/instance/inst-1/advanced-settings",
      expect.anything(),
    );
  });

  it("updateAdvancedSettings() targets this instance's own id", async () => {
    const fetch = makeFetch({ message: "ok", settings: { rejectCall: true } });
    const instance = new Instance(data, {
      baseUrl: "https://api.example.com",
      fetch,
    });
    const settings = await instance.updateAdvancedSettings({
      rejectCall: true,
    });
    expect(fetch).toHaveBeenCalledWith(
      "https://api.example.com/instance/inst-1/advanced-settings",
      expect.objectContaining({
        method: "PUT",
        body: JSON.stringify({ rejectCall: true }),
      }),
    );
    expect(settings).toEqual({ rejectCall: true });
  });
});
