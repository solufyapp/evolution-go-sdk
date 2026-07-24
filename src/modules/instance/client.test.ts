import { describe, expect, it, vi } from "vitest";

import { CallModule } from "@/modules/call";
import { ChatModule } from "@/modules/chat";
import { CommunityModule } from "@/modules/community";
import { GroupModule } from "@/modules/group";
import { LabelModule } from "@/modules/label";
import { MessageModule } from "@/modules/message";
import { SendMessageModule } from "@/modules/send-message";
import { InstanceClient } from "./client";

function makeFetch(body: unknown = { message: "success", data: {} }) {
  return vi.fn().mockResolvedValue({
    ok: true,
    status: 200,
    json: () => Promise.resolve(body),
  });
}

const config = { baseUrl: "https://api.example.com" };
const identity = { id: "inst-1", token: "tok" };

describe("InstanceClient", () => {
  it("wires up one submodule per messaging tag", () => {
    const client = new InstanceClient(identity, {
      ...config,
      fetch: makeFetch(),
    });
    expect(client.call).toBeInstanceOf(CallModule);
    expect(client.chat).toBeInstanceOf(ChatModule);
    expect(client.community).toBeInstanceOf(CommunityModule);
    expect(client.group).toBeInstanceOf(GroupModule);
    expect(client.label).toBeInstanceOf(LabelModule);
    expect(client.message).toBeInstanceOf(MessageModule);
    expect(client.sendMessage).toBeInstanceOf(SendMessageModule);
  });

  it("authenticates every request with its token", async () => {
    const fetch = makeFetch();
    const client = new InstanceClient(identity, { ...config, fetch });
    await client.chat.archive("chat@s.whatsapp.net");
    expect(fetch).toHaveBeenCalledWith(
      "https://api.example.com/chat/archive",
      expect.objectContaining({
        headers: expect.objectContaining({ apikey: "tok" }),
      }),
    );
  });

  it("connect() -> POST /instance/connect", async () => {
    const fetch = makeFetch();
    const client = new InstanceClient(identity, { ...config, fetch });
    await client.connect({ phone: "5511999999999" });
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
    const client = new InstanceClient(identity, { ...config, fetch });
    await client.disconnect();
    expect(fetch).toHaveBeenCalledWith(
      "https://api.example.com/instance/disconnect",
      expect.objectContaining({
        headers: expect.objectContaining({ apikey: "tok" }),
      }),
    );
  });

  it("reconnect() -> POST /instance/reconnect", async () => {
    const fetch = makeFetch();
    const client = new InstanceClient(identity, { ...config, fetch });
    await client.reconnect();
    expect(fetch).toHaveBeenCalledWith(
      "https://api.example.com/instance/reconnect",
      expect.anything(),
    );
  });

  it("logout() -> DELETE /instance/logout", async () => {
    const fetch = makeFetch();
    const client = new InstanceClient(identity, { ...config, fetch });
    await client.logout();
    expect(fetch).toHaveBeenCalledWith(
      "https://api.example.com/instance/logout",
      expect.objectContaining({ method: "DELETE" }),
    );
  });

  it("getStatus() -> GET /instance/status", async () => {
    const fetch = makeFetch();
    const client = new InstanceClient(identity, { ...config, fetch });
    await client.getStatus();
    expect(fetch).toHaveBeenCalledWith(
      "https://api.example.com/instance/status",
      expect.anything(),
    );
  });

  it("getQr() -> GET /instance/qr", async () => {
    const fetch = makeFetch();
    const client = new InstanceClient(identity, { ...config, fetch });
    await client.getQr();
    expect(fetch).toHaveBeenCalledWith(
      "https://api.example.com/instance/qr",
      expect.anything(),
    );
  });

  it("pair() -> POST /instance/pair", async () => {
    const fetch = makeFetch();
    const client = new InstanceClient(identity, { ...config, fetch });
    await client.pair({ phone: "5511999999999" });
    expect(fetch).toHaveBeenCalledWith(
      "https://api.example.com/instance/pair",
      expect.objectContaining({
        body: JSON.stringify({ phone: "5511999999999" }),
      }),
    );
  });

  it("getAdvancedSettings() targets this instance's own id", async () => {
    const fetch = makeFetch();
    const client = new InstanceClient(identity, { ...config, fetch });
    await client.getAdvancedSettings();
    expect(fetch).toHaveBeenCalledWith(
      "https://api.example.com/instance/inst-1/advanced-settings",
      expect.anything(),
    );
  });

  it("updateAdvancedSettings() targets this instance's own id", async () => {
    const fetch = makeFetch({ message: "ok", settings: { rejectCall: true } });
    const client = new InstanceClient(identity, { ...config, fetch });
    const settings = await client.updateAdvancedSettings({ rejectCall: true });
    expect(fetch).toHaveBeenCalledWith(
      "https://api.example.com/instance/inst-1/advanced-settings",
      expect.objectContaining({
        method: "PUT",
        body: JSON.stringify({ rejectCall: true }),
      }),
    );
    expect(settings).toEqual({ rejectCall: true });
  });

  it("can be constructed with just { id, token } and a baseUrl", () => {
    const client = new InstanceClient(
      { id: "inst-123", token: "secret" },
      { baseUrl: "https://api.example.com" },
    );
    expect(client.id).toBe("inst-123");
    expect(client.chat).toBeInstanceOf(ChatModule);
  });
});
