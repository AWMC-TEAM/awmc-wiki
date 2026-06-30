# AWMC BOT Command Reference

::: tip
Use <kbd>Ctrl+F</kbd> to search for specific topics.
:::

This page is split into two bots: the **Transport Bot** handles account binding, B50 uploads, tickets, and card redemption; the **Query Bot** handles song lookup, score charts, constant tables, and group interactions.

---

## 1. Transport Bot (MaiBot)

Command prefix is shown as `/`; match your Koishi prefix configuration. Account binding accepts **SGID text** or **official account web URLs**.

### 1.1 Help & Info

| Command | Description |
|---------|-------------|
| `/mai` / `/mai help` | View all commands; add `--advanced` for tickets, collectibles, travel distance, etc. |
| `/maiping` | Test arcade connection |
| `/maiqueue [Ref_ID]` | Check ticket recharge queue (optional Ref_ID for a single entry) |
| `/mai状态` / `/mymai` | Binding status, tickets, and priority; add `--expired` for expired tickets |
| `/mai地图 [QR or URL]` | Provinces/regions played on the account |
| `/mai查询opt <version>` | Mai2 option file download URL, e.g. `/mai查询opt 1.40` |

### 1.2 Account Binding

| Command | Description |
|---------|-------------|
| `/mai绑定 [QR or URL]` | Bind maimai DX account; interactive guide if no args |
| `/mai解绑` | Unbind maimai DX (subject to rebind cooldown) |
| `/mai解绑卡` / `maiunbindkey` | Unbind during cooldown using **unbind card quota** (SGID verification + confirmation) |

### 1.3 Diving Fish B50

| Command | Description |
|---------|-------------|
| `/mai绑定水鱼 <token>` | Bind Diving Fish token for B50 upload |
| `/mai解绑水鱼` | Unbind Diving Fish token (maimai DX binding kept) |
| `/mai上传B50` / `maiu` | Upload B50 to Diving Fish |
| `/maiua [QR or Lxns code]` | Upload B50 to both Diving Fish and Lxns (SGID once) |

### 1.4 Lxns B50

| Command | Description |
|---------|-------------|
| `/mai绑定落雪 <Token>` | Bind Lxns token (third-party import in profile) |
| `/mai解绑落雪` | Unbind Lxns token (maimai DX binding kept) |
| `/mai上传落雪b50` / `maiul` | Upload B50 to Lxns |

### 1.5 Account Security

| Command | Description |
|---------|-------------|
| `/mai锁定` | Lock account to prevent others from logging in |
| `/mai解锁` / `/mai逃离` / `mai逃离小黑屋` | Unlock (only accounts locked via `/mai锁定`) |
| `/mai保护模式 [on\|off]` | Toggle protection mode; auto-lock when account goes offline |

### 1.6 Priority & Card Redemption

When **priorityCooldown** is enabled, some commands have cooldowns; redeeming cards shortens or removes them.

| Command | Description |
|---------|-------------|
| `/mai兑换卡密 [card]` | Redeem card; paste after command within time limit (`MAI-` prefix) |
| `/mai取消群组优先` | Cancel group priority in current group (**group card redeemer** only) |
| `/mai群组优先换绑` | Start group priority migration from **source group** |
| `/mai群组优先换入` / `mai群组优先换绑完成` | Complete migration in **target group** |

#### Card Types

| Type | Where to redeem | Description |
|------|-----------------|-------------|
| **Personal** | DM or group | **Global** priority cooldown for bound account |
| **Group** | **Must be in target group** | Bound to group; members get no cooldown **in that group** (not in DM) |
| **Unbind** | DM or group | Requires `/mai绑定`; adds unbind quota for `/mai解绑卡` during cooldown |

### 1.7 Advanced (Tickets, Collectibles, etc.)

::: danger Warning
Issuing tickets carries risks. Proceed with caution. AWMC TEAM is not responsible for negative effects.

