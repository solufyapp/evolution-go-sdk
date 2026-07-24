# AGENTS.md

This file provides guidance to Codex (Codex.ai/code) when working with code in this repository.

## What this is

`@solufy/evolution-go-sdk` — an unofficial, typed TypeScript SDK for the Evolution GO WhatsApp API (a Go/Gin server built on whatsmeow). It covers exactly 8 swagger tags: Call, Chat, Community, Group, Instance, Label, Message, Send Message. No more, no less — don't add modules for endpoints outside this set.

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

Run `check-types`, `test`, and `lint:ci` (and `build` for anything touching exports/types) before considering a change done — this is the bar every prior change in this repo has been held to.

## Architecture

### Response envelope: unwrap inline, no shared helper

The swagger spec only declares success responses as generic untyped `gin.H` — the *real* shapes were reverse-engineered from the actual Go handler/service source (`github.com/evolution-foundation/evolution-go`), not the spec. On the wire, most successes are `{ message: string; data: T }` (`SuccessResponse<T>` in `src/shared.ts`) or, for pure confirmations, just `{ message: string }` (`SuccessMessage`). A few endpoints (`instance.getLogs`, `label.list`, `instance.getAdvancedSettings`) return a bare array/object with no envelope at all.

**Every module/entity method unwraps this itself, inline, at the call site** — there is deliberately no generic `requestData`/`requestAction` wrapper:

```ts
async setName(name: string) {
  const res = await this.api.json<SetGroupNameResponse>("POST", "/group/name", {
    body: { groupJid: this.data.JID, name },
  });
  return res.data;
}
```

This was an explicit, corrected decision (a wrapper layer was tried and rejected) — every call site already knows its own path/body/response type, so a shared unwrap function added indirection without saving real duplication. Keep new endpoints consistent with this: `const res = await this.api.json<XResponse>(...); return res.data;`, or construct/return an entity from `res.data`. Pure actions with no payload just `await` and return nothing (`void`).

### Transport

`src/api.ts`'s `API` class is the one place that touches `fetch`, builds URLs/query strings, serializes bodies, and turns non-2xx responses into `EvolutionGoApiError`. Its `json<T>(method, path, options?)` and `formData<T>(method, path, form)` methods are what every module constructor takes an `API` instance to call — modules never touch `fetch` or a client class directly. Both `EvolutionGoClient` and `Instance` construct their own `new API(config)`, each with their own apikey (see below) — there is no per-call apikey override (there used to be one, before the two-client split; it's gone because each client's `API` instance is now permanently scoped to one key). `EvolutionGoClient` exposes its instance as `client.transport`.

### Two clients, split along the server's own auth tiers

Evolution GO's `AuthAdmin` middleware (global admin key, exact match) and `Auth` middleware (any instance's own token, resolved via `GetInstanceByToken`) gate genuinely different sets of routes — confirmed by reading `pkg/routes/routes.go` and `pkg/middleware/auth_middleware.go` in the server source. The SDK mirrors that split as two client classes instead of one client with a mix of methods that only work for some keys:

- **`EvolutionGoClient`** (`src/client.ts`) — admin key only. Holds just `instance: InstanceModule`, whose methods (`create`, `getAll`, `getInfo`, `delete`, `setProxy`, `deleteProxy`, `forceReconnect`, `getLogs`) are the only instance-related routes under `AuthAdmin`.
- **`Instance`** (`src/modules/instance/entity.ts`) — one specific instance's own token. Holds every messaging module (`call`, `chat`, `community`, `group`, `label`, `message`, `sendMessage`) plus the session ops (`connect`, `disconnect`, `reconnect`, `logout`, `getStatus`, `getQr`, `pair`, `getAdvancedSettings`, `updateAdvancedSettings`) — everything gated by `Auth` instead. Its constructor builds its own `new API({...config, apiKey: data.token})`; nothing on it accepts or needs an admin key.

`InstanceModule.create()`/`getInfo()`/`getAll()` construct `Instance` clients directly (passed `this.api.config`, which is `Omit<APIConfig, "apiKey">` in spirit — `Instance`'s constructor overwrites `apiKey` with the instance's own token) — that's the supported way to get one. `Instance` is also a plain exported class, so it can be constructed directly from `InstanceData` obtained elsewhere (your own DB, a webhook payload) without going through the admin client at all.

