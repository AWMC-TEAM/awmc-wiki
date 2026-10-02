# AWMC QueryBot Command Reference

This page describes account, upload, BREAK, and admin commands. For full query
commands such as song lookup, B50, song guessing, and data reports, see
[Command Help](/en/guide/bot/advanced).

::: warning Version note
Account features have been merged into QueryBot. The old Koishi maiBot's
priority card keys, unbind cards, account locking, protection mode, and account
read/write features have migrated to the AWMC Gateway API; the bulk
`upsert-all` is not exposed to users.

Account **write operations** (scores, items, profile edits) have been upgraded to
the **AWMC API v2-3 session model**: the Bot submits a job, the server executes it
in the background, and the Bot automatically confirms and polls it — no manual
confirmation is needed. See [Section 8](#8-account-editing--bulk-operations-v2-3).
:::

## 1. General Rules

- The command prefix is determined by the platform configuration; this page writes no `/` by default.
- Account and upload flows reference the triggering message; since the original message containing sensitive credentials is recalled first, group chat results use `@user` markers instead.
- Interactive flows generally support `取消`, `cancel`, `q`, or `退出` to cancel.
- QR codes, official QR links, and Tokens are all sensitive credentials; the Bot tries to recall them first.
- External calls generate a `Ref_ID`; if something goes wrong, provide it to an admin instead of sending a Token or UID.

## 2. Agreement & Account

| Command | Description |
|---|---|
| `用户协议` | View the current agreement link and confirmation method |
| `同意用户协议 <full confirmation phrase>` | Confirm the agreement; sending the full confirmation phrase directly also works |
| `撤回用户协议` | Withdraw consent for the current version |
| `不同意共享我的数据` | Disable anonymized public sharing and training use of scores/Rating/trends (enabled by default; see [Terms](/en/guide/bot/terms#42-public-data-and-training-use-enabled-by-default)) |
| `mai账号` | View the account feature help |
| `mai绑定` / `maibind` | Interactive bind or claim of a maimai account |
| `mai绑定 <QR code or link>` | Submit and bind in one step |
| `mai解绑` | Unbind the maimai account; upload Tokens are kept |
| `mai状态` / `mymai` | View full account status; re-asks for the QR code when the cache is stale |
| `舞萌状态` / `mais` | Server failure-rate line chart + live status (see [Command Help](/en/guide/bot/advanced#11-help--info)) |
| `maiping` | Check AWMC API connectivity |
| `mai地图` | View play regions (when supported) |
| `mai预览` / `预览` | Query the account preview; costs 5 BREAK on success |
| `mai道具` / `道具` | Query all items; costs 5 BREAK on success |
| `mai门状态` / `查门` / `门状态` | Query Kaleidx Gate discovery, key, and clear status; costs 5 BREAK on success (see the v2-3 note below) |
| `mai查询opt <version>` | Query the Mai2 option file |

Gate status also shows the Gate name: 1 Blue Gate, 2 White Gate, 3 Purple Gate,
4 Black Gate, 5 Yellow Gate, 6 Red Gate, 7 Prism Tower, 8 Outer Gate,
9 Gate of Hope, and 10 Inner Gate.

::: warning Upstream v2-3 removed gate-status and event queries
After the server upgrades to v2-3 it no longer provides the gate status
(`get-kaleidx-scope`) or game event (`get-game-event`) read endpoints; at that
point `mai门状态` / `maievent` report that the query has been removed, and account
items can be inspected with `mai道具` instead.
**Gate status changes** use `mai改门` (see [Section 8](#8-account-editing--bulk-operations-v2-3)),
whose write endpoint supports gates 1–6.
:::

Supported QR inputs:

```text
SGWCMAID...
https://wq.wahlap.net/qrcode/img/MAID....png
https://wq.wahlap.net/qrcode/req/MAID....html
```

All API commands that use account QR credentials check the cache lifetime.
When the cache expires, stale credentials are never reused; send the latest
SGWCMAID, official QR link, or QR image, and re-run the original command after
verification refresh succeeds.

The Bot re-asks at most 3 times when credentials are invalid, expired, return
500/empty, or the identity does not match.

## 3. Score-Tracker Binding & Uploads

| Command | Description |
|---|---|
| `mai绑定水鱼 <Token>` / `maibindfish <Token>` | Bind the Diving Fish Token |
| `mai解绑水鱼` | Unbind the Diving Fish Token |
| `lxbind` | Bind Lxns via OAuth (recommended) |
| `lxunbind` | Unbind Lxns OAuth |
| `mai绑定落雪 <Import Token>` / `maibindlx <Import Token>` | Bind a Lxns compatibility Token |
| `mai解绑落雪` | Unbind the Lxns compatibility Token |
| `maiu [QR code or link]` | Upload to Diving Fish |
| `maiul [QR code or link]` | Upload to Lxns |
| `maiua [QR code or link]` | Upload to both Diving Fish and Lxns |

All three uploads share the daily first-success-free allowance. The default
prices after that are 2 BREAK for Diving Fish, 2 BREAK for Lxns, and 3 BREAK for
both. Failures, timeouts, and cancellations are never charged.

## 4. Direct QR & PC

Sending `SGWCMAID...` or a supported official link directly triggers a PC sync,
then uploads to Diving Fish, Lxns, or both according to binding status. If no
score tracker is bound, only the PC is synced.

| Command | Description |
|---|---|
| `更新pc数` | Sync PC using cached or latest QR |
| `我的pc数` | View personal PC stats |
| `pc数 <song>` | View PC for a specific chart |
| `pc50` | B50 sorted by PC |
| `pca50` | Rating B50 re-sorted by PC |
| `游玩排行50` | Top 50 most-played charts library-wide |
| `pc排行` | All synced users ranked by total PC |

::: tip Developers: AWMCNET chunked sync
When QueryBot or another server syncs a large amount of scores to AWMCNET, the
full snapshot can be split into multiple requests. Set `full_snapshot: true` on
every chunk and reuse the same `snapshot_id`. Intermediate chunks omit
`snapshot_final`; the last chunk sets `snapshot_final: true`. On timeout, retry
with the same `snapshot_id`. Full fields and examples are in
[AWMCNET Bot API](/en/dev/awmcnet-api).
:::

## 5. Rank Courses

The default rank-course table uses the current CN server version, **PRiSM PLUS**.
Query results render an image containing the LIFE rules, the 4 course tracks,
song level/constant, personal best achievement, and anonymous sample stats
aggregated from recent server-side scores.

| Command | Description |
|---|---|
| `段位表` | View queryable rank lists and examples |
| `段位表 <rank>` | Query a rank course, e.g. `段位表 真二段` |
| `<rank>段位表` | Same as above, e.g. `真二段段位表` |
| `段位表 <rank> @user` | Render the target user's personal score display |

Rank resources prefer the player's current nameplate and official dani Plate.
Anonymous samples come from scores recently synced on the server that have not
opted out of data sharing; low-sample or cold-start cases fall back to bundled
samples. The footer marks the data source and notes "for practice reference;
arcade results are authoritative".

## 6. BREAK & Tickets

| Command | Description |
|---|---|
| `AWMC签到` / `签到` | Daily check-in |
| `我的AWMC` | View BREAK, check-in streak, call stats, recent transactions, invoice success/failure rate and `returnCode=0` stats; auto-attaches the group song-guess chart in groups |
| `AWMC帮助` | View pricing and reward details |
| `转账BREAK @用户 数量` | Transfer BREAK |
| `BREAK抽奖 [1-10]` | Lottery; default 2 BREAK per draw |
| `发票` / `fp <2/3>` | Request 2x or 3x tickets |
| `mai查票` / `查票` | Format and query valid tickets (type, stock, expiry); never shows the account UID |

Invoices are charged by multiplier: 20 BREAK for 2x, 30 BREAK for 3x. Charges
only apply after the external service actually succeeds and the credit is
confirmed.

## 7. Score & Item Writes

| Command | Description |
|---|---|
| `mai改成绩` / `改成绩` / `改分` | Interactive song/difficulty/score selection; 75 BREAK per successful run |
| `mai改成绩` / `改分 <song> <difficulty> <achievement> <DX score> [FC] [FS] [simple/pro]` | Edit scores in one line |
| `mai删成绩` / `删成绩` / `删分` | Interactive song and difficulty selection; 50 BREAK per successful run |
| `mai删成绩` / `删分 <song> <difficulty>` | Delete scores in one line |
| `mai改道具` / `改道具` | High-risk interactive item mutation; 100 BREAK per successful action |
| `mai改道具` / `改道具 <itemKind> <itemId> <add/del>` | Prefill parameters; risk confirmation is still required |

### Bulk scores (up to 20 at once, same price)

`mai改成绩` accepts newline- or semicolon-separated (`;`) input and submits **up to
20 scores in a single run**:

```text
mai改成绩
songA 紫 100.5% 5 AP FDX
songB 黄 99.8% 600 FC FS 专业
```

`mai删成绩` supports bulk input too (one `<song> <difficulty>` per line).

- The same difficulty of the same song cannot appear twice.
- A bulk run must use **one mode**: either every DX value is a star rating (simple
  mode) or every DX value is an actual DX score (pro mode).
- **Billing is per run, not per entry**: 1–20 scores all cost 75 BREAK (deletion: 50).
- After a write the Bot shows the server verification result and uploaded/skipped
  counts; when the account already satisfies the input it reports "no upload needed".

### Score format

Score commands accept song IDs, full titles, and aliases. During interactive
difficulty selection you can send a number: `0 BASIC`, `1 ADVANCED`,
`2 EXPERT`, `3 MASTER`, `4 Re:MASTER`; songs without a Re:MASTER chart only
accept `0-3`. Difficulty also supports `BASIC/ADV/EXP/MAS/Re:MAS`,
green/yellow/red/purple/white, and "宴" for banquet charts. Achievement can be
written as `100.5%` or `0.995` (parsed as `99.5%`).

- **Simple mode (default)**: DX score is a star rating `0-5`.
- **Pro mode**: DX score is the actual DX score; values above 5 automatically select pro mode and validate against the chart maximum.
- You can explicitly append `简单` or `专业`; `FC/FCP/AP/APP` and `FS/FSP/FDX/FDXP` are supported.
- API, parse, timeout, or cancel failures do not charge BREAK; write endpoints never auto-retry.

::: tip Item kinds
`mai改道具` accepts `itemKind` 1 nameplate, 2 title, 3 icon, 4 collection,
5 music unlock, 6 MASTER chart unlock, 7 Re:MASTER chart unlock, 10 partner,
11 frame. Use `mai改角色` for characters; tickets are not writable as items
(buy them on the cabinet or use the ticket command).
:::

::: danger Item mutation risk
`mai改道具` has **not been tested on a real account** and may cause data
corruption or irreversible consequences, especially `itemKind=4/8`. The Bot
shows an operation summary and requires you to send "我已知晓风险" before
executing; continuing means you accept the risk yourself. The bulk `upsert-all`
has no user command.
:::

## 8. Account Editing & Bulk Operations (v2-3)

Account writes now use the **AWMC API v2-3 session model**: the Bot submits the
request, the server executes it in the background (login → multi-round upload →
server verification → logout), and the Bot automatically performs "create +
immediate confirm" and polls the result. **No manual confirmation is required.**
A run usually takes 1–2 minutes.

`mai改资料` (aliases `资料修改` / `改资料` / `资料命令`) is a **hub entry** that lists
every write command with its current price and offers buttons that jump straight
into each command.

| Command | Description | Price (charged on success) |
|---|---|---|
| `mai批量编辑` / `批量编辑` / `批量改` | Collect several edits in one conversation (mixed types) and run them serially | 300 BREAK per run |
| `mai全解锁 [music/master/remaster] [version ID]` | Unlock all music / MASTER / Re:MASTER | 200 BREAK per run |
| `mai改门 <gate 1–6 or name> <found/key/both/off>` | Change Kaleidx Gate state | 50 BREAK per run |
| `mai改rating <0~99999>` | Change the displayed Rating (does not raise the historical best) | 50 BREAK per run |
| `mai改里程 <0~99999>` | Change maimile points | 50 BREAK per run |
| `mai改地图库存 <0~999>` | Change map stock | 50 BREAK per run |
| `mai改游玩次数 <total> [current version]` | Change play counts | 50 BREAK per run |
| `mai改段位 <rank or ID>` | Change the rank course (0–23) | 50 BREAK per run |
| `mai改阶级 <class or ID>` | Change the class (0–25) | 50 BREAK per run |
| `mai改搭档 <character or ID>` | Fill all five partner slots with that character | 50 BREAK per run |
| `mai改角色 <character or ID> <level> [awakening]` | Change character level / awakening | 50 BREAK per run |
| `mai改亲密度 <partner or ID> <level>` | Change partner intimacy | 50 BREAK per run |
| `mai完成地图 <map or ID…>` | Complete finite maps and grant their rewards | 50 BREAK per run |
| `mai推进地图 <map or ID…>` | Advance maps up to the first unclaimed challenge song | 50 BREAK per run |
| `mai改登录奖励 <bonus or ID…>` | Set login bonuses to one stamp short | 50 BREAK per run |
| `mai重置版本` | Reset to the game version currently used by the service | 50 BREAK per run |
| `mai查任务 <session_id>` | Inspect an upload session's progress and result | Free |

### Bulk editing: several edits in one conversation

Each v2-3 upload endpoint only accepts its own kind of data (scores / items /
profile fields), so **mixed types cannot be merged into a single request**. Bulk
editing therefore collects edits in one conversation and runs several upload
sessions serially:

```text
mai批量编辑
改地图 1,2
改道具 5 11479 add
改成绩 songA 紫 100.5% 5 AP FDX 专业
完成
确认修改
```

- Send one edit per message, **up to 3 items** (each item is one upload session, about 1–2 minutes).
- Send `完成` to review the list and total price, then `确认修改` to execute (`取消` to quit).
- **Charged 300 BREAK once**, not per item; nothing is charged if every item fails; a failing
  item is reported and the remaining items still run.
- Supported entries: `改地图` / `推进地图` / `改门` / `改rating` / `改里程` / `改地图库存` /
  `改游玩次数` / `改段位` / `改阶级` / `改搭档` / `改角色` / `改亲密度` / `改登录奖励` /
  `重置版本` / `改道具` / `改成绩` / `删成绩` / `全解锁`.

### Name input (edit without knowing IDs)

Parameters marked "or name" accept a plain name; the Bot queries the upstream
resource catalog and converts it to the right ID:

```text
mai改门 紫色之门 found     # gate name → ID 3
mai改角色 星 <level>       # character name → character ID
mai完成地图 幻象           # map name → map ID
```

- Matching happens upstream (case-insensitive, keyword based).
- When several resources share the name, the Bot lists candidates — use a more
  precise name or enter the ID directly.
- Rank/class names come from upstream and rank names carry a version prefix
  (e.g. `1.17_初段`), so entering the numeric value (rank `0~23`, class `0~25`)
  is recommended.

### One-click unlock

```text
mai全解锁             # all music
mai全解锁 master      # all MASTER charts
mai全解锁 remaster 25 # Re:MASTER within a version range
```

The candidate list is generated upstream and **tracks the account already owns are
skipped automatically** (nothing is uploaded when everything is skipped). A
successful run costs 200 BREAK regardless of how many tracks are unlocked.

### Billing & failure handling

- All prices above can be adjusted in the database configuration (admin `BREAK配置`).
- Clear upstream failures (rejected parameters, abnormal account state, …) do not charge BREAK;
  a failure during execution reports the concrete reason.
- On timeout or network loss the Bot **never replays the write** (to avoid duplicates); use
  `mai查任务` to check what actually happened.
- Writes support **expired-QR continuation**: after the Bot reports an expired QR code, send a
  fresh one and the original operation continues.
- Most edits create one play record and affect the displayed Rating; it recalculates after one
  play on the cabinet.

## 9. Admin Commands

The following commands are limited to the Bot's super admins or plugin admins:

| Command | Description |
|---|---|
| `查询REF <Ref_ID>` | View the redacted full processing chain |
| `封禁用户 <user> [reason]` | Ban a user |
| `解封用户 <user>` | Unban a user |
| `封禁列表` | View active bans |
| `管理面板` / `WebUI` | View the WebUI address and config status |
| `查看AWMC <user>` | View a user's BREAK profile |
| `设置BREAK <user> <amount>` | Set the balance directly |
| `增减BREAK <user> <amount>` | Increase or decrease the balance |
| `BREAK配置 [key value]` | View or modify BREAK default parameters |
| `迁移Koishi 检查 <database>` | Read-only precheck for Koishi account migration |
| `迁移Koishi 确认 <database>` | Confirm migration of accounts, Tokens, and agreement records |
| `发票统计` / `ticket统计` / `returnCode统计` | Global invoice success/failure and `returnCode=0` stats; add days, e.g. `发票统计 7` |
| `存储状态` | View SQLite/YAML/MySQL storage status |
| `存储迁移 检查 <source> <target>` | Precheck data migration |
| `存储迁移 确认 <source> <target>` | Confirm migration |
| `存储同步` | Immediately sync the configured remote storage backend |

::: tip Unified storage (MySQL / YAML)
Packing can be skipped when the working set is unchanged; unchanged MySQL files
can be reused; startup sync runs in the background and does not block the Bot
from receiving messages. See admin `存储状态` / `存储同步` for details.
:::

The WebUI and admin interfaces never return QR codes, Tokens, or full arcade
UIDs; admin modifications are also recorded with a `Ref_ID`.

## 10. Interactive Examples

### Bind and upload to both trackers

```text
用户协议
mai绑定
mai绑定水鱼 <Token>
lxbind
maiua
```

### Expired QR code

```text
Bot: QR cache expired, please send the latest QR (up to 3 times)
User: SGWCMAID...
Bot: Verification succeeded, continuing the original operation
```

### Query issue

```text
User: mymai
Bot: Replies referencing that message with account status and Ref_ID
```

### Bulk scores (20 at once, same price)

```text
User: mai改成绩
       songA 紫 100.5% 5 AP FDX
       songB 黄 99.8% 600 FC FS 专业
Bot: ⚠️ About to write 2 scores in bulk (same price, 75 BREAK on success)
     Send "确认修改" to submit
User: 确认修改
Bot: ✅ 2 scores written + server verification result + billing + Ref_ID
```

### Bulk editing (several mixed-type edits in one run)

```text
User: mai批量编辑
Bot: 📝 Bulk edit mode (up to 3 items; 300 BREAK once on success)
User: 改地图 1,2
Bot: ✅ Added 1/3: map completion: 完成地图 [1, 2]
User: 改道具 5 11479 add
Bot: ✅ Added 2/3: item add: music unlock · itemId=11479
User: 完成
Bot: ⚠️ About to run 2 items serially (2 upload sessions, about 2~4 minutes) …
User: 确认修改
Bot: ✅ Bulk edit finished 2/2 + per-item results + billing + Ref_ID
```

### One-click unlock and name input

```text
User: mai全解锁 master
Bot: ⚠️ One-click unlock (MASTER): 45 candidates (already-owned tracks are skipped)
     Send "确认解锁" to continue
User: 确认解锁
Bot: ✅ Submitted + server verification result

User: mai改门 紫色之门 found
Bot: ⚠️ About to run gate edit: gate 紫色之门 (ID 3) → open   ← name resolved to ID
User: 确认修改
```

### Checking an upload session

```text
User: mai查任务 b26759bec50e42d89efe43186a98c40d
Bot: Upload session …: completed / processing (query again later, free)
```
