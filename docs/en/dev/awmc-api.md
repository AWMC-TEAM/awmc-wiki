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

- Upstream is **AWMC API v2**; **public paths stay as close as possible to the old ones** (e.g. still `/v1/user/data`).
- **POST** with **plain JSON** (`Content-Type: application/json`). zlib/Base64 is handled by the gateway.
- Responses include:
  - Upstream: `returnCode`, `returnMessage` (and `businessData` when applicable)
  - Compatibility: **`code === 0`** on business success; `msg` often JSON-parseable

**Success (billing)**

| Endpoint | Upstream success |
|----------|------------------|
| `GET /v1/health` | `returnCode === 0` (ping) |
| Other business | `returnCode === 1` |

Prefer `returnCode` in new clients; legacy clients may use `code === 0`.

## 2. Token pricing

Charged on **HTTP 2xx** and upstream business success. Suggest **180s** client timeout.

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

| Method | Path | Cost | Notes |
|--------|------|------|-------|
| POST | `/v1/user/preview` | 1 | Preview |
| POST | `/v1/user/item-list` | 2 | Items |
| POST | `/v1/user/kaleidx-scope` | 2 | Read Gate state |
| POST | `/v1/music/upsert` | 15 | Upsert 1–4 scores |
| POST | `/v1/music/delete` | 10 | Delete 1–4 scores |
| POST | `/v1/item/upsert` | 20 | Item write (**high risk**) |
| POST | `/v1/ticket/clear` | 5 | Clear Charges |
| POST | `/v1/kaleidx-scope/upsert` | 30 | Gate edit (**high risk**) |
| POST | `/v1/user/upsert-all` | 25 | Combined write (**high risk**) |

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
      description: 'Free connectivity check. returnCode=0 on success; also code=0.',
      response: { returnCode: 0, returnMessage: 'pong', code: 0, msg: 'pong' }
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
> **Write/overwrite** → `POST /v1/music/upsert`; **delete** → `POST /v1/music/delete`.

#### What one request does

- Body: `qrcode` + `musicList` (array length **1–4**).
- Each item is uniquely identified by **`(musicId, level)`**.
- Costs **15 Tokens**; success when upstream `returnCode === 1`.

#### `level`

| Value | Difficulty |
|---:|------|
| 0 | BASIC |
| 1 | ADVANCED |
| 2 | EXPERT |
| 3 | MASTER |
| 4 | Re:MASTER |
| 10 | UTAGE |

#### Exact vs fuzzy (`fuzzy`) — easy to get wrong

| Mode | `fuzzy` | `achievement` | Meaning of `dxScore` |
|------|---------|---------------|----------------------|
| **Exact** | `false` | Target rate, e.g. `100.9444` | **Actual DX score** (e.g. `2947`) |
| **Fuzzy** | `true` | **Minimum** desired rate | **DX star 0–5** (not the raw DX score!) |

Fuzzy stars: `0` none · `1` ≥85% · `2` ≥90% · `3` ≥93% · `4` ≥95% · `5` ≥97% of chart max DX.

#### Minimal exact example

```json
{
  "qrcode": "SGWCMAID...",
  "musicList": [
    {
      "musicId": 11479,
      "level": 3,
      "achievement": 100.5,
      "dxScore": 2100,
      "comboStatus": "ap",
      "syncStatus": "fsd",
      "fuzzy": false
    }
  ]
}
```

More detail: [API Reference / Swagger](/en/dev/api-docs) → **Score → `/v1/music/upsert`**.

<ApiDemo 
  :options="[
    {
      title: 'Upsert scores (exact)',
      method: 'POST',
      path: '/v1/music/upsert',
      paramsIn: 'json',
      description: 'Costs 15 Tokens. fuzzy=false: dxScore is the real DX score. 1–4 items.',
      params: [
        { name: 'qrcode', type: 'string', required: 'Required', desc: 'QR', value: '' },
        { name: 'musicList', type: 'array', required: 'Required', desc: 'Scores', value: [{ musicId: 11479, level: 3, achievement: 100.5, dxScore: 2100, comboStatus: 'ap', syncStatus: 'fsd', fuzzy: false }] }
      ],
      response: { returnCode: 1, code: 0 }
    },
    {
      title: 'Upsert scores (fuzzy stars)',
      method: 'POST',
      path: '/v1/music/upsert',
      paramsIn: 'json',
      description: 'fuzzy=true: dxScore is star 0–5, not the raw DX score.',
      params: [
        { name: 'qrcode', type: 'string', required: 'Required', desc: 'QR', value: '' },
        { name: 'musicList', type: 'array', required: 'Required', desc: 'Scores', value: [{ musicId: 11176, level: 2, achievement: 100.0, dxScore: 3, comboStatus: 'fcp', syncStatus: 'fsp', fuzzy: true }] }
      ],
      response: { returnCode: 1, code: 0 }
    },
    {
      title: 'Delete scores',
      method: 'POST',
      path: '/v1/music/delete',
      paramsIn: 'json',
      description: 'Costs 10 Tokens. Each item: musicId + level only.',
      params: [
        { name: 'qrcode', type: 'string', required: 'Required', desc: 'QR', value: '' },
        { name: 'musicList', type: 'array', required: 'Required', desc: 'To delete', value: [{ musicId: 799, level: 4 }] }
      ],
      response: { returnCode: 1, code: 0 }
    }
  ]"
/>

### 3.5 High-risk writes

<ApiDemo 
  :options="[
    {
      title: 'Gate edit (high risk)',
      method: 'POST',
      path: '/v1/kaleidx-scope/upsert',
      paramsIn: 'json',
      description: 'Costs 30 Tokens. HIGH RISK: may irreversibly damage the account.',
      params: [
        { name: 'qrcode', type: 'string', required: 'Required', desc: 'QR', value: '' },
        { name: 'gateId', type: 'integer', required: 'Required', desc: 'Gate ID', value: 7 },
        { name: 'isKeyFound', type: 'boolean', required: 'Optional', desc: 'At least one status field', value: true }
      ],
      response: { returnCode: 1, code: 0 }
    },
    {
      title: 'Item upsert (risky kinds)',
      method: 'POST',
      path: '/v1/item/upsert',
      paramsIn: 'json',
      description: 'Costs 20 Tokens. HIGH RISK for itemKind 4/8.',
      params: [
        { name: 'qrcode', type: 'string', required: 'Required', desc: 'QR', value: '' },
        { name: 'itemKind', type: 'integer', required: 'Required', desc: 'Avoid unverified 4/8', value: 2 },
        { name: 'itemId', type: 'integer', required: 'Required', desc: 'Target ID', value: 11 },
        { name: 'operation', type: 'string', required: 'Required', desc: 'add or del', value: 'add' }
      ],
      response: { returnCode: 1, code: 0 }
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
| **4001** etc. | Upstream business errors (see `returnMessage`) |
| **500 / 502** | Forwarding or decode failure |

::: tip Tips
Start with **`/v1/health`**. Buy tickets with **`/v1/charge`**; do not rely on **`/v1/charge/queue`**. Never log QR codes or third-party tokens.
:::
