# Changelog

## July 2026

### 2026/07/19
<Badge type="tip" text="New Feature" />

- **Letter board timed settlement** — no in-round points/BREAK; after full clear, award by speed stars + contribution; elapsed shown as `xx.xxx` seconds
- **Adaptive star caps** — default ≤30/45/60/90/180s; tighten from group history P35 (5★ between 15–30s); settlement shows active thresholds
- **Settlement UX** — short text (elapsed `xx.xxx`s + stars + pool) → round split chart → final board; query with `开字母排行` / `开字母贡献榜` / `开字母时间榜`
- `不玩了` reveals only — no speed/contribution rewards
- **Guess answer rate limit** — 3 seconds per user globally (text / jacket / audio / chart / letter); over-limit reply: “嘿嘿，你的答案被我吃掉啦！”
- **`舞萌状态` / `mais`** — “服务器失败率” chart from full account-operation logs (ticket / maiu / bind; `returnCode=0` counts as failure; empty buckets omitted) plus live Status API

<Badge type="warning" text="Optimization" />

- Unified storage MySQL sync: skip pack when unchanged; reuse unchanged files; startup sync runs in background
- `我的AWMC` / admin `发票统计` show ticket `returnCode=0` and null/missing counts

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

### 2026/05/23
AWMC Version `RELEASE-20260523 V26.5.13`
<Badge type="tip" text="New Feature" />

- API added new endpoint `/v1/delete_score_manual`
- Bot added delete score feature

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
