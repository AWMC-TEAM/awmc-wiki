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

By default, you also need to complete [forum account binding (qbind)](/en/guide/bot/intro#viii-forum-account-binding-qbind)
first — the console uses your forum identity to confirm that the person opening the link is you.

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
| Group overview | Today's activity, message counts and latest activity for your groups |
| Feature switches | Enable / disable score lookup, guessing games, BREAK, queue, account, search, play count and more per group |
| Group statistics | BREAK income/spending, feature usage share, member message ranking and usage logs for the last 1 / 7 / 30 / 90 days |
| Arcade queue | Add, edit and delete arcades; autofill store details from Nearcade; view report history |
| Weather | Enable daily weather digest, set push time, severe-weather alerts and subscription interval |
| Message templates | Custom query / report / predict templates for queue cards (super admin only) |
| Member grants | Super admins can grant a `后台身份` group management rights (30 days by default) |

Key actions in the console are written to an audit log for traceability.

## 3. FAQ

| Message | Fix |
|------|----------|
| "Group management console is not enabled" | The server has not enabled the feature; ask a bot admin to deploy it |
| "Please complete qbind first" | Send `qbind` and finish forum binding |
| "Could not confirm group management rights" | Send `后台身份` and give the returned ID to a super admin |
| "Set arcade latitude/longitude in group management first" | Open the console, add an arcade under "Arcade queue" and fill in coordinates |
| The link does not open or errors | Use the newest link from the bot; links are single-use and expire after 5 minutes. Resend `群管理` if needed |

## 4. Deployment Notes (for admins)

The console runs as a standalone HTTP service on port `8100` by default and must be exposed
through an HTTPS reverse proxy.

```text
MAIMAIDX_GROUP_CONSOLE_ENABLED=true
# Public HTTPS URL, must end with /group-console
MAIMAIDX_GROUP_CONSOLE_PUBLIC_URL=https://console.example.com/group-console
# Bind address: 127.0.0.1 / ::1 / localhost, or explicit 0.0.0.0 behind a reverse proxy
MAIMAIDX_GROUP_CONSOLE_HOST=127.0.0.1
MAIMAIDX_GROUP_CONSOLE_PORT=8100
# Fast one-time login; off by default because group links may be visible to others
MAIMAIDX_GROUP_CONSOLE_FAST_LOGIN=false
# Emergency super-admin token; prefer forum UID/QQ + OAuth for daily use
MAIMAIDX_GROUP_CONSOLE_ADMIN_TOKEN=
# Dedicated forum OAuth redirect; defaults to {PUBLIC_URL}/api/login/callback
MAIMAIDX_GROUP_CONSOLE_OAUTH_REDIRECT=
```

Related settings:

- `MAIMAIDX_QUEUE_NEARCADE_TOKEN`: Nearcade search / sync token;
- `MAIMAIDX_QUEUE_WEATHER_PROVIDER`: weather source (`openmeteo` / `qweather` / `both`);
- `MAIMAIDX_QUEUE_WEATHER_QWEATHER_KEY` and friends: QWeather JWT settings.

Console data lives under `data/group_console/`; queue and weather data are stored in
`data/group_console/queue.db` and never run on the event-loop hot path.

Related pages: [Command Reference](/en/guide/bot/advanced#212-advanced-features) ·
[Basic Tutorial](/en/guide/bot/intro) · [Sponsor](/en/sponsor)
