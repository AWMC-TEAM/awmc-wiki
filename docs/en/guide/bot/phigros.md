# Phigros Score Lookup (phi)

::: tip In one sentence
Besides maimai DX, AWMC Bot can also look up **Phigros**: bind your TapTap account and you
get the B30 score chart, an account card, per-song info, an equivalent-rks calculator, and a
progress report between two cloud saves. 🐾
:::

Phigros data comes from the **TapTap cloud save** (protocol restored from the community
phi-plugin). The binding is attached to your **score-lookup QQ**: on a regular QQ the current
QQ is used directly, while the official QQ requires
[forum account binding (qbind)](/en/guide/bot/intro) first — if you send `phi绑定` without it,
the bot will tell you to run qbind.

Command overview:

| Command | Description |
|---------|-------------|
| `phi绑定` | TapTap QR authorization (link valid for 5 minutes), or `phi绑定 <sessionToken>` to bind directly |
| `phi查分` | B30 score chart (the default entry point) |
| `phi更新` | Re-fetch the latest cloud save immediately |
| `phi进步` | Compare with the previous save: rks / thresholds / per-song accuracy / entries and drops |
| `phi资料` | Your account card |
| `phi查歌 <song>` | Per-song info card |
| `phi随机 [filter]` | Pick a random song |
| `phi计算 <constant> <acc>` | Equivalent-rks calculator |
| `phi解绑` | Unbind |
| `phi帮助` | Command list plus shortcut buttons |
| `开启phi` / `关闭phi` | **Group owner / admin**: per-group switch |

The English sub-commands work as well — `phi bind` / `phi b30` / `phi song` / `phi rand` /
`phi com` / `phi update` / `phi progress` / `phi info` / `phi unbind` / `phi help` — and the
`φ` prefix (e.g. `φ绑定`) is recognised too.

## 1. Group Switch

- Phigros is **enabled by default** in every group; after `关闭phi` all phi commands in that
  group stay silent, and `开启phi` restores them.
- The switch is stored per group, like the guessing games, and any group owner or admin can
  toggle it.
- Private chats are not affected by the group switch.
- An admin can also disable the whole module at once with the database key `phi_module_enabled`
  (commands then reply "Phigros module is currently disabled").

## 2. Binding and Unbinding

```text
phi绑定
phi绑定 <sessionToken>
phi解绑
```

- **QR binding**: `phi绑定` returns a TapTap authorization QR code (plus a text link as a
  fallback). Scan it with the TapTap app and tap "Confirm" in the app; the link is valid for
  5 minutes.
- **Token binding**: if you already have a sessionToken, send `phi绑定 <sessionToken>`.
- **Credential safety**: the sessionToken is only written to the database (`phigros_bind`
  table) and is **never echoed** in replies, images or logs.
- On success the bot replies with your nickname and rks and reminds you to send `phi查分`.
- `phi解绑` removes the binding but **keeps** the historical snapshots, so progress can still
  be compared after re-binding.
- Only one binding flow per QQ runs at a time; if the QR code expires, just send `phi绑定`
  again.

## 3. B30 Lookup

```text
phi查分
phi
pgr
phib30
phi查分 b40
phi查分 best19
```

- The default output is the **B30 chart**: the φ (perfect) songs plus the top 27 scores
  (rank, constant, accuracy, grade, suggestions), stamped with the constant-data version
  used for that render.
- The list length is adjustable: `phi查分 b<N>` widens the list to 33–50 rows (values below
  33 are treated as 33); `phi查分 best<N>` shows exactly N rows (1–50).
- The attached shortcut panel has 10 buttons: B30 lookup / profile / song search / random /
  calculator / bind / refresh save / my progress / unbind / help.
- Every image command first replies with "generating the image, one moment please", then sends
  the picture.
- Cover art is downloaded from a public CDN on demand and cached; if the download fails, the
  render degrades to a first-character placeholder block instead of failing.
- The save freshness is checked on every lookup: a save older than the auto-refresh window
  (12 hours by default) is re-fetched first (see the next section).

