# AWMC BOT Advanced Tutorial

::: tip
Use <kbd>Ctrl+F</kbd> to search for specific topics.
:::

## 1. Basics & Help

| Command | Description |
|---------|-------------|
| `帮助maimaiDX` / `帮助maimaidx` | Send help image |
| `项目地址maimaiDX` | Project GitHub link |
| `更新maimai数据` | **Super admin**: Update local song library/charts/aliases |
| `今日mai` / `今日舞萌` / `今日运势` | Daily fortune + recommended song |
| `mai什么` / `mai什么歌` | Random song recommendation (supports score-push intent) |
| `给个绿14+` etc. | Random draw by difficulty/type |
| `查看排名` / `查看排行` | Global Rating leaderboard |
| `我的排名` | Your Rating ranking |
| `主题` / `theme` | Switch B50 image theme |

## 2. Song Search

| Command | Description |
|---------|-------------|
| `查歌 <keyword>` | Search by song name |
| `定数查歌` | Search by constant range |
| `bpm查歌` | Search by BPM |
| `曲师查歌` | Search by artist |
| `谱师查歌` | Search by charter |
| `<alias>是什么歌` | Reverse lookup by alias, generates detailed info image (chart tags, constant changes, preview links, etc.) |
| `id12345` | View song details by ID (chart tags, constant changes, preview links, etc.) |
| `谱面12345紫` | Chart preview link |
| `提取曲绘 <ID>` | Extract jacket art image |

## 3. Score Charts (B50 Series)

### Regular

| Command | Description |
|---------|-------------|
| `b50` | Standard B50 (B35 + B15 grouped) |
| `ab50` / `a50` | Top 50 without grouping |
| `合作b50` / `合作a50` | @friend duo B50 |
| `lxb50` / `落雪b50` | Force Lxns data source B50 |

### Filters / Variants

| Command | Description |
|---------|-------------|
| `紫b50` / `13+b50` / `Master b50` etc. | Filter B50 by difficulty |
| `紫ab50` etc. | Filter ab50 by difficulty |
| `镜代b50` etc. | Filter B50 by version era |
| `l镜代b50` / `l爽代b35` etc. | Recalculate B50/B35 with past version constants |
| `dx2026b35` | Colorful era B35 |
| `fcb50` / `fcallb50` | FC-oriented B50 |
| `apb50` / `apallb50` | AP-oriented B50 |
| `拟合b50` / `拟合b50全部` | Sort by fitted constant |
| `寸b50` / `寸ab50` | Edge-cut scores (exactly on rating boundary) |
| `锁血b50` / `锁血ab50` | Minimum-threshold scores (exactly on rating floor) |
| `越级b50` / `越级ab50` | Skill-jump scores |
| `理想b50` / `理想ab50` | Ideal B50 if all ratings upgraded by one tier |
| `含金量` / `含水量` | Score value/dilution analysis chart |

### Analysis / Comparison

| Command | Description |
|---------|-------------|
| `我有多菜` | Rating distribution bar chart |
| `底力分析` | B50 tag radar + bar chart, for reference only |
| `minfo` / `info` | Single song difficulty play details |
| `ginfo` | Single song global stats + pie chart |
| `分数线` | Calculate TAP/GREAT tolerance for a given achievement rate |

### Analysis / Score Push / Head-to-Head

| Main Command | Aliases | Usage | Description |
|--------------|---------|-------|-------------|
| `弱项处方` | `弱项处方单` `底力处方` `练习推荐` | `弱项处方` / `弱项处方@someone` | Weakness prescription image |
| `b50风险` | `B50风险` `b50风险预警` `风险预警` | `b50风险` / `b50风险@someone` | B50 risk warning image |
| `对战战绩` | `headtohead` `h2h` `对决战绩` | `对战战绩@friend` | Head-to-Head comparison chart |
| `目标rating` | `rating沙盘` `目标分` `推分沙盘` | `目标rating 16000` / `目标rating 15500@someone` | Rating sandbox text plan |

### Floor

| Command | Description |
|---------|-------------|
| `地板` | View overall B35/B15 rating floor |
| `地板 14+` | View floor for 14+ charts in B50 |
| `地板 紫13` / `地板 master` | Filter by difficulty level + constant |
| `b50地板` / `rating地板` | Same as above (aliases) |
| `地板 @someone` | Check someone else's floor |

## 4. Constant Tables / Completion Tables / Progress

| Command | Description |
|---------|-------------|
| `14定数表` | View constant table (lv7–15) |
| `14完成表` / `14ap完成表` etc. | Personal completion table overlay |
| `真极完成表` / `舞神完成表` etc. | Plate completion table (supports pagination) |
| `真极进度` | Plate completion progress |
| `14 SSS 进度` etc. | Check progress by level + rating |
| `14 分数列表` | Score list for specified level |
| `我要上100分` etc. | Score-push recommendation charts (old/new charts) |
| `更新定数表` / `更新完成表` | **Super admin**: Regenerate base images |

