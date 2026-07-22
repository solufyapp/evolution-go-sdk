
<h1 align="center">@solufy/evolution-go-sdk</h1>

<p align="center">Unofficial, typed TypeScript SDK for the <a href="https://github.com/evolution-foundation/evolution-go" target="_blank">Evolution GO</a> WhatsApp API (whatsmeow-based).</p>

## Installation

```bash
npm install @solufy/evolution-go-sdk
# or
yarn add @solufy/evolution-go-sdk
# or
pnpm add @solufy/evolution-go-sdk
```

## Getting started

```ts
import { EvolutionGoClient, EvolutionGoApiError } from "@solufy/evolution-go-sdk";

const client = new EvolutionGoClient({
  baseUrl: "https://your-evolution-go-server.com",
  apiKey: process.env.EVOLUTION_GO_API_KEY!,
});

try {
  const instances = await client.instance.getAll();
  console.log(instances.map((i) => `${i.data.name} (connected: ${i.data.connected})`));
} catch (err) {
  if (err instanceof EvolutionGoApiError) {
    console.error(err.status, err.message, err.body);
  } else {
    throw err;
  }
}
```

Every method resolves directly to the data you asked for — no `{message,
data}` envelope to unwrap. The server always sends one back, but the SDK
strips it before returning.

The `apikey` header is sent on every request — either a global key or an
instance-specific token (returned by `client.instance.create`), per
Evolution GO's convention.

### Scoping a client to one instance

Every module besides Instance's own id-scoped operations (chat, group,
message, sendMessage, label, community, call) is scoped implicitly by
whichever `apikey` a request authenticates with — there's no
`instanceId` param on those endpoints at all. So "a client for one
instance" is just a new client using that instance's token, which
`forInstance` gives you:

```ts
const admin = new EvolutionGoClient({ baseUrl, apiKey: globalKey });
const instance = await admin.instance.getInfo("inst-123");

const instanceClient = admin.forInstance(instance); // or admin.forInstance(instance.data.token)
await instanceClient.chat.archive("5511999999999@s.whatsapp.net");
await instanceClient.sendMessage.text({ number: "5511999999999", text: "Hi!" });
```

An `Instance` entity can also do this itself — see Entities below.

## Modules

The client exposes one namespace per API tag:

```ts
client.call            // Call
client.chat            // Chat
client.community       // Community
client.group            // Group
client.instance         // Instance
client.label            // Label
client.message          // Message
client.sendMessage      // Send Message
```

## Entities

Fetching or creating an Instance, Group, Label, or Community returns a
rich object, not just data — it carries both the underlying data (in
`.data`) and bound methods for the actions that scope to that identity:

```ts
const instance = await client.instance.create({
  name: "my-instance",
  token: "some-secret-token",
});
await instance.setProxy({ host: "proxy.example.com", port: "8080" });
await instance.getAdvancedSettings();
await instance.delete();

// connect/disconnect/reconnect/logout/getStatus/getQr/pair have no
// instanceId param on the server — they're authenticated by whichever
// apikey the request carries. The entity sends its own token
// (instance.data.token), so these correctly act on this instance
// regardless of which key the client itself was built with:
await instance.connect({ phone: "5511999999999" });
const qr = await instance.getQr();
const status = await instance.getStatus();
await instance.disconnect();

const group = await client.group.getInfo("123456789-987654321@g.us");
await group.setName("New name");
await group.updateSettings("locked");
await group.leave();
await group.refresh(); // re-fetch to pick up changes made elsewhere
```

Mutating an entity method (e.g. `group.setName(...)`) performs the action
and returns its own response — it does **not** silently update the
entity's cached `.data`. Call `.refresh()` when you want that (available
on `Instance` and `Group`; `Label` and `Community` have no single-item
GET endpoint to refresh from).

Chat and Message have no "get by id" endpoint on the server, so they get
a thin variant: a handle with bound methods and no cached data, built
locally via `.from(...)` (no network call):

```ts
const chat = client.chat.from("5511999999999@s.whatsapp.net");
await chat.archive();
await chat.pin();

const message = client.message.from({ chat: "5511999999999@s.whatsapp.net", id: "msg-1" });
await message.react("👍");
await message.markRead();
```

`sendMessage.*` methods return a `Message` entity built from the send
result, so you can act on what you just sent immediately:

```ts
const sent = await client.sendMessage.text({ number: "5511999999999", text: "Hi!" });
await sent.react("👍");
console.log(sent.chat, sent.id, sent.data); // raw send result on .data
```

### Module reference (flat methods)

Every module also exposes flat, direct-by-id methods for actions the
entity pattern doesn't cover, or when you don't need to fetch first
(e.g. `client.instance.delete(id)` without a prior `getInfo`).

### Call

```ts
await client.call.reject({ callId: "abc123", callCreator: "5511999999999@s.whatsapp.net" });
```

### Chat

```ts
await client.chat.archive("5511999999999@s.whatsapp.net");
await client.chat.pin("5511999999999@s.whatsapp.net");
await client.chat.mute("5511999999999@s.whatsapp.net");
await client.chat.historySyncRequest({ count: 50 });
```

`unarchive`, `unpin`, and `unmute` are also available, all taking a chat
JID string. Use `client.chat.from(jid)` for a bound handle instead (see
Entities above).

### Community

```ts
const community = await client.community.create("My Community");
await community.addParticipants(["123456789-987654321@g.us"]);
await community.removeParticipants(["123456789-987654321@g.us"]);
```

