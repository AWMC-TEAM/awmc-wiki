---
apiBaseUrl: https://api.awmc.cc
---
# AWMC Gateway Public API (Billing Info)

For **end users**: how to call the public APIs and **when Tokens are charged**. This page does not cover internals.

::: tip Platform
Platform: https://api.awmc.cc

Sign in with your **AWMC passport (forum account)**, then create a `gw_` token in the dashboard (or use the login JWT).
:::

::: warning Authentication
Send on every business request:

`Authorization: Bearer <token>`

- Browser JWT after login, or a long-lived **`gw_`** token from the dashboard (keep it secret).
:::

::: tip Buy Tokens
Top up via **card-code redeem**. Cards are sold at: https://store.awmc.cc/item?id=98  
Redeem in the dashboard, or `POST /redeem` with a login token.
:::

::: info keychip
`keychip` is injected by the gateway. Callers **must not** send it. Only pass business fields such as `qrcode`.
:::

## 1. Base URL and Paths

All business paths are under the gateway root with prefix **`/v1`**.

- **GET**: usually no body (health, charge queue).
- **POST**: **JSON body** with `Content-Type: application/json`.
- Upstream responses are often `{ "code": 0, "msg": "..." }`. Some `msg` values are **JSON strings** and need a second `JSON.parse`.

## 2. Token Billing

- **"Cost"** below is charged when the response is **HTTP 2xx** and business succeeds (typically **`code === 0`**). **0** means free.
- Insufficient balance → **403** `Insufficient balance`.

| Method | Path | Cost | Notes |
|--------|------|------|--------|
| GET | `/v1/health` | 0 | Upstream health check |
| POST | `/v1/user/data` | 1 | Detailed user data |
| POST | `/v1/user/region` | 1 | Region / rank |
| POST | `/v1/user/music` | 2 | All chart scores (large) |
| POST | `/v1/user/charge` | 1 | Ticket / charge query (read-only) |
| GET | `/v1/charge/queue` | 0 | Your filtered charge queue |
| POST | `/v1/charge` | 10 | Enqueue charge task |
| POST | `/v1/update-lx` | 5 | Upload scores to Lxns |
| POST | `/v1/update-fish` | 5 | Upload scores to DivingFish |

### Charge binding & queue

1. `POST /v1/charge` requires `qrcode` and `charge`.
2. After a successful enqueue, the gateway calls `user/data` with the same `qrcode` (**free**) to resolve `userId` and bind it to your gateway account.
3. `GET /v1/charge/queue` returns **only** tasks for your bound `userId`, with `qrToken` removed.

## 3. Interactive Demos

Set a valid token under **Auth**, then run the demos below.

### 3.1 Health (free)

<ApiDemo 
  :options="[
    {
      title: 'Health check',
      method: 'GET',
      path: '/v1/health',
      description: 'Probe upstream availability. No charge.',
      response: { code: 0 }
    }
  ]"
/>

### 3.2 User queries (billed / JSON body)

All **POST** with body field **`qrcode`**.

<ApiDemo 
  :options="[
    {
      title: 'User detailed data',
      method: 'POST',
      path: '/v1/user/data',
      paramsIn: 'json',
      description: 'Costs 1 Token. msg is often a JSON string (parse twice); includes userId, userData, etc.',
      params: [
        { name: 'qrcode', type: 'string', required: 'Required', desc: 'QR text (SGWCMAID... or official URL)', value: '' }
      ],
      response: { code: 0, msg: '{\"userId\": 13699208, \"userData\": {}}' }
    },
    {
      title: 'Region / rank',
      method: 'POST',
      path: '/v1/user/region',
      paramsIn: 'json',
      description: 'Costs 1 Token. msg may need a second parse.',
      params: [
        { name: 'qrcode', type: 'string', required: 'Required', desc: 'QR text', value: '' }
      ],
      response: { code: 0, msg: '{}' }
    },
    {
      title: 'All chart scores',
      method: 'POST',
      path: '/v1/user/music',
      paramsIn: 'json',
      description: 'Costs 2 Tokens. Large payload; msg may need a second parse.',
      params: [
        { name: 'qrcode', type: 'string', required: 'Required', desc: 'QR text', value: '' }
      ],
      response: { code: 0, msg: '[]' }
    },
    {
      title: 'Ticket / charge query',
      method: 'POST',
      path: '/v1/user/charge',
      paramsIn: 'json',
      description: 'Costs 1 Token. Read-only ticket / charge info.',
      params: [
        { name: 'qrcode', type: 'string', required: 'Required', desc: 'QR text', value: '' }
      ],
      response: { code: 0 }
    }
  ]"
/>

### 3.3 Charge enqueue & queue

<ApiDemo 
  :options="[
    {
      title: 'Enqueue charge',
      method: 'POST',
      path: '/v1/charge',
      paramsIn: 'json',
      description: 'Costs 10 Tokens. Enqueues a charge job and binds mai userId. Do not send unless intended.',
      params: [
        { name: 'qrcode', type: 'string', required: 'Required', desc: 'QR text', value: '' },
        { name: 'charge', type: 'integer', required: 'Required', desc: 'Charge amount / tier per upstream', value: 5 }
      ],
      response: { code: 0, boundMaiUserId: '13699208' }
    },
    {
      title: 'Charge queue',
      method: 'GET',
      path: '/v1/charge/queue',
      description: 'Free. Only tasks for your bound userId; qrToken stripped. Empty if you never charged.',
      response: { code: 0, tasks: [], workers: 1 }
    }
  ]"
/>

### 3.4 Score upload (billed / JSON body)

<ApiDemo 
  :options="[
    {
      title: 'Upload to Lxns',
      method: 'POST',
      path: '/v1/update-lx',
      paramsIn: 'json',
      description: 'Costs 5 Tokens. Do not send unless intended.',
      params: [
        { name: 'qrcode', type: 'string', required: 'Required', desc: 'QR text', value: '' },
        { name: 'key', type: 'string', required: 'Required', desc: 'Lxns key / friend code per upstream', value: '' },
        { name: 'type', type: 'string', required: 'Required', desc: 'Type, e.g. maimai', value: 'maimai' }
      ],
      response: { code: 0 }
    },
    {
      title: 'Upload to DivingFish',
      method: 'POST',
      path: '/v1/update-fish',
      paramsIn: 'json',
      description: 'Costs 5 Tokens. Do not send unless intended.',
      params: [
        { name: 'qrcode', type: 'string', required: 'Required', desc: 'QR text', value: '' },
        { name: 'token', type: 'string', required: 'Required', desc: 'DivingFish Import-Token', value: '' }
      ],
      response: { code: 0 }
    }
  ]"
/>

## 4. Public JSON Catalog

```http
GET https://api.awmc.cc/api/docs
```

Returns path, method, **cost**, and short descriptions for scripting.

## 5. Common Errors

| HTTP | Meaning |
|------|---------|
| **401** | Missing or invalid token |
| **403** | Insufficient balance, etc. |
| **404** | Unknown path |
| **500** | Forwarding / misconfiguration; see `msg` |
| **5xx** | Retry later |

::: tip Tips
Start with **`/v1/health`** (free). Use **`/v1/charge`** then **`/v1/charge/queue`** to track top-ups.  
Legacy paths such as `/v1/get_preview` and `/v1/upload_b50` are **removed**—use the table above.
:::
