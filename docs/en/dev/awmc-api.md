---
apiBaseUrl: https://api.wmc.pub
---
# AWMC Gateway Public API (Billing)

For **end users**: how to call open endpoints and **when Tokens are charged**. This page does not cover upstream wire encoding.

::: tip Platform
Platform: https://api.wmc.pub

Docs: https://wiki.awmc.team/en/dev/awmc-api

Sign in with an **AWMC passport (forum account)**, then create a `gw_` token or use the login JWT.
:::

::: warning Auth
Send:

`Authorization: Bearer <token>`

- Session JWT after browser login, or a long-lived **`gw_` token** from the console (keep secret).
:::

::: tip Buy Tokens
Top up with **card codes** from the [Afdian shop](https://afdian.com/a/AWMC_TEAM?tab=shop).  
Redeem in the console or via `POST /redeem`.
:::

::: info keychip
`keychip` is injected by the gateway. Callers must **not** send it. Provide business fields only (e.g. `qrcode`).
:::

::: danger High-risk operations (read first)
These actions **may cause irreversible, severe damage to an account**. Do not call them casually:

1. **Gate edits**: `POST /v1/kaleidx-scope/upsert` (Kaleidx Scope Gate state).
2. **Unverified collectibles**: writing **`itemKind` `4` / `8`** via `POST /v1/item/upsert` or `POST /v1/user/upsert-all`.

The gateway does **not** block these requests; you accept the risk by calling them.
:::

## 1. Base URL & path compatibility

All business paths are under **`/v1`** on the gateway.

- Upstream is **AWMC API v2 / v2-3 dual mode**; **public paths stay unchanged** (e.g. still `/v1/user/data`).
- The gateway **auto-detects** the upstream generation (~60s cache): `GET /v1/health` responds with `upstreamVersion` (`v2` or `v2-3`) and `sessionApi` (whether writes are session-based).
- **POST** with **plain JSON** (`Content-Type: application/json`). zlib/Base64 is handled by the gateway.
- Responses include:
  - Upstream: `returnCode`, `returnMessage` (and `businessData` when applicable)
  - Compatibility: **`code === 0`** on business success; `msg` often JSON-parseable

**Success (billing)**

| Endpoint | Upstream success |
|----------|------------------|
| `GET /v1/health` | `returnCode === 0` (ping) |
| Other business | `returnCode === 1` |
| Session-based writes (v2-3 upstream) | See [§2.3 billing timing](#_2-3-billing-timing-for-session-based-writes-v2-3-upstream) |

Prefer `returnCode` in new clients; legacy clients may use `code === 0`.

## 2. Token pricing

Charged on **HTTP 2xx** and upstream business success. Suggest **180s** client timeout (200s with `?sync=1`).

**Session-based write endpoints** (all `upsert` ones on a v2-3 upstream): **creation is free**; billing timing in [§2.3](#_2-3-billing-timing-for-session-based-writes-v2-3-upstream). On a legacy v2 upstream they still bill on success.

### 2.1 Legacy-compatible paths

| Method | Path | Cost | Notes |
|--------|------|------|-------|
| GET | `/v1/health` | 0 | Connectivity (ping) |
| POST | `/v1/user/data` | 2 | User data |
| POST | `/v1/user/region` | 2 | Region records |
| POST | `/v1/user/music` | 4 | All scores |
| POST | `/v1/user/charge` | 2 | Owned Charges (read-only) |
| GET | `/v1/charge/queue` | 0 | **Stub**: no real queue; empty `tasks` |
| POST | `/v1/charge` | 10 / 15 / 25 | Buy one Charge (`chargeId`/`charge` = **2 / 3 / 5** → **10 / 15 / 25** Tokens) |
| POST | `/v1/update-lx` | 5 | LXNS sync (`key`+`qrcode`; ignore legacy `type`) |
| POST | `/v1/update-fish` | 5 | Diving-Fish sync |

### 2.2 New paths

#### Basic reads/writes (v2 era)

| Method | Path | Cost | Notes |
|--------|------|------|-------|
| POST | `/v1/user/preview` | 1 | Preview |
| POST | `/v1/user/item-list` | 2 | Items |
| POST | `/v1/user/kaleidx-scope` | 2 | Read Gate state (v2 only; 410 on v2-3, use `/v1/user/item-list`) |
| POST | `/v1/music/upsert` | 15 | Upsert scores (v2: 1–4 sync; v2-3: **1–20, session-based**, see §2.3) |
| POST | `/v1/music/delete` | 10 | Delete scores (v2: 1–4; v2-3: session-based, keeps play counts) |
| POST | `/v1/item/upsert` | 20 | Item write (**high risk**; v2-3 supports **batch `itemList`**, legacy style auto-converted) |
| POST | `/v1/ticket/clear` | 5 | Clear Charges (v2-3: session-based) |
| POST | `/v1/kaleidx-scope/upsert` | 30 | Gate edit (**high risk**; v2-3 maps to `upsert-kaleidx-gate`, `gateId` limited to **1–6**) |
| POST | `/v1/user/upsert-all` | 25 | Combined write (**v2 only**; removed on v2-3 → 410, split into single endpoints) |

#### Session control (v2-3 upstream)

| Method | Path | Cost | Notes |
|--------|------|------|-------|
| POST | `/v1/upsert/continue` | 0 | Confirm an upload session. **Tolerant idempotent**: if already auto-confirmed by the gateway, returns current state without error |
| POST | `/v1/upsert/check` | 0 | Poll session status (idempotent read); `upsert_status=2` **triggers settlement** (see §2.3) |

#### Resource queries (v2-3 upstream; no account params, sync)

| Method | Path | Cost | Notes |
|--------|------|------|-------|
| POST | `/v1/user/ping` | 0 | Game connectivity check (`get-ping`, v2-3 only; useful to detect the generation) |
| POST | `/v1/select/categories` | 1 | Resource categories |
| POST | `/v1/select/resource` | 1 | Paged resources by category (`category` required; `query` / `offset` / `limit` optional) |
| POST | `/v1/select/music` | 1 | Paged songs with chart constants (`charts`, `constant`) |
| POST | `/v1/select/music-unlock-plan` | 1 | Unlock candidates (**resource candidates**, not live account gaps) |

#### Profile writes (v2-3 upstream; all session-based)

| Method | Path | Cost | Notes |
|--------|------|------|-------|
| POST | `/v1/music/upsert-fuzzy` | 15 | Fuzzy score upload (`dxStar` half-star 0–7, applies when `dxScore=0`) |
| POST | `/v1/user/play-count` | 8 | Play count (`playCount` total / `currentPlayCount` current version) |
| POST | `/v1/user/maimile` | 8 | maimile points (0–99999) |
| POST | `/v1/user/map-stock` | 8 | Map stock (0–999) |
| POST | `/v1/user/rating` | 10 | Displayed rating (does not raise the historical best) |
| POST | `/v1/user/course-rank` | 8 | Course rank (0–23, also adds clear records) |
| POST | `/v1/user/class-rank` | 8 | Class rank (0–25, keeps historical best) |
| POST | `/v1/user/chara-slot` | 8 | Character slot (0/1/5 character IDs) |
| POST | `/v1/user/character` | 8 | Character level / awakening / use count |
| POST | `/v1/user/intimate` | 8 | Partner intimacy (`partnerId` = `naviCharaId` from queries) |
| POST | `/v1/user/map-complete` | 15 | Complete maps and grant rewards (**high risk**) |
| POST | `/v1/user/map-challenge` | 15 | Advance map to first unearned challenge song; no progress rollback (**high risk**) |
| POST | `/v1/user/login-bonus` | 8 | Set login bonus to one stamp before claim |
| POST | `/v1/version/reset` | 10 | Reset account to the current game version (does not unlock songs) |

### 2.3 Billing timing for session-based writes (v2-3 upstream)

On a **v2-3** upstream every write endpoint (scores / items / tickets / profile) is a **three-step session**: create → confirm → poll. The gateway does two of them for you:

```
① Create   POST /v1/music/upsert (or other business endpoint)
           → gateway forwards and returns a session (upsert_status=0, 60s confirm window)
② Confirm  the gateway AUTO-calls upsert-continue immediately — no caller action needed
           → the response you get is already "confirmed, uploading" (upsert_status=1)
③ Poll     POST /v1/upsert/check  { "session_id": "..." }     ← caller does this
           → upsert_status: 1 processing / 2 complete / 3 error
```

**Billing rules** (different from legacy v2 "bill on success"):

- **Create and confirm stages are free**;
- Settlement happens **once** when `/v1/upsert/check` returns `upsert_status === 2` (complete), at the creating endpoint's price (idempotent per `session_id`);
- `upsert_status === 3` (upload failure) is **not billed**;
- `/v1/upsert/check` and `/v1/upsert/continue` themselves **cost 0**.

**Session response shape** (`businessData`, returned by create / confirm / poll):

```json
{
  "session_id": "32-char lowercase hex",
  "upsert_kind": "upsert-music-exact",
  "upsert_status": 1,
  "upsert_message": {
    "text": "Uploading in background",
    "phase": "uploading",
    "total_rounds": 2,
    "completed_rounds": 1,
    "estimated_remaining_seconds": 30
  }
}
```

`upsert_message.result` (on completion) contains `verified`, `uploadedMusicCount`, `skippedMusicCount`, `noOp`; on failure read `upsert_message.error`. **Session created ≠ upload complete** — always poll to a terminal state.

**`?sync=1` mode**: append `?sync=1` to any session-based write (e.g. `POST /v1/music/upsert?sync=1`) and the gateway polls on your behalf until the terminal state (default budget 180s) and **returns the final result synchronously** — same semantics as legacy v2, for simple clients that don't want to implement polling.

**410 capability missing**: when an endpoint doesn't exist on the current upstream generation, the gateway returns `410` with `UPSTREAM_CAPABILITY_MISSING` (e.g. `/v1/user/upsert-all`, `/v1/user/game-event`, `/v1/user/kaleidx-scope` on v2-3; or `/v1/select/*`, `/v1/upsert/*` on v2).

**Field whitelist**: the v2-3 upstream strictly validates request fields; extra fields return `1205`. The gateway filters per endpoint (legacy junk like `qr_text`, `type` is stripped automatically) — just send the fields listed on this page.

### Charge / queue behavior change

1. `POST /v1/charge` buys a Charge directly (not enqueue); **10 / 15 / 25** Tokens for `chargeId` **2 / 3 / 5**.
2. `GET /v1/charge/queue` remains but has **no real tasks**.
3. Use `POST /v1/user/charge` to list owned tickets.

## 3. Interactive demos

### 3.1 Health

<ApiDemo 
  :options="[
    {
      title: 'Health',
      method: 'GET',
      path: '/v1/health',
      description: 'Free connectivity check. returnCode=0 on success; also code=0. upstreamVersion reports the detected upstream generation (v2 / v2-3); sessionApi tells whether writes are session-based.',
      response: { returnCode: 0, returnMessage: 'pong', code: 0, msg: 'pong', upstreamVersion: 'v2-3', sessionApi: true }
    }
  ]"
/>

### 3.2 User reads

<ApiDemo 
  :options="[
    {
      title: 'User data',
      method: 'POST',
      path: '/v1/user/data',
      paramsIn: 'json',
      description: 'Costs 2 Tokens. returnCode=1 on success.',
      params: [
        { name: 'qrcode', type: 'string', required: 'Required', desc: 'QR text', value: '' }
      ],
      response: { returnCode: 1, code: 0, businessData: { userId: 13699208 } }
    },
    {
      title: 'Preview',
      method: 'POST',
      path: '/v1/user/preview',
      paramsIn: 'json',
      description: 'Costs 1 Token.',
      params: [
        { name: 'qrcode', type: 'string', required: 'Required', desc: 'QR text', value: '' }
      ],
      response: { returnCode: 1, code: 0 }
    },
    {
      title: 'Region',
      method: 'POST',
      path: '/v1/user/region',
      paramsIn: 'json',
      description: 'Costs 2 Tokens.',
      params: [
        { name: 'qrcode', type: 'string', required: 'Required', desc: 'QR text', value: '' }
      ],
      response: { returnCode: 1, code: 0 }
    },
    {
      title: 'All scores',
      method: 'POST',
      path: '/v1/user/music',
      paramsIn: 'json',
      description: 'Costs 4 Tokens. Large response.',
      params: [
        { name: 'qrcode', type: 'string', required: 'Required', desc: 'QR text', value: '' }
      ],
      response: { returnCode: 1, code: 0 }
    },
    {
      title: 'Owned Charges',
      method: 'POST',
      path: '/v1/user/charge',
      paramsIn: 'json',
      description: 'Costs 2 Tokens. Read-only owned tickets, not the shop catalog.',
      params: [
        { name: 'qrcode', type: 'string', required: 'Required', desc: 'QR text', value: '' }
      ],
      response: { returnCode: 1, code: 0 }
    },
    {
      title: 'Item list',
      method: 'POST',
      path: '/v1/user/item-list',
      paramsIn: 'json',
      description: 'Costs 2 Tokens.',
      params: [
        { name: 'qrcode', type: 'string', required: 'Required', desc: 'QR text', value: '' }
      ],
      response: { returnCode: 1, code: 0 }
    },
    {
      title: 'Kaleidx Gate (read)',
      method: 'POST',
      path: '/v1/user/kaleidx-scope',
      paramsIn: 'json',
      description: 'Costs 2 Tokens. Read-only.',
      params: [
        { name: 'qrcode', type: 'string', required: 'Required', desc: 'QR text', value: '' }
      ],
      response: { returnCode: 1, code: 0, businessData: { userKaleidxScopeList: [] } }
    }
  ]"
/>

### 3.3 Buy Charge & queue stub

<ApiDemo 
  :options="[
    {
      title: 'Buy Charge',
      method: 'POST',
      path: '/v1/charge',
      paramsIn: 'json',
      description: 'Costs 10 / 15 / 25 Tokens by chargeId (2 / 3 / 5). Maps to upsert-ticket; charge or chargeId. May be slow.',
      params: [
        { name: 'qrcode', type: 'string', required: 'Required', desc: 'QR text', value: '' },
        { name: 'chargeId', type: 'integer', required: 'Required', desc: 'Charge ID (alias: charge; only 2/3/5)', value: 2 }
      ],
      response: { returnCode: 1, code: 0 }
    },
    {
      title: 'Charge queue (stub)',
      method: 'GET',
      path: '/v1/charge/queue',
      description: 'Free. No real queue under v2; empty tasks.',
      response: { code: 0, returnCode: 1, tasks: [], workers: 0, msg: 'No charge queue on upstream v2' }
    }
  ]"
