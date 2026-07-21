
<h1 align="center">@solufy/evolution-sdk</h1>

<p align="center">Unofficial SDK for the <a href="https://doc.evolution-api.com/v2" target="_blank">Evolution Whatsapp API</a> (v2).</p>

<div align="center">
  <div style="width: fit-content; display: flex; align-items: flex-start; gap: 4px;">
    <img alt="NPM License" src="https://img.shields.io/npm/l/@solufy/evolution-sdk">
    <img alt="NPM Downloads" src="https://img.shields.io/npm/dw/@solufy/evolution-sdk">
    <a href="https://npmjs.com/package/@solufy/evolution-sdk">
      <img alt="NPM Version" src="https://img.shields.io/npm/v/@solufy/evolution-sdk">
    </a>
  </div>
</div>

## Installation

```bash
npm install @solufy/evolution-sdk
// or
yarn add @solufy/evolution-sdk
// or
pnpm add @solufy/evolution-sdk
```

## Getting Started

```ts
import { EvolutionClient } from "@solufy/evolution-sdk"
// const { EvolutionClient } = require("@solufy/evolution-sdk")

const client = new EvolutionClient({
  serverUrl: "Your server url",
  instance: "Your instance",
  token: "Global api key or instance token"
})
```

## Features

- **Check numbers**

  ```ts
  client.chats.check("551199999999", "552299999999")
  ```

- **Find chats and groups**

  ```ts
  client.chats.findAll()

  client.groups.findAll()
  client.groups.findByJid("999999999999999999@g.us")
  client.groups.findByInviteCode("0000000000000000000000")
  ```

- **Send messages**

  There are available these types of messages: **audio**, **contact**, **document**, **image**, **location**, **poll**, **sticker**, **text**, **video** and **voice**.

  ```ts
  client.messages.sendText({
    number: "+551199999999",
    text: "Hi!",
    delay: 1000,
  })
  ```

## API Documentation

Check the [official API documentation](https://doc.evolution-api.com/v2) for more information about their service.

## Contributing

Feel free to contribute with suggestions or bug reports at our [GitHub repository](https://github.com/solufyapp/evolution-sdk).

## Authors

- [@joaotonaco](https://github.com/joaotonaco)