# Group Management Console

::: tip In one sentence
The **Group Management Console** is the web panel of AWMC Bot. Group owners and admins
can toggle group features, inspect group data, and manage arcade queues and weather in a
browser — no need to remember a pile of text commands. 🐾
:::

## 1. How to Log In

Send this command in the target group:

```text
群管理
```

Aliases: `管理后台`, `群后台`.

You need one of the following:

- You are the **owner or admin** of this group (detected automatically);
- A super admin has **granted** you management rights for this group;
- You are a plugin super admin.

By default, you also need a **linked forum identity**. Start with
[qbind QQ email verification](/en/guide/bot/intro#viii-forum-account-binding-qbind):
send `qbind <QQ number>` and return the emailed code. When forum integration is configured,
the Bot also links an existing forum account by that email or creates one automatically.
If that association fails, your QQ binding still works, but default console login needs
you to finish `论坛绑定` OAuth — the console verifies who opens the link using the forum identity.
Fast login, when enabled by the server, does not require this forum-binding check.

After sending `群管理`, the bot returns a **one-time login link** (valid for 5 minutes, usable once):

- Default mode: the link contains `#invite=...`; complete the forum authorization flow, then the page redirects back to the console;
- Fast login (when enabled on the server): the link contains `#fast=...` and signs you in directly.

::: danger The login link appears in the group
The bot's reply may be visible to other group members. Open it promptly and never forward it;
with fast login the link signs in directly, so be extra careful. 🐾
:::

If the bot cannot confirm your management rights, send:

```text
后台身份
```

and give the returned identity ID to a super admin, who can grant you access in the console.

## 2. What You Can Do

| Module | Description |
|------|------|
| Group overview | Today's activity, message counts and latest activity for your groups; empty group names are filled from the platform, and "Sync group name" refreshes them manually |
| Feature switches | Enable / disable score lookup, guessing games, Phigros lookup, BREAK, queue, account, search, play count and more per group |
| Group statistics | BREAK income/spending, feature usage share, member message ranking and usage logs for the last 1 / 7 / 30 / 90 days |
| Poll results | **Super-admin** feature (at `{PUBLIC_URL}/votes`): list this group's (and server-wide) polls with bar / pie charts of the votes, and close them early; the ballot detail (voter / raw input) is on the same page |
| Arcade queue | Add, edit and delete arcades; autofill store details from Nearcade; view report history |
| Weather | Enable daily weather digest, set push time, severe-weather alerts and subscription interval |
| Message templates | Custom query / report / predict templates for queue cards (super admin only) |
| Member grants | Super admins can grant a `后台身份` group management rights (30 days by default) |

Key actions in the console are written to an audit log for traceability.

## 3. Admin Command Quick Reference {#admin-quick-ref}

Besides the console, these commands can be sent directly in the group (group owner / admin
required; follow the links for details):

| What you want | Send | Details |
|----------|------|------|
| Toggle guessing mini-games (猜歌, 开字母, maidle, 猜群友 …) | `开启mai猜歌` / `关闭mai猜歌` | [Song Guessing](/en/guide/bot/advanced#_2-6-song-guessing) |
| Toggle Werewolf | `开启狼人杀` / `关闭狼人杀` | [Werewolf](/en/guide/bot/advanced#_2-13-werewolf-狼人杀) |
| Toggle Phigros lookup | `开启phi` / `关闭phi` | [Phigros](/en/guide/bot/phigros) |
| Toggle alias push | `开启别名推送` / `关闭别名推送` | [Group Interaction Extras](/en/guide/bot/advanced#group-interaction-extras) |
| Quiz new members on join | `入群验证 开启` | [Join verification](/en/guide/bot/advanced#group-moderation) |
| Auto-approve join requests by keyword | `自动审批 开启` + `自动审批 关键词 添加 <word>` | [Auto-approval](/en/guide/bot/advanced#group-moderation) |
| Kick / kick and blacklist | `mai踢 @member` / `mai踢 @member -b` | [Kicking](/en/guide/bot/advanced#group-moderation) |
| Subscribe to arcade weather | `subweather <alias>` | [Arcade Queue](/en/guide/bot/advanced#arcade-queue) |
| Start a group poll | `创建投票 <title> <A/B>` | [Voting](/en/guide/bot/advanced#_2-14-voting-投票) |
| Give guessing bonus cards | `发加倍卡 @user [count] [hours]` | [Admin Rendering](/en/guide/bot/advanced#admin-rendering-precache-status) |
| Silence the "mini-game permission" reminder | `小游戏权限不再提醒 <version>` | [Group Interaction Extras](/en/guide/bot/advanced#group-interaction-extras) |
| Force-end a stuck game | `重置猜歌` / `重置maidle` / `重置猜群友` … | [Song Guessing](/en/guide/bot/advanced#_2-6-song-guessing) |

::: tip Make the Bot an admin first
Join approval, kicking, muting and auto-recalling credentials all require the Bot to be a
**group admin**. To let it reply without @ and run guessing games, also allow it to "view all
messages" — see [Adding the Bot to your group](/en/guide/bot/intro#add-to-group).
:::

## 4. FAQ

| Message | Fix |
|------|----------|
| "Group management console is not enabled" | The feature is not available yet; contact a bot admin |
| "Please complete qbind first" | Send `qbind <QQ number>` and return the email code; if no forum identity was linked, complete `论坛绑定` OAuth before retrying |
| "Could not confirm group management rights" | Send `后台身份` and give the returned ID to a super admin |
| "Set arcade latitude/longitude in group management first" | Open the console, add an arcade under "Arcade queue" and fill in coordinates |
| The link does not open or errors | Use the newest link from the bot; links are single-use and expire after 5 minutes. Resend `群管理` if needed |

Related pages: [Command Reference](/en/guide/bot/advanced#_2-12-advanced-features) ·
[Basic Tutorial](/en/guide/bot/intro) · [Sponsor](/en/sponsor)