### Chinese Shorthand Progress

The original `level rating progress` pattern now supports Chinese plate shorthand:

| Example | Equivalent to | Condition |
|---------|---------------|-----------|
| `13将` / `13将进度` | `13 sss进度` | Achievement ≥100% |
| `14+极` | `14+ fc进度` | FC and above |
| `13神` | `13 ap进度` | AP and above |
| `13舞舞` | `13 fsd进度` | FSD and above |
| `13者` | `13 bbb进度` | Achievement ≥80% |

**Output**: Text summary (completed X/Y songs, unfinished/unplayed count) + completion table image.

Also supports `13将 未完成`、`13将 2` for pagination filtering, and `13将 @someone` to query others.

## 5. Data Storage & Reports

::: warning Note
Must first **enable data storage**.
:::

| Command | Description |
|---------|-------------|
| `立即存储数据` | Manually save a snapshot |
| `关闭存储数据` | Disable auto storage |
| `存储历史` | View historical archive IDs |
| `查看存档 <ID>` | View snapshot details |
| `日报` / `周报` / `月报` | Past 1/7/30 day score report chart |
| `对比存档 <oldID> <newID>` | Compare two snapshots |
| `今日吃分推荐` | Personalized score-push suggestions based on history (text) |
| `牌子统计` | Plate achievement statistics |

## 6. Lxns Data Source

| Command | Description |
|---------|-------------|
| `lxbind` / `绑定落雪` | OAuth bind Lxns score checker |
| `lxunbind` / `解绑落雪` | Unbind |
| `数据源 水鱼` / `数据源 落雪` | Switch default B50 data source |

::: info Note
B50 series automatically uses Diving Fish or Lxns based on user preference. Some features (fitted constant, value analysis, etc.) fall back to Diving Fish when Lxns is unsupported.
:::

## 7. Play Count (PC)

PC = Play Count, the number of times each song has been played on arcade machines.

| Command | Description |
|---------|-------------|
| `更新pc数 <QR code>` | Log in at arcade and sync PC |
| `我的pc数` | Personal PC Top list |
| `pc排行` | PC leaderboard |
| `pc数 <song ID>` | PC for a specific song |
| `pc50` / `pca50` | B50 chart sorted by PC |

## 8. Group Interactions

| Command | Description |
|---------|-------------|
| `我在群里有多菜` | Group Rating comparison |
| `群聊rating排行榜` | Group Rating leaderboard |
| `群吃分榜` / `群寸止榜` / `群锁血榜` | Various group leaderboards |
| `友人对战` | Friend score battle |
| `潘排名` / `我的白潘排名` etc. | Group ranking for specific song difficulty |
| `猜歌` / `猜曲绘` | Group song-guessing mini-game |
| `猜歌积分排行` | View total song-guess / jacket-guess score ranking in the group (merged forward format) |
| `猜歌积分周榜` | View this week's score ranking in the group (merged forward format) |
| `开启mai猜歌` / `关闭mai猜歌` | **Group admin**: Toggle guessing game |

## 9. Alias System

| Command | Description |
|---------|-------------|
| `添加别名` | Submit alias to official library |
| `添加本地别名` | Locally-effective alias only |
| `同意别名 <Tag>` | Vote to approve alias |
| `当前投票` | View ongoing alias vote |
| `<song>有什么别名` | View aliases for a song (plain text) |
| `开启别名推送` / `关闭别名推送` | **Group admin**: Toggle alias push for the group |
| `更新别名库` | **Super admin**: Sync alias library |

## 10. Chart Impressions (PMYX)

| Command | Description |
|---------|-------------|
| `谱面印象 <ID>` | View chart impressions |
| `写谱面印象` | Post an impression |
| `回复谱面印象` | Reply to someone's impression |
| `点赞谱面印象` | Like an impression |

::: tip
When using `查歌` (by ID or alias), chart impressions, tags, constant changes, and preview links are **automatically included** as a merged forward message.
:::

## Appendix: About "Poke"

The BOT responds to QQ's poke feature. If the BOT has admin privileges, it may trigger a random-duration **mute** (up to 1 day). Poke with caution.

## Appendix: Tickets

::: danger Warning
Issuing tickets carries risks. Proceed with caution. AWMC TEAM is not responsible for any negative effects.

See [AWMC BOT Terms of Service & Privacy Policy](/en/guide/bot/terms#10-disclaimer), Section 10.
:::

Use `发票 [x]` to issue a function ticket to your game account. `[x]` is the ticket multiplier (integer 2-6, default 2). Tickets with 4x and above have a higher failure rate.