/>

### 3.4 Score writes (upload charts) — details

> Do **not** confuse with `POST /v1/user/music` (**read** all scores).  
> **Write/overwrite** → `POST /v1/music/upsert`; **delete** → `POST /v1/music/delete`; **fuzzy** → `POST /v1/music/upsert-fuzzy`.

#### What one request does

- Body: `qrcode` + `musicList` (array).
- `musicList` length: **1–4 on v2**; **1–20 on v2-3** (server auto-splits rounds).
- Each item is uniquely identified by **`(musicId, level)`**.
- Costs **15 Tokens**; **v2**: success when upstream `returnCode === 1` (sync). **v2-3**: session-based (see §2.3) — poll `/v1/upsert/check` afterwards, or add `?sync=1` to wait synchronously.

#### `level`

| Value | Difficulty |
|---:|------|
| 0 | BASIC |
| 1 | ADVANCED |
| 2 | EXPERT |
| 3 | MASTER |
| 4 | Re:MASTER |
| 10 | UTAGE |

#### Exact vs fuzzy — easy to get wrong

**v2 upstream** (legacy contract, `fuzzy` boolean):

| Mode | `fuzzy` | `achievement` | Meaning of `dxScore` |
|------|---------|---------------|----------------------|
| **Exact** | `false` | Target rate, e.g. `100.9444` | **Actual DX score** (e.g. `2947`) |
| **Fuzzy** | `true` | **Minimum** desired rate | **DX star 0–5** (not the raw DX score!) |