See [AWMC BOT Terms of Service & Privacy Policy](/en/guide/bot/terms#10-disclaimer), Section 10.
:::

| Command | Description |
|---------|-------------|
| `/mai发票 [multiplier] [target]` | Issue function ticket (multiplier 2–6, default 2); 4x+ may fail |
| `/mai修改版本号 [QR or target]` | Change game version (cached) |
| `/mai获取收藏品 [SGID or @user]` | Interactive collectible fetch |
| `/mai上传乐曲成绩 [@user]` | Interactive single-song score upload |
| `/mai删除成绩 [@user]` | Interactive single-song score delete |

---

## 2. Query Bot (maimaiDX)

> Regular user commands only; no admin commands. Advanced variants and group-admin features are in [2.11 Advanced](#211-advanced).

### 2.1 Basics

| Command | Description |
|---------|-------------|
| `帮助maimaiDX` | Send help image |
| `项目地址maimaiDX` | Project info |
| `今日mai` | Daily fortune + recommended song |
| `主题` | View or switch score chart theme |
| `查看排名` | Global Rating leaderboard |
| `我的排名` | Your Rating ranking |

### 2.2 Song Search

| Command | Description |
|---------|-------------|
| `查歌 <keyword>` | Search by name / alias |
| `定数查歌 <constant>` | Search by constant |
| `bpm查歌 <bpm>` | Search by BPM |
| `曲师查歌 <artist>` | Search by artist |
| `谱师查歌 <charter>` | Search by charter |
| `<alias>是什么歌` | Lookup by alias |
| `id <song ID>` | Song details |
| `谱面<ID><difficulty>` | Chart preview: green / yellow / red / purple / white |
| `提取曲绘 <song ID>` | Extract jacket art |
| `mai什么` | Random song |
| `mai什么推分` | Random score-push song |
| `来个<level>` | Random song at level |
| `来个dx<level>` / `来个sd<level>` | Random DX / standard |
| `来个<difficulty><level>` | e.g. `来个紫14+` |

### 2.3 Aliases

| Command | Description |
|---------|-------------|
| `<song>有什么别名` | View aliases |
| `id<song ID>有什么别名` | Aliases by ID |
| `添加别名 <ID> <alias>` | Submit alias |
| `添加本地别名 <ID> <alias>` | Local-only alias |
| `同意别名 <Tag>` | Vote on alias |
| `当前投票` | Ongoing alias votes |

### 2.4 Scores

| Command | Description |
|---------|-------------|
| `b50` | B50 chart |
| `ab50` | Top 50 without grouping |
| `刷新b50` | Force refresh cache |
| `合作b50` | Duo B50 comparison |
| `合作a50` | Duo top-50 comparison |
| `我有多菜` | Rating comparison chart |
| `我在群里有多菜` | Group Rating comparison |
| `minfo` | Personal play info |
| `ginfo` | Group play info |
| `分数线` | Score line calculator |
| `友人对战` | Random friend battle (optional rating gap, e.g. `友人对战 300`) |

#### Group Single-Song Ranking

| Command | Description |
|---------|-------------|
| `<song>排名` | Group ranking for song |
| `我的<song>排名` | Your group ranking |
| `<song>排名 <N>` | Top N |

Prefix difficulty before song name, e.g. `白潘排名`.

### 2.5 Constant / Completion / Progress

| Command | Description |
|---------|-------------|
| `<level>定数表` | Constant table, e.g. `13+定数表` |
| `<level>完成表` | Completion table, e.g. `13+ap完成表` |
| `<plate>完成表` | Plate completion table |
| `<plate>进度` | Plate progress |
| `<level><achievement>进度` | Level progress, e.g. `13+sss进度` |
| `<level><plate>进度` | e.g. `13将进度`, `14+极进度` |
| `我要上<score>分` | Score-push recommendations |
| `我要在<level>上<score>分` | Level-specific recommendations |
| `<level>分数列表` | Score list for level |

Achievements: `ap` `fc` `fcp` `fs` `fsp` `ss` `sss` `sync`, etc.

### 2.6 Song Guessing

| Command | Description |
|---------|-------------|
| `猜歌` | Text guessing |
| `猜曲绘` | Jacket guessing |
| `猜曲子` | Audio guessing |
| `查加倍卡` | View your multiplier cards |
| `猜歌积分排行` | Total points leaderboard |
| `猜歌积分日榜` / `周榜` / `月榜` / `年榜` / `赛季榜` | Period leaderboards |
| `猜歌历史日榜` / `周榜` / `月榜` / `年榜` / `赛季榜` | Historical period boards |

### 2.7 Play Count (PC)

| Command | Description |
|---------|-------------|
| `更新pc数` | Bind arcade QR and sync PC |
| `我的pc数` | Personal PC stats |
| `pc排行` | PC leaderboard |
| `pc数 <song>` | PC for a song |
| `pc50` | PC-based B50 |
| `pca50` | PC-based top 50 |

### 2.8 Lxns Score Checker

| Command | Description |
|---------|-------------|
| `lxbind` | OAuth bind Lxns |
| `lxunbind` | Unbind Lxns |
| `lxb50` | B50 from Lxns source |
| `数据源` | Current data source |
| `数据源 水鱼` / `数据源 落雪` | Switch personal source |

::: info
B50 uses Diving Fish or Lxns per preference; some features fall back to Diving Fish when Lxns lacks support.
:::

### 2.9 Chart Impressions

| Command | Description |
|---------|-------------|
| `谱面印象 <song>` | View impressions |
| `写谱面印象 <song> <text>` | Post impression |
| `回复谱面印象 <ID> <text>` | Reply |
| `点赞谱面印象 <ID>` | Like |

::: tip
`查歌` (by ID or alias) **automatically includes** impressions, tags, constant changes, and preview links.
:::

### 2.10 AWMC BREAK

| Command | Description |
|---------|-------------|
| `AWMC签到` | Daily check-in for BREAK |
| `我的AWMC` | Account status and usage |
| `AWMC帮助` | BREAK system help |

> First actual score-API request per day is free; each later request costs 1 BREAK (cache hits are free).

### 2.11 Advanced

Advanced query-bot commands and variants.

#### B50 Variants

| Command | Description |
|---------|-------------|
| `紫b50` / `13+b50` / `Master b50` etc. | Filter B50 by difficulty |
| `紫ab50` etc. | Filter ab50 by difficulty |
| `镜代b50` etc. | Filter by version era |
| `l镜代b50` / `l爽代b35` etc. | Recalculate with past constants |
| `dx2026b35` | Colorful era B35 |
| `fcb50` / `fcallb50` | FC-oriented B50 |
| `apb50` / `apallb50` | AP-oriented B50 |
| `拟合b50` / `拟合b50全部` | Sort by fitted constant |
| `寸b50` / `寸ab50` | Edge-cut scores |
| `锁血b50` / `锁血ab50` | Minimum-threshold scores |
| `越级b50` / `越级ab50` | Skill-jump scores |
| `理想b50` / `理想ab50` | Ideal B50 after +1 rating tier |
| `含金量` / `含水量` | Value / dilution analysis |

#### Analysis / Score Push / Head-to-Head

| Main | Aliases | Example | Description |
|------|---------|---------|-------------|
| `弱项处方` | `弱项处方单` `底力处方` `练习推荐` | `弱项处方@someone` | Weakness prescription image |
| `b50风险` | `B50风险` `b50风险预警` | `b50风险@someone` | B50 risk warning |
| `对战战绩` | `headtohead` `h2h` | `对战战绩@friend` | Head-to-Head chart |
| `目标rating` | `rating沙盘` `推分沙盘` | `目标rating 16000` | Rating sandbox plan |
| `底力分析` | — | `底力分析` | Tag radar + bar chart |

#### Floor

| Command | Description |
|---------|-------------|
| `地板` | Overall B35/B15 floor |
| `地板 14+` | Floor for 14+ in B50 |
| `地板 紫13` / `地板 master` | Filter by difficulty + constant |
| `b50地板` / `rating地板` | Aliases |
| `地板 @someone` | Someone else's floor |

#### Chinese Shorthand Progress

| Example | Equivalent | Condition |
|---------|------------|-----------|
| `13将` / `13将进度` | `13 sss进度` | Achievement ≥100% |
| `14+极` | `14+ fc进度` | FC+ |
| `13神` | `13 ap进度` | AP+ |
| `13舞舞` | `13 fsd进度` | FSD+ |
| `13者` | `13 bbb进度` | Achievement ≥80% |

Also: `13将 未完成`, `13将 2`, `13将 @someone`.

#### Data Storage & Reports

::: warning
Must **enable data storage** first.
:::

| Command | Description |
|---------|-------------|
| `立即存储数据` | Manual snapshot |
| `关闭存储数据` | Disable auto storage |
| `存储历史` | Archive IDs |
| `查看存档 <ID>` | Snapshot details |
| `日报` / `周报` / `月报` | 1/7/30 day reports |
| `对比存档 <old> <new>` | Compare snapshots |
| `今日吃分推荐` | Personalized push suggestions |
| `牌子统计` | Plate statistics |

#### Group Extras

| Command | Description |
|---------|-------------|
| `群聊rating排行榜` | Group Rating board |
| `群吃分榜` / `群寸止榜` / `群锁血榜` | Group leaderboards |
| `开启mai猜歌` / `关闭mai猜歌` | **Group admin**: toggle guessing |
| `开启别名推送` / `关闭别名推送` | **Group admin**: alias push |

#### Appendix: QQ Poke

The bot reacts to QQ pokes. With admin rights it may **mute** randomly (up to 1 day). Poke with caution.

---

## Contact & Feedback

- **QQ Group**: [1072033605](https://qm.qq.com/q/7157yt6n6w)
- **Website**: https://awmc.cc