## 4. Refreshing the Save and Progress

```text
phi更新
phi进步
```

- **Auto refresh**: whenever a lookup (`phi查分` / `phi资料` / `phi进步`, …) finds the save
  older than `phi_auto_update_hours` (12 hours by default), it re-fetches it first, so a
  manual update is usually unnecessary.
- Use `phi更新` right after playing, when you want to see the new scores immediately.
- Every **successful** fetch writes a snapshot into the `phigros_snapshot` table;
  `phi进步` compares the **two most recent** snapshots and reports the rks change, the B30
  computed value (cut-off line), per-song accuracy gains, and the songs that entered or
  dropped out. With only one snapshot it asks you to accumulate a second one.

## 5. Profile, Songs and Other Lookups

```text
phi资料
phi查歌 <song>
phi随机 [EZ/HD/IN/AT | 15 | 15+]
phi计算 <constant> <acc>
```

- `phi资料`: an account card showing rks, per-difficulty statistics, the course rank and the
  data currency, with your background illustration as a blurred backdrop. Aliases:
  `phi info` / `phi账号资料` / `phi个人信息`.
- `phi查歌 <song>`: a song info card with its constant, chart designer and chapter; **after
  binding** it also appends your scores on the four difficulties and suggestions. Chinese and
  English titles and aliases are fuzzy-matched (the alias table follows the song library).
  Aliases: `phi song` / `查phi` / `phi搜索`.
- `phi随机 [filter]`: picks a random song, optionally filtered by difficulty
  (`EZ` / `HD` / `IN` / `AT`) or constant (`15` / `15+`). Aliases: `phi rand` /
  `phi随机曲` / `随机phi`.
- `phi计算 <constant> <acc>`: the equivalent-rks calculator, using
  `rks = constant × ((acc − 55) / 45)²`; accuracy ranges from 0 to 100 and the constant
  from 0 to 20. Example: `phi计算 16.7 98.5`. Aliases: `phi com` / `phi等效`.
- These lookups carry **no extra charge**.

## 6. Billing

The B30 lookup is charged per call and can be changed live via `BREAK配置` (effective within
60 seconds, no restart needed):

| Key | Default | Description |
|---|---|---|
| `phi_b19_cost` | `2` | B30 lookup price (BREAK per call); `0` = free |
| `phi_update_cost` | `0` | `phi更新` price; free by default |
| `phi_auto_update_hours` | `12` | Save auto-refresh window in hours |
| `phi_module_enabled` | `1` | Module master switch (`0` = disabled everywhere) |

- Billing follows the same path as other services: the balance is checked up front and the
  charge happens **only on success**; an insufficient balance produces a notice.
- The usual FREEDOM free-ride and free-window rules apply; the reply states whether the call
  was free and shows your balance.
- The TapTap nickname in the save is display-only; the identity is always the
  **lookup QQ**.

## 7. Data and Song Library

- The song library and constants follow the upstream phi-plugin data; 328 songs are currently
  included (with Chapter 9, "Dome Alone"), synced by an admin when a new dataset is
  released. The version badge on the chart shows which constant dataset was used.
- Cover art is cached under the bot's `data/phigros/ill` directory, so it is fetched only once.
- Rendering uses the same template as phi-plugin; if the screenshot process crashes
  transiently it retries once and otherwise falls back to the built-in renderer.

## 8. FAQ

**`phi` does nothing?**
Check whether the group switched it off: ask the owner or an admin to send `开启phi`. If you
see "Phigros module is currently disabled", an admin turned the whole module off.

**It asks me to qbind first?**
On the official QQ, Phigros binding requires a forum account binding (send `qbind`); after
that, come back and run `phi绑定`.

**The save is not the latest one?**
After playing you can run `phi更新`; normally any save older than 12 hours is re-fetched
automatically. If new scores still do not appear, check that the cabinet has uploaded to the
TapTap cloud save.

**`phi进步` says there is nothing to compare?**
Progress depends on snapshots: after two successful lookups/updates (with an actual save
change) the comparison has content.
