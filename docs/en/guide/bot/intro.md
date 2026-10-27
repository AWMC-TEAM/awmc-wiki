# AWMC QueryBot Basic Tutorial

::: tip ☕ Support AWMC
All AWMC services are free forever, but keeping them online costs real money. If
AWMC has helped you, please consider [sponsoring us](https://afdian.com/a/AWMC_TEAM?tab=shop) —
every bit of support keeps the services stable. Thank you meow~ 🐾
:::

Account binding, score uploads, PC sync, score queries, and BREAK interactions
are now all merged into the same QueryBot — you no longer need to distinguish
between the "account bot" and the "query bot". Commands in this page default to
no prefix; if your platform configures a prefix such as `/`, prepend it to each
command.

::: tip Contact & Feedback
Join the QQ groups: [Group 1 · 1072033605](https://qm.qq.com/q/Gj3QmfEyY0) (main, no games) and [Group 2 · 993795066](https://qm.qq.com/q/PF5t1VXPi0) (games). Please read the [Group Rules](/en/guide/group-rules) before joining.

If something goes wrong, keep the `Ref_ID` the Bot returns and post on the
[AWMC Bot forum board](https://bbs.wmc.pub/forums/awmc-bot.17/). Please do not chase the group
owner or admins with repeated @-mentions in the group — unwanted pestering can get you muted
for 1 day under the [Group Rules](/en/guide/group-rules).
:::

::: danger Credential safety
`SGWCMAID`, official maimai QR links, and score-tracker Tokens are all sensitive
credentials. The Bot will try to recall the original message first; if recall
fails, please manually recall it immediately and do not forward credentials to
others.
:::

::: info Version and availability
This page follows the current source code; production deployment has not been verified. Availability, prices and limits depend on deployed configuration and Bot prompts. Prices below are source-code defaults.
:::

## 0. Quick Start

Follow this order on your first use and you can query scores within five minutes:

1. **Add the bot** — Click "Add AWMC Bot" at the top of this page, or have a group owner
   invite the bot to your group. Before using group features, allow the bot to read all
   messages in group settings (see [Section XI](/en/guide/bot/intro#add-to-group)).
2. **Agree to the terms** — Send `用户协议`, read the web page, and reply with the full
   confirmation phrase.
3. **Bind your maimai account** — Send `mai绑定` and submit a `SGWCMAID...` or official QR
   link. No Diving Fish / Lxns binding is required to query scores (AWMC NET is the default
   score database).
4. **Query scores** — Send `b50`, `ab50`, or `我的pc数` to get started; see
   [Command Reference](/en/guide/bot/advanced) for the full list.
5. **Group management & queue cards** — Group owners / admins send `群管理` to open the
   [Group Console](/en/guide/bot/group-console) for feature switches, group stats, arcade
   queues and weather.

## I. First-Time Setup

### 1. Read and confirm the user agreement

1. Send `用户协议` to the Bot.
2. Open the [AWMC maiBot Terms of Service (v4)](https://wiki.awmc.team/en/guide/bot/terms) returned by the Bot.
3. Read the full page carefully and copy the **full confirmation phrase** from the page.
4. Send the confirmation phrase directly to the Bot; `同意用户协议 <full confirmation phrase>` also works.

Only after confirmation can you use account binding, uploads, tickets, BREAK
transfers, and lottery features. Sending `撤回用户协议` withdraws consent but
does not automatically delete existing account bindings.

Scores, Rating, and trends are anonymized and treated as public data (including
training use) by default. To opt out, send `不同意共享我的数据`.

### 2. Bind your maimai account

Send:

```text
mai绑定
```

The Bot will ask for the latest player QR data. To get it:

1. Open the "maimai DX | CHUNITHM" player QR in WeChat;
2. Long-press the QR and choose "识别图中二维码" (recognize QR in image);
3. Copy the recognized text or web address and send it to the Bot.

The following three forms are supported:

- Full `SGWCMAID...` string;
- `https://wq.wahlap.net/qrcode/img/MAID....png` image link;
- `https://wq.wahlap.net/qrcode/req/MAID....html` request link.

You can also send `mai绑定 SGWCMAID...` directly. Common alias: `maibind`.

The Bot verifies the account identity in the QR; after binding it only shows
the player name and Rating, never the arcade UID. If the same maimai account
exists in old Bot migration records, the new credential automatically claims
the old record after verification; BREAK, agreement status, and Lxns OAuth do
not transfer with the claim.

After binding verification passes, the Bot automatically syncs anonymized
scores to **AWMC NET.** (the default score database) and prompts that you can
register at [net.wmc.pub](https://net.wmc.pub) with your QQ email for web
queries. This means **you don't need to bind Diving Fish or Lxns to query B50**
— see [the next section](#iii-awmc-net-score-query-without-binding).

## II. Check Account Status

Send `mymai` or `mai状态` to view:

- Player name, Rating, and old/new version Rating breakdown;
- Friend-battle level, play count, cabinet and data version;
- Recent login, play, co-op, region, and awakening count;
- Account ban status, BREAK balance;
- Diving Fish / Lxns binding, recent uploads, and valid ticket summary.

The status message never shows the full QR, Token, or arcade UID.

The last successfully verified QR is cached for 10 minutes by default. While
the cache is valid, the Bot re-verifies the account identity before fetching
the latest status; when the cache expires, returns empty/500, the last use
failed, or the identity mismatches, the Bot asks for a new QR again. Up to 3
attempts; sending `取消` directly views the saved cached profile.

## III. AWMC NET Score Query Without Binding

AWMC NET is QueryBot's built-in default score mirror database (at
[net.wmc.pub](https://net.wmc.pub)); all new users' default data source is
AWMCNET. It lets you query scores **without binding any third-party score
checker** (Diving Fish / Lxns):

1. Complete `mai绑定`, or directly send the latest `SGWCMAID` / official QR link;
2. The Bot creates your profile after verification and uploads anonymized scores to AWMC NET;
3. The first successful sync replies: "AWMC NET has synced your info; no further action needed";
4. After that, send `b50`, `ab50`, etc. directly — no Diving Fish Token or Lxns OAuth needed.

On the web, register [net.wmc.pub](https://net.wmc.pub) with the same QQ email
to view scores. AWMC NET only receives anonymized QQ, display name, and scores;
it never receives QR codes, arcade UIDs, or third-party Tokens.

Common commands:

| Command | Description |
|---|---|
| `数据源` | View the current data source (new users default to AWMCNET) |
| `数据源 AWMCNET` / `数据源 水鱼` / `数据源 落雪` | Switch personal data source |
| `成绩趋势 [days]` | AWMC NET server-side Rating trend over the last 30 days, default 30, range 1-365 |

Aliases: `rating趋势`, `mai趋势`, `awmc趋势`. When AWMC NET has no scores, the
Bot automatically detects a bound Diving Fish / Lxns and migrates one score
snapshot; some advanced analyses (fitting, gold content, etc.) that Lxns does
not support fall back to Diving Fish automatically.

Diving Fish Token and Lxns OAuth are now **optional**: binding them syncs to the
corresponding platform in addition to AWMCNET, convenient for viewing on
external score checkers.

## IV. Upload Scores to Trackers (Optional)

### 1. Bind Diving Fish

Get an Import Token from [Diving Fish](https://maimai.diving-fish.com/), then
send:

```text
mai绑定水鱼 <Token>
```

Alias: `maibindfish <Token>`.

### 2. Bind Lxns

Recommended: send directly:

```text
lxbind
```

Complete the Lxns OAuth flow as prompted; after that, no Lxns Import Token needs
to be submitted to the Bot.

For the compatibility path, send:

```text
mai绑定落雪 <Import Token>
```

Alias: `maibindlx <Import Token>`. Uploads prefer OAuth; the Import Token is
only used when not authorized or as a compatibility fallback.

### 3. Upload

| Command | What it does | Default price |
|---|---|---:|
| `maiu` | Upload to Diving Fish | 2 BREAK |
| `maiul` | Upload to Lxns | 2 BREAK |
| `maiua` | Upload to both Diving Fish and Lxns | 3 BREAK |

All three uploads also **write to AWMC NET** (always synced); `maiu` is Diving
Fish only, `maiul` is Lxns only, and `maiua` is both. External platforms only
participate when bound; not binding them does not affect AWMCNET queries.

All three share the "daily first-success-free" allowance. BREAK is only charged
after the external service actually returns success; invalid QR, HTTP 500,
empty results, task failure, or timeout do not charge.

Uploads prefer the 10-minute verified QR cache. When the cache is unavailable,
the Bot asks for the latest `SGWCMAID` or official link, up to 3 retries;
sending `取消` ends the current upload round.

::: info Third-party trackers
QueryBot cannot know when you play at the cabinet or which songs you played.
After playing, re-run `maiu`, `maiul`, or `maiua` so the tracker's B50 updates.
:::

## V. Sending QR Codes Directly

When a message starting with `SGWCMAID` or the Wahlap official links above is
sent directly, the Bot processes it in this order:

1. Recalls the original credential message first;
2. Verifies the user agreement and group feature switch;
3. Fetches and saves the latest PC data;
4. Auto-uploads by binding status: only Diving Fish bound → Diving Fish, only
   Lxns bound → Lxns, both bound → both;
5. Returns PC count, upload results, BREAK settlement, and `Ref_ID` together.

If no score tracker is bound, only PC is synced this time. If the QR is
invalid, expired, or the service is temporarily unavailable, you can resend at
most 3 times within 3 minutes.

## VI. PC Data & Score Queries

| Command | Description |
|---|---|
| `更新pc数` | Sync PC data using a valid cache or latest QR |
| `我的pc数` | Total PC and top 15 most-played charts |
| `pc数 <song>` | PC data for a specific song |
| `pc50` | B50 sorted by play count |
| `pca50` | Rating B50 re-sorted by PC |
| `游玩排行50` | Top 50 most-played charts library-wide |
| `pc排行` | All synced users' PC total ranking |

PC data comes from the maimai account sync; score charts like `b50`, `ab50`
still use the Diving Fish or Lxns score checker as the source.

If a query still shows old scores right after an upload, wait a moment and send
`刷新b50`. The Bot proactively clears the local score cache before and after
uploads, but the score checker itself may need time to process.

## VII. BREAK

### 1. Earning & viewing

| Command | Description |
|---|---|
| `AWMC签到` / `签到` | Check in for BREAK; available again 24 h after the last successful check-in |
| `我的AWMC` | Balance, check-in streak, today's usage, recent transactions, and invoice `returnCode` stats |
| `AWMC帮助` | View BREAK rules |

The base check-in reward is 1-2 BREAK by default; the consecutive check-in bonus
adds up to 3 more (capped from day 5). Specific groups, Thursdays, and the group's
first check-in of the day may apply extra multipliers; the actual result follows
what the Bot returns.

### 2. Default pricing

| Feature | Default rule |
|---|---|
| Score API | First actual request per day free, then 1 BREAK; cache hits are free |
| B50 analysis | Billed by Token usage: base price min 3, max 30; 14 BREAK reserved before the call, refund/settle the difference on success, full refund on failure (both ×2 during LLM peak hours) |
| Song guessing | Normal correct guess gives 1 BREAK by default; Guess Rating / B50 Impostor settle by rank and difficulty |
| Score upload | First success per day free, then Diving Fish 2, Lxns 2, both 3 |
| Tickets | Success: 2x 20, 3x 30, 5x 50 BREAK; failure after submission: default 100 BREAK penalty; see [billing conditions](/en/guide/bot/commands#_6-break-tickets) |
| Lottery | 2 BREAK per draw by default; 1-1000 draws |

### 3. Group interaction

```text
转账BREAK @用户 10
BREAK抽奖
BREAK抽奖 5
```

`BREAK抽奖` draws once by default; a number means consecutive draws. BREAK is an
internal interaction currency of the Bot and has no cash value.

## VIII. Forum Account Binding (qbind)

qbind binds your **score-query QQ** on the official QQ Bot. The main path verifies
your QQ email — **no forum registration is required**. After binding you can use
check-in, score query, B50, and other account features. The first-binding BREAK
reward follows the server configuration and the Bot's actual reply.

### 1. Start binding

Send your QQ number (not your email address):

```text
qbind 123456789
```

1. The Bot sends a **6-digit verification code** to `123456789@qq.com`;
2. Check the inbox or spam folder, then send the code directly to the Bot within **10 minutes**;
3. The code becomes invalid after **5 wrong attempts**. If it expires or the Bot restarts, request a new code.

A bare `qbind` shows instructions when email binding is enabled. If email binding
is unavailable, `qbind` falls back to forum OAuth; follow the Bot's prompts.

::: warning Email rate limits
Requests are limited to once per **60 seconds** for both the platform user and the QQ email.
In a **rolling 24-hour window**, the same platform user can request **10 emails**
and the same QQ email **5 emails**; the whole Bot allows **300 per rolling hour**. Wait for the Bot's retry notice; do not repeatedly request codes.
:::

**Alternative: forum OAuth.** Send `论坛绑定` (also `论坛登录` / `AWMC论坛绑定`)
to use forum authorization explicitly. `绑定qq` / `mai绑定qq` / `maiqbind` follow
the same email-first routing as `qbind`.

1. Open the authorization link in a browser and log in to the forum;
2. The forum email must be `yourQQ@qq.com`;
3. After authorizing, send the authorization code or full callback link directly to the Bot.

The OAuth code is valid for 10 minutes and can only be used once. Once the flow
has started, you do not need to repeat the `qbind` prefix.

### 2. Binding success

Email verification replies "绑定成功"; OAuth replies "论坛绑定成功".
When the forum integration is configured, email binding also finds the forum account
with the same QQ email or creates one automatically. **Forum association failures do
not invalidate QQ binding**; check-in, score queries, B50, and Phigros can still use
the verified score-query QQ. Features requiring a forum identity, such as the default
group-console login, still need a successful association (or `论坛绑定` OAuth).
For an automatically created forum account, choose **邮件链接登录** (email-link login)
on the forum login page and enter your QQ number to sign in without a password.

### 3. Check binding status

Send:

```text
qbind状态
```

Aliases: `查绑定qq` / `我的qbind` / `论坛绑定状态` / `论坛账号状态` / `论坛状态`.

### 4. Unbind / cancel

| Command | Description |
|---|---|
| `qunbind` | Quote the forum / score-query QQ unbinding fee without charging yet (aliases: `解绑qq` / `QQ解绑` / `解绑qbind` / `解绑论坛` / `论坛解绑`) |
| `qunbind 确认` | Confirm payment and remove the score-query QQ and forum identity binding |
| `取消论坛绑定` | Cancel an in-progress binding flow (aliases: `论坛绑定取消` / `取消qbind`) |

::: warning Unbind before changing QQ
An existing binding blocks a direct `qbind` change. Send `qunbind` for a quote, then `qunbind 确认`. Fees are counted from the **old score-query QQ** transaction history: **100 BREAK** for its first unbinding, **200 BREAK** each time thereafter, deducted from that QQ’s balance. FREEDOM and free windows do not waive this fee; insufficient balance leaves the binding intact. After unbinding, account features such as check-in and score queries require `qbind` again. `取消论坛绑定` only cancels a pending flow; it does not unbind an account.
:::

### 5. View or change your forum username

Send `nickname` for your username and next allowed rename time, or `nickname <new name>` to rename it. Aliases: `论坛改名` / `修改论坛用户名` / `改论坛用户名` / `论坛用户名`. A successfully associated forum identity is required, not just a QQ mapping. This handler has no separate BREAK charge.

An automatically generated username can be changed immediately for the first time; later changes are normally limited to once every 30 days. The forum’s returned limit and next allowed time take precedence. Names must contain 3–25 characters, cannot be all digits, generated usernames or platform OpenIDs, and cannot contain emoji or prohibited special characters. The forum may reject a name, for example if it is already taken. Staff accounts, OneBot users, or forums without Bot rename support must use forum account settings instead.

::: info
In OneBot mode, the message QQ is the score-query QQ; qbind / forum OAuth is not
required to use account features.
:::

## IX. Tickets

Send `发票 2` or `fp 2` to request a 2x ticket; 2x, 3x, and 5x are currently
supported:

| Multiplier | Price (per success) |
|---:|---:|
| 2x | 20 BREAK |
| 3x | 30 BREAK |
| 5x | 50 BREAK |

Successful tickets are charged by multiplier, with no daily first-free allowance. Failure after actual submission has a default 100 BREAK penalty; pre-submit QR validation / balance failures and local quota rejection do not incur it. See the [command reference](/en/guide/bot/commands#_6-break-tickets) for unused-ticket blocking and other conditions; live configuration takes precedence.
`mai查票` or `查票` views ticket type, stock, and expiry, at a default 1 BREAK per successful query; replies never show the account UID or raw API data.

::: danger Risk warning
Issued tickets cannot be undone and must be used on the cabinet; do not stockpile them.

Tickets, uploads, and QR-related features may affect official maimai account
safety. Read the [AWMC BOT Terms of Service & Privacy Policy](/en/guide/bot/terms)
in full before use, and bear the risk yourself.
:::

## X. FAQ

### Bot says "no account record yet"

Complete these in order:

1. Send `mai绑定` and submit the latest `SGWCMAID` string or official link;
2. Send `mai绑定水鱼 <Token>` as needed, or use `lxbind` for Lxns OAuth;
3. Use `maiu`, `maiul`, `maiua` to upload to Diving Fish, Lxns, or both.

### QR returns 500, all null, or says expired

Go back to the maimai player QR page, regenerate it, and long-press to
recognize. Don't keep sending old QR codes; the same round allows at most 3
attempts. If it still fails, restart later.

### Bot cannot recall the credential message

Recall it manually immediately. The Bot will still return redacted processing
results, but that cannot replace your deleting the original message.

### Query says user not found or no data

New users default to AWMC NET; sending one latest `SGWCMAID` completes sync and
enables queries without Diving Fish / Lxns. If you manually switched to Diving
Fish, confirm your Diving Fish profile has the correct QQ number, disable
"禁止其他人查询我的成绩" (prohibit others from querying my scores), and run
`maiu` at least once; for Lxns, check whether OAuth is still valid.

### B50 shows integer scores or differs from the web

Check the Diving Fish privacy settings, disable "对非网页查询的成绩使用掩码"
(use mask for non-web query scores), then send `刷新b50` to retry.

### Upload says login failed

Usually the QR is expired, the account is still logged in at the cabinet, or
the external service is temporarily unavailable. Get a new QR and follow the
Bot prompts, up to 3 retries; failed flows never charge BREAK.

### Want plain text / weird bot replies

Some clients (certain QQ versions or special environments) cannot render
Markdown and quick buttons properly. Send「切换兼容模式」to enable compatibility
mode; the Bot replies:

> Compatibility mode enabled: except for necessary segments like @, images,
> and audio, subsequent replies use plain text and links show as raw URLs.

Send「切换兼容模式」or「标准模式」to restore Markdown and quick buttons.

## XI. Add the Bot to Your Own Group (Group Owner/Admin) {#add-to-group}

The Bot supports joining other QQ groups. If you are a group owner or admin and
want the Bot to reply without @, play guessing games normally, etc., follow
these steps:

1. Open the Bot's profile page and click the settings button at the top right;
2. Change the Bot to "allow viewing all messages".
   Note: after enabling this, other bots will also read group messages and may
   cause duplicate replies;
3. Allow the Bot to push messages proactively (required for guessing features);
4. To let the Bot auto-recall messages, add the Bot as an admin in group
   management.

Common owner / admin commands (game toggles, join verification, auto-approval, kicking,
arcade queue, polls …) are collected in the
[Group Console · Admin Command Quick Reference](/en/guide/bot/group-console#admin-quick-ref).

If issues occur, contact the responsible admin. Midday and evening peaks may be
slower; please be patient.

## XII. More Commands

- [Full Command Reference](/en/guide/bot/advanced)
- [Terms of Service & Privacy Policy](/en/guide/bot/terms)
- [Terminology](/en/guide/bot/explain)