**v2-3 upstream** (new contract, split into two endpoints):

| Endpoint | Notes |
|----------|-------|
| `/v1/music/upsert` (→ `upsert-music-exact`) | Exact: `achievement` as protocol integer recommended (`100% = 1000000`; **integer 100 is NOT 100%**); `dxScore` is the raw DX score, must not exceed the chart max |
| `/v1/music/upsert-fuzzy` (→ `upsert-music-fuzzy`) | Fuzzy: `dxStar` **half-star 0–7** (applies when `dxScore=0`); percentages with fewer than 4 decimals get random 1–9 padding |

`dxStar` minimum completion: `0` none · `1` 85% · `1.5` 87.5% · `2` 90% · `2.5` 91.5% · `3` 93% · `3.5` 94% · `4` 95% · `4.5` 96% · `5` 97% · `5.5` 98% · `6` 99% · `6.5` 99.5% · `7` 100%.

::: tip Legacy client compatibility
The v2-era style of `fuzzy: true` inside `musicList` items still works on a v2-3 upstream — the gateway detects it and **reroutes to** `upsert-music-fuzzy` (stripping the flag). The flag must be consistent across the batch, otherwise 400.
:::

#### Combo / Sync enums

- Combo: `none` / `fc` / `fcp` / `ap` / `app` (strings on v2; integers 0–4 on v2-3)
- Sync: `none` / `fs` / `fsp` / `fsd` / `fsdp` / `sync` (strings on v2; integers 0–5 on v2-3)

