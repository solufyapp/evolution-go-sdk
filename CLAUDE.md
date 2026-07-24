# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

`@solufy/evolution-go-sdk` — an unofficial, typed TypeScript SDK for the Evolution GO WhatsApp API (a Go/Gin server built on whatsmeow). It covers exactly 8 swagger tags: Call, Chat, Community, Group, Instance, Label, Message, Send Message. No more, no less — don't add modules for endpoints outside this set.

Response shapes are reverse-engineered from the actual Go handler/service source (`github.com/evolution-foundation/evolution-go`), not the swagger spec, which only declares generic untyped `gin.H`.

## Commands

Node/pnpm are version-pinned (`pnpm@11.10.0`, `node>=22.18.0`) and the system default node may be too old. Prefix commands with `fnm exec --using=v24.1.0 --` if plain `pnpm` fails:

```bash
pnpm test              # vitest run — full suite
pnpm test <path>        # single file, e.g. pnpm test src/modules/group/group.test.ts
pnpm check-types        # tsc --noEmit
pnpm lint               # biome check --write .  (fixes in place)
pnpm lint:ci            # biome check .            (no fixes, use to verify)
pnpm build              # tsdown -> lib/index.{cjs,mjs,d.cts,d.mts}
```

Run `check-types`, `test`, and `lint:ci` (and `build` for anything touching exports/types) before considering a change done.

## Architecture

### Two clients, split along the server's own auth tiers

