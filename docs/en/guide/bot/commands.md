# AWMC QueryBot Command Reference

This page describes account, upload, BREAK, and admin commands. For full query
commands such as song lookup, B50, song guessing, and data reports, see
[Command Help](/en/guide/bot/advanced).

::: warning Version note
Account features have been merged into QueryBot. The old Koishi maiBot's
priority card keys, unbind cards, account locking, protection mode, and account
read/write features have migrated to the AWMC Gateway API v2; the bulk
`upsert-all` is not exposed to users.
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
| `mai门状态` / `查门` / `门状态` | Query Kaleidx Gate discovery, key, and clear status; costs 5 BREAK on success |
| `mai查询opt <version>` | Query the Mai2 option file |

Gate status also shows the Gate name: 1 Blue Gate, 2 White Gate, 3 Purple Gate,
4 Black Gate, 5 Yellow Gate, 6 Red Gate, 7 Prism Tower, 8 Outer Gate,
9 Gate of Hope, and 10 Inner Gate.

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
| `mai改成绩` / `改成绩` / `改分` | Interactive song/difficulty/score selection; 75 BREAK per successful entry |
| `mai改成绩` / `改分 <song> <difficulty> <achievement> <DX score> [FC] [FS] [simple/pro]` | Edit a single score in one line |
| `mai删成绩` / `删成绩` / `删分` | Interactive song and difficulty selection; 50 BREAK per successful entry |
| `mai删成绩` / `删分 <song> <difficulty>` | Delete a single score in one line |
| `mai改道具` / `改道具` | High-risk interactive item mutation; 100 BREAK per successful action |
| `mai改道具` / `改道具 <itemKind> <itemId> <add/del>` | Prefill parameters; risk confirmation is still required |

Score commands accept song IDs, full titles, and aliases. During interactive
difficulty selection you can send a number: `0 BASIC`, `1 ADVANCED`,
`2 EXPERT`, `3 MASTER`, `4 Re:MASTER`; songs without a Re:MASTER chart only
accept `0-3`. Difficulty also supports `BASIC/ADV/EXP/MAS/Re:MAS`,
green/yellow/red/purple/white, and "宴" for banquet charts. Achievement can be
written as `100.5%` or `0.995` (parsed as `99.5%`).

- **Simple mode (default)**: DX score is a star rating `0-5`; requests use `fuzzy=true`.
- **Pro mode**: DX score is the actual DX score; values above 5 automatically select pro mode and validate against the chart maximum.
- You can explicitly append `简单` or `专业`; `FC/FCP/AP/APP` and `FS/FSP/FDX/FDXP` are supported.
- API, parse, timeout, or cancel failures do not charge BREAK; write endpoints never auto-retry.

::: danger Item mutation risk
`mai改道具` has **not been tested on a real account** and may cause data
corruption or irreversible consequences, especially `itemKind=4/8`. The Bot
shows an operation summary and requires you to send "我已知晓风险" before
executing; continuing means you accept the risk yourself. The bulk `upsert-all`
has no user command.
:::

## 8. Admin Commands

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

## 9. Interactive Examples

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