#### Minimal example (v2-3 exact)

```json
{
  "qrcode": "SGWCMAID...",
  "musicList": [
    {
      "musicId": 11479,
      "level": 3,
      "achievement": 1009444,
      "dxScore": 2100,
      "comboStatus": 4,
      "syncStatus": 0
    }
  ]
}
```

#### Fuzzy example (v2-3, dxStar)

```json
{
  "qrcode": "SGWCMAID...",
  "musicList": [
    { "musicId": 11176, "level": 2, "achievement": 1000000, "dxScore": 0, "dxStar": 3, "comboStatus": 2, "syncStatus": 0 }
  ]
}
```

`musicId` must exist in the current version, otherwise `5004`; `dxScore` over the chart max returns `5009`.

More detail: [API Reference / Swagger](/en/dev/api-docs) → **Score → `/v1/music/upsert`**.

<ApiDemo 
  :options="[
    {
      title: 'Upsert scores (exact)',
      method: 'POST',
      path: '/v1/music/upsert',
      paramsIn: 'json',
      description: 'Costs 15 Tokens. v2: fuzzy=false, real DX score, 1–4 items, sync. v2-3: 1–20 items, session-based — returns a session (upsert_status=1); poll /v1/upsert/check or use ?sync=1.',
      params: [
        { name: 'qrcode', type: 'string', required: 'Required', desc: 'QR', value: '' },
        { name: 'musicList', type: 'array', required: 'Required', desc: 'Scores (max 20 on v2-3)', value: [{ musicId: 11479, level: 3, achievement: 1005000, dxScore: 2100, comboStatus: 4, syncStatus: 0 }] }
      ],
      response: { returnCode: 1, code: 0, autoConfirmed: true, gatewayBilling: { deferred: true, settleOn: '/v1/upsert/check' }, businessData: { session_id: 'a1b2...', upsert_status: 1 } }
    },
    {
      title: 'Upsert scores (fuzzy stars)',
      method: 'POST',
      path: '/v1/music/upsert-fuzzy',
      paramsIn: 'json',
      description: 'Costs 15 Tokens. v2-3 only: dxStar half-star 0–7 (applies when dxScore=0).',
      params: [
        { name: 'qrcode', type: 'string', required: 'Required', desc: 'QR', value: '' },
        { name: 'musicList', type: 'array', required: 'Required', desc: 'Scores with dxStar', value: [{ musicId: 11176, level: 2, achievement: 1000000, dxScore: 0, dxStar: 3, comboStatus: 2, syncStatus: 0 }] }
      ],
      response: { returnCode: 1, code: 0, businessData: { session_id: 'c3d4...', upsert_status: 1 } }
    },
    {
      title: 'Delete scores',
      method: 'POST',
      path: '/v1/music/delete',
      paramsIn: 'json',
      description: 'Costs 10 Tokens. Each item: musicId + level only; v2-3 is session-based and keeps play counts.',
      params: [
        { name: 'qrcode', type: 'string', required: 'Required', desc: 'QR', value: '' },
        { name: 'musicList', type: 'array', required: 'Required', desc: 'To delete', value: [{ musicId: 799, level: 4 }] }
      ],
      response: { returnCode: 1, code: 0 }
    }
  ]"
