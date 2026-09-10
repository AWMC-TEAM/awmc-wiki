# AWMCNET Bot API

AWMCNET is QueryBot's score mirror and query service. This page is for Bot,
score-checker, and server developers who need to sync scores to AWMCNET.

::: tip Service address
Base URL: `https://net.wmc.pub`

The API is authenticated with a `Bot-Token`. This token belongs on the server
only and must never be shipped to user clients or written into public logs.
:::

## `POST /api/bot/sync`

Sync player profile and scores. The first sync creates a non-public temporary
player keyed by QQ; it can later be claimed by the forum account via
`QQ号@qq.com`.

### Request headers

```http
Bot-Token: <shared-secret>
Content-Type: application/json
```

### Request fields

| Field | Type | Description |
| --- | --- | --- |
| `qq` | integer | Required, QQ number, range `10000`～`999999999999` |
| `nickname` | string | Optional, player nickname |
| `source` | string | Optional, data source, e.g. `sega`, `divingfish` |
| `rating` | integer | Optional, current Rating |
| `old_rating` / `new_rating` | integer | Optional, old-version / new-version Rating |
| `play_count` | integer | Optional, play count |
| `records` | array | Score array, up to 10000 entries per request |
| `full_snapshot` | boolean | Set `true` for full snapshots; keep default `false` for incremental sync |
| `snapshot_id` | string | Identifier for a chunked snapshot, max 64 characters |
| `snapshot_final` | boolean | Set `true` on the final chunk of a chunked snapshot |

## Submitting a full snapshot in chunks

If a one-shot full snapshot is too large and times out, split it into multiple
requests:

1. Set `full_snapshot: true` on every chunk and reuse the same `snapshot_id`.
2. Intermediate chunks omit `snapshot_final` or set it to `false`; the server returns `status: "partial"`.
3. Set `snapshot_final: true` on the final chunk; the server returns `status: "ok"` and clears old scores that are absent from this snapshot.
4. After a timeout, retry the same chunk with the same `snapshot_id`; duplicate submissions are idempotent.
5. An unfinished snapshot cannot mix another `snapshot_id`; otherwise HTTP `409` is returned.

Scores are written as chunks arrive, but old scores are only deleted when the
final chunk arrives. Therefore, while the upload is unfinished, queries may
temporarily still contain scores from the previous snapshot.

### Intermediate chunk example

```bash
curl -X POST 'https://net.wmc.pub/api/bot/sync' \
  -H 'Bot-Token: <shared-secret>' \
  -H 'Content-Type: application/json' \
  -d '{
    "qq": 123456789,
    "source": "sega",
    "full_snapshot": true,
    "snapshot_id": "qq-123456789-20260825-01",
    "snapshot_final": false,
    "records": [
      {
        "song_id": 1,
        "title": "Example Song",
        "type": "DX",
        "level_index": 3,
        "achievements": 100.1234,
        "dxScore": 2500,
        "fc": "fc",
        "fs": "fs"
      }
    ]
  }'
```

### Final chunk example

The request body is the same as an intermediate chunk; keep using the same
`snapshot_id` and set:

```json
{
  "full_snapshot": true,
  "snapshot_id": "qq-123456789-20260825-01",
  "snapshot_final": true,
  "records": [
    {"song_id": 2, "level_index": 3, "achievements": 99.8765}
  ]
}
```

The final chunk cannot submit an empty valid snapshot; at least one valid score
must have been submitted in some chunk of this snapshot.

### Response

```json
{
  "status": "partial",
  "snapshot_id": "qq-123456789-20260825-01",
  "imported": 1,
  "updated": 0,
  "skipped": 0,
  "stored_records": 1,
  "errors": []
}
```

`imported`, `updated`, `skipped`, and `errors` reflect the current chunk;
`stored_records` is the number of scores currently stored for the player. The
final chunk and duplicate requests with the same `snapshot_id` return
`status: "ok"`.

## `GET /api/bot/player/{qq}`

Read the merged player profile, scores, and B50/B15 from AWMCNET. Requires the
same `Bot-Token` request header.

## `GET /api/bot/player/{qq}/trend`

Read the player's Rating trend. Query `days` from 1 to 365; default 30 days.

::: warning Data source
The AWMCNET API only accepts unified score data; it does not accept SGWCMAID,
arcade UIDs, or third-party score-checker Tokens.
:::
