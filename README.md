
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

## Quick start

```ts
import { EvolutionGoClient, EvolutionGoApiError } from "@solufy/evolution-go-sdk";

const client = new EvolutionGoClient({
  baseUrl: "https://your-evolution-go-server.com",
  apiKey: process.env.EVOLUTION_GO_API_KEY!,
});

try {
  const instances = await client.instance.getAll();
  console.log(instances.map((i) => i.data.name));
} catch (err) {
  if (err instanceof EvolutionGoApiError) console.error(err.status, err.message, err.body);
  else throw err;
}
```

Every method resolves directly to the data you asked for — the server's `{message, data}` envelope is unwrapped for you.

## Modules

```ts
client.call, client.chat, client.community, client.group,
client.instance, client.label, client.message, client.sendMessage
```

## Entities

Fetching or creating an **Instance**, **Group**, **Label**, or **Community** returns a rich object: `.data` plus bound methods for that identity.

```ts
const group = await client.group.getInfo("123456789-987654321@g.us");
await group.setName("New name");
await group.updateSettings("locked");
await group.leave();
await group.refresh(); // re-fetch to pick up changes made elsewhere
```

Mutating methods (`setName`, `leave`, ...) don't update `.data` for you — call `.refresh()` when you need that (available on `Instance` and `Group`; `Label`/`Community` have no single-item GET to refresh from).

**Chat** and **Message** have no "get by id" endpoint, so they're thin handles built locally with `.from(...)` — no network call:

```ts
const chat = client.chat.from("5511999999999@s.whatsapp.net");
await chat.archive();

const message = client.message.from({ chat: "5511999999999@s.whatsapp.net", id: "msg-1" });
await message.react("👍");
```

`sendMessage.*` returns a `Message` entity built from the send result, so you can act on it right away:

```ts
const sent = await client.sendMessage.text({ number: "5511999999999", text: "Hi!" });
await sent.react("👍");
```

## Scoping a client to one instance

Every module except Instance's own id-scoped operations has no `instanceId` param at all — a request is scoped by whichever `apikey` it carries. `forInstance` gives you a client pinned to one instance's token:

```ts
const admin = new EvolutionGoClient({ baseUrl, apiKey: globalKey });
const instance = await admin.instance.getInfo("inst-123");

const instanceClient = admin.forInstance(instance); // or admin.forInstance(instance.data.token)
await instanceClient.chat.archive("5511999999999@s.whatsapp.net");
```

An `Instance` entity does this itself for its own token-scoped operations (`connect`, `disconnect`, `getStatus`, `getQr`, ...) — no separate client needed:

```ts
const instance = await client.instance.create({ name: "my-instance", token: "secret" });
await instance.connect({ phone: "5511999999999" });
const qr = await instance.getQr();
```

## Module reference

Every module also has flat, direct-by-id methods for when you don't need to fetch an entity first.

### Call

```ts
await client.call.reject({ callId: "abc123", callCreator: "5511999999999@s.whatsapp.net" });
```

### Chat

```ts
await client.chat.archive(jid);
await client.chat.pin(jid);
await client.chat.mute(jid);
await client.chat.historySyncRequest({ count: 50 });
// unarchive, unpin, unmute also available
```

### Community

```ts
const community = await client.community.create("My Community");
await community.addParticipants(["123456789-987654321@g.us"]);
```

### Group

```ts
const group = await client.group.create({
  groupName: "Dev Team",
  participants: ["5511999999999@s.whatsapp.net"],
});

const groups = await client.group.list();
const myGroups = await client.group.myGroups();
await client.group.join("<invite-code>");
```

### Instance

```ts
const instance = await client.instance.create({ name: "my-instance", token: "secret" });
await instance.setProxy({ host: "proxy.example.com", port: "8080" });
const settings = await instance.getAdvancedSettings();
await instance.forceReconnect();
await instance.delete();

const all = await client.instance.getAll();
```

### Label

```ts
const labels = await client.label.list();
await labels[0].edit({ name: "Urgent", color: 2 });
await labels[0].addToChat(jid);
```

### Message

```ts
const message = client.message.from({ chat: jid, id: "msg-1" });
await message.markRead();
await message.edit("new text");
const status = await message.getStatus();

const media = await client.message.downloadMedia({ message: rawWebhookMessage });
```

### Send Message

Dedicated methods for **text**, **media**, **sticker**, **location**, **contact**, **link**, **button**, **carousel**, **list**, **poll**, and **status** (text/media) messages. All return a `Message` entity.

```ts
await client.sendMessage.text({ number: "5511999999999", text: "Hi!" });
await client.sendMessage.media({ number: "5511999999999", url: "https://example.com/image.jpg", type: "image" });
await client.sendMessage.statusText({ text: "Good morning!" });
```

## Error handling

Non-2xx responses throw `EvolutionGoApiError`, carrying the HTTP `status` and parsed response `body`.

```ts
import { EvolutionGoApiError } from "@solufy/evolution-go-sdk";

try {
  await client.group.getInfo("invalid-jid");
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