/>

### 3.4b Session polling (v2-3 upstream)

Use the `businessData.session_id` from a session-based write with these two endpoints:

<ApiDemo 
  :options="[
    {
      title: 'Poll session (settlement point)',
      method: 'POST',
      path: '/v1/upsert/check',
      paramsIn: 'json',
      description: 'Costs 0 Tokens. Idempotent read; settles the session when upsert_status=2 (gatewayBilling.billed=true); status=3 failure is not billed. Resumable after disconnects with session_id.',
      params: [
        { name: 'session_id', type: 'string', required: 'Required', desc: 'session_id from the create response', value: '' }
      ],
      response: { returnCode: 1, code: 0, gatewayBilling: { billed: true, cost: 15 }, businessData: { session_id: 'a1b2...', upsert_status: 2, upsert_message: { result: { verified: true, uploadedMusicCount: 1 } } } }
    },
    {
      title: 'Confirm session (tolerant)',
      method: 'POST',
      path: '/v1/upsert/continue',
      paramsIn: 'json',
      description: 'Costs 0 Tokens. Usually unnecessary — the gateway already auto-confirms on creation; repeated calls simply return the current state without error.',
      params: [
        { name: 'session_id', type: 'string', required: 'Required', desc: 'Session ID', value: '' }
      ],
      response: { returnCode: 1, code: 0, businessData: { session_id: 'a1b2...', upsert_status: 1 } }
    }
  ]"
