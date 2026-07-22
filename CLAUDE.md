# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

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
  const res = await this.#request<SetGroupNameResponse>("POST", "/group/name", {
    body: { groupJid: this.data.JID, name },
  });
  return res.data;
}
```

This was an explicit, corrected decision (a wrapper layer was tried and rejected) — every call site already knows its own path/body/response type, so a shared unwrap function added indirection without saving real duplication. Keep new endpoints consistent with this: `const res = await this.#request<XResponse>(...); return res.data;`, or construct/return an entity from `res.data`. Pure actions with no payload just `await` and return nothing (`void`).

### Transport

`src/transport.ts` defines only the two primitives every module is built on: `RequestFn` (`request<T>(method, path, options?)`) and `RequestFormFn` (`requestForm<T>(method, path, form, apiKey?)`). Both are implemented once on `EvolutionGoClient` (`src/client.ts`) and passed down to every module's constructor — modules never touch `fetch` directly. `RequestOptions.apiKey` overrides the client's own `apikey` header for a single call; this is how per-instance-token operations authenticate without needing a whole separate client (see `Instance` entity below).

### Module + Entity pattern (per-directory, `src/modules/<name>/`)

```
<name>.ts        # Module class — flat, direct-by-id methods; constructs entities
types.ts          # request bodies, raw <X>Data shapes, SuccessResponse<T>-wrapped response aliases
entity.ts          # rich/thin entity class, when the module has one
index.ts           # barrel re-exporting the module, entity, and types
*.test.ts           # one test file per class, asserting `expect(request).toHaveBeenCalledWith(method, path, options)`
```

Fetching or creating an **Instance**, **Group**, **Label**, or **Community** returns a rich entity, not raw data — `.data` holds the underlying record and bound methods perform the actions scoped to that identity (`instance.setProxy(...)`, `group.leave()`). **Chat** and **Message** have no "get by id" endpoint, so they're thin handles built locally via `.from(...)` with no network call and little/no cached data. **Call** and the flat `SendMessageModule` have no entity, except every `sendMessage.*` method constructs and returns a `Message` entity from the send result so you can act on what you just sent.

Rule: mutating an entity method (e.g. `group.setName(...)`) performs the action and returns its own response — it never silently updates the entity's cached `.data`. Only `.refresh()` does that (available on `Instance` and `Group`, which have a real GET-by-id; not on `Label`/`Community`, which don't).

`GroupModule.create()` is the one deliberate exception to "no extra requests": the create endpoint only returns `{jid, name, owner, added, failed}`, too thin to seed a full `Group`, so it makes one extra `getInfo()` call internally to return a fully-populated entity.

### `types.JID` wire quirk

whatsmeow's `types.JID` has no custom JSON marshaling, so any Go struct field typed `types.JID` (not `string`) serializes/deserializes as a raw object with capitalized field names (`{User, Server, Device, RawAgent, Integrator}`), not the usual `"user@server"` string. This affects both request bodies (`call.reject`'s `callCreator`, `group.leave`'s `groupJid`) and response payloads (`GroupInfo.JID`, `OwnerJID`, etc.). `src/jid.ts` exports `parseJid(jid: string): Jid` and `jidToString(jid: Jid): string` for converting between the ergonomic string form and this raw wire shape — use them whenever wiring up a field the Go source declares as `types.JID`, not `string`.

### `EvolutionGoClient#forInstance`

Every module besides Instance's own id-scoped operations (chat, group, message, sendMessage, label, community, call) has no `instanceId` param at all — they're scoped implicitly by whichever `apikey` a request authenticates with. So "a client for one instance" is just a new `EvolutionGoClient` using that instance's own token, which `client.forInstance(tokenOrInstance)` returns (sharing `baseUrl`/`fetch` with the parent).

### Testing

Vitest, with `@/*` aliased to `./src` in both `tsconfig.json` (`paths`) and `vitest.config.ts` (`resolve.alias`) — keep these in sync if the alias ever changes. Tests mock the injected `RequestFn`/`RequestFormFn` and assert the exact `(method, path, options)` tuple each call produces, plus (for construction methods like `create`/`getInfo`/`list`) that the resolved value is `instanceof <Entity>` with the expected identity field.
