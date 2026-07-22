import { describe, expect, it, vi } from "vitest";

import { EvolutionGoClient } from "./client";
import { EvolutionGoApiError } from "./errors";
import { Instance } from "./modules/instance";

function makeFetch(status: number, body: unknown) {
  return vi.fn().mockResolvedValue({
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(body),
  });
}

describe("EvolutionGoClient transport", () => {
  it("sets apikey header on every request", async () => {
    const fetch = makeFetch(200, {});
    const client = new EvolutionGoClient({
      baseUrl: "https://api.example.com",
      apiKey: "secret",
      fetch,
    });
    await client.request("GET", "/test");
    expect(fetch).toHaveBeenCalledWith(
      "https://api.example.com/test",
      expect.objectContaining({
        headers: expect.objectContaining({ apikey: "secret" }),
      }),
    );
  });

  it("strips trailing slash from baseUrl", async () => {
    const fetch = makeFetch(200, {});
    const client = new EvolutionGoClient({
      baseUrl: "https://api.example.com/",
      apiKey: "k",
      fetch,
    });
    await client.request("GET", "/test");
    expect(fetch).toHaveBeenCalledWith(
      "https://api.example.com/test",
      expect.anything(),
    );
  });

  it("serialises body as JSON with Content-Type header", async () => {
    const fetch = makeFetch(200, {});
    const client = new EvolutionGoClient({
      baseUrl: "https://api.example.com",
      apiKey: "k",
      fetch,
    });
    await client.request("POST", "/test", { body: { foo: "bar" } });
    expect(fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        body: JSON.stringify({ foo: "bar" }),
        headers: expect.objectContaining({
          "Content-Type": "application/json",
        }),
      }),
    );
  });

  it("appends query params, skipping undefined values", async () => {
    const fetch = makeFetch(200, {});
    const client = new EvolutionGoClient({
      baseUrl: "https://api.example.com",
      apiKey: "k",
      fetch,
    });
    await client.request("GET", "/test", {
      query: { a: "1", b: undefined, c: 2 },
    });
    const url = fetch.mock.calls[0][0] as string;
    expect(url).toContain("a=1");
    expect(url).toContain("c=2");
    expect(url).not.toContain("b=");
  });

  it("throws EvolutionGoApiError on non-2xx", async () => {
    const fetch = makeFetch(400, { error: "bad input" });
    const client = new EvolutionGoClient({
      baseUrl: "https://api.example.com",
      apiKey: "k",
      fetch,
    });
    await expect(client.request("GET", "/test")).rejects.toBeInstanceOf(
      EvolutionGoApiError,
    );
  });

  it("EvolutionGoApiError carries status and body", async () => {
    const fetch = makeFetch(500, { message: "oops" });
    const client = new EvolutionGoClient({
      baseUrl: "https://api.example.com",
      apiKey: "k",
      fetch,
    });
    try {
      await client.request("GET", "/test");
    } catch (e) {
      expect(e).toBeInstanceOf(EvolutionGoApiError);
      const err = e as EvolutionGoApiError;
      expect(err.status).toBe(500);
      expect(err.body).toEqual({ message: "oops" });
      expect(err.message).toBe("oops");
    }
  });

  it("does not include Content-Type when no body", async () => {
    const fetch = makeFetch(200, {});
    const client = new EvolutionGoClient({
      baseUrl: "https://api.example.com",
      apiKey: "k",
      fetch,
    });
    await client.request("GET", "/test");
    const headers = fetch.mock.calls[0][1].headers as Record<string, string>;
    expect(headers["Content-Type"]).toBeUndefined();
  });
});

describe("EvolutionGoClient forInstance", () => {
  it("returns a new client scoped to a token string", async () => {
    const fetch = makeFetch(200, {});
    const client = new EvolutionGoClient({
      baseUrl: "https://api.example.com/",
      apiKey: "admin-key",
      fetch,
    });
    const scoped = client.forInstance("instance-token");
    expect(scoped).not.toBe(client);
    await scoped.request("GET", "/test");
    expect(fetch).toHaveBeenCalledWith(
      "https://api.example.com/test",
      expect.objectContaining({
        headers: expect.objectContaining({ apikey: "instance-token" }),
      }),
    );
  });

  it("returns a new client scoped to an Instance entity's token", async () => {
    const fetch = makeFetch(200, {});
    const client = new EvolutionGoClient({
      baseUrl: "https://api.example.com",
      apiKey: "admin-key",
      fetch,
    });
    const instance = new Instance(
      {
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
      },
      client.request.bind(client),
    );
    const scoped = client.forInstance(instance);
    await scoped.request("GET", "/test");
    expect(fetch).toHaveBeenCalledWith(
      "https://api.example.com/test",
      expect.objectContaining({
        headers: expect.objectContaining({ apikey: "instance-token" }),
      }),
    );
  });

  it("preserves baseUrl and fetch from the parent client", async () => {
    const fetch = makeFetch(200, {});
    const client = new EvolutionGoClient({
      baseUrl: "https://api.example.com",
      apiKey: "admin-key",
      fetch,
    });
    const scoped = client.forInstance("instance-token");
    await scoped.chat.archive("chat@s.whatsapp.net");
    expect(fetch).toHaveBeenCalledWith(
      "https://api.example.com/chat/archive",
      expect.objectContaining({
        headers: expect.objectContaining({ apikey: "instance-token" }),
      }),
    );
  });
});

describe("EvolutionGoClient requestForm", () => {
  it("does not set Content-Type (let fetch set multipart boundary)", async () => {
    const fetch = makeFetch(200, {});
    const client = new EvolutionGoClient({
      baseUrl: "https://api.example.com",
      apiKey: "k",
      fetch,
    });
    const form = new FormData();
    form.set("type", "image");
    await client.requestForm("POST", "/send/status/media", form);
    const headers = fetch.mock.calls[0][1].headers as Record<string, string>;
    expect(headers["Content-Type"]).toBeUndefined();
    expect(headers.apikey).toBe("k");
  });
});