/>

### 3.5 High-risk writes

#### Item write contract (v2-3 upstream)

v2-3 supports **batch `itemList`** (no duplicate `itemKind`/`itemId` in one batch):

```json
{
  "qrcode": "SGWCMAID...",
  "itemList": [
    { "itemKind": 5, "itemId": 10030, "stock": 1, "isValid": true }
  ]
}
```

- `itemKind`: 1 name plate / 2 title / 3 icon / 4 present / 5 music / 6 MASTER / 7 Re:MASTER / 10 partner / 11 frame
- Regular items: `stock=1, isValid=true` to own, `stock=0, isValid=false` to remove
- Presents (`itemKind=4`): `stock` is the **absolute stock** (non-negative integer); `itemId` = source type × 1000000 + resource ID
- If everything is skipped, the upstream returns `noOp=true` and uploads nothing

::: tip Legacy style compatibility
The v2-era single-item style `{ "itemKind": 2, "itemId": 11, "operation": "add" }` (`operation`: `add` / `del`) still works on a v2-3 upstream; the gateway converts it into a one-element `itemList`.
:::

<ApiDemo 
  :options="[
    {
      title: 'Gate edit (high risk)',
      method: 'POST',
      path: '/v1/kaleidx-scope/upsert',
      paramsIn: 'json',
      description: 'Costs 30 Tokens. HIGH RISK. v2-3 maps to upsert-kaleidx-gate: gateId limited to 1–6, field is gateList.',
      params: [
        { name: 'qrcode', type: 'string', required: 'Required', desc: 'QR', value: '' },
        { name: 'gateList', type: 'array', required: 'v2-3', desc: '[{gateId, isGateFound, isKeyFound}] (gateId 1–6, at least one boolean)', value: [{ gateId: 1, isGateFound: true, isKeyFound: true }] },
        { name: 'gateId', type: 'integer', required: 'v2 legacy', desc: 'Gate ID (v2 upstream)', value: 7 }
      ],
      response: { returnCode: 1, code: 0 }
    },
    {
      title: 'Item upsert (batch, risky kinds)',
      method: 'POST',
      path: '/v1/item/upsert',
      paramsIn: 'json',
      description: 'Costs 20 Tokens. HIGH RISK for itemKind 4/8. v2-3 supports batch itemList (legacy itemKind/itemId/operation auto-converted).',
      params: [
        { name: 'qrcode', type: 'string', required: 'Required', desc: 'QR', value: '' },
        { name: 'itemList', type: 'array', required: 'New', desc: '[{itemKind, itemId, stock, isValid}]', value: [{ itemKind: 2, itemId: 11, stock: 1, isValid: true }] }
      ],
      response: { returnCode: 1, code: 0, businessData: { session_id: 'e5f6...', upsert_status: 1 } }
    }
  ]"
