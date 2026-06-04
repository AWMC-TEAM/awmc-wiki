---
apiBaseUrl: https://api.awmc.cc
---
# AWMC Gateway Public API (Billing Info)

For **users**: How to call the open APIs, and **when Tokens will be charged**. This document does not discuss internal implementation.

::: tip Platform URL
Platform URL: https://api.awmc.cc

Requires AWMC Passport login.
:::

::: warning Authentication
Business requests must include in the request header:

`Authorization: Bearer <token>`

- JWT obtained after browser login, or a **`gw_` long-term token** generated on the website (do not leak).
:::

::: tip Purchase Tokens
Buy quota: https://store.awmc.cc/item?id=98
:::

## 1. Service URL and Paths

All business paths are appended after the **gateway base URL**, prefixed with **`/v1`**.

- **GET**: Parameters go in URL Query, must be **URL encoded**.
- **POST**: Use Query or JSON Body as required by each endpoint; when sending JSON, add `Content-Type: application/json`.


## 2. Token Billing Rules

- The **"Consumption"** column below indicates: the number of Tokens deducted from the account when the request **succeeds at HTTP level** and **business logic determines success**; **0** means no charge.
- Whether business succeeds is determined by the response JSON, common examples:

| Endpoint | Billing Condition (Summary) |
|----------|---------------------------|
| `get_preview` | `UserID` is valid and not `-1` / `"-1"` |
| `upload_b50` / `upload_lx_b50` | `UploadStatus === true` |
| `get_charge` | `ChargeStatus === true` |
| `mai_ping` | Success response (e.g., `returnCode === 1`), not failure like `result: "down"` |

- When balance is insufficient, **403** is returned. You need to top up your account first.


## 3. Open API Testing

Fill in a valid token in the **Auth Settings** below, then enter parameters to test endpoints online.

### 3.1 Connectivity Test (mai_ping)

<ApiDemo 
  :options="[
    {
      title: 'Connectivity Test',
      method: 'GET',
      path: '/v1/mai_ping',
      description: 'Test gateway connectivity, no charge.',
      response: { returnCode: 1, result: 'ok' }
    }
  ]"
/>


### 3.2 User Info & Task Submission (Billed)

The following endpoints consume Tokens when business succeeds.

<ApiDemo 
  :options="[
    {
      title: 'User Info Preview',
      method: 'GET',
      path: '/v1/get_preview',
      description: 'Get user info preview, consumes 1 Token.',
      params: [
        { name: 'qr_text', type: 'string', required: 'Required', desc: 'QR code content', value: '' }
      ],
      response: { UserID: '12345', UserName: 'Player', UploadStatus: true }
    },
    {
      title: 'Diving Fish B50 Task',
      method: 'POST',
      path: '/v1/upload_b50',
      description: 'Submit Diving Fish B50 upload task, consumes 5 Tokens.',
      params: [
        { name: 'qr_text', type: 'string', required: 'Required', desc: 'QR code content', value: '' },
        { name: 'fish_token', type: 'string', required: 'Required', desc: 'Diving Fish Token', value: '' }
      ],
      response: { UploadStatus: true, task_id: 'task_xxx' }
    },
    {
      title: 'Lxns B50 Task',
      method: 'POST',
      path: '/v1/upload_lx_b50',
      description: 'Submit Lxns B50 upload task, consumes 5 Tokens.',
      params: [
        { name: 'qr_text', type: 'string', required: 'Required', desc: 'QR code content', value: '' },
        { name: 'lxns_code', type: 'string', required: 'Required', desc: '15-digit Lxns friend code', value: '' }
      ],
      response: { UploadStatus: true, task_id: 'task_xxx' }
    },
    {
      title: 'Ticket Query',
      method: 'GET',
      path: '/v1/get_charge',
      description: 'Query ticket details, consumes 1 Token.',
      params: [
        { name: 'qr_text', type: 'string', required: 'Required', desc: 'QR code content', value: '' }
      ],
      response: { ChargeStatus: true, tickets: [] }
    }
  ]"
/>


### 3.3 Task Status Query (No Charge)

After submitting upload tasks, use the following endpoints to poll progress.