### Group

```ts
const group = await client.group.create({
  groupName: "Dev Team",
  participants: ["5511999999999@s.whatsapp.net"],
});

await group.setName("New name");
await group.setDescription("...");
await group.setPhoto("<base64>");
await group.updateParticipants(["5511999999999@s.whatsapp.net"], "promote"); // add | remove | promote | demote
await group.updateSettings("locked");
const link = await group.getInviteLink();
await group.leave();

const groups = await client.group.list();
const myGroups = await client.group.myGroups();

await client.group.join("<invite-code>");
```

### Instance

```ts
const instance = await client.instance.create({
  name: "my-instance",
  token: "some-secret-token",
});

await instance.setProxy({ host: "proxy.example.com", port: "8080" });
await instance.deleteProxy();
const settings = await instance.getAdvancedSettings();
await instance.updateAdvancedSettings({ rejectCall: true });
const logs = await instance.getLogs({ level: "error", limit: 50 });
await instance.forceReconnect();
await instance.delete();

// Token-scoped operations — also callable directly on the module using
// the client's own apiKey instead of a specific instance's token:
await client.instance.connect({ phone: "5511999999999" });
await client.instance.pair({ phone: "5511999999999" });
const qr = await client.instance.getQr();
const status = await client.instance.getStatus();
await client.instance.disconnect();
await client.instance.reconnect();
await client.instance.logout();

const all = await client.instance.getAll();
```

### Label

```ts
const labels = await client.label.list();
await labels[0].edit({ name: "Urgent", color: 2 });
await labels[0].addToChat("5511999999999@s.whatsapp.net");
await labels[0].addToMessage("5511999999999@s.whatsapp.net", "msg-1");
```

### Message

```ts
const message = client.message.from({ chat: "5511999999999@s.whatsapp.net", id: "msg-1" });
await message.react("👍");
await message.markRead();
await message.edit("new text");
await message.delete();
const status = await message.getStatus();

const media = await client.message.downloadMedia({ message: rawWebhookMessage });
```

### Send Message

There are dedicated methods for **text**, **media**, **sticker**, **location**,
**contact**, **link**, **button**, **carousel**, **list**, **poll**, and
**status** (text and media) messages. Every one returns a `Message`
entity (see Entities above).

```ts
const sent = await client.sendMessage.text({
  number: "5511999999999",
  text: "Hi!",
  delay: 1000,
});

await client.sendMessage.media({
  number: "5511999999999",
  url: "https://example.com/image.jpg",
  type: "image",
  caption: "Check this out",
});

await client.sendMessage.button({
  number: "5511999999999",
  title: "Special offer",
  description: "Check the conditions below",
  footer: "Evolution GO",
  buttons: [{ type: "reply", displayText: "Yes", id: "yes" }],
});

// Status updates (status@broadcast)
await client.sendMessage.statusText({ text: "Good morning!" });
await client.sendMessage.statusMedia({ type: "image", url: "https://example.com/img.jpg" });
```

## Error handling

Non-2xx responses throw `EvolutionGoApiError`, carrying the HTTP `status`
and the parsed response `body`:

```ts
import { EvolutionGoApiError } from "@solufy/evolution-go-sdk";

try {
  await client.group.getInfo("invalid-jid");
} catch (err) {
  if (err instanceof EvolutionGoApiError) {
    console.error(err.status, err.message);
  }
}
```

## Response types

Every method resolves to a typed value reconstructed from Evolution GO's
actual Go handlers (the swagger spec only declares a generic, untyped
`gin.H` for success responses). The server wraps most successes as
`{ message: string; data: T }`; the SDK unwraps that envelope so you get
`T` directly, and pure confirmation actions (no payload beyond
`message`) resolve to `void`. A few endpoints return a bare array or
object with no envelope at all on the wire (`instance.getLogs`,
`label.list`, `instance.getAdvancedSettings`) — those are unaffected.
See each module's exported response types (e.g. `GetGroupInfoResponse`,
`SendMessageResponse`) for the exact shape of `T`.

whatsmeow's `types.JID` has no custom JSON marshaling, so it appears in
some raw response payloads (`GroupInfo.JID`, etc.) as a `Jid` object
(`{User, Server, Device, RawAgent, Integrator}`) rather than the usual
`"user@server"` string. `jidToString`/`parseJid` (exported from the
package root) convert between the two.

## Extending

`EvolutionGoClient#request<T>(method, path, options?)` and
`#requestForm<T>(method, path, form)` are the only two transport
primitives — every module and entity method calls one of them directly
and unwraps the `{message, data}` envelope itself (`const res = await
this.#request<XResponse>(...); return res.data;`). To add an endpoint,
add a method to the relevant module or entity class (or a new module
under `src/modules/`) the same way, rather than calling the transport
directly from application code.

`options.apiKey` on `request`/`requestForm` overrides the client's own
apikey for a single call — this is how `Instance`'s token-scoped methods
(connect, getStatus, ...) authenticate as that specific instance.

## API documentation

See the Evolution GO server's own Swagger UI (`/swagger/index.html` on
your deployment) for the full API surface. This SDK covers the **Call**,
**Chat**, **Community**, **Group**, **Instance**, **Label**, **Message**,
and **Send Message** modules.

## Contributing

Feel free to contribute with suggestions or bug reports at the
[GitHub repository](https://github.com/solufyapp/evolution-go-sdk).

## Authors

- [@joaotonaco](https://github.com/joaotonaco)