/>

### 3.6 Third-party sync

<ApiDemo 
  :options="[
    {
      title: 'Upload to LXNS',
      method: 'POST',
      path: '/v1/update-lx',
      paramsIn: 'json',
      description: 'Costs 5 Tokens.',
      params: [
        { name: 'qrcode', type: 'string', required: 'Required', desc: 'QR', value: '' },
        { name: 'key', type: 'string', required: 'Required', desc: 'LXNS X-User-Token', value: '' }
      ],
      response: { returnCode: 1, code: 0 }
    },
    {
      title: 'Upload to DivingFish',
      method: 'POST',
      path: '/v1/update-fish',
      paramsIn: 'json',
      description: 'Costs 5 Tokens.',
      params: [
        { name: 'qrcode', type: 'string', required: 'Required', desc: 'QR', value: '' },
        { name: 'token', type: 'string', required: 'Required', desc: 'DivingFish Import-Token', value: '' }
      ],
      response: { returnCode: 1, code: 0 }
    }
  ]"
/>

### 3.7 Resource queries (v2-3 upstream)

No account params (no `qrcode`), sync responses, 1 Token each:

<ApiDemo 
  :options="[
    {
      title: 'Songs & chart constants',
      method: 'POST',
      path: '/v1/select/music',
      paramsIn: 'json',
      description: 'Costs 1 Token. Paged song query: each item has name/type/version and charts (level, constant, maxDxScore). Multiple conditions intersect.',
      params: [
        { name: 'query', type: 'string', required: 'Optional', desc: 'Song name keyword (case-insensitive)', value: 'PANDORA' },
        { name: 'level', type: 'integer', required: 'Optional', desc: 'Difficulty 0–4', value: '' },
        { name: 'offset', type: 'integer', required: 'Optional', desc: 'Default 0', value: 0 },
        { name: 'limit', type: 'integer', required: 'Optional', desc: 'Default 10, max 20', value: 10 }
      ],
      response: { returnCode: 1, code: 0, businessData: { total: 1, items: [{ id: 11479, name: 'PANDORA PARADOXXX', charts: [{ level: 3, constant: '13.9', maxDxScore: 2100 }] }] } }
    },
    {
      title: 'Resources by category',
      method: 'POST',
      path: '/v1/select/resource',
      paramsIn: 'json',
      description: 'Costs 1 Token. category comes from /v1/select/categories (partner / title / icon etc.); supports query keyword and paging.',
      params: [
        { name: 'category', type: 'string', required: 'Required', desc: 'Resource category (check /v1/select/categories first)', value: 'partner' },
        { name: 'query', type: 'string', required: 'Optional', desc: 'Name keyword', value: '' }
      ],
      response: { returnCode: 1, code: 0, businessData: { category: 'partner', total: 0, items: [] } }
    }
  ]"