Before moving a method between the two clients, check `routes.go` for which middleware actually gates that path — don't assume from the endpoint's shape (e.g. `/instance/:instanceId/advanced-settings` takes a path param but is gated by `Auth`, not `AuthAdmin`, so it belongs on `Instance`, not `InstanceModule`).

### Module + Entity pattern (per-directory, `src/modules/<name>/`)

```
<name>.ts        # Module class — flat, direct-by-id methods; constructs entities
types.ts          # request bodies, raw <X>Data shapes, SuccessResponse<T>-wrapped response aliases
entity.ts          # rich/thin entity class, when the module has one
index.ts           # barrel re-exporting the module, entity, and types
*.test.ts           # one test file per class, asserting `expect(api.json).toHaveBeenCalledWith(method, path, options)`
```

Every module and entity class takes a single `API` instance in its constructor (`constructor(private readonly api: API) {}`, or `public readonly api: API` on entities that expose it) and calls `this.api.json<T>(...)`/`this.api.formData<T>(...)` — no module touches `fetch` directly.

Fetching or creating a **Group**, **Label**, or **Community** returns a rich entity, not raw data — `.data` holds the underlying record and bound methods perform the actions scoped to that identity (`group.leave()`, `labels[0].edit(...)`). **Chat** and **Message** have no "get by id" endpoint, so they're thin handles built locally via `.from(...)` with no network call and little/no cached data. **Call** and the flat `SendMessageModule` have no entity, except every `sendMessage.*` method constructs and returns a `Message` entity from the send result so you can act on what you just sent. **Instance** is the odd one out — see the two-clients section above; it isn't a lightweight entity anymore, it's a full client with its own `API` instance and submodules.

Rule: mutating an entity method (e.g. `group.setName(...)`) performs the action and returns its own response — it never silently updates the entity's cached `.data`. Only `.refresh()` does that (available on `Group`, which has a real GET-by-id; not on `Label`/`Community`, which don't; `Instance` has no `.refresh()` either — refetching by id is `AuthAdmin`-gated, so only `EvolutionGoClient#instance.getInfo()` can do it, returning a fresh `Instance`).

`GroupModule.create()` is the one deliberate exception to "no extra requests": the create endpoint only returns `{jid, name, owner, added, failed}`, too thin to seed a full `Group`, so it makes one extra `getInfo()` call internally to return a fully-populated entity.

### `types.JID` wire quirk

whatsmeow's `types.JID` has no custom JSON marshaling, so any Go struct field typed `types.JID` (not `string`) serializes/deserializes as a raw object with capitalized field names (`{User, Server, Device, RawAgent, Integrator}`), not the usual `"user@server"` string. This affects both request bodies (`call.reject`'s `callCreator`, `group.leave`'s `groupJid`, `group.updateParticipants`'s `groupJid`) and response payloads (`GroupInfo.JID`, `OwnerJID`, etc.). `src/jid.ts` exports `parseJid(jid: string): Jid` and `jidToString(jid: Jid): string` for converting between the ergonomic string form and this raw wire shape — use them whenever wiring up a field the Go source declares as `types.JID`, not `string`.

### Testing

Vitest, with `@/*` aliased to `./src` in both `tsconfig.json` (`paths`) and `vitest.config.ts` (`resolve.alias`) — keep these in sync if the alias ever changes. Module-level tests use `makeApi()` from `src/test-utils.ts` (a mocked `API`-shaped object with `json`/`formData` as `vi.fn()`) and assert the exact `(method, path, options)` tuple each call produces via `expect(api.json).toHaveBeenCalledWith(...)`, plus (for construction methods like `create`/`getInfo`/`list`) that the resolved value is `instanceof <Entity>` with the expected identity field.

Classes that own a real `API` instance internally rather than just receiving one — `EvolutionGoClient`, `Instance`, and `InstanceModule` (which reads `this.api.config` to construct `Instance` clients, so it needs a real `API`, not the `makeApi()` stub) — are tested by mocking `fetch` instead and asserting on the outgoing request (URL, headers, body), the same way `src/api.test.ts` covers the `API` class directly.
