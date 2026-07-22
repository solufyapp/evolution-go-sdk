
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
  const { data: instances } = await client.instance.getAll();
  console.log(instances.map((i) => `${i.name} (connected: ${i.connected})`));
} catch (err) {
  if (err instanceof EvolutionGoApiError) {
    console.error(err.status, err.message, err.body);
  } else {
    throw err;
  }
}
```

The `apikey` header is sent on every request — either a global key or an
instance-specific token (returned by `client.instance.create`), per
Evolution GO's convention.

## Modules

The client exposes one namespace per API tag, each returning typed
responses:

```ts
client.call            // Call
client.chat            // Chat
client.community       // Community
client.group           // Group
client.instance        // Instance
client.label           // Label
client.message         // Message
client.sendMessage     // Send Message
```

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
JID string.

### Community

```ts
await client.community.create("My Community");
await client.community.addParticipants({
  communityJid: "123456789@newsletter",
  groupJid: ["123456789-987654321@g.us"],
});
await client.community.removeParticipants({ communityJid: "...", groupJid: [...] });
```

### Group

```ts
const { data: group } = await client.group.create({
  groupName: "Dev Team",
  participants: ["5511999999999@s.whatsapp.net"],
});

await client.group.setName({ groupJid: "123@g.us", name: "New name" });
await client.group.setDescription({ groupJid: "123@g.us", description: "..." });
await client.group.setPhoto({ groupJid: "123@g.us", image: "<base64>" });
await client.group.updateParticipants({
  groupJid: "123@g.us",
  participants: ["5511999999999@s.whatsapp.net"],
  action: "promote", // "add" | "remove" | "promote" | "demote"
});
await client.group.updateSettings({ groupJid: "123@g.us", action: "locked" });

const { data: info } = await client.group.getInfo("123@g.us");
const { data: link } = await client.group.getInviteLink({ groupJid: "123@g.us" });
const { data: groups } = await client.group.list();
const { data: myGroups } = await client.group.myGroups();

await client.group.join("<invite-code>");
await client.group.leave("123@g.us");
```

### Instance

```ts
const { data: instance } = await client.instance.create({
  name: "my-instance",
  token: "some-secret-token",
});

await client.instance.connect({ phone: "5511999999999" });
await client.instance.pair({ phone: "5511999999999" });
const { data } = await client.instance.getQr();

const { data: status } = await client.instance.getStatus();
const { data: all } = await client.instance.getAll();
const { data: one } = await client.instance.getInfo(instance.id);

await client.instance.setProxy(instance.id, { host: "proxy.example.com", port: "8080" });
await client.instance.deleteProxy(instance.id);

const settings = await client.instance.getAdvancedSettings(instance.id);
await client.instance.updateAdvancedSettings(instance.id, { rejectCall: true });

const logs = await client.instance.getLogs(instance.id, { level: "error", limit: 50 });

await client.instance.disconnect();
await client.instance.reconnect();
await client.instance.forceReconnect(instance.id);
await client.instance.logout();
await client.instance.delete(instance.id);
```

### Label

```ts
const labels = await client.label.list();

await client.label.edit({ labelId: "lbl-1", name: "Urgent", color: 2 });
await client.label.addToChat({ jid: "5511999999999@s.whatsapp.net", labelId: "lbl-1" });
await client.label.removeFromChat({ jid: "5511999999999@s.whatsapp.net", labelId: "lbl-1" });
await client.label.addToMessage({ jid: "...", labelId: "lbl-1", messageId: "msg-1" });
await client.label.removeFromMessage({ jid: "...", labelId: "lbl-1", messageId: "msg-1" });
```

### Message

```ts
await client.message.react({ number: "5511999999999", id: "msg-1", reaction: "👍" });
await client.message.markRead({ number: "5511999999999", id: ["msg-1"] });
await client.message.markPlayed({ number: "5511999999999", id: ["msg-1"] });
await client.message.setPresence({ number: "5511999999999", state: "composing" });
await client.message.edit({ chat: "...", messageId: "msg-1", message: "new text" });
await client.message.delete({ chat: "...", messageId: "msg-1" });

const { data } = await client.message.getStatus("msg-1");
const { data: media } = await client.message.downloadMedia({ message: rawWebhookMessage });
```

### Send Message

There are dedicated methods for **text**, **media**, **sticker**, **location**,
**contact**, **link**, **button**, **carousel**, **list**, **poll**, and
**status** (text and media) messages.

```ts
await client.sendMessage.text({
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

Every method returns a typed response reconstructed from Evolution GO's
actual Go handlers (the swagger spec only declares a generic, untyped
`gin.H` for success responses). Most endpoints follow a
`{ message: string; data: T }` envelope; a few return a bare array or
object instead (`instance.getLogs`, `label.list`,
`instance.getAdvancedSettings`) — see each module's exported response
types (e.g. `GetGroupInfoResponse`, `SendMessageResponse`) for the exact
shape.

## Extending

`EvolutionGoClient#request<T>(method, path, options?)` and
`#requestForm<T>(method, path, form)` are the only two transport
primitives — every module method is a thin, typed wrapper around one of
them. To add an endpoint, add a method to the relevant module class (or a
new module under `src/modules/`) rather than calling the transport
directly from application code.

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