/>

### 3.8 Profile writes (v2-3 upstream, session-based)

Examples: play count / rating. Other endpoints (`maimile`, `character`, `map-*`, …) are listed in [§2.2](#_2-2-new-paths); all session-based (§2.3: create → auto-confirm → poll):

<ApiDemo 
  :options="[
    {
      title: 'Set play count',
      method: 'POST',
      path: '/v1/user/play-count',
      paramsIn: 'json',
      description: 'Costs 8 Tokens. At least one of playCount (total) / currentPlayCount (current version); current must not exceed total.',
      params: [
        { name: 'qrcode', type: 'string', required: 'Required', desc: 'QR', value: '' },
        { name: 'playCount', type: 'integer', required: 'One of', desc: 'Total play count', value: 100 },
        { name: 'currentPlayCount', type: 'integer', required: 'One of', desc: 'Current version count', value: 10 }
      ],
      response: { returnCode: 1, code: 0, businessData: { session_id: 'b7c8...', upsert_status: 1 } }
    },
    {
      title: 'Set displayed rating',
      method: 'POST',
      path: '/v1/user/rating',
      paramsIn: 'json',
      description: 'Costs 10 Tokens. Displayed rating only; does not raise the historical best.',
      params: [
        { name: 'qrcode', type: 'string', required: 'Required', desc: 'QR', value: '' },
        { name: 'playerRating', type: 'integer', required: 'Required', desc: 'Target rating', value: 15000 }
      ],
      response: { returnCode: 1, code: 0, businessData: { session_id: 'b7c8...', upsert_status: 1 } }
    }
  ]"
/>

## 4. Public JSON catalog

```http
GET https://api.wmc.pub/api/docs
```

## 5. Usage & failure rate

| Method | Path | Auth | Scope |
|--------|------|------|-------|
| GET | `/me/usage` | Bearer | Personal log |
| GET | `/me/usage/stats` | Bearer | Daily stats |
| GET | `/usage/failure-rate` | None | Site-wide, 7d / 30m buckets |
| GET | `/me/usage/failure-rate` | Bearer | Personal failure rate |

`codeZero` counts business success (`returnCode` 0 for ping, 1 otherwise).

## 6. Common errors

| HTTP / returnCode | Meaning |
|------|---------|
| **401** | Missing/invalid token |
| **403** | Insufficient balance |
| **410** | Endpoint unavailable on the current upstream generation (`UPSTREAM_CAPABILITY_MISSING`, see §2.3) |
| **4001** etc. | Upstream business errors (see `returnMessage`) |
| **5004 / 5009** | Chart not found / DX score over chart max |
| **5101 / 5106** | Session missing or cleaned / not confirmed within 60s (v2-3; rare with gateway auto-confirm) |
| **500 / 502** | Forwarding or decode failure |

::: tip Tips
Start with **`/v1/health`** (check `upstreamVersion` for the generation). Buy tickets with **`/v1/charge`**; do not rely on **`/v1/charge/queue`**.  
On a v2-3 upstream: after a session-based write returns a `session_id`, **always poll** `/v1/upsert/check` until `upsert_status` is 2/3 — forgetting to poll doesn't lose the result (sessions stay queryable), but settlement only happens when a poll sees `2`. Never log QR codes or third-party tokens.
:::
