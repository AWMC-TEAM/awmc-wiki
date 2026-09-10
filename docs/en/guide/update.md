# Changelog

Subsequent changelogs are posted on [Afdian Updates](https://afdian.com/a/AWMC_TEAM?tab=feed).

## September 2026

### 2026/09/08

<Badge type="tip" text="Docs" />

- **Level-filtered B50 notes** — Added usage for filtering B50 by level/constant (`13+b50`, `紫13+b50`, `14.0b50`, etc.), and clarified that `ab50` cancels B35/B15 grouping and directly takes the top 50 by Rating from the filtered results.
- **"Single-song-level B50" meaning** — Clarified that this feature filters the specified level or constant from the user's full scores, recalculates per-song Rating, and forms a conditional B50; it is not a single-song query, nor a list of the whole song library at that level.
- **Command list completion** — Compared against source code and added `同步b50`, `年报`, class schedules, Diving Fish OAuth, queue cards, welfare pool, `dx2025b50`, `锐评风格`, plus admin commands for card codes, announcements, and QQ platform configuration.

## August 2026

### 2026/08/10
AWMC Version `V26.10.1` [AWMC V2]

<Badge type="tip" text="New Feature" />

- **AWMC NET binding-free score query** — New default score database [AWMC NET.](https://net.wmc.pub); new users default to AWMCNET. Sending one `SGWCMAID` auto-creates the profile and syncs scores, so B50 can be queried without binding Diving Fish / Lxns. The first sync tells you to register NET with your QQ email; switch with `数据源 AWMCNET/水鱼/落雪`.
- **Rating trend** — Added `成绩趋势` / `rating趋势` / `mai趋势` / `awmc趋势 [days]`, reading the daily Rating trend from AWMC NET without enabling local data storage.
- **Card code system** — Added `兑换卡密` / `redeem` to redeem BREAK / double / FREEDOM card codes, auto-redeemed in group and private chat; `我的卡密` / `卡密状态` shows active bonuses; admins can create, query, invalidate, and tally card codes.
- **You Guess (20 questions)** — Added `你想我猜` / `20问猜曲`; Milk thinks of a song and members narrow it down with yes/no questions. LLM semantic understanding; supports category/charter/version/constant comparison questions, mid-round title guesses, `查看已有信息` / `20问进度`, and `重置你想我猜`; mutually exclusive with other guessing modes per group.
- **Account read-only queries** — Added `mai预览` / `mai道具` (5 BREAK per successful query) and `mai门状态` / `mai查门` / `查门` (5 BREAK), read-only account preview, item list, and Kaleidx Gate discovery/key/clear status.
- **Score & item management** — Added interactive and one-line `mai改成绩` / `改分` (75 BREAK / entry) and `mai删成绩` / `删分` (50 BREAK / entry), with title/alias resolution, difficulty selection, percentage achievements, and auto simple/pro mode by DX stars or actual score; added confirm-required `mai清票` / `清票` (10 BREAK) to clear Charge tickets and `mai改道具` / `改道具` (100 BREAK, high risk, untested).
- **BREAK red packets** — Added `发红包 [total] [count]` group luck red packets, `抢红包` to claim, `红包状态` for claim details, and `收回红包` (after 90 seconds, unclaimed balance returns); amounts not claimed within 10 minutes return automatically.
- **Make-up check-in & economy stats** — Added `AWMC补签` / `补签` for yesterday's check-in, max 3 times per month costing 30 / 60 / 90 BREAK; added `BREAK统计` / `BREAK收支` for today / 7-day / 30-day global income and spending; `BREAK抽奖 帮助` shows pool probabilities; `贡献总榜` / `首富榜` shows cumulative all-in contributions.
- **Announcements & gate guides** — Added `公告列表` and `确认阅读公告`; sending blue/white/purple/black/yellow/red gate names, `哪些门`, or `门攻略 [gate name]` returns the corresponding Kaleidx gate guide links.
- **Other commands** — Added `谱面排行` / `谱面热度`, `友人对战排行`, and `不同意共享我的数据` / `同意共享我的数据` / `数据共享状态`.

<Badge type="warning" text="Optimization" />

- **AWMC Gateway API v2** — Adapted to the new response envelope; invoices now execute synchronously using recent real latency estimates; removed the obsolete invoice queue query and `maiqueue` command.
- **Invoice pricing** — Adjusted to multiplier × 10 BREAK (2x 20, 3x 30, 5x 50); legacy default multiplier prices migrate automatically at startup; only 2 / 3 / 5 multipliers are allowed by default.
- **Roast billing** — `锐评一下` now bills by actual model tokens, reserving 10 BREAK before the call, settling the difference on success and refunding fully on generation or rendering failure; conclusions now include anonymized sample count, chart coverage, and confidence, and push candidates estimate per-song gain from B35/B15 floors.
- **Check-in economy convergence** — Streak reward cap is 3; group multipliers no longer amplify streak rewards; fixed MySQL `break_config` missing primary key causing duplicate inserts and legacy unbounded curves on every startup; admin WebUI config now takes effect.
- **Direct QR sending** — Instant recall status and dynamic estimated latency; auto-verifies/binds or claims when no account record exists, then syncs PC and auto-uploads by bound Diving Fish / Lxns channels; clarified `maiu` = Diving Fish only, `maiul` = Lxns only, `maiua` = both, with direct QR using the auto channel.
- **我的 AWMC** — Split into chat segments with modern image rendering, showing today/cumulative success-failure stats and recent transactions.
- **Modern image rendering** — Group Rating boards, "how bad am I in this group", plate progress, B50 risk panels, and score-push recommendations now use compact cards with jacket art; fixed Chinese-font tofu boxes and avatar cache.
- **QR recognition** — Image QR scanning isolated to a subprocess with concurrency and a 4-second timeout; added original → upscale → grayscale autocontrast → sharpen multi-path fallback plus multiple binarizations; phone screenshots and compressed group images recognize noticeably better.
- **舞萌状态** — `舞萌状态` / `mais` failure rate now uses the AWMC global stats endpoint, categorized by business errors, server/forwarding errors, and client 4xx.
- **Completion-table cache validation** — Constant tables and completion tables record song/constant signatures at generation; stale backgrounds are rejected after catalogue changes with an admin `更新完成表` reminder.
- **High-load surcharge** — After more than 30 real feature requests within 60 seconds, the 31st onward costs the triggerer 1 extra BREAK (threshold, window, and price adjustable via ENV).
- Today's maimai BREAK output halved (luck value ÷20); song lookup uses WMC tags instead of retired combined-tags.

<Badge type="danger" text="Bug Fix" />

- Fixed Letter Board three-character typo tolerance causing songs whose titles and aliases don't contain `the` to be opened by "the".
- Fixed gold content/dilution avatar not rendering and `ValueError` when today's push recommendations have no candidates.
- Fixed weakness prescription label and render blocking, B50 risk image encoding, and group Rating board MySQL access.
- Fixed `我的AWMC` errors with MySQL NULL fields and double image encoding.
- Fixed card-code MySQL table compatibility, large-QQ auto-redeem failures, and event-loop stalls when many users redeem simultaneously.
- Fixed multiple You Guess LLM prompt braces, constant-tier semantics, and settlement stalls.

### 2026/08/06
AWMC Version `V26.8.14` [AWMC V2]

<Badge type="tip" text="New Feature" />

- **Extreme Two-Choice** — Added `舞萌极限二选一` / `极限二选一` / `二选一`, with `加入` / `参赛` for the five-round left/right song comparison; reveal images label Green Basic, Yellow Advanced, Red Expert, Purple Master, and White Re:MASTER explicitly.
- **Letter Board modes** — Added `开字母文字模式`, `开字母图片模式`, and `开字母自动模式` for choosing text, image, or adaptive boards.

<Badge type="warning" text="Optimization" />

- **Game concurrency isolation** — Song, jacket, audio, chart, Guess Rating, Impostor, Extreme Two-Choice, and Letter Board games now share per-group session exclusion to prevent duplicate rounds and stale-round settlement.
- **Rendering performance** — Image work uses a dedicated CPU executor with higher default parallelism, reducing render pressure on message handling.
- **SW-API quota messaging** — `quota_exceeded` replies include personal read/write usage and the Beijing-time recovery timestamp; exhausted quota is no longer reported as an invalid QR code.

## July 2026

### 2026/07/28
AWMC Version `V26.8.13` [AWMC V2]

<Badge type="tip" text="New Feature" />

- **Four Guess Rating difficulties** — `猜Rating` randomly selects level 1–4; `猜Rating1`–`猜Rating4` select one explicitly. Higher levels show fewer cards and fewer score clues, with slightly higher points/BREAK. The selected B50 owner cannot answer or receive rewards.
- **B50 Impostor** — start with `找内鬼` or `找假卡`; find the one card whose song RA was altered among five B50 cards. Send 1–5 within 45 seconds; correct players are rewarded by final-answer submission time.
- **Seven-mode personal guess stats** — Guess Rating and B50 Impostor now appear in trends, mode cards, share donuts, and recent details; the layout adapts to the number of modes.
- **All-in (倾家荡产)** — Go all-in with your entire BREAK balance. Three modes: Standard (2 BREAK entry, 70% no-win, 50x max), Exciting (3 BREAK, 78%, 100x), High Risk (5 BREAK, 82%, 100x). Entry fee is non-refundable. Available anytime (no date restriction). Lost BREAK enters the welfare pool (50% distributable).
- **Welfare Pool** / `领取福利` — View today's contribution leaderboard and claim proportional welfare; once per day per user.

<Badge type="warning" text="Optimization" />

- **B50 roast pricing and failure protection** — current token base price ×3; reserve 6 BREAK before the model call, then refund or charge the difference from actual usage. Model/render failures refund the reservation in full.
- **Evidence-backed B50 analysis** — peer comparisons now include anonymized player count, chart coverage, and confidence; push candidates use the correct B35/B15 replacement floor and deterministic ordering.
- **Completion-table cache validation** — generated tables now record a song/chart-constant signature. Stale backgrounds are rejected after catalogue changes, with an `更新完成表` reminder at startup or query time.
- Guess Rating, B50 Impostor, Letter Board, and the other guessing modes now share the same per-group mutual exclusion and shutdown cleanup.

### 2026/07/27
AWMC Version `V26.8.12` [AWMC V2]

<Badge type="tip" text="New Feature" />

- **Guess Rating game** — New Guess Rating mode: randomly selects a group member and hides the B50 identity and scores (keeping only jacket / level / FC / FS), with a time limit to guess the closest Rating; supports custom first count and time (`猜rating 30 90`); fixed points + BREAK rewards (🥇15/3, 🥈5/1, 🥉3/0, participant 1/0)

<Badge type="warning" text="Optimization" />

- New chart tags API `GET /api/v1/charts/:chartKey/tags`, returning difficulty classification, radar/evaluation-axis tags, regression feature contributions, and chart pattern detection

### 2026/07/26
<Badge type="tip" text="New Feature" />

- **Rank course image** — added PRiSM PLUS rank course reports with `段位表 真二段` / `真二段段位表`; supports `@user` for personal score state
- **Rank course samples** — the image shows LIFE rules, track level/constant, personal best achievement, anonymous sample count, average, median, P25-P75 distribution, and SSS rate

<Badge type="warning" text="Optimization" />

- Rank course images use the player's nameplate and official dani Plate assets; the footer identifies live/bundled sample sources and notes that arcade results are authoritative

### 2026/07/20
AWMC Version `V26.8.7` [AWMC V2]

<Badge type="tip" text="New Feature" />

- **Letter board timed settlement** — no in-round points/BREAK; after full clear, award by speed stars + contribution; elapsed shown as `xx.xxx` seconds
- **Adaptive star caps** — default ≤30/45/60/90/180s; tighten from group history P35 (5★ between 15–30s); settlement shows active thresholds
- **Settlement UX** — short text (elapsed `xx.xxx`s + stars + pool) → round split chart → final board; `不玩了` reveals only (no speed/contribution rewards)
- **Letter limited ×3** — for one week, letter settlement score & BREAK ×3; text and boards show “限时×3”; auto-reverts to 1× after the event
- **Letter boards** — `开字母排行` / `开字母贡献榜` / `开字母时间榜`
- **我的猜歌** / `猜歌数据` / `猜歌统计` — personal 5-mode (text / jacket / audio / chart / letter) 30-day trend, dual radar, mode cards & recent details; `我的猜歌 @user` for others; group `我的AWMC` attaches the guess-stats image
- **`舞萌状态` / `mais`** — “服务器失败率” chart from full account-operation logs (ticket / maiu / bind; `returnCode=0` = failure; empty buckets omitted) plus live Status API
- **Guess-chart BGM** — precache ending-phase chart video with muxed BGM; rendering isolated from the online bot path

<Badge type="warning" text="Optimization" />

- **Guess answer rate limit** — 2.5 seconds per user globally (text / jacket / audio / chart); over-limit: “嘿嘿，你的答案被我吃掉啦！”
- **Letter cooldown** — separate 2.5s/user cooldown off-peak (same tip text; independent of global guess limit); skipped in crowded text mode
- **Letter text mode** — when contributors or short-window burst hits threshold, in-round boards fall back to plain text; clear settlement still forces images
- **Guess-chart adaptive concurrency** — scale precache/backfill by load; throttle under load so the bot stays responsive
- Unified storage MySQL sync: skip pack when unchanged; reuse unchanged files; startup sync in background
- `我的AWMC` / admin `发票统计` show ticket `returnCode=0` and null/missing counts

<Badge type="danger" text="Bug Fix" />

- Guess-stats chart layout: trend legend/title on separate lines; radar labels pushed out to avoid overlap

::: tip Docs
See [Command Reference · Song Guessing](/en/guide/bot/advanced#26-song-guessing).
:::

### 2026/07/18
<Badge type="warning" text="Docs / API" />

- **AWMC public API gateway** now targets the new upstream: `/v1/health`, `/v1/user/*`, `/v1/charge`, `/v1/charge/queue`, `/v1/update-lx`, `/v1/update-fish`
- `keychip` is injected server-side; callers only send fields such as `qrcode`
- Billing requires HTTP 2xx and upstream `code === 0`; charge enqueue binds mai `userId`, and the queue is filtered/redacted per account
- Legacy paths (`/v1/get_preview`, `/v1/upload_b50`, manual score APIs, etc.) are removed — see [developer docs](/en/dev/awmc-api)

### 2026/07/15
AWMC Version `RELEASE-20260715 V26.8.1` [AWMC V2]

<Badge type="tip" text="New Feature" />

- `maibindfish` / `mai绑定水鱼` now supports interactive binding without an argument. The Bot provides the Diving-Fish prober link and guides users to generate and copy an `Import-Token` from “Edit Profile”
- The Bot keeps waiting after an invalid Shuiyu Token and allows up to three attempts per session; users can send “取消” to exit

<Badge type="warning" text="Optimization" />

- Submitted Shuiyu Tokens are recalled first; users are explicitly warned when recall fails
- Successful binding only displays a masked Token and includes a traceable `REF_ID`
- Shuiyu binding prompts, retries, and results now reply to the triggering message to reduce ambiguity in busy group chats

<Badge type="danger" text="Bug Fix" />

- Fixed successful ticket operations being incorrectly reported as `FinishedException()`
- Fixed the same false-success-error pattern in account, map, queue, and LXNS B50 flows

### 2026/07/16
<Badge type="tip" text="New Feature" />

- Sending QR text directly in the group now auto-syncs
- QR photos sent directly are recognized and synced automatically

::: tip Suggestions
Feel free to suggest changes on the [AWMC forum](https://bbs.wmc.pub/forums/awmc.19/). After AI integration, the bot modifies itself automatically; once approved, it is available and the docs update.
:::

### 2026/07/05
<Badge type="tip" text="New Feature" />

- **maiBot upgraded to V3**
- **Official bot support**
- **mai-queue** connected to [nearcade.com](https://nearcade.com)
- Improved **B50 query** experience

<Badge type="warning" text="Optimization" />

- Download site: removed in-group verification, replaced with a queue system
- Due to Shuiyu-related impact, a credit system now limits user API usage

<Badge type="danger" text="Bug Fix" />

- Fixed known download site issues
- Fixed index download failures

## June 2026

### 2026/06/30
<Badge type="tip" text="New Feature" />

- **游玩排行50** (`游玩PC50` / `PC游玩50` / `pc游玩50`) — Top 50 most-played songs library-wide (image), not limited to Rating B50

<Badge type="warning" text="Optimization" />

- `pc排行` title changed to "PC全部排行 (N users)"; shows all synced users, no longer mislabeled as in-group or capped at top 15; aliases `pc全部排行` / `PC全部排行`
- `更新pc数` completion hints and `pca50` description updated to distinguish from `游玩排行50`

### 2026/06/23
AWMC Version `PRE-20260623 V26.6.4` [AWMC V2]

<Badge type="tip" text="New Feature" />

- **猜曲子** — New group mini-game: 4 stages, 30 seconds of voice per stage, instruments added progressively (drums → drums+bass → +other → +vocals)
- Higher score for earlier correct guesses (10 / 9 / 7 / 5)
- Super users can DM `更新猜曲音频`; `更新猜曲音频 -full` forces cache rebuild

<Badge type="warning" text="Optimization" />

- Guess-audio baking: trim before stem separation to prevent OOM; auto-fallback to ffmpeg when demucs fails; per-song async baking with interrupt support
- Full `[GuessAudio]` logging across baking/start/stem pipeline; cache version auto-invalidates stale data
- Song-guess scoring: daily / weekly / monthly / quarterly / season leaderboards; decreasing score; period settlement archive & history; per-entry settlement messages; combo & banquet filtering
- B15 push recommendations: version detection updated to DX2026「丸」era; fallback to「镜彩」era when CiRCLE missing; multi-level fallback when B15 list is empty
- PC count fetching migrated to sw-api `user/music` endpoint

<Badge type="danger" text="Bug Fix" />

- Guess-song four-stage mixing and stage file validation
- Song-guess answer tolerance regex character class
- Multiple B15 push recommendation filter defects
- sw-api parsing when `code=0` and `msg` is JSON

### 2026/06/15
<Badge type="tip" text="New Feature" />

- **猜歌积分排行** / **猜歌积分周榜** — View total and weekly song-guess / jacket-guess score rankings in the group (merged forward format)
- **弱项处方** (`弱项处方单` / `底力处方` / `练习推荐`) — Weakness prescription image; supports @someone
- **b50风险** (`B50风险` / `b50风险预警` / `风险预警`) — B50 risk warning image; supports @someone
- **对战战绩** (`headtohead` / `h2h` / `对决战绩`) — Head-to-Head comparison chart with a group member
- **目标rating** (`rating沙盘` / `目标分` / `推分沙盘`) — Rating sandbox text plan, e.g. `目标rating 16000`

<Badge type="warning" text="Optimization" />

- Advanced tutorial docs updated with the new commands above

### 2026/06/13
AWMC Version `PRE-20260613 V26.6.3` [AWMC V2]

<Badge type="tip" text="New Feature" />

- Download site https://download.awmc.cc launched
- maimai constant table updated
- Group member limit increased to 3000

<Badge type="danger" text="Bug Fix" />

- Fixed several download site issues
- Fixed some completion table display issues
- Prevented UI issues when users don't refresh the page

### 2026/06/10
<Badge type="tip" text="New Feature" />

- New project download.awmc.cc download site launched
- Updated maimai DX 2026

<Badge type="warning" text="Optimization" />

- Migrated much data to new servers

<Badge type="danger" text="Bug Fix" />

- Fixed known issues

### 2026/06/04
<Badge type="tip" text="New Feature" />

- New project launched: maimai DX chart download site

<Badge type="warning" text="Optimization" />

- Optimized score fetching with new caching

<Badge type="danger" text="Bug Fix" />

- Fixed issues caused by batch downloads
- Fixed .adx format incorrectly adding an extra .zip

[v26.6.1 - Pre]

### 2026/06/01
AWMC Version `ALPHA-20260601 V26.6.0.67` [AWMC V2]

<Badge type="danger" text="Bug Fix" />

- Fixed known issues

AWMC Version `ALPHA-20260601 V26.6.0.65-66` [AWMC V2]

<Badge type="danger" text="Bug Fix" />

- Fixed level progress compatibility with unknown sync types (e.g. `fs=sync`); `_parse_level_plan` now supports internal values like `combo_rank`/`sync_rank`
- `舞舞` now equivalent to `fdx` (FSD/FDX and above)

AWMC Version `ALPHA-20260601 V26.6.0.64` [AWMC V2]

<Badge type="tip" text="New Feature" />

- Chinese shorthand progress queries: `13将` (sss), `14+极` (fc), `13神` (ap), `13舞舞` (fsd), `13者` (bbb); supports pagination and @someone queries

AWMC Version `ALPHA-20260601 V26.6.0.63` [AWMC V2]

<Badge type="tip" text="New Feature" />

- Added `地板` command — view B35/B15 floor, filter by difficulty/constant, query others; aliases `b50地板`/`rating地板`

AWMC Version `ALPHA-20260601 V26.6.0.62` [AWMC V2]

<Badge type="warning" text="Optimization" />

- Unified visual rewrite for daily/weekly/monthly reports and archive comparison (B50 background, frosted glass panels, B50 improvement layout fix, footer bar)

AWMC Version `ALPHA-20260601 V26.6.0.61` [AWMC V2]

<Badge type="danger" text="Bug Fix" />

- Fixed B50 vs play detail DX star calculation — `dxScore()` now compares thresholds with float percentages directly instead of `int()` truncation

## May 2026

### 2026/05/31
AWMC Version `ALPHA-20260531 V26.6.0.50-26.6.0.60` [AWMC V2]
<Badge type="tip" text="New Feature" />

- **Lxns data source** — OAuth binding (`lxbind`), data source switching (Diving Fish / Lxns), `lxb50` query, automatic data-source routing, and local caching of song library/charts/aliases (1h)
- **Score chart footer** — all score charts show data source, theme, ⏱️ latency (fetch / render / total), and append `Generated by xxx BOT | QQ Group 1072033605`
- **B50 anomaly hints** — auto-diagnostics for no Diving Fish data, masked scores, no Lxns data, etc.

<Badge type="warning" text="Optimization" />

- **Constant/completion table render rewrite** — unified grid coordinates, frosted-glass card style, dance/霸 completion table pagination
- **Bottom-line analysis chart improvements** — frosted-glass panels, white-track bar charts with value badges, radar chart style improvements
- **Theme system & image path unification** — `pic()`/`resolve_theme_path` manage everything, font path moved to `static/font/`, graceful degradation on missing images

<Badge type="danger" text="Bug Fix" />

- Fixed constant/completion table SSS rating and FC/AP icon misalignment
- Fixed plate image path errors (`plate/` → `plate_version/`)
- Fixed lv15 constant table and 舞 completion table crashes (RaMusic missing `basic_info`, unhashable)
- Fixed `minfo`/`info` render coordinates and TOTAL column overlap
- Banquet chart filtering: ID ≥ 100000, preventing banquet charts from entering b50
- Removed whitelist, Diving Fish/Lxns upload, ticket features (pruned as needed)
- Startup hook robustness; chart preview domain changed to `v.awmc.cc`

AWMC Version `ALPHA-20260531 V26.6.0.0-26.6.0.50` [AWMC V2]
<Badge type="tip" text="New Feature" />

- **Theme system support** — all image paths now support theme switching (`prism_plus`/`circle`); theme-specific images read from the theme subdirectory, shared images from root
- **舞/霸 completion table pagination** — 舞 and 霸 completion tables split into two pages (13+ and above / 13 and below), generating `舞-1.png` and `舞-2.png`; 霸 shares 舞's files
- **Bottom-line analysis visual optimization** — warm sunset palette, radar shadows/glow/vertex highlights, bar shadows/highlights/background frames, larger font
- **Jacket lookup logic** — supports four-digit format (`% 10000`) and JPG format for higher cover-finding success

<Badge type="danger" text="Bug Fix" />

- **All image paths broke after version update** — old paths read from `pic/` root; new versions distinguish theme directory and root
- **Plate/icon filename updates** — `UI_Plate_300501` → `UI_Plate_550101`, `UI_Icon_309503` → `UI_Icon_509506`
- **Hyphens to underscores** — `d-{num}` → `d_{num}`, `t-{num}` → `t_{num}`, `ra-dx` → `ra_dx`, `info-{cat}` → `info_{cat}`
- **Background filename fixes** — `song_bg` → `chart_info`, `info_bg` → `play_info`, `unfinished_bg` → `unfinished_1`, `complete_bg` → `complete_1`, `unfinished_bg_2` → `unfinished_2`, `complete_bg_2` → `complete_2`, `rating_bg` → `complete`, `plate_num` → `plate_progress`
- **minfo/info render coordinate misalignment** — fixed all coordinates against the beta branch: cover size/position, type icon position, BPM position, constant/notes/charter/rating layout
- **舞/霸 plate query KeyError** — 舞 and 霸 lack `plate_to_dx_version` keys in `version_map`; switched to explicit checks
- **Completion-table directory structure** — from `platedir/plate_{version}.png` to dedicated `plate_table/{version}.png`; plate icon assets read from `plate_version/{version}{plan}.png`
- **霸 query path** — 霸 and 舞 share the `舞-{page}.png` completion-table files
- **Shared vs theme images** — `UI_CMN_TabTitle_NewSong`, `{version}`, `{type}`, `d_{num}`, `fcfs`, `UI_CHR_PlayBonus_*`, `UI_GAM_Gauge_DXScoreIcon_*`, `UI_MSS_*` etc. use `pic()` from root; `logo`, `ra_dx`, `UI_TTR_Rank_*` etc. continue using `_rtp()` from the theme directory
- **Completion-table render logic rewrite** — rewritten against the beta branch: grid layout `start_x=180, start_y=490, gap=96, row_count=12`, adjusted icon size and stats position, 舞/霸 use `plate_progress_wu.png`

### 2026/05/30
AWMC Version `ALPHA-20260530 V26.6.0` [AWMC V2]
<Badge type="tip" text="New Feature" />

- Bot supports the Lxns score checker

### 2026/05/27
AWMC Version `RELEASE-20260527 V26.5.19`
<Badge type="tip" text="New Feature" />

- Added `wife` emote-pack generation

<Badge type="danger" text="Bug Fix" />

- Fixed constant errors and float precision issues
- Fixed banquet charts being counted into B50
- Fixed other banquet-related issues

AWMC Version `RELEASE-20260527 V26.5.18`
<Badge type="tip" text="New Feature" />

- Added `dx2026b35` — query new-version PRiSM B35 info

<Badge type="danger" text="Bug Fix" />

- Fixed constant anomalies
- Fixed banquet charts being counted into `dx2026b50`

AWMC Version `BETA-20260527 V26.5.17`
<Badge type="tip" text="New Feature" />

- Added `dx2026b35` — query new-version PRiSM B35 info

### 2026/05/25
AWMC Version `RELEASE-20260525 V26.5.16`
<Badge type="tip" text="New Feature" />

- `koishi-plugin-maibot` 1.9.9
  - Anti-alt cooldown bypass: binding checks whether the same maiUid is already bound by another Bot user; warns but allows (holding SGID proves ownership)
  - Shared cooldown: all Bot users of the same game account share cooldown timing (new `maiuid:<maiUid>` shared key)
  - More than 2 bindings blocks cooldown-affected commands and prompts unbinding extra accounts

<Badge type="danger" text="Bug Fix" />

- `koishi-plugin-maibot` 1.9.8
  - Fixed `maibypass` not working: completed `koishi:<aid>` unified key so cooldown records stored under the unified key clear correctly
  - `/mai管理员设置个人优先` parameters can be omitted; when missing, enters interactive mode (asks target user, duration in order)
  - `/mai管理员设置群组优先` parameters can be omitted; when missing, enters interactive mode (send `0` in a group to use the current group)

### 2026/05/24
AWMC Version `BETA-20260524 V26.5.15`
<Badge type="danger" text="Bug Fix" />

- Fixed b50 roast generative-AI calls not auditing generated output

### 2026/05/23
AWMC Version `RELEASE-20260523 V26.5.13`
<Badge type="tip" text="New Feature" />

- API added new endpoint `/v1/delete_score_manual`
- Bot added delete score feature

AWMC Version `BETA-20260523 V26.5.14`
<Badge type="tip" text="New Feature" />

- Added PC (Play Count) stats
  - `更新pc数` — guides QR scanning to fetch play-count data
  - `pc50` — B50 sorted by play count, `pc:xx` at the card corner
  - `pca50` — compact PC-sorted version without B35/B15 grouping
  - `我的pc数` — total play count + top 15 songs
  - `pc数 <song/ID>` — query a specific song's play count
  - `pc排行` — in-group users ranked by total play count

AWMC Version `BETA-20260523`
<Badge type="danger" text="Bug Fix" />

- Temporarily disabled Mai Mileage feature
- Fixed ticket API

### 2026/05/22
AWMC Version `BETA-20260522-C2 V26.5.13`
<Badge type="danger" text="Bug Fix" />

- Fixed bot issues

AWMC Version `BETA-20260522 V26.5.12`
<Badge type="tip" text="New Feature" />

- Added `mai upload song score` feature
- Added `mai get collectibles` feature

### 2026/05/20
AWMC Version `RELEASE-20260520 V26.5.10`
<Badge type="warning" text="Optimization" />

- Server upgraded to bare metal, providing ultimate performance
- Fixed some known issues

### 2026/05/19
AWMC Version `RELEASE-20260519 V26.5.7`
<Badge type="warning" text="Change Notice" />

- All **external example links** in the Wiki, site configuration, and developer documentation are now unified to display as **`awmc.cc` and its subdomains** (e.g., `api.awmc.cc`, `status.awmc.cc`, `store.awmc.cc`, `wiki.awmc.cc`, etc.).
- **Compatibility Note**: If your bookmarks or custom integrations used other domain suffixes, please update them to **`*.awmc.cc`**.


### 2026/05/17
AWMC Version `RELEASE-20260517 V26.5.6`
<Badge type="tip" text="New Feature" />

- Added a special **520** play count tracker for the mysterious song **Love You** for that special romantic occasion.
- Added new domain `wmc.pub`. We made something mysterious.
  

### 2026/05/14
AWMC Version `BETA-20260514 V26.5.5`
<Badge type="tip" text="New Feature" />

- Added B50 queries filtered by level and difficulty, e.g., `13b50`, `Re:MASTER 13 b50`, etc.
- Fully tested the "Today's Score Push Recommendation" feature that automatically recommends charts based on recent data. This feature will recommend suitable charts based on your play history.
- Added B50 roast feature, trigger command: `roast`.

<Badge type="danger" text="Bug Fix" />

- Fixed some issues in the KALEIDXSCOPE web page
- Fixed KOOK bot disconnection issues
- Fixed DNS pollution redirecting to inappropriate websites
- Fixed abnormally slow page loading
- Fixed API site login issues
- Fixed STAT data retrieval failures

<Badge type="warning" text="Optimization" />

- Optimized cases where the ticket command could cause account restrictions
- Optimized generation experience and interactions
- Removed NET detection from the Status page

## April 2026

### 2026/04/04
AWMC Version `RELEASE-20260403 V26.4.03`
<Badge type="danger" text="Bug Fix" />

- Fixed QQ bot image rendering issues
- Fixed bot protocol data loss due to containerization
- Fixed the "How bad am I in this group" feature

### 2026/04/03
AWMC Version `RELEASE-20260403 V26.4.03`
<Badge type="danger" text="Bug Fix" />

- Fixed store payment API errors
- Fixed KOOK bot disconnection issues
- Fixed KALEIDXSCOPE page data issues

<Badge type="warning" text="Optimization" />

- Optimized rendering speed
- Optimized cases where the ticket command could cause account restrictions