Evolution GO gates routes with two middlewares: `AuthAdmin` (global admin key, exact match) and `Auth` (any instance's own token). The SDK mirrors that as two client classes instead of one client with methods that only work for some keys:

- **`EvolutionGoClient`** (`src/client.ts`) — admin key only. Holds `instance: InstanceModule`, the `AuthAdmin`-gated instance lifecycle routes (`create`, `getAll`, `getInfo`, `delete`, `setProxy`, `deleteProxy`, `forceReconnect`, `getLogs`).
- **`InstanceClient`** (`src/modules/instance/client.ts`) — one instance's own token. Holds every messaging module (`call`, `chat`, `community`, `group`, `label`, `message`, `sendMessage`) plus session ops (`connect`, `disconnect`, `reconnect`, `logout`, `getStatus`, `getQr`, `pair`, `getAdvancedSettings`, `updateAdvancedSettings`) — everything `Auth`-gated. Constructed with just `{ id, token }` + `{ baseUrl }`.
- **`Instance`** (`src/modules/instance/entity.ts`) — extends `InstanceClient`, adds `readonly data: InstanceData`. This is what `InstanceModule.create()`/`getInfo()`/`getAll()` return. Has the same API as `InstanceClient` plus the full cached record on `.data`.

Use `InstanceClient` when you only have a token and id (from your own DB, an env var, a webhook payload) and don't need the rest of `InstanceData`. Use `Instance` when you got it from the admin client and want the cached record too.

When placing a new endpoint, check which middleware actually gates that route in the server source — don't assume from the URL shape (e.g. `/instance/:instanceId/advanced-settings` takes a path param but is `Auth`-gated, so it belongs on `Instance`, not `InstanceModule`).

### Transport

`src/api.ts`'s `APITransport` class is the only place that touches `fetch`: it builds URLs/query strings, serializes bodies, and turns non-2xx responses into `EvolutionGoApiError`. Every module and entity takes one `APITransport` instance in its constructor and calls `this.api.json<T>(...)` / `this.api.formData<T>(...)` — nothing else touches `fetch` or builds a request by hand. `EvolutionGoClient` and `Instance` each construct their own `APITransport`, permanently scoped to one key; there is no per-call key override.

### Response envelope: unwrap inline, no shared helper

Most successes are `{ message: string; data: T }` (`SuccessResponse<T>` in `src/shared.ts`) or, for pure confirmations, `{ message: string }` (`SuccessMessage`). A few endpoints (`instance.getLogs`, `label.list`, `instance.getAdvancedSettings`) return a bare array/object with no envelope.

Every module/entity method unwraps this itself, inline, at the call site — there is deliberately no generic `requestData`/`requestAction` wrapper, since every call site already knows its own path/body/response type and a shared unwrap function would add indirection without saving real duplication:

```ts
async setName(name: string) {
  const res = await this.api.json<SetGroupNameResponse>("POST", "/group/name", {
    body: { groupJid: this.data.JID, name },
  });
  return res.data;
}
```

Follow the same shape for new endpoints: `const res = await this.api.json<XResponse>(...); return res.data;`, or construct/return an entity from `res.data`. Pure actions with no payload just `await` and return nothing (`void`).

### Module + Entity pattern (per-directory, `src/modules/<name>/`)

```
<name>.ts    # Module class — flat, direct-by-id methods; constructs entities
types.ts     # request bodies, raw <X>Data shapes, SuccessResponse<T>-wrapped response aliases
entity.ts    # rich/thin entity class, when the module has one
index.ts     # barrel re-exporting the module, entity, and types
*.test.ts    # one test file per class, asserting `expect(api.json).toHaveBeenCalledWith(method, path, options)`
```

Fetching or creating a **Group**, **Label**, or **Community** returns a rich entity: `.data` holds the record and bound methods perform actions scoped to that identity (`group.leave()`, `labels[0].edit(...)`). **Chat** and **Message** have no "get by id" endpoint, so they're thin handles built locally via `.from(...)` — no network call, little or no cached data. **Call** and the flat `SendMessageModule` have no entity, except every `sendMessage.*` method returns a `Message` entity from the send result so you can act on what you just sent. **Instance** is the odd one out — it's a full client with its own `APITransport` and submodules, not a lightweight entity.

Rule: a mutating entity method (e.g. `group.setName(...)`) performs the action and returns its own response — it never silently updates the entity's cached `.data`. Only `.refresh()` does that, and only where a real GET-by-id exists (`Group`; not `Label`/`Community`; `Instance` has none either — refetching is `AuthAdmin`-gated, so only `EvolutionGoClient#instance.getInfo()` can do it, returning a fresh `Instance`).

`GroupModule.create()` is the one deliberate exception to "no extra requests": its endpoint only returns `{jid, name, owner, added, failed}`, too thin to seed a full `Group`, so it makes one extra `getInfo()` call internally to return a fully-populated entity.

### `types.JID` wire quirk

whatsmeow's `types.JID` has no custom JSON marshaling, so any Go struct field typed `types.JID` (not `string`) serializes as a raw object with capitalized field names (`{User, Server, Device, RawAgent, Integrator}`), not `"user@server"`. This affects both request bodies (`call.reject`'s `callCreator`, `group.leave`'s `groupJid`, `group.updateParticipants`'s `groupJid`) and response payloads (`GroupInfo.JID`, `OwnerJID`, etc.). `src/jid.ts` exports `parseJid(jid: string): Jid` and `jidToString(jid: Jid): string` — use them whenever wiring up a field the Go source declares as `types.JID`.

### Testing

Vitest, with `@/*` aliased to `./src` in both `tsconfig.json` and `vitest.config.ts` — keep in sync if the alias changes. Module-level tests use `makeApi()` from `src/test-utils.ts` (a mocked `APITransport`-shaped object with `json`/`formData` as `vi.fn()`) and assert the exact `(method, path, options)` tuple via `expect(api.json).toHaveBeenCalledWith(...)`, plus (for construction methods like `create`/`getInfo`/`list`) that the resolved value is `instanceof <Entity>` with the expected identity field.

Classes that own a real `APITransport` instance internally rather than just receiving one — `EvolutionGoClient`, `Instance`, `InstanceModule` — are tested by mocking `fetch` instead and asserting on the outgoing request, the same way `src/api.test.ts` covers the `APITransport` class directly.