<ApiDemo 
  :options="[
    {
      title: 'Diving Fish Task Status (by User)',
      method: 'GET',
      path: '/v1/get_b50_task_status',
      description: 'Query Diving Fish task status by mai_uid.',
      params: [
        { name: 'mai_uid', type: 'string', required: 'Required', desc: 'User ID', value: '' }
      ]
    },
    {
      title: 'Diving Fish Task Details (by ID)',
      method: 'GET',
      path: '/v1/get_b50_task_byid',
      description: 'Query Diving Fish task details by task_id.',
      params: [
        { name: 'task_id', type: 'string', required: 'Required', desc: 'Task ID', value: '' }
      ]
    },
    {
      title: 'Lxns Task Status (by User)',
      method: 'GET',
      path: '/v1/get_lx_b50_task_status',
      description: 'Query Lxns task status by mai_uid.',
      params: [
        { name: 'mai_uid', type: 'string', required: 'Required', desc: 'User ID', value: '' }
      ]
    },
    {
      title: 'Lxns Task Details (by ID)',
      method: 'GET',
      path: '/v1/get_lx_b50_task_byid',
      description: 'Query Lxns task details by task_id.',
      params: [
        { name: 'task_id', type: 'string', required: 'Required', desc: 'Task ID', value: '' }
      ]
    }
  ]"
/>

### 3.4 Ticket Acquisition (Billed)

Acquire function tickets (multiplier tickets). This endpoint uses **Query** parameters, and consumes **10 Tokens** on business success.

<ApiDemo 
  :options="[
    {
      title: 'Acquire Function Ticket (Multiplier)',
      method: 'POST',
      path: '/v1/get_ticket',
      description: 'Acquire function ticket (multiplier); Query params: ticket_id, qr_text, etc.; consumes 10 Tokens on success.',
      params: [
        { name: 'qr_text', type: 'string', required: 'Recommended', desc: 'QR code content', value: '' },
        { name: 'ticket_id', type: 'string', required: 'Optional', desc: 'Ticket ID (if available)', value: '' }
      ],
      response: { TicketStatus: true, ticket: {} }
    }
  ]"
/>

### 3.5 Manual Operation Endpoints (Billed / JSON Body)

The following endpoints are all **POST** with **JSON** request body. The gateway will perform approximately **60 seconds of security wait** (queue/risk control) on the business side. Please be patient after clicking "Run" in the browser.

Fill in a valid token in **Auth Settings**, enter parameters as shown in the table, then run (`level_range` should be a JSON array literal, e.g., `[0,1,2,3]`).

