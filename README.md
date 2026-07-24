
<h1 align="center">@solufy/evolution-go-sdk</h1>

<p align="center">Unofficial, typed TypeScript SDK for the <a href="https://github.com/evolution-foundation/evolution-go" target="_blank">Evolution GO</a> WhatsApp API (whatsmeow-based).</p>

## Install

```bash
npm install @solufy/evolution-go-sdk
# or
yarn add @solufy/evolution-go-sdk
# or
pnpm add @solufy/evolution-go-sdk
```

## Two clients

Evolution GO's own auth has two tiers, and the SDK mirrors them as two separate client classes instead of one client with a mix of methods that only work for some keys:

- **`EvolutionGoClient`** — authenticated with the server's global admin key. Only instance lifecycle management is reachable with it: `create`, `getAll`, `getInfo`, `delete`, `setProxy`, `deleteProxy`, `forceReconnect`, `getLogs`.
- **`Instance`** — authenticated with one specific instance's own token. Everything else lives here: `call`, `chat`, `community`, `group`, `label`, `message`, `sendMessage`, plus the session operations (`connect`, `disconnect`, `reconnect`, `logout`, `getStatus`, `getQr`, `pair`, `getAdvancedSettings`, `updateAdvancedSettings`).

You get an `Instance` from the admin client — `create`/`getInfo`/`getAll` all return one, already scoped to that instance's token:

```ts
import { EvolutionGoClient, EvolutionGoApiError } from "@solufy/evolution-go-sdk";

const admin = new EvolutionGoClient({
  baseUrl: "https://your-evolution-go-server.com",
  apiKey: process.env.EVOLUTION_GO_ADMIN_KEY!,
});

try {
  const instance = await admin.instance.create({ name: "my-instance", token: "secret" });
  const qr = await instance.getQr();
  await instance.chat.archive("5511999999999@s.whatsapp.net");
} catch (err) {
  if (err instanceof EvolutionGoApiError) console.error(err.status, err.message, err.body);
  else throw err;
}
```

If you already have an instance's token from elsewhere (your own database, an env var) and don't need the admin client at all, construct an `Instance` directly:

```ts
import { Instance } from "@solufy/evolution-go-sdk";

const instance = new Instance(
  { id: "inst-123", token: "secret" /* ...rest of InstanceData */ },
  { baseUrl: "https://your-evolution-go-server.com" },
);
await instance.chat.archive("5511999999999@s.whatsapp.net");
```

Every method resolves directly to the data you asked for — the server's `{message, data}` envelope is unwrapped for you.

## Entities

Fetching or creating a **Group**, **Label**, or **Community** returns a rich object: `.data` plus bound methods for that identity.

```ts
const group = await instance.group.getInfo("123456789-987654321@g.us");
await group.setName("New name");
await group.updateSettings("locked");
await group.leave();
await group.refresh(); // re-fetch to pick up changes made elsewhere
```

Mutating methods (`setName`, `leave`, ...) don't update `.data` for you — call `.refresh()` when you need that (available on `Group`; `Label`/`Community` have no single-item GET to refresh from).

**Chat** and **Message** have no "get by id" endpoint, so they're thin handles built locally with `.from(...)` — no network call:

```ts
const chat = instance.chat.from("5511999999999@s.whatsapp.net");
await chat.archive();

const message = instance.message.from({ chat: "5511999999999@s.whatsapp.net", id: "msg-1" });
await message.react("👍");
```

`sendMessage.*` returns a `Message` entity built from the send result, so you can act on it right away:

```ts
const sent = await instance.sendMessage.text({ number: "5511999999999", text: "Hi!" });
await sent.react("👍");
```

## Module reference

Every module also has flat, direct-by-id methods for when you don't need to fetch an entity first. All of these (except `client.instance`) are on an `Instance`, not on the admin `EvolutionGoClient`.

### Instance (admin client)

```ts
const instance = await client.instance.create({ name: "my-instance", token: "secret" });
const all = await client.instance.getAll();
const info = await client.instance.getInfo("inst-123");

await client.instance.setProxy("inst-123", { host: "proxy.example.com", port: "8080" });
await client.instance.forceReconnect("inst-123");
const logs = await client.instance.getLogs("inst-123", { level: "error", limit: 50 });
await client.instance.delete("inst-123");
```

### Instance (session, on the Instance client)

```ts
await instance.connect({ phone: "5511999999999" });
const qr = await instance.getQr();
const status = await instance.getStatus();
await instance.pair({ phone: "5511999999999" });
await instance.disconnect();
await instance.reconnect();
await instance.logout();

const settings = await instance.getAdvancedSettings();
await instance.updateAdvancedSettings({ rejectCall: true });
```

### Call

```ts
await instance.call.reject({ callId: "abc123", callCreator: "5511999999999@s.whatsapp.net" });
```

### Chat

```ts
await instance.chat.archive(jid);
await instance.chat.pin(jid);
await instance.chat.mute(jid);
await instance.chat.historySyncRequest({ count: 50 });
// unarchive, unpin, unmute also available
```

### Community

```ts
const community = await instance.community.create("My Community");
await community.addParticipants(["123456789-987654321@g.us"]);
```

### Group

```ts
const group = await instance.group.create({
  groupName: "Dev Team",
  participants: ["5511999999999@s.whatsapp.net"],
});

const groups = await instance.group.list();
const myGroups = await instance.group.myGroups();
await instance.group.join("<invite-code>");
```

### Label

```ts
const labels = await instance.label.list();
await labels[0].edit({ name: "Urgent", color: 2 });
await labels[0].addToChat(jid);
```

### Message

```ts
const message = instance.message.from({ chat: jid, id: "msg-1" });
await message.markRead();
await message.edit("new text");
const status = await message.getStatus();

const media = await instance.message.downloadMedia({ message: rawWebhookMessage });
```

### Send Message

Dedicated methods for **text**, **media**, **sticker**, **location**, **contact**, **link**, **button**, **carousel**, **list**, **poll**, and **status** (text/media) messages. All return a `Message` entity.

```ts
await instance.sendMessage.text({ number: "5511999999999", text: "Hi!" });
await instance.sendMessage.media({ number: "5511999999999", url: "https://example.com/image.jpg", type: "image" });
await instance.sendMessage.statusText({ text: "Good morning!" });
```

## Error handling

Non-2xx responses throw `EvolutionGoApiError`, carrying the HTTP `status` and parsed response `body`.

```ts
import { EvolutionGoApiError } from "@solufy/evolution-go-sdk";

try {
  await instance.group.getInfo("invalid-jid");
} catch (err) {
  if (err instanceof EvolutionGoApiError) console.error(err.status, err.message);
}
```

## API documentation

See your deployment's own Swagger UI (`/swagger/index.html`) for the full API surface. This SDK covers **Call**, **Chat**, **Community**, **Group**, **Instance**, **Label**, **Message**, and **Send Message**.

## Contributing

Issues and PRs welcome at the [GitHub repository](https://github.com/solufyapp/evolution-go-sdk).

## Authors

- [@joaotonaco](https://github.com/joaotonaco)
