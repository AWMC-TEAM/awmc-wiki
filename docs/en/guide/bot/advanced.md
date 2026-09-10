# AWMC BOT Command Reference

::: tip
Use the search shortcut <kbd>/</kbd> (desktop) or the search button at the top (mobile) to find topics.
:::

::: tip Forum account binding (qbind)
The full flow for binding your score-query QQ to your AWMC forum account is in
[Basic Tutorial · Forum Account Binding (qbind)](/en/guide/bot/intro#viii-forum-account-binding-qbind).
:::

Account binding, B50 uploads, tickets, PC sync, score queries, and group
interactions are now all merged into the same QueryBot. The command prefix is
determined by the platform configuration; this page uses no prefix below.

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

See [AWMC BOT Terms of Service & Privacy Policy](/en/guide/bot/terms#10-disclaimer), Section 10.
:::

| Command | Description |
|------|------|
| `AWMC签到` / `签到` | Daily check-in for BREAK |
| `AWMC补签` / `补签` | Make up yesterday's check-in; max 3 times per month, costing 30 / 60 / 90 BREAK in order, no bonus rewards |
| `AWMC帮助` / `BREAK帮助` | View the BREAK system help |
| `我的AWMC` | View BREAK, check-in streak, and usage stats, including invoice success/failure rate and `returnCode=0`, null/missing counts; auto-attaches the group song-guess data chart in groups |
| `BREAK统计` / `BREAK收支` | View today's, last 7 days', and last 30 days' BREAK income, spending, and net change for all users |
| `转账BREAK @用户 数量` | Transfer BREAK to another user |
| `BREAK抽奖 [1-10]` | Default 2 BREAK per draw |
| `BREAK抽奖 帮助` | View pool, probabilities, costs, and examples |
| `发红包 [total] [count]` | Send a BREAK luck red packet in the group (alias `BREAK红包`); sending just `发红包` follows prompts |
| `抢红包` | Claim the current group red packet, once per user (alias `领红包`) |
| `红包状态` | View red packet claim details (aliases `红包记录` / `查看红包`) |
| `收回红包` | Withdraw a red packet after 90 seconds; unclaimed balance returns (alias `重置红包`) |
| `兑换卡密 [code]` | Redeem BREAK / double / FREEDOM card codes, auto-redeemed in group and private chat (aliases `redeem` / `兑换码`) |
| `我的卡密` | View active card-code bonuses (aliases `卡密状态` / `我的加成`) |
| `卡密商店` / `BREAK商店` | View currently redeemable or purchasable card codes |
| `抽奖池` / `贡献榜` | View the current welfare pool and today's contributions |
| `领取福利` / `领福利` | Claim eligible welfare pool rewards |
| `贡献总榜` / `首富榜` | View cumulative contribution ranking |
| `mai发票` / `发票` / `fp <2/3/5>` | Request 2x, 3x, or 5x tickets; first successful one each day is free, then multiplier × 10 BREAK (20 / 30 / 50) |
| `mai查票` / `查票` | Query valid tickets; formatted by type, stock, and expiry, without showing the account UID |

### 1.6 Account Advanced Operations (Billing / High Risk)

::: danger Warning
`mai改成绩`, `mai删成绩`, and `mai改道具` directly modify maimai account data.
`mai改道具` has not been tested on a real account and may cause irreversible
data corruption; you bear the risk yourself. See
[AWMC BOT Terms of Service & Privacy Policy](/en/guide/bot/terms#10-disclaimer), Section 10.
:::

| Command | Description |
|------|------|
| `mai预览` | Query account preview info (5 BREAK on successful query; no charge on failure) |
| `mai道具` | Query the account item list (5 BREAK on successful query) |
| `mai门状态` / `mai查门` / `查门` | Read-only display of Kaleidx Gate discovery, key, and clear status (5 BREAK on successful query) |
| `maievent` / `mai活动` / `舞萌活动` | Query the account's current event |
| `mai改成绩 [song difficulty achievement DX score FC FS]` | Interactive or one-line score edit; DX score 0-5 is star/simple mode, actual score auto-selects pro mode; 75 BREAK per successful entry |
| `mai删成绩 [song difficulty]` | Interactive or one-line score deletion; 50 BREAK per successful entry |
| `mai改道具 [itemKind itemId add/del]` | High-risk item mutation; 100 BREAK on success; bulk `upsert-all` is not exposed by the Bot |

---

## 2. Query & Group Interaction

> Regular-user query bot commands only; no admin commands. Advanced variants,
> data analysis, and group-admin features are in [2.12 Advanced Features](#212-advanced-features).

### 2.1 Basics

| Command | Description |
|------|------|
| `帮助maimaiDX` | View the help image |
| `项目地址maimaiDX` | View project info |
| `今日mai` | Daily fortune and recommended song |
| `主题` | View or switch score chart theme |
| `查看排名` | Global Rating leaderboard |
| `我的排名` | Your Rating ranking |

### 2.2 Song Search

| Command | Description |
|------|------|
| `查歌 <keyword>` | Search by title / alias |
| `定数查歌 <constant>` | Search by constant |
| `bpm查歌 <bpm>` | Search by BPM |
| `曲师查歌 <artist>` | Search by artist |
| `谱师查歌 <charter>` | Search by charter |
| `<alias>是什么歌` | Look up a song by alias |
| `id <song ID>` | Song details |
| `谱面<ID><difficulty>` | Chart preview, difficulty: green / yellow / red / purple / white |
| `提取曲绘 <song ID>` | Extract jacket art |
| `mai什么` | Random song recommendation |
| `mai什么推分` | Random score-push recommendation |
| `来个<level>` | Random song at a level |
| `来个dx<level>` / `来个sd<level>` | Random DX / standard song |
| `来个<difficulty><level>` | Random song with difficulty and level, e.g. `来个紫14+` |

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
| `minfo` | Personal play info |
| `ginfo` | Group play info |
| `分数线` | Score line query |
| `友人对战` | Random in-group friend battle (add a number to tighten the Rating gap, e.g. `友人对战 300`) |
| `友人对战排行` | In-group friend battle records ranking (aliases `友人排行` / `友人对战排名`) |
| `b50鸟率` / `B50鸟率` / `b50鳥率` | B50 "bird" (SSS+) rate stats (image) |
| `b50鸟加率` / `B50鸟加率` / `b50鳥加率` / `b50鸟+率` | B50 "bird plus" (SSS+ full combo) rate stats (image) |

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
| `我要上<score>分` | Score-push recommendations |
| `我要在<level>上<score>分` | Level-specific score-push recommendations |
| `<level>分数列表` | Score list for that level |

Achievement marks support: `ap` `fc` `fcp` `fs` `fsp` `ss` `sss` `sync`, etc.

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
prompt to join the [AWMC official group](https://qm.qq.com/q/ZIJWblUc4E) before
starting.
:::

| Command | Description |
|------|------|
| `猜歌` | Text guessing |
| `猜曲绘` / `猜曲绘1`～`猜曲绘4` | Jacket guessing; specify difficulty 1-4 |
| `猜曲子` | Audio guessing |
| `猜铺面` / `猜谱面` | Chart-video guessing (muted early phase, ending BGM; correct-answer chime and countdown) |
| `猜Rating` | Random difficulty 1-5; guess the total Rating of an anonymous B50 within 60 seconds |
| `猜Rating1`～`猜Rating5` | Specify difficulty; higher levels show fewer cards and fewer clues |
| `猜Rating3 90` | Difficulty 3 with a 90-second answer window (10-300 seconds supported) |
| `重置猜rating` | Force-end the current Guess Rating round |
| `找内鬼` / `找假卡` | Find the one card whose song RA was altered among five B50 cards |
| `重置找内鬼` | Force-end the current B50 Impostor round |
| `舞萌极限二选一` / `极限二选一` / `二选一` | Join the five-round left/right song comparison; answer each round with `左` or `右` |
| `加入` / `参赛` | Join the current Extreme Two-Choice round |
| `重置二选一` | Force-end the current Extreme Two-Choice round |
| `你想我猜` / `20问猜曲` | Milk thinks of a song; members ask "yes/no" questions to narrow it down and guess the title; fewer questions score higher, with combo and multiplier cards stacking |
| `重置你想我猜` / `重置20问` | Force-end the current "You Guess" round |
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
| `猜歌积分排行` | Total points leaderboard |
| `本群猜歌排行` | View this group's guess participation and points ranking |
| `猜歌积分日榜` / `猜歌积分周榜` / `猜歌积分月榜` / `猜歌积分年榜` / `猜歌积分赛季榜` | Period leaderboards |
| `猜歌历史日榜` / `猜歌历史周榜` / `猜歌历史月榜` / `猜歌历史年榜` / `猜歌历史赛季榜` | Historical period boards |
| `我的猜歌` / `猜歌数据` / `猜歌统计` | Personal guess-stats chart: nine modes, 30-day trend, points/count share donuts, mode cards, and recent details; `我的猜歌 @user` for others |

::: tip BREAK earnings
Daily BREAK cap from mini-games: 40 / day globally; per game, 猜歌/猜曲绘/猜曲子/
猜铺面/你想我猜 are capped at 20 each, 开字母/猜Rating/找内鬼 at 15 each, and
极限二选一 at 10. Once a game's cap is reached that game stops awarding, and
once the global cap is reached all games stop awarding; reset at midnight.
During an active double-BREAK card, earnings are doubled and these caps are
waived.
:::

::: tip My guess stats
- Nine modes: 猜歌 / 猜曲绘 / 猜曲子 / 猜铺面 / 开字母 / 猜 Rating / 找内鬼 / 二选一 / 你想我猜
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
(猜歌 / 曲绘 / 曲子 / 铺面 / 猜 Rating / 找内鬼). Over limit:

`嘿嘿，你的答案被我吃掉啦！(x.x秒后才能发送新的答案）`
:::

::: tip Guess Rating
Requires a group admin to send `开启mai猜歌`; mutually exclusive with other
guessing modes and Letter Board in the same group.

- Randomly selects a group member → hides their B50 identity and scores by difficulty → guess the Rating with a number within 60 seconds → answers can be changed → closest wins
- `猜Rating` picks a random difficulty; `猜Rating1`～`猜Rating5` pick one explicitly; append a 10-300 second timer, e.g. `猜Rating3 90`
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

- The system randomly draws five B50 cards from a group member and changes the song RA on one of them to a wrong value
- Send `1`～`5` within 45 seconds; answers can be changed; speed ranking uses the final-answer submission time
- The selected B50 owner cannot submit a valid answer or enter the reward list
- First correct: 10 points + 2 BREAK; second: 6 points + 1 BREAK; third and later correct players: 3 points
- Settlement highlights the impostor card and shows both the real and altered RA
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

### 2.7 Play Count (PC)

| Command | Description |
|------|------|
| `更新pc数` | Bind the cabinet QR and sync PC; completion message lists available commands |
| `我的pc数` | Personal PC stats (total + top 15 songs) |
| `pc排行` / `pc全部排行` / `PC全部排行` | All synced users' PC total ranking (text list titled "PC全部排行（共 N 人）") |
| `pc数 <song>` | PC for a specific song |
| `pc50` | B50 sorted by play count (`pc:xx` on the card corner) |
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
| `AWMC签到` | Daily check-in for BREAK |
| `我的AWMC` | View account status and usage stats (including invoice returnCode stats); attaches guess-stats chart in groups |
| `AWMC帮助` | View the BREAK system help |
| `转账BREAK @用户 数量` | Transfer BREAK to another user |
| `BREAK抽奖 [1-10]` | Default 2 BREAK per draw; 1-10 draws at once |

::: tip BREAK guide

Suggestions go to the [AWMC forum](https://bbs.wmc.pub/forums/awmc.19/); after
AI integration, the bot modifies itself and updates automatically.

1. Daily check-in earns BREAK; consecutive check-ins earn more.
2. "Roast" is charged at token base price ×3, with 6 BREAK reserved before the call; success refunds/settles the difference, failure refunds everything.
3. BREAK lottery supports up to 10 draws.
4. A normal correct song guess gives 1 BREAK by default; Guess Rating / B50 Impostor settle by round rank and difficulty.
5. "Today's maimai" adds BREAK based on luck value.
6. Chatting with the group owner may earn some BREAK.

:::

> Score queries charge 1 BREAK per actual score-API request after the daily
> first free one (cache hits are free). Normal correct song guesses give 1
> BREAK by default; Guess Rating / B50 Impostor settle by game rules. Score
> uploads and tickets are only settled after the external operation actually
> succeeds, and each has its own daily first-success-free allowance.

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
| `弱项处方` | `弱项处方单` `底力处方` `练习推荐` | `弱项处方` / `弱项处方@user` | Weakness prescription image |
| `b50风险` | `B50风险` `b50风险预警` `风险预警` | `b50风险` / `b50风险@user` | B50 risk warning image |
| `对战战绩` | `headtohead` `h2h` `对决战绩` | `对战战绩@friend` | Head-to-Head comparison chart |
| `目标rating` | `rating沙盘` `目标分` `推分沙盘` | `目标rating 16000` / `目标rating 15500@user` | Rating sandbox text plan |
| `底力分析` | — | `底力分析` | B50 tag radar chart + bar chart, for reference only |
| `锐评一下` | `分析b50` `B50分析` | `锐评一下` | LLM roast of your B50; charged by actual tokens, 10 BREAK reserved before the call, success refunds/settles the difference, failure refunds in full |

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
| `立即存储数据` | Manually save a snapshot |
| `关闭存储数据` | Disable auto storage |
| `存储历史` | View historical archive IDs |
| `查看存档 <ID>` | View a snapshot's details |
| `日报` / `周报` / `月报` | 1/7/30-day score report images |
| `年报` | One-year score report |
| `对比存档 <old ID> <new ID>` | Compare two snapshots |
| `今日吃分推荐` | Personalized push suggestions based on history (text) |
| `牌子统计` | Plate achievement stats |

#### Group Interaction Extras

| Command | Description |
|------|------|
| `群聊rating排行榜` | In-group Rating ranking |
| `群吃分榜` / `群寸止榜` / `群锁血榜` | In-group leaderboards |
| `开启mai猜歌` / `关闭mai猜歌` | **Group admin**: toggle guessing |
| `开启别名推送` / `关闭别名推送` | **Group admin**: alias push for this group |
| `排卡帮助` / `排卡教程` | View arcade queue-card feature usage |
| `排卡列表` | View configured arcade queue-card lists |

#### Admin Rendering & Precache Status

| Command | Description |
|------|------|
| `猜歌预制状态` / `猜歌预制` / `预制状态` | **Admin**: inspect guess-audio/chart precache task status |
| `渲染状态` / `查询渲染` / `渲染任务` | **Admin**: inspect image and video rendering progress |
| `发加倍卡` | **Group admin**: grant song-guess multiplier cards |
| `迁移数据` | **Admin**: migrate guess data |

#### Admin & Platform Configuration

The following commands need plugin admin or group admin permissions; regular
users don't need them.

| Command | Description |
|------|------|
| `设置入群欢迎词 <text>` / `开启入群欢迎` / `关闭入群欢迎` / `查看入群欢迎` | Manage group welcome messages |
| `群绑定QQ <QQ number>` / `解绑群QQ` / `群绑定状态` | Manage official QQ group and historical QQ group mappings |
| `强制绑定QQ <QQ number>` | Admin-assisted user QQ binding |
| `设置QQ菜单` / `QQ菜单` | Push or query the official QQ menu |
| `设置QQ面板` / `QQ面板列表` / `QQ面板详情` / `删除QQ面板` | Manage official QQ command panels |
| `我的id` / `platformid` | Query the current platform user ID (available to regular users) |
| `锐评风格 设置 <description>` / `锐评风格 重置` | Save or clear personal roast style; view with `锐评风格 查看` |
| `更新maimai数据` / `更新别名库` | Update the song library or alias library |
| `发布公告` / `编辑公告` / `删除公告` | Manage bot announcements |
| `创建卡密` / `查询卡密` / `作废卡密` / `卡密列表` / `卡密统计` | Manage BREAK card codes |
| `锐评模型配置` | View or adjust LLM roast runtime config |
| `关闭BREAK计费` / `开启BREAK计费` | Temporarily toggle BREAK billing |
| `群成员记录` | View official QQ group member mapping records |
| `后台身份` | View the identity recognized by the group management backend |

#### Appendix: QQ Poke

The bot reacts to QQ pokes. If the bot is an admin, it may trigger a random
**mute** (up to 1 day). Poke with caution.

---

## Contact & Feedback

- **QQ Group**: [1072033605](https://qm.qq.com/q/7157yt6n6w)
- **Website**: https://awmc.cc
