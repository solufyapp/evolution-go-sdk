# evolution-go-sdk

Typed TS client for Evolution Go (`GET /instance/all`, extensible for more endpoints).

## Install

```bash
npm install
npm run build
```

## Usage

```ts
import { EvolutionGoClient, EvolutionGoApiError } from 'evolution-go-sdk';

const client = new EvolutionGoClient({
  baseUrl: 'https://your-instance.com',
  apiKey: process.env.EVOLUTION_GO_API_KEY!,
});

try {
  const { instances } = await client.instances.getAll();
  console.log(instances.map((i) => `${i.name} (connected: ${i.connected})`));
} catch (err) {
  if (err instanceof EvolutionGoApiError) {
    console.error(err.code, err.status, err.message);
  } else {
    throw err;
  }
}
```

## Extending

`client.request<T>(method, path, init?)` is public — add new endpoints as
methods on `EvolutionGoClient` (or just call `request` directly) without
touching the transport/error-handling logic. Add matching types to
`src/types.ts`.

## Auth

Sends the `apikey` header (global or instance-specific), per Evolution Go's
`ApiKeyAuth` security scheme.