<ApiDemo
  :options="[
    {
      title: 'Manual Single Score Upload',
      method: 'POST',
      path: '/v1/upload_score_manual',
      paramsIn: 'json',
      description: 'Consumes 15 Tokens. Params: qr_code, musicId, levelId, achievement, combo, sync, dxScore, rank; optional: playcount, iscover, isforce, detailmode.',
      params: [
        { name: 'qr_code', type: 'string', required: 'Required', desc: 'QR code text', value: '' },
        { name: 'musicId', type: 'integer', required: 'Required', desc: 'Song ID (e.g., 11538)', value: 11538 },
        { name: 'levelId', type: 'integer', required: 'Required', desc: 'Difficulty: 0 Basic / 1 Advanced / 2 Expert / 3 Master / 4 Re:MASTER', value: 4 },
        { name: 'achievement', type: 'integer', required: 'Required', desc: 'Achievement 0-1010000 (e.g., 1005000 = 100.5000%)', value: 1005000 },
        { name: 'combo', type: 'integer', required: 'Required', desc: '0 None / 1 FC / 2 FC+ / 3 AP / 4 AP+', value: 2 },
        { name: 'sync', type: 'integer', required: 'Required', desc: '0 None / 1 FS / 2 FS+ / 3 FDX / 4 FDX+ / 5 SYNC', value: 2 },
        { name: 'dxScore', type: 'integer', required: 'Required', desc: 'DX Score', value: 1234 },
        { name: 'rank', type: 'integer', required: 'Required', desc: 'Rank level (e.g., 10:SS, 11:SS+, 12:SSS, 13:SSS+)', value: 12 },
        { name: 'playcount', type: 'integer', required: 'Optional', desc: 'Play count, default 1', value: 1 },
        { name: 'iscover', type: 'integer', required: 'Optional', desc: 'Whether to overwrite 0/1, default 0', value: 0 },
        { name: 'isforce', type: 'integer', required: 'Optional', desc: 'Whether to force update 0/1, default 0', value: 0 },
        { name: 'detailmode', type: 'integer', required: 'Optional', desc: 'Whether detail mode 0/1, default 0', value: 0 }
      ],
      response: {}
    },
    {
      title: 'Manual Batch Score Upload',
      method: 'POST',
      path: '/v1/batch_upload_score_manual',
      paramsIn: 'json',
      description: 'Consumes 20 Tokens. Params: qr_code, musicId, level_range (JSON array), combo, sync, dxScore.',
      params: [
        { name: 'qr_code', type: 'string', required: 'Required', desc: 'QR code text', value: '' },
        { name: 'musicId', type: 'integer', required: 'Required', desc: 'Song ID', value: 11538 },
        { name: 'level_range', type: 'array', required: 'Required', desc: 'Difficulty ID array JSON, e.g., [0,1,2,3]', value: '[0,1,2,3]' },
        { name: 'combo', type: 'integer', required: 'Required', desc: 'Combo status 0-4', value: 0 },
        { name: 'sync', type: 'integer', required: 'Required', desc: 'Sync status 0-5', value: 0 },
        { name: 'dxScore', type: 'integer', required: 'Required', desc: 'DX star rating 0-5', value: 5 }
      ],
      response: {}
    },
    {
      title: 'Manual Unlock Single Item',
      method: 'POST',
      path: '/v1/unlock_single_item_manual',
      paramsIn: 'json',
      description: 'Consumes 10 Tokens. Params: qr_code, item_id, item_kind; optional: item_stock.',
      params: [
        { name: 'qr_code', type: 'string', required: 'Required', desc: 'QR code text', value: '' },
        { name: 'item_id', type: 'integer', required: 'Required', desc: 'Item ID', value: 123 },
        { name: 'item_kind', type: 'integer', required: 'Required', desc: '1 Nameplate / 2 Title / 3 Avatar / 10 Partner / 11 Background / 12 Ticket, etc.', value: 2 },
        { name: 'item_stock', type: 'integer', required: 'Optional', desc: 'Quantity, default 1', value: 1 }
      ],
      response: {}
    },
    {
      title: 'Manual Unlock Single Song',
      method: 'POST',
      path: '/v1/unlock_music_manual',
      paramsIn: 'json',
      description: 'Consumes 10 Tokens. Params: qr_code, music_id; optional: item_stock, remaster.',
      params: [
        { name: 'qr_code', type: 'string', required: 'Required', desc: 'QR code text', value: '' },
        { name: 'music_id', type: 'integer', required: 'Required', desc: 'Song ID', value: 11538 },
        { name: 'item_stock', type: 'integer', required: 'Optional', desc: 'Quantity, default 1', value: 1 },
        { name: 'remaster', type: 'integer', required: 'Optional', desc: 'Re:MASTER: 0 No / 1 Yes / 2 Re:MASTER only, default 0', value: 0 }
      ],
      response: {}
    }
  ]"
/>

### 3.6 Delete Single Score (Billed / JSON Body)

Delete the score record of a specified song. This endpoint uses **JSON Body** parameters.

<ApiDemo
  :options="[
    {
      title: 'Manual Delete Single Score',
      method: 'POST',
      path: '/v1/delete_score_manual',
      paramsIn: 'json',
      description: 'Delete the score record of a specified song. Params: qr_code, musicId, levelId.',
      params: [
        { name: 'qr_code', type: 'string', required: 'Required', desc: 'QR code text', value: '' },
        { name: 'musicId', type: 'integer', required: 'Required', desc: 'Song ID', value: 11538 },
        { name: 'levelId', type: 'integer', required: 'Required', desc: 'Difficulty ID: 0 Basic / 1 Advanced / 2 Expert / 3 Master / 4 Re:Master', value: 4 }
      ],
      response: {}
    }
  ]"
/>

## 4. Public JSON Directory

```http
GET https://api.awmc.cc/api/docs
```

Returns paths, methods, **consumption**, and brief descriptions for each endpoint, convenient for script consumption.


## 5. Common Errors

| HTTP | Description |
|------|-------------|
| **401** | Token missing or invalid |
| **403** | Insufficient balance, etc. |
| **404** | Path or resource not found |
| **5xx** | Service error, retry later |


::: tip Recommendation
First call **`/v1/mai_ping`** (no charge) to confirm the URL and token, then call **billed** endpoints. For upload tasks, always save the **`task_id`** and use query endpoints to track progress.
:::
