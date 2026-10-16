---
title: Quotas and Rate Limits
---

# Quotas and Rate Limits

AWMC API applies both **personal** and **global** quotas to Token-consuming endpoints. Windows are **15 minutes, 1 hour, and 5 hours**, and each window starts at its first **successful** request. Usage is counted in **successful requests** (failed requests don't consume quota):

- **Read**: user data, scores, tickets, items, and Gate status queries. Read limits are higher by default.
- **Write**: `upsert`, delete, clear operations, and `POST /v1/charge` ticket purchases.
- `POST /v1/update-lx` and `POST /v1/update-fish` read and synchronize external score results, so they use read quota.

## Quota exceeded

An exceeded quota returns HTTP `429`, with `Retry-After` (seconds) and `X-Quota-Reset` (ISO timestamp) headers:

```json
{
  "error": "quota_exceeded",
  "msg": "Reached Personal 1-Hour Quota Limit for Read requests. You may continue request after 2026-08-06 23:06:26 Beijing Time (UTC+8). If you want a higher quota, please get in touch on us https://bbs.wmc.pub.",
  "retryAfterSeconds": 1800,
  "quota": { "scope": "Personal", "category": "read", "window": "1h", "limit": 120, "used": 118, "requested": 4, "resetAt": "2026-08-06T15:06:26.000Z", "retryAtBeijing": "2026-08-06 23:06:26", "timeZone": "Asia/Shanghai" }
}
```

Wait until `retryAfterSeconds` or `quota.resetAt` before retrying.

## Query quota status

Authenticated users can call `GET /me/quota` (`GET /quota` is a compatibility alias):

```bash
curl https://api.wmc.pub/me/quota -H 'Authorization: Bearer <JWT or gw_token>'
```

The response contains `windows.read` and `windows.write`, with `scope`, `window`, `limit`, `used`, `remaining`, `startedAt`, and `resetAt`.

## Administrator controls

The dashboard's **Quotas & errors** page supports conservative, normal, loose, adaptive, and custom modes — the conservative / normal / loose multipliers are 50% / 100% / 150% of baseline — plus per-category/window baselines, a global switch, and a global window multiplier. User editing supports six personal read/write overrides and a bypass-global switch. Personal limits always remain active.

The same page shows a 7-day, 30-minute chart of server internal errors. `httpStatus = 0` (forwarding failures) and HTTP `>= 500` are included.
