# Changelog

## June 2026

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
