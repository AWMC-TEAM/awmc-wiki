# AWMC BOT Command Reference

::: tip
Use the search shortcut <kbd>/</kbd> (desktop) or the search button at the top (mobile) to find topics.
:::

::: tip QQ email binding (qbind)
Send `qbind <QQ number>` and return the emailed verification code; no forum registration is needed.
Forum OAuth (`论坛绑定`) remains an alternative. The full flow and rate limits are in
[Basic Tutorial · Forum Account Binding (qbind)](/en/guide/bot/intro#viii-forum-account-binding-qbind).
:::

Account binding, B50 uploads, tickets, PC sync, score queries, and group
interactions are now all merged into the same QueryBot. The command prefix is
determined by the platform configuration; this page uses no prefix below.

::: info Version and availability
This page follows the current source code; production deployment has not been verified, so not every feature is necessarily live. Availability, prices and limits depend on the deployed configuration and Bot prompts. Prices below are source-code defaults.
:::

::: tip Phigros, too
The Phigros (`phi`) commands bind your TapTap cloud save and cover the B30 chart, an account
card, per-song info and progress comparison — they have [their own page](/en/guide/bot/phigros).
:::

## 1. Account, Uploads & BREAK

Before getting started, send `用户协议`, open the web page, read it, and copy
the full confirmation phrase. QR-related commands accept `SGWCMAID...`, and the
official Wahlap `img/MAID...png` and `req/MAID...html` links.

### 1.1 Help & Info

| Command | Description |
|------|------|
| `mai账号` | View account feature help |
| `mai状态` / `mymai` | View full account status; interactively refreshes when the QR cache expires |
| `舞萌状态` / `mais` | "Server failure rate" line chart (all account operations: tickets, `maiu` uploads, bindings, etc.; `returnCode=0` counts as failure; empty periods omitted) + live server status |
| `maiping` | Test AWMC API connectivity |
| `状态页` / `服务状态` / `系统状态` | Show overall status, ongoing maintenance and incidents from the AWMC status page ([up.wmc.pub](https://up.wmc.pub)); when the status page announces Bot maintenance, the Bot enters maintenance mode automatically |
| `mai上报 <type>` | Manually report an arcade status to isMaiDown: `断网` / `无法登录` / `NET打不开` / `二维码` / `上传失败` / `小黑屋` / `恢复正常` |
| `mai配额` / `配额` / `限额` | View shared AWMC API quota usage (read / write per window) |
| `mai地图` | Query provinces/regions played by the account (when supported) |
| `mai查询opt <version>` | Query the Mai2 option file download URL, e.g. `mai查询opt 1.40` |
| `成绩趋势 [days]` | View the AWMC NET server-side Rating trend, default 30 days (aliases `rating趋势` / `mai趋势` / `awmc趋势`) |
| `公告列表` | View the latest 10 announcements (internal announcement IDs are hidden from regular users) |
| `确认阅读公告` | Confirm the current must-read announcement; the same version is not prompted again |
| `门攻略 [gate name]` / `哪些门` | List or fetch Kaleidx gate guide links; sending a blue/white/purple/black/yellow/red gate name directly also triggers it |
| `怎么用` | Auto-returns this command help when a message contains "怎么用" (same as the help entry) |

### 1.2 Account Binding

| Command | Description |
|------|------|
| `mai绑定` / `maibind` | Bind or claim a maimai DX account; interactive guide when no argument is given |
| `mai解绑` | Unbind the maimai account; Diving Fish / Lxns upload configs are kept |
| `更新pc数` | Sync PC data using a valid cache or the latest QR |
| `不同意共享我的数据` | Disable anonymized score / Rating / trend public sharing (enabled by default) |
| `同意共享我的数据` | Re-enable data sharing |
| `数据共享状态` | View whether anonymized data sharing is currently enabled |

### 1.3 Diving Fish B50

| Command | Description |
|------|------|
| `mai绑定水鱼 <Token>` / `maibindfish <Token>` | Bind the Diving Fish Token |
| `mai解绑水鱼` | Unbind the Diving Fish Token; the maimai account binding is kept |
| `maiu [QR code or link]` | Upload B50 to Diving Fish |
| `maiua [QR code or link]` | Upload B50 to both Diving Fish and Lxns |
| `dfbind` / `绑定水鱼` | Bind Diving Fish via OAuth (no Import Token needed) |
| `dfstatus` | View Diving Fish OAuth authorization status |
| `dfunbind` | Remove Diving Fish OAuth authorization |

### 1.4 Lxns B50

| Command | Description |
|------|------|
| `lxbind` | Bind Lxns via OAuth (recommended; no Import Token needed) |
| `lxunbind` | Unbind Lxns OAuth |
| `mai绑定落雪 <Import Token>` / `maibindlx <Import Token>` | Bind a Lxns Import Token for compatibility |
| `mai解绑落雪` | Unbind the Lxns compatibility Token |
| `maiul [QR code or link]` | Upload B50 to Lxns, preferring OAuth |

### 1.5 BREAK & Tickets

::: danger Warning
Issuing tickets carries risks; proceed with caution. AWMC TEAM is not
responsible for any negative effects tickets may cause.

See [AWMC BOT Terms of Service & Privacy Policy](/en/guide/bot/terms#_10-disclaimer), Section 10.
:::

| Command | Description |
|------|------|
| `AWMC签到` / `签到` | Check in for BREAK; available again **24 h after the last successful check-in** (no midnight reset) |
| `AWMC补签` / `补签` | Make up yesterday's check-in; max 3 times per month, costing 30 / 60 / 90 BREAK in order, no bonus rewards |
| `AWMC帮助` / `BREAK帮助` | View the BREAK system help |
| `我的AWMC` | View BREAK, check-in streak, and usage stats, including invoice success/failure rate and `returnCode=0`, null/missing counts; auto-attaches the group song-guess data chart in groups |
| `BREAK统计` / `BREAK收支` | View today's, last 7 days', and last 30 days' BREAK income, spending, and net change for all users |
| `转账BREAK @用户 数量` | Transfer BREAK to another user |
| `BREAK抽奖 [1-1000]` | Default 2 BREAK per draw |
| `BREAK抽奖 帮助` | View pool, probabilities, costs, and examples |
| `发红包 [total] [count]` | Send a BREAK luck red packet in the group (alias `BREAK红包`); sending just `发红包` follows prompts |
| `抢红包` | Claim the current group red packet, once per user (alias `领红包`) |
| `红包状态` | View red packet claim details (aliases `红包记录` / `查看红包`) |
| `收回红包` | Withdraw a red packet after 90 seconds; unclaimed balance returns (alias `重置红包`) |
| `兑换卡密 [code]` | Redeem BREAK / double / FREEDOM / PASS card codes, auto-redeemed in group and private chat (aliases `redeem` / `兑换码`) |
| `我的卡密` | View active card-code bonuses (aliases `卡密状态` / `我的加成`) |
| `卡密商店` | Open the configured external card-code shop; unavailable if no URL is configured |
| `商店` / `BREAK商店` | View the built-in BREAK shop and current prices |
| `商店购买 <双倍/FREEDOM/PASS> [quantity]` | Buy bonuses with BREAK; aliases `BREAK购买` / `购买`. Requires `qbind`; quantity defaults to 1, integer 1–720. Double / FREEDOM use hours; PASS uses charges |
| `使用PASS` / `用PASS` | Explain automatic PASS usage; does not manually consume a charge |
| `小游戏上限` | Show daily mini-game BREAK caps, plus today’s usage for bound users |
| `查看加成` / `加成总览` / `加成列表` | View active check-in bonuses (including admin-configured weekly / group / date / streak campaigns) |
| `mai发票` / `发票` / `fp <2/3/5>` | Request 2x, 3x, or 5x tickets; success costs multiplier × 10 BREAK (20 / 30 / 50); a submitted request that fails has a default 100 BREAK penalty, detailed below |
| `mai查票` / `查票` | Query valid tickets; 1 BREAK per successful query, no charge on failure; formatted by type, stock and expiry, without showing the account UID |

::: warning Ticket charges and penalties
A ticket request that fails after submission incurs a default fixed **100 BREAK** penalty. Pre-submission QR validation / balance-check failures and local API quota rejections are exempt. Existing unused multiplier tickets block issuance and instead invoke the separate **20 BREAK** unused-ticket penalty (`one_time_qrcode` mode skips this stock check). Penalties are deducted only when the balance covers them; they do not create a negative balance. Do not stockpile tickets: use issued tickets on a cabinet.
:::

::: info Shop and disabled features
Default prices are **300 BREAK/hour** for double BREAK, **1000 BREAK/hour** for FREEDOM, and **150 BREAK/charge** for PASS; admins can change them, so check `商店`. Purchases are not free under FREEDOM. PASS automatically spends one charge to bypass an exhausted **local AWMC team API quota** for one request; it cannot bypass public server quotas or mini-game reward caps.

The welfare-pool commands `抽奖池` / `贡献榜`, `领取福利` / `领福利`, and `贡献总榜` / `首富榜` are temporarily disabled. They are separate from the still-available `BREAK抽奖`.
:::

### 1.6 Account Advanced Operations (Billing / High Risk)

::: danger Warning
`mai改成绩`, `mai删成绩`, and `mai改道具` directly modify maimai account data.
`mai改道具` has not been tested on a real account and may cause irreversible
data corruption; you bear the risk yourself. See
[AWMC BOT Terms of Service & Privacy Policy](/en/guide/bot/terms#_10-disclaimer), Section 10.
:::

| Command | Description |
|------|------|
| `mai预览` | Query account preview info (5 BREAK on successful query; no charge on failure) |
| `mai道具` | Query the account item list (5 BREAK on successful query) |
| `mai门状态` / `mai查门` / `查门` | Read-only display of Kaleidx Gate discovery, key, and clear status (5 BREAK on successful query). ⚠️ Upstream v2-3 removed this read endpoint |
| `maievent` / `mai活动` / `舞萌活动` | Query the account's current event. ⚠️ Upstream v2-3 removed this read endpoint |
| `mai改成绩 [song difficulty achievement DX score FC FS]` | Interactive or one-line score edit; DX score 0-5 is star/simple mode, actual score auto-selects pro mode; newline/semicolon-separated bulk up to 20 entries; 258 BREAK per successfully edited chart |
| `mai删成绩 [song difficulty]` | Interactive or one-line score deletion; bulk supported too; 50 BREAK per successfully deleted chart |
| `mai改道具 [itemKind itemId add/del]` | High-risk item mutation; 100 BREAK on success; bulk `upsert-all` is not exposed by the Bot |
| `mai改资料` / `资料修改` / `改资料` | **Account editing hub**: one-click unlock, bulk editing, 14 profile edits and upload-session lookup (see [Command Reference](/en/guide/bot/commands#_8-account-editing-bulk-operations-v2-3)) |
| `mai批量编辑` / `批量编辑` / `批量改` | Collect mixed-type edits and run them serially; flat **1500 BREAK for the entire batch**, charged once on the first confirmed success; paid QR continuation is not charged again; cancelling before execution is free. **Untested, strongly discouraged: up to about 30 minutes and very likely to get stuck** |
| `mai全解锁 [music/master/remaster] [version ID]` | Unlock all music / MASTER / Re:MASTER (already-owned tracks are skipped); **1500 BREAK per successful run**. **Untested, strongly discouraged: up to about 30 minutes and very likely to get stuck** |
| `mai改门` / `mai改rating` / `mai改里程` / `mai改地图库存` / `mai改游玩次数` | v2-3 profile edits; 50 BREAK each (parameters accept plain names) |
| `mai改段位` / `mai改阶级` / `mai改搭档` / `mai改角色` / `mai改亲密度` | v2-3 profile edits; 50 BREAK each |
| `mai重置版本` | v2-3 version reset; 50 BREAK on success |
| `mai完成地图` / `mai推进地图` / `mai改登录奖励` | Temporarily disabled because upstream save verification keeps failing (5006), including their bulk-edit entry points |
| `查进度` / `查任务` | Free progress lookup for your uploads, bulk tasks and background sync; aliases `mai查任务` / `查上传任务` / `查会话`. Admins may append `<session_id>` for an exact session lookup |

::: tip Quick and automatic updates
`导` / `u` / `更` / `更新` (or `mai对手同步`) quickly sync scores without scanning. `mai自动更新 [hours]` defaults to 3 hours, 30 BREAK/hour, a sync every 15 minutes, and a maximum of 12 hours; payment is collected after confirmation. Use `查自动更新` for status and `自动更新关闭` to stop early (no refund).

Requires `mai绑定`; Diving Fish / Lxns require OAuth. Quick / automatic updates do not refresh FC/FS or PC; scan a QR for a complete update. Prices, intervals and availability depend on the Bot configuration; see [Quick and automatic updates](/en/guide/bot/commands#quick-update).
:::

---

## 2. Query & Group Interaction

> Regular-user query bot commands only; no admin commands. Advanced variants,
> data analysis, and group-admin features are in [2.12 Advanced Features](#_2-12-advanced-features).

### 2.1 Basics

| Command | Description |
|------|------|
| `帮助maimaiDX` | View the help image |
| `项目地址maimaiDX` | View project info |
| `今日mai` | Daily fortune and recommended song |
| `主题` | View or switch score chart theme |
| `查看排名` | Global Rating leaderboard |
| `我的排名` | Your Rating ranking |
| `赞助` / `赞助榜` / `本月赞助` | View this month's sponsor leaderboard (amounts hidden by default; see [Sponsor](/en/sponsor)) |

**Pick one** — just say something like `吃拉面还是米饭`, `是去 A 还是 B`, or
`吃 A 还是 B 还是 C 呢？` (2–4 options) and the Bot picks one at random, replying with
the result and the candidate list. Sentences where `还是` means "still" do not trigger
(e.g. `我还是不去了吧`). When an option contains a sensitive word, the reply omits the
option text: `# 🎲 🎯 就决定是你了：第 N 个`.

### 2.2 Song Search

| Command | Description |
|------|------|
| `查歌 <keyword>` | Search by title / alias |
| `定数查歌 <constant>` | Search by constant |
| `等级查歌 <level>` | Search by level, e.g. `等级查歌 13+` |
| `谱式查歌 <SD/DX>` | Search by chart type; `标准` / `dx` spellings also work |
| `分类查歌 <category>` | Search by category substring; lists all categories when nothing matches |
| `版本查歌 <version>` | Search by version, e.g. `版本查歌 舞萌DX 2024` |
| `拟合定数查歌 <value/range>` | Match fitted constant at display precision (2 decimals); alias `拟合查歌` |
| `bpm查歌 <bpm>` | Search by BPM |
| `曲师查歌 <artist>` | Search by artist |
| `谱师查歌 <charter>` | Search by charter |
| `试听 <song ID>` | Audio snippet (about 60 s, cut from around 20 %; trimmed and cached on first use) |
| `<alias>是什么歌` | Look up a song by alias |
| `id <song ID>` | Song details |
| `谱面<ID><difficulty>` | Chart preview, difficulty: green / yellow / red / purple / white |
| `提取曲绘 <song ID>` | Extract jacket art |
| `mai什么` | Random song recommendation |
| `mai什么推分` | Random score-push recommendation |
| `来个<level>` | Random song at a level |
| `来个dx<level>` / `来个sd<level>` | Random DX / standard song |
| `来个<difficulty><level>` | Random song with difficulty and level, e.g. `来个紫14+` |

::: tip Song-search quick line
The `查歌` intro image is followed by a **quick line** listing artist / charter / category /
version / chart type / BPM / level / constant / fitted constant, with difficulty-coloured
blocks for per-difficulty rows. On official QQ every value is a **tappable link** that fills
the matching lookup command (`曲师查歌`, `版本查歌`, `等级查歌`, …) into the input box, plus a
「🎵 试听」 button. OneBot and compatibility mode fall back to plain text; use `试听 <song ID>`
to audition.
:::

### 2.3 Aliases

| Command | Description |
|------|------|
| `<song>有什么别名` | View aliases of a song |
| `id<song ID>有什么别名` | View aliases by ID |
| `添加别名 <ID> <alias>` | Submit an alias for a song |
| `添加本地别名 <ID> <alias>` | Add a local alias that only applies to this Bot |
| `同意别名 <Tag>` | Vote on an alias application |
| `当前投票` | View ongoing alias votes |

### 2.4 Score Queries

| Command | Description |
|------|------|
| `b50` | B50 score chart |
| `ab50` | All best 50 |
| `刷新b50` | Force-refresh the score cache |
| `同步b50` | Explicitly sync Diving Fish / Lxns scores into AWMC NET (requires confirmation) |
| `合作b50` | Duo B50 comparison |
| `合作a50` | Duo all-best-50 comparison |
| `我有多菜` | Rating comparison chart |
| `我在群里有多菜` | In-group Rating comparison |
| `minfo <song ID/title/alias> [@user]` | Personal per-song scores for yourself or the selected user |
| `ginfo [绿/黄/红/紫/白]<song ID/title/alias>` | Global chart sample statistics, not group statistics; defaults to purple MASTER |
| `分数线 <绿/黄/红/紫/白><song ID> <target achievement>` | E.g. `分数线 紫799 100`; numeric target strictly between 0 and 101, without `%`. Use `分数线 帮助` for help |
| `友人对战` | Random in-group friend battle (add a number to tighten the Rating gap, e.g. `友人对战 300`) |
| `友人对战排行` | In-group friend battle records ranking (aliases `友人排行` / `友人对战排名`) |
| `b50鸟加率` / `B50鸟加率` / `b50鳥加率` / `b50鸟+率` | B50 "bird plus" (SSS+) rate stats (text list) |

#### Group Single-Song Ranking

| Command | Description |
|------|------|
| `<song>排名` | Group ranking for this song |
| `我的<song>排名` | Your in-group ranking for this song |
| `<song>排名 <N>` | Top N |

Difficulty can be prefixed, e.g. `白潘排名`, `我的白潘排名`.

### 2.5 Constant / Completion / Progress

| Command | Description |
|------|------|
| `<level>定数表` | Level constant table, e.g. `13+定数表` |
| `<level>完成表` | Level completion table, e.g. `13+ap完成表` |
| `<plate>完成表` | Plate completion table, e.g. `晓极完成表` |
| `<plate>进度` | Plate progress, e.g. `晓极进度` |
| `<level><achievement>进度` | Level progress, e.g. `13+sss进度` |
| `<level><plate>进度` | Level plate progress, e.g. `13将进度`, `14+极进度` |
| `段位表 [rank]` | Rank course image; defaults to PRiSM PLUS, e.g. `段位表 真二段`; supports @user |
| `<rank>段位表` | Reverse form, e.g. `真二段段位表` |
| `我要上<score>分` | Score-push recommendations (multi-route; see "Score-Push Recommendations" under 2.12) |
| `我要在<level>上<score>分` | Level-specific score-push recommendations |
| `<level>分数列表` | Score list for that level |
| `新歌列表` | Current-version song list, filtered by difficulty / level / chart type / play state; supports @user (aliases `新曲列表` / `B15列表`) |
| `新曲统计` | New-song completion, average RA and pushable songs (aliases `新歌完成度` / `B15统计` / `b15统计`) |

Achievement marks support: `ap` `fc` `fcp` `fs` `fsp` `ss` `sss` `sync`, etc.

::: tip Examples (new songs)
`新歌列表 紫 13+`, `新歌列表 DX 未游玩`, `新歌列表 13.5`. The feature follows the
"current version" (B15) definition, which differs from historical-version filters such as
`镜代b50`.
:::

::: tip Rank course samples
The rank course image shows LIFE rules, course level/constant, personal best
achievement, anonymous sample count, average, median, P25-P75 distribution, and
SSS rate. Samples come from scores recently synced on the server that have not
opted out of data sharing; low-sample, cold-start, or aggregation-failure cases
fall back to bundled samples. The footer marks the data source, and passing or
failing the rank is still determined by the arcade result.
:::

### 2.6 Song Guessing

::: info Group games in private chat
To play group games such as song guessing or chart guessing, follow the bot
prompt to join [Group 2 · 993795066](https://qm.qq.com/q/PF5t1VXPi0) (games)
before starting. Group 1 does not unlock mini-games, to keep it readable.
:::

| Command | Description |
|------|------|
| `猜歌` | Text guessing |
| `猜曲绘` / `猜曲绘1`～`猜曲绘4` | Jacket guessing; specify difficulty 1-4 |
| `猜曲子` | Audio guessing |
| `猜铺面` / `猜谱面` | Chart-video guessing (muted early phase, ending BGM; correct-answer chime and countdown) |
| `猜Rating` | Random difficulty 1-4; guess the total Rating of an anonymous B50 within 60 seconds |
| `猜Rating1`～`猜Rating5` | Specify difficulty; higher levels show fewer cards and fewer clues |
| `猜Rating3 90` | Difficulty 3 with a 90-second answer window (30-300 seconds supported) |
| `重置猜rating` | Force-end the current Guess Rating round |
| `找内鬼` / `找假卡` | Find the card from another member that does not belong to the selected owner’s B50 |
| `重置找内鬼` | Force-end the current B50 Impostor round |
| `舞萌极限二选一` / `极限二选一` / `二选一` | Join the five-round left/right song comparison; answer each round with `左` or `右` |
| `加入` / `参赛` | Join the current Extreme Two-Choice round |
| `重置二选一` | Force-end the current Extreme Two-Choice round |
| `你想我猜` / `20问猜曲` | Milk thinks of a song; members ask "yes/no" questions to narrow it down and guess the title; fewer questions score higher, with combo and multiplier cards stacking |
| `重置你想我猜` / `重置20问` | Force-end the current "You Guess" round |
| `maidle` / `舞萌dle` | maimai Dle: the whole group guesses one song together; every guess returns a 7-column comparison board. `maidle 困难` (hard) gives no first-character / jacket hints |
| `猜 <title/alias/#ID>` / `dle <title>` | Submit a guess during maidle (10 guesses shared by the group) |
| `重置maidle` / `结束maidle` | End the current maidle and reveal the answer; `maidle帮助` shows the rules |
| `猜群友` | The question shows three members plus one chart; guess who has the highest achievement on it. Each player may bet once, answers stay silent for 15 seconds, then all are revealed at once |
| `重置猜群友` | Force-end the current Guess-the-Member round |
| `重置猜歌` | Force-end the current text-guess round (in group) |
| `查看已有信息` / `查看提问列表` / `20问进度` / `提问列表` | View the Q&A records of the current "You Guess" round |
| `舞萌开字母` / `开字母` | Multi-song letter board (default 8 titles); send letters or aliases during the round, or use `开歌`; timed settlement after full clear |
| `开字母排行` / `开字母积分榜` | Group letter settlement score board (image) |
| `开字母贡献榜` | Group letter contribution board (image) |
| `开字母时间榜` | Group best clear-time board (image, with avatars) |
| `开字母文字模式` / `文字模式` | Use a plain-text board for the current or next Letter Board round |
| `开字母图片模式` / `图片模式` | Use an image board for the current or next Letter Board round |
| `开字母自动模式` / `自动模式` | Restore automatic Letter Board mode selection by member count and load |
| `查加倍卡` | View your multiplier cards |
| `猜歌积分排行` | This group's overall points leaderboard |
| `本群猜歌排行` | View this group's guess participation and points ranking |
| `猜歌积分日榜` / `猜歌积分周榜` / `猜歌积分月榜` / `猜歌积分年榜` / `猜歌积分赛季榜` | This group's per-period leaderboards |
| `猜歌历史日榜` / `猜歌历史周榜` / `猜歌历史月榜` / `猜歌历史年榜` / `猜歌历史赛季榜` | This group's historical period boards |
| `全服猜歌排行` / `全服猜歌总榜` | Server-wide overall points board (text) |
| `全服猜歌日榜` / `全服猜歌周榜` / `全服猜歌月榜` / `全服猜歌年榜` / `全服猜歌赛季榜` | Server-wide per-period boards (text) |
| `我的猜歌` / `猜歌数据` / `猜歌统计` | Personal guess-stats chart: mode mix, 30-day trend, points/count share donuts, mode cards, and recent details; `我的猜歌 @user` for others |

::: tip BREAK earnings
Daily BREAK cap from mini-games: **50** / day globally; per game, 猜歌/猜曲绘/猜曲子/
猜铺面/你想我猜 are capped at 20 each, 开字母/猜Rating/找内鬼 at 15 each, maidle at 20,
极限二选一 at 10, and 猜群友 at 50. Once a game's cap is reached that game stops awarding, and
once the global cap is reached all games stop awarding; reset at midnight.
During an active double-BREAK card, earnings are doubled and these caps are
waived. Send `小游戏上限` for current caps and your progress.
:::

::: tip My guess stats
- Modes: 猜歌 / 猜曲绘 / 猜曲子 / 猜铺面 / 开字母 / 猜 Rating / 找内鬼 / 二选一 / 你想我猜 / 猜群友
- The chart includes a 30-day trend, adaptive mode cards, points/count share donuts, and recent details; updates live after settlement
- `@user` views that member's group stats, e.g. `我的猜歌 @张三`; without an at, shows yourself
- In-group `我的AWMC` automatically attaches the group guess-stats image (failure does not block the account status flow)
:::

::: tip Letter Board
Requires a group admin to send `开启mai猜歌`; mutually exclusive with text /
jacket / audio / chart guessing in the same group.

- During a round, send a single letter (e.g. `m`) to open it, or send a title/alias to guess it; also `开字母 m`, `开歌 xxx`
- Completing a title by filling letters credits the completer (✅ 字母补齐)
- **No points/BREAK in-round**; after full clear, settle by **speed stars + personal contribution**
- Elapsed shown in milliseconds as `xx.xxx秒`
- **Stars (adaptive)**: default ≤30 / 45 / 60 / 90 / 180 seconds for 5-1 stars; after the group clears faster, the 5-star cap tightens by historical P35 (min 15 seconds, max still 30), other stars scale at 1 : 1.5 : 2 : 3 : 6 relative to 5-star; slower rounds earn 0 stars from the minimum pool. The settlement text shows the active thresholds
- **Contribution weights**: valid letter open ×1, title completion ×3, `开歌` solve ×4; no contribution, no reward; pool split by weight
- **Limited ×3**: during a one-week event, settlement score and BREAK are tripled; text/boards mark "限时×3"; auto-reverts to 1x after the event
- Settlement order: ① guessed/completed text + speed stars + pool ② round board contribution split ③ full-clear board; boards can also be queried via `开字母排行` / `开字母贡献榜` / `开字母时间榜`
- **Crowded text mode**: when contributor count or short-window burst hits the threshold, in-round boards fall back to plain text; clear settlement still forces images
- A separate **2.5s/user** cooldown off-peak (independent of the global guess rate limit below); skipped in text mode
- `不玩了` / `结束开字母` ends and reveals remaining titles, **without** speed/contribution rewards
:::

::: warning Answer rate limit
The same user can submit only one answer globally every **2.5 seconds**
(猜歌 / 曲绘 / 曲子 / 铺面 / 猜 Rating / 找内鬼 / 猜群友); follow the Bot's prompts for the
current interval. Over limit:

`嘿嘿，你的答案被我吃掉啦！(x.x秒后才能发送新的答案）`
:::

::: tip Guess Rating
Requires a group admin to send `开启mai猜歌`; mutually exclusive with other
guessing modes and Letter Board in the same group.

- Randomly selects a group member → hides their B50 identity and scores by difficulty → guess the Rating with a number within 60 seconds → answers can be changed → closest wins
- `猜Rating` picks a random difficulty (1-4); `猜Rating1`～`猜Rating5` pick one explicitly; append a 30-300 second timer, e.g. `猜Rating3 90`
- The selected B50 owner cannot submit a valid answer, enter the ranking, or receive rewards
- Settlement: countdown ends → reveal true Rating + nickname → distribute points / BREAK → show the full B50 image

**Difficulty conditions and top-three rewards**:

| Difficulty | Shown / hidden | 🥇 | 🥈 | 🥉 |
|------|-----------|----|----|----|
| 1 | 20 cards; score rank and FC/FS kept | 15 pts + 2 BREAK | 5 pts + 1 BREAK | 3 pts |
| 2 | 16 cards; FC/FS hidden | 18 pts + 2 BREAK | 6 pts + 1 BREAK | 4 pts |
| 3 | 12 cards; score rank hidden too | 21 pts + 2 BREAK | 7 pts + 1 BREAK | 5 pts |
| 4 | 8 cards; minimal identifying info | 24 pts + 2 BREAK | 8 pts + 1 BREAK | 6 pts |
| 5 | 4 cards; almost no clues | 30 pts + 2 BREAK | 10 pts + 1 BREAK | 7 pts |

Other valid participants get 1 point. BREAK rewards are difficulty-independent:
champion / runner-up get 2 / 1 BREAK, third place only points; BREAK is only
awarded when at least 3 valid participants (excluding the owner) join and the
champion's error is ≤ 200.
:::

::: tip B50 Impostor
Requires a group admin to send `开启mai猜歌`; mutually exclusive with other
guessing modes and Letter Board in the same group.

- Mixes four cards from the selected owner’s B50 with one from another member; the impostor song is absent from the owner’s B50. RA values are not tampered with
- Send `1`～`5` within 45 seconds; answers can be changed; speed ranking uses the final-answer submission time
- Neither the selected B50 owner nor the impostor card’s original owner can submit a valid answer or receive rewards
- First correct: 10 points + 2 BREAK; second: 6 points + 1 BREAK; third and later correct players: 3 points
- BREAK is awarded only with at least three valid submissions, excluding both owners; points are still awarded below that threshold
- Settlement highlights the impostor card and reveals both owners
:::

::: tip Extreme Two-Choice
Requires a group admin to send `开启mai猜歌`; send `极限二选一` to start, then
`加入` or `参赛` to register.

- Five rounds compare a random metric of two songs; participants answer with `左` or `右`
- Points accumulate per round by correctness; settlement and reveal image at the end
- The reveal image marks chart types next to constants: 绿 Basic, 黄 Advanced, 红 Expert, 紫 Master, 白 Re:MASTER
- `重置二选一` can force-end the current round (admin or initiator)
:::

::: tip You Guess (20 Questions)
Requires a group admin to send `开启mai猜歌`; mutually exclusive with other
guessing modes and Letter Board in the same group.

- Send `你想我猜` / `20问猜曲` to start; Milk thinks of a maimai song
- Members send "yes/no"-style questions directly (e.g. "is it a purple chart", "is the constant over 14"), understood by an LLM; comparison words, ranges, and category/charter/version conditions are also supported
- You can guess the title at any time; `查看已有信息` / `20问进度` shows the round Q&A; `重置你想我猜` force-ends
- A wrong guess does not end the round; timeout reveals the answer; fewer questions score higher, and points stack with combo and multiplier cards
:::

::: tip Guess the Member (猜群友)
Requires a group admin to send `开启mai猜歌`; mutually exclusive with the other guessing
modes in the same group.

- Send `猜群友` to start: the question shows **three members** plus a chart, and asks whose
  achievement on that chart is the highest
- **One bet per player**: answers stay silent during the round (a repeat only earns a short
  notice); after 15 seconds all bets are revealed at once
- Settlement groups the bets by option, marks the correct option ✅, and credits each winner
  individually (the earliest correct bet counts as a ×2 first answer, with the same combo
  rules as the other modes); each correct bet pays a flat +1 BREAK
  (`groupmate_break_per_win` is configurable; point multipliers and bonus cards do **not**
  inflate BREAK)
- Visitors without qbind can play and appear on the board, but receive no BREAK
- Questions avoid the group's recently used charts and only use Expert or above;
  `重置猜群友` force-ends the round
:::

::: tip maimai Dle (maidle)
A group admin must first send `开启mai猜歌`; mutually exclusive with the other guessing games
and 开字母 **in the same group**. It plays like Wordle:

- Send `maidle` to start; the answer is drawn from the full song list (no 宴会場). Sending
  `maidle` again during a round re-sends the board
- Guess with `猜 <title>` (or `猜 <alias>` / `猜 #ID`). Each guess compares **7 columns**:
  version / genre / BPM / artist / Master constant / chart type / charter
  - 🟩 green = match; 🟨 yellow = close (adjacent version, BPM ±10, constant ±0.5, shared artist / charter)
  - ▲ / ▼ = the answer is newer / higher, or older / lower, than your guess
- **10 guesses for the whole group**, at least 6 seconds between two guesses from the same
  player; unknown titles, ambiguous aliases and repeated songs don't use a guess
- Normal mode: after 6 misses the first character of the title is revealed, and a blurred
  jacket appears for the very last guess; `maidle 困难` has no hints
- Earlier hits score more: 12 points on guess 1 down to 2 points on guess 10, +3 per tier in
  hard mode; the solver also earns the regular correct-guess BREAK
- When someone solves it, every other player who made a valid guess gets an **assist reward**
  of 2 points + 1 BREAK; nothing is paid if nobody solves it
- About 4 minutes without a guess ends the round and reveals the answer; `重置maidle` ends it early
:::

### 2.7 Play Count (PC)

| Command | Description |
|------|------|
| `更新pc数` | Bind the cabinet QR and sync PC; completion message lists available commands |
| `我的pc数` | Personal PC stats (total + top 15 songs) |
| `pc排行` / `pc全部排行` / `PC全部排行` | All synced users' PC total ranking (text list titled "PC全部排行（共 N 人）") |
| `pc数 <song>` | PC for a specific song |
| `pc50` | Top 50 charts by play count from all synced cabinet PC records, not just Rating B50; B35/B15 are layout sections only |
| `<category>pc50` | Category PC top 50: `术力口pc50` / `东方pc50` / `舞萌pc50` / `其他pc50` / `中二pc50` / `流行pc50` / `宴谱pc50` |
| `<level>pc50` | Filter by current chart level, e.g. `13pc50` / `14+pc50`; supports @user |
| `pc等级 [level]` | PC ranking for one current level (1–15, optional `+`, must exist in the song library); without an argument it shows usage and shortcut buttons (aliases `等级pc` / `PC等级`) |
| `pca50` | Your Rating B50's 50 songs re-sorted by PC (image) |
| `游玩排行50` / `游玩PC50` / `PC游玩50` / `pc游玩50` | Top 50 most-played charts library-wide (not limited to Rating B50, image) |

#### Command Comparison

| Command | What it does |
|------|------|
| `游玩排行50` | Top 50 most-played songs library-wide (image) |
| `pca50` | Your Rating B50 songs re-ordered by PC (image) |
| `pc排行` | All-user PC total ranking (text) |

::: info
`游玩排行50` is not named `pc排行50` to avoid a prefix conflict with
`pc排行`. High-play songs like `sølips` (137 plays) or `Believe the Rainbow`
(120 plays) appear in the chart even if they are not in your B50.
:::

### 2.8 Data Source & Lxns Score Checker

| Command | Description |
|------|------|
| `数据源` | View the current data source (new users default to AWMCNET) |
| `数据源 AWMCNET` / `数据源 水鱼` / `数据源 落雪` | Switch personal data source |
| `成绩趋势 [days]` | View the AWMC NET server-side Rating trend (aliases `rating趋势` / `mai趋势` / `awmc趋势`) |
| `lxbind` | Bind Lxns score checker (OAuth) |
| `lxunbind` | Unbind Lxns score checker |
| `lxb50` | Query B50 using the Lxns data source |

::: info
AWMC NET is the default score database; sending one `SGWCMAID` is enough to
query scores, no Diving Fish / Lxns binding required. B50 commands route to
AWMCNET / Diving Fish / Lxns by user preference; features Lxns does not support
(e.g. fitting, gold content) fall back to Diving Fish.
:::

### 2.9 Chart Impressions

| Command | Description |
|------|------|
| `谱面印象 <song>` | View chart impressions |
| `写谱面印象 <song> ` | Submit a chart impression |
| `谱面排行` / `谱面热度` | Chart impression popularity ranking |

::: tip
Using `查歌` (by ID or alias) **automatically includes** chart impressions,
tags, constant changes, preview links, etc.
:::

### 2.10 AWMC BREAK

| Command | Description |
|------|------|
| `AWMC签到` | Check in for BREAK; available again 24 h after the last successful check-in |
| `我的AWMC` | View account status and usage stats (including invoice returnCode stats); attaches guess-stats chart in groups |
| `AWMC帮助` | View the BREAK system help |
| `转账BREAK @用户 数量` | Transfer BREAK to another user |
| `BREAK抽奖 [1-1000]` | Default 2 BREAK per draw; 1-1000 draws at once |

::: tip BREAK guide

Suggestions go to the [AWMC forum](https://bbs.wmc.pub/forums/awmc.19/); after
AI integration, the bot modifies itself and updates automatically.

1. Check-in earns BREAK (available again **24 h after the last successful check-in**); consecutive check-ins earn more.
2. "Roast" is billed by actual Token usage (base price min 3, max 30 BREAK; ×2 during LLM peak hours), with 14 BREAK reserved before the call; success refunds/settles the difference, failure refunds everything.
3. BREAK lottery supports up to 1000 draws.
4. A normal correct song guess gives 1 BREAK by default; Guess Rating / B50 Impostor settle by round rank and difficulty.
5. "Today's maimai" adds BREAK based on luck value.
6. Chatting with the group owner may earn some BREAK.

:::

> Score queries charge 1 BREAK per actual score-API request after the daily
> first free one (cache hits are free). Normal correct song guesses give 1
> BREAK by default; Guess Rating / B50 Impostor settle by game rules. Score
> uploads are settled after success, with a daily first-success-free allowance.
> Tickets cost their price on success; a submitted request that fails has a default
> 100 BREAK penalty. See [ticket charges and penalties](#_1-5-break-tickets) for unused-ticket blocks and exceptions.

### 2.11 Class Schedule

The class schedule supports importing a course JSON, viewing personal or group
schedules, and exporting the current schedule.

| Command | Description |
|------|------|
| `课表帮助` | View class schedule help (aliases `classtable帮助` / `ct帮助` / `课表菜单`) |
| `导入课表` | Upload a class schedule JSON file and import it (aliases `ct导入` / `导入我的课表`) |
| `今天课表` / `明天课表` / `后天课表` / `昨天课表` | View the schedule for that date |
| `本周课表` | View this week's personal schedule (aliases `本周课程` / `ct周`) |
| `群课表` / `明天群课表` | View the group members' combined schedule or tomorrow's group schedule |
| `我的课表` | View schedule status (aliases `ct状态` / `课表状态`) |
| `查课表` | Query schedule by date or keyword (alias `ct查`) |
| `删除我的课表` | Delete the imported personal schedule (aliases `ct删除` / `课表删除`) |
| `导出我的课表` | Export the personal schedule (aliases `课表导出` / `ct导出`) |
| `<YYYY-MM-DD>课表` | Query a specific date's schedule, e.g. `2026-09-08课表` |

### 2.12 Advanced Features

Advanced query-bot commands and variants; daily users can skip this section.

#### Score Chart Variants

| Command | Description |
|------|------|
| `紫b50` / `白b50` / `Master b50` etc. | Filter B50 by chart difficulty (紫=Master, 白=Re:MASTER) |
| `三星b50` / `四星b50` | Filter B50 by DX stars (3-star / 4-star results) |
| `3b50` / `4b50` / `13+b50` | Filter B50 by level/constant; numeric levels and star-count filters are different conditions |
| `紫13+b50` / `14.0b50` / `13-14b50` | Combine chart difficulty with level/constant; English difficulty names like `Basic`, `Master`, `Re:MASTER` are also supported |
| `<filter>ab50` (e.g. `13+ab50`) | Same as `<filter>b50` but without B35/B15 grouping; directly takes the top 50 by Rating from filtered results |
| `紫ab50` etc. | Filter ab50 by difficulty |
| `镜代b50` etc. | Filter B50 by version era |
| `l镜代b50` / `l爽代b35` etc. | Recalculate B50/B35 with past-version constants |
| `dx2026b35` | Colorful-era B35 |
| `dx2025b50` | Recalculate 2025-version B35/B15 using the 2026-06-09 local snapshot and PRiSM constants |
| `fcb50` / `fcallb50` | FC-oriented B50 |
| `apb50` / `apallb50` | AP-oriented B50 |
| `拟合b50` / `拟合b50全部` | Sort by fitted constants |
| `寸b50` / `寸ab50` | Edge-cut (rating-line) scores |
| `锁血b50` / `锁血ab50` | Minimum-threshold (rating floor) scores |
| `越级b50` / `越级ab50` | Skill-jump scores |
| `理想b50` / `理想ab50` | Ideal B50 after one rating tier up |
| `含金量` / `含水量` | Gold content / dilution analysis |
| `锐评风格 查看` | View the saved B50 roast style |
| `锐评风格 设置 <description>` | Save a custom B50 roast tone |
| `锐评风格 重置` | Clear the custom roast style |

#### Analysis / Score Push / Battle

| Main command | Aliases | Example | Description |
|------|------|----------|------|
| `弱项处方` | `弱项处方单` `底力处方` `练习推荐` | `弱项处方` / `弱项处方@user` | Finds weak spots from your actual scores and builds an eight-card training panel; the practice range is anchored to your B50 constants |
| `b50风险` | `B50风险` `b50风险预警` `风险预警` | `b50风险` / `b50风险@user` | B50 risk warning image |
| `对战战绩` | `headtohead` `h2h` `对决战绩` | `对战战绩@friend` | Head-to-Head comparison chart |
| `目标rating` | `rating沙盘` `目标分` `推分沙盘` | `目标rating 16000` / `目标rating 15500@user` | Rating sandbox text plan |
| `底力分析` | — | `底力分析` / `底力分析@user` | One "score panorama" image: compares your achievement per chart tag against charts of the same constant band, colouring strengths / weaknesses relative to your overall level; tags with too few samples are marked as insufficient evidence. For reference only |
| `锐评一下` | `分析b50` `B50分析` | `锐评一下` | LLM roast of your B50; charged by actual tokens, 14 BREAK reserved before the call, success refunds/settles the difference, failure refunds in full |

#### Floor

| Command | Description |
|------|------|
| `地板` | Overall B35/B15 floor |
| `地板 14+` | Floor for 14+ charts in B50 |
| `地板 紫13` / `地板 master` | Filter by difficulty level + constant |
| `b50地板` / `rating地板` | Aliases for the above |
| `地板 @user` | Someone else's floor |

#### Chinese Shorthand Progress

| Example | Equivalent | Completion condition |
|------|----------|--------|
| `13将` / `13将进度` | `13 sss进度` | Achievement ≥100% |
| `14+极` | `14+ fc进度` | FC and above |
| `13神` | `13 ap进度` | AP and above |
| `13舞舞` | `13 fsd进度` | FSD and above |
| `13者` | `13 bbb进度` | Achievement ≥80% |

Also supports `13将 未完成`, `13将 2` pagination, and `13将 @user` for others.

#### Data Storage & Reports

::: warning
**Enable data storage** first.
:::

| Command | Description |
|------|------|
| `开启存储数据` / `开启数据存储` | Enable automatic storage and attempt an immediate full sync |
| `立即存储数据` | Manually save a snapshot |
| `关闭存储数据` | Disable auto storage |
| `存储历史` | View historical archive IDs |
| `查看存档 <ID>` | View a snapshot's details |
| `日报` / `周报` / `月报` | 1/7/30-day score report images |
| `年报` | One-year score report |
| `对比存档 <old ID> <new ID>` | Compare two snapshots |
| `牌子统计` | Fetch all tracker scores live and render one long image of each version's nameplate requirements and your progress, with song jackets marked unplayed / played / SSS; falls back to text if rendering fails |

#### Score-Push Recommendations (multi-route)

`今日吃分推荐` (aliases `吃分推荐` / `今日推分推荐`) and `我要上<score>分` are now both
produced by the **multi-route** engine: it splits candidates into the **steady / challenge /
explore** routes, gives each one an **independent net gain** (they do not add up), and renders a
chart showing the current → target achievement and the reasoning.

| Command | Description |
|------|------|
| `今日吃分推荐` / `吃分推荐` | Generate multi-route score-push advice (data storage must be enabled; billed as `today_gain_recommend`) |
| `吃分换批` | Get another batch in the same session (seen charts never repeat; **no extra generation fee**) |
| `吃分反馈 <number> <不喜欢/卡住/跳过>` | Rate; affects later filtering |
| `吃分撤销` | Undo feedback in this session (other categories of the same chart are unaffected) |
| `吃分重看` | Explicitly restart the session (long-term feedback is kept) |
| `吃分练习` | Open the bottleneck-practice page, separate from direct pushing |
| `我要上<score>分` / `我要在<level>上<score>分` | Target-score pushing (old entry points, delegated to the multi-route engine, works in private chat) |

::: tip Group assistance
Recommendations blend in **group assistance** (a baseline built from members who share data) by
default, which improves ranking for rarely-played charts; without sharing or with too few
samples it silently falls back to your personal baseline.
:::

#### Group Interaction Extras

| Command | Description |
|------|------|
| `群聊rating排行榜` | In-group Rating ranking |
| `群吃分榜` / `群寸止榜` / `群锁血榜` | In-group leaderboards |
| `开启mai猜歌` / `关闭mai猜歌` | **Group admin**: toggle guessing |
| `开启狼人杀` / `关闭狼人杀` | **Group admin**: toggle Werewolf (shares the guessing switch) |
| `开启phi` / `关闭phi` | **Group admin**: toggle Phigros lookup (see [Phigros](/en/guide/bot/phigros)) |
| `开启别名推送` / `关闭别名推送` | **Group admin**: alias push for this group |
| `排卡帮助` / `排卡教程` | View arcade queue-card feature usage |
| `排卡列表` | View configured arcade queue-card lists |
| `小游戏权限不再提醒 <revision>` | **Owner / group admin**: stop the official-QQ "mini-game permission" reminder with the revision from the latest reminder (alias `游戏权限不再提醒`) |

::: tip Mini-game permissions on the official QQ
To start mini-games (guessing, Guess the Member, Werewolf, …) in an official QQ group, the
owner must grant the bot the "proactive / receive message" permission. When it is missing the
bot posts an image reminder at round start; after checking the settings the owner can send
`小游戏权限不再提醒 <revision>` (or tap the "don't remind again" button) to silence it for that
revision. The reminder returns automatically when the permission state changes.
:::

#### Arcade Queue (排卡) {#arcade-queue}

A group admin first enables the queue in the [Group Console](/en/guide/bot/group-console) and
adds arcades with aliases under "Arcade queue". Members then send **arcade alias + suffix**;
for an arcade with alias `xjj`:

| Message | Description |
|------|------|
| `xjj几` / `xjjj` | Current head count, cabinet count, last report time and estimated wait |
| `xjj3` | Report the current head count as 3 |
| `xjj+1` / `xjj-1` | Add to / subtract from the current count |
| `predict xjj` | Forecast the near-term trend from recent reports (says so when samples are too few) |
| `weather xjj` | Weather at the arcade (needs latitude / longitude set in the console) |
| `subweather xjj` / `unsubweather xjj` | **Group admin**: subscribe / unsubscribe the daily weather digest; `subweather list` shows subscriptions |
| `排卡列表` | List all arcades in this group with current counts |

- Wait time assumes about 17 minutes per round per cabinet; for reference only.
- A count above 99, or a jump of more than 50 from the last report, is treated as a typo and ignored.
- With a Nearcade shop / game ID set in the console, reports sync to [Nearcade](https://nearcade.cn)
  and queries prefer Nearcade data.

#### Admin Rendering & Precache Status

| Command | Description |
|------|------|
| `猜歌预制状态` / `猜歌预制` / `预制状态` | **Admin**: inspect guess-audio/chart precache task status |
| `渲染状态` / `查询渲染` / `渲染任务` | **Admin**: inspect image and video rendering progress |
| `发加倍卡 @user [count] [hours]` | **Group admin**: defaults to 1 card / 24 hours; also accepts `发加倍卡 全体 [count] [hours]`. A correct answer consumes one card for ×2 points, distinct from shop double-BREAK cards. On official QQ, “all” covers recorded members only |
| `迁移数据` | **Admin**: migrate guess data |

#### Admin & Platform Configuration

The following commands need plugin admin or group admin permissions; regular
users don't need them.

| Command | Description |
|------|------|
| `设置入群欢迎词 <text>` / `开启入群欢迎` / `关闭入群欢迎` / `查看入群欢迎` | **Plugin admin**: manage welcome messages |
| `群绑定QQ <QQ number>` / `解绑群QQ` / `群绑定状态` | Manage official QQ group and historical QQ group mappings |
| `强制绑定QQ <QQ number>` | Admin-assisted user QQ binding |
| `设置QQ菜单` / `QQ菜单` | Push or query the official QQ menu |
| `设置QQ面板` / `QQ面板列表` / `QQ面板详情` / `删除QQ面板` | Manage official QQ command panels |
| `我的id` / `platformid` | Query the current platform user ID (available to regular users) |
| `锐评风格 设置 <description>` / `锐评风格 重置` | Save or clear personal roast style; view with `锐评风格 查看` |
| `更新maimai数据` / `更新别名库` | Update the song library or alias library |
| `更新定数表` / `更新完成表` | **Plugin admin**: rebuild constant / completion table resources |
| `发布公告` / `编辑公告` / `删除公告` | Manage bot announcements |
| `创建卡密` / `查询卡密` / `作废卡密` / `卡密列表` / `卡密统计` | Manage BREAK card codes |
| `锐评模型配置` | View or adjust LLM roast runtime config |
| `向量检索配置` | View or adjust the title vector-search (embedding) configuration: `开` / `关` / `URL <address>` / `模型 <name>` (aliases `曲名向量配置` / `embedding配置`) |
| `命令排行 [command]` | Server-wide command usage ranking for the last 7 days (Top 20); with a command name, that command's 7-day detail (image) |
| `关闭BREAK计费` / `开启BREAK计费` | Temporarily toggle BREAK billing |
| `群成员记录` | View official QQ group member mapping records |
| `后台身份` | View the identity recognized by the group management backend |
| `群管理` / `管理后台` / `群后台` | Get a one-time login link for the group management console (see [Group Console](/en/guide/bot/group-console)) |
| `设置全局签到加成 <percent> [start date] [end date]` | Set a global check-in bonus; `0` / `off` / `关闭` disables it immediately |
| `加成设置` / `加成管理` / `加成配置` | Manage check-in bonus rules: `添加` / `编辑` / toggle / `删除` (weekly / group / date / streak) |
| `维护模式 [开/关]` | Enable or disable global maintenance mode |
| `维护消息 <text>` | Set the maintenance notice shown to users |

#### Appendix: QQ Poke

The bot reacts to QQ pokes. If the bot is an admin, it may trigger a random
**mute** (up to 1 day). Poke with caution.

### 2.13 Werewolf (狼人杀)

A multiplayer werewolf game started in the group, with actions in both the group and private
chat. State lives in memory only (**a bot restart dissolves the round**); treat the live
`狼人杀帮助` text as authoritative.

| Command | Description |
|------|------|
| `狼人杀` | Start a round and return the game ID |
| `狼人杀加入` / `狼人杀报名` | Join (private-chat `加入 <game ID>` works too) |
| `狼人杀开始` / `狼人杀开局` | **Initiator / admin**: start early once the player count is met |
| `狼人杀延长` / `延长报名` / `延长` | Extend the join window by 30 seconds (2 times globally) |
| `退出狼人杀` / `退出报名` | Leave during the join window (after the start you play the round out; alias `不玩了`) |
| `狼人杀状态` / `狼人杀战况` | View the phase, survivors and countdown |
| `狼人杀名单` / `狼人杀玩家` | View the round roster |
| `结束狼人杀` / `解散狼人杀` | **Initiator / admin**: force-end the round |
| `狼人杀帮助` / `狼人杀说明` | View the live rule text |
| `开启狼人杀` / `关闭狼人杀` | **Group admin**: per-group switch (shares the guessing switch) |

**Private-chat actions**: `身份` (resend your role), `刀 <number>`, `查验 <number>`,
`救` / `毒 <number>` / `不用`, `守 <number>`, `开枪 <number>` / `不开枪`,
`投票 <number>` / `弃权`, `说 <text>`. With 9+ players there is also the sheriff role
(`上警` / `退水` / `投警 <number>` / `警徽流 <number>` / `撕警徽`).

::: tip Rules at a glance
- 4–16 players; roles are derived as "wolves ≈ ⌊players / 3⌋, one seer, one witch, the rest
  villagers", with guard / idiot / hunter added in larger rounds (the live broadcast is
  authoritative).
- The day has three parts: **rotating speeches** (a fixed slot each, only the current
  speaker may talk in the group; `结束发言` hands over early) → **open chat** → **voting
  window** (group muted, votes by private message; you may vote any time from day start).
- The night defaults to two parts: 🛡️guard / 🐺wolves / 🔮seer act in the same window, then
  🧪the witch uses her potions.
- Every phase starts with a 5-second grace window; speaking in the group when it is not your
  turn (or after death) is **recalled and charged BREAK** (10 alive / 100 dead, configurable).
- Rewards split a pool that scales with the player count (100 at 4 players, capped at 600);
  a wolf win multiplies by 1.2, plus survival and MVP bonuses; the switch and parameters are
  hot-configurable by an admin.
:::

### 2.14 Voting (投票)

A group admin can open a poll in the group; results live in the console's "投票结果" page
(bar / pie charts plus the admin-only detail).

| Command | Description |
|------|------|
| `创建投票 <title> <optionA/optionB/...>` | **Group admin**: multi-option poll (at least 2 options) |
| `创建曲目投票 <title> [candidate1/candidate2/...]` | **Group admin**: song poll; leave candidates empty = open submission (reply a title to vote) |
| `创建范围投票 <title> 难度13~14 [duration]` | **Group admin**: song poll limited to a constant range (alias `创建定数投票`) |
| `投票 <id> [content]` | Vote / change vote; without content it shows details and buttons (alias `参与投票`) |
| `投票结果 <id>` | View the anonymous tally of that poll |
| `投票列表` | List open polls (alias `进行中的投票`) |
| `关闭投票 <id>` | Settle early (alias `结束投票`) |

- A duration can be written as `30分钟` / `2小时`; the default is 60 minutes. Polls settle
  and announce automatically at the deadline.
- Creating / closing requires **group owner or admin**; a plugin admin can put "全服" in the
  title to create a **server-wide poll** (visible in every group, votes aggregated globally,
  with the announcement sent to the creating group).
- The console's "投票结果" page lists polls with vote charts and the **admin-only ballot
  detail**.

### 2.15 Join Verification, Auto-Approval & Kicking (group admins) {#group-moderation}

These commands only work in groups and need the **group owner / an admin** (or a manager
granted in the Group Console). The Bot must be a group admin to approve, kick or mute.

#### Join verification (入群验证)

When enabled, the Bot posts a question for each new member, who simply **replies with the
answer in the group**. Timing out or using up all attempts removes the member.

| Command | Description |
|------|------|
| `入群验证` / `入群验证 状态` | Show this group's verification settings (aliases `群验证` / `人机验证`) |
| `入群验证 开启` / `入群验证 关闭` | Turn verification on / off |
| `入群验证 题目 算术` / `入群验证 题目 验证码` | Question type: arithmetic, or a 4-character code |
| `入群验证 兼容模式 开启` / `关闭` | Compatibility mode (on by default) sends plain-text questions on every platform; turning it off may leave some clients unable to answer |

- 90 seconds and 3 attempts by default; other commands from that member are ignored while verifying.
- On failure the member is kicked; if the Bot lacks the official kick permission (error 11253)
  it **mutes them for 30 days** instead and asks admins to remove them manually.

#### Auto-approval (自动审批)

Handles join requests by keyword (matched against the verification message the applicant
typed). When enabled, the Bot scans pending requests in the background.

| Command | Description |
|------|------|
| `自动审批` / `自动审批 查看` | Show settings (aliases `加群自动审批` / `入群审批设置`) |
| `自动审批 开启` / `自动审批 关闭` | Turn auto-approval on / off |
| `自动审批 关键词 添加 <word>` | Add an approval keyword, e.g. `自动审批 关键词 添加 舞萌` |
| `自动审批 关键词 删除 <word>` / `清空` / `查看` | Manage the keyword list |
| `自动审批 严格模式 开启` / `关闭` | Strict: requests without a keyword are **rejected**; lenient (default): left for an admin |
| `自动审批 频率 <seconds>` | Scan interval, default 30 s, range 15–600 s |
| `自动审批 播报 开启` / `关闭` | Announce auto-approved members in the group |
| `群审批` | Process the pending list right now and report approved / rejected / pending counts (aliases `执行群审批` / `处理入群申请`) |

#### Kicking & group blacklist

| Command | Description |
|------|------|
| `mai踢 @member` | Remove a member (aliases `踢人` / `移出成员`; with an @ you can also send `踢 @member`) |
| `mai踢 @member -b` | Remove and blacklist, so they cannot request to join again |
| `mai拉黑 <OpenID>` | Blacklist someone **no longer in the group** (aliases `拉黑` / `群黑名单`); use `mai踢 @member -b` for current members |
| `mai解封 @member` / `mai解封 <OpenID>` | Remove from the blacklist (aliases `解封` / `移出黑名单`) |

::: info No false triggers from chat
`踢` only fires when followed by an @ or written as `踢 <OpenID>`; everyday phrases like
"踢我" or "踢球" are ignored. On official QQ groups the kick / blacklist APIs need Tencent's
permission; without it a kick falls back to a 30-day mute.
:::

---

## Contact & Feedback

- **QQ Groups**: [Group 1 · 1072033605](https://qm.qq.com/q/Gj3QmfEyY0) (main) · [Group 2 · 993795066](https://qm.qq.com/q/PF5t1VXPi0) (games) · [Rules](/en/guide/group-rules)
- **Website**: https://awmc.cc
