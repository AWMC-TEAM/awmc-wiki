# maimai Bot (koishi-plugin-maibot) Command Reference


## 1. Before You Start

- **Command Prefix**: All examples below use `/` as the prefix, consistent with Koishi command prefix configuration.


## 2. Store & "Priority Authorization"

### 2.1 Default Purchase Link (Store)

The plugin uses the following link by default in **cooldown prompts**, **unbind card guides**, and similar scenarios (configurable):

- **Priority Authorization / General Store**: https://store.awmc.cc/


### 2.2 What is "Priority Authorization"?

When **`priorityCooldown`** is enabled, regular users will enter a **cooldown** period for certain features; the `{shopUrl}` in prompt text refers to the store URL above.

- **Personal Priority**: After redeeming a **personal key**, the corresponding account enjoys shorter or zero cooldown **globally** (as configured).
- **Group Priority**: After redeeming a **group key** (must be redeemed **within the target group**); once active, **all group members within that group** are exempt from cooldown when using the Bot (does not apply in private messages).
- **Admin Bypass**: When a user's `authority` is **greater than** `adminBypassAuthority` (default **4**), they **bypass cooldown** and may automatically sync a permanent personal priority entry (cleared when authority drops; **unrelated to key redemption records**).




## 3. How to Redeem Keys

### 3.1 Command

```
/mai redeem key <key>
```

Or send `/mai redeem key` first, then paste the full key within the **time limit** prompted by the Bot (usually starts with **MAI-**).

### 3.2 Three Types of Keys

| Type | Redemption Environment | Description |
|------|----------------------|-------------|
| **Personal** | Private message or group | The bound account enjoys priority cooldown **globally**. |
| **Group** | **Must be redeemed within the target group** | Bound to the current group; all group members enjoy no cooldown **within the group**. |
| **Unbind** | Private message or group | Must have already executed `/mai bind`; after redemption, adds **unbind quota** to the current binding for `/mai unbind key` (alias: `maiunbindkey`) during cooldown. |

### 3.3 Group Priority Follow-up Actions (Redeemer)

- **`/mai cancel group priority`**: Cancel group priority for the current group (only the **group key redeemer** and their cross-platform linked accounts can operate).
- **`/mai transfer group priority`**: Initiate migration in the **original group**.
- **`/mai receive group priority`**: Complete the transfer in the **target group** (used with the above command).

If historical data has no redeemer record, an admin can use **`/mai admin cancel group priority`** to handle it.

---

## 4. Help & Aliases

| Command | Description |
|---------|-------------|
| `/mai` / `/mai help` | View built-in help; add `--advanced` to expand ticket, collectible, and travel distance features. |
| `/mai status` | Query binding and priority authorization status. |
| `/mymai` | Same as `/mai status`. |
| `/mai unbind key` | `maiunbindkey` is an alias. |
| `/mai unlock` / `/mai escape` | Only effective when lock-related commands are re-registered in source code; currently disabled in default builds. |

---

## 5. Regular User Commands (Non-Admin)

### 5.1 Account & Connection

| Command | Description |
|---------|-------------|
| `/mai bind [QR code or link]` | Bind maimai DX account (SGID text or official account webpage, etc.). |
| `/mai unbind` | Unbind maimai DX (Bot will prompt about unbind cards when rebind cooldown is active). |
| `/mai unbind key` | Unbind using **unbind key quota** during cooldown (requires SGID verification and confirmation). |
| `/mai status [target]` | Check your own status; high authority can check others. |
| `/maiping` | Test arcade connection. |
| `/maiqueue` | Check current queue position (when queue is enabled). |

### 5.2 Diving Fish B50

| Command | Description |
|---------|-------------|
| `/mai bind fish <token> [target]` | Bind Diving Fish Token. |
| `/mai unbind fish [target]` | Unbind Diving Fish Token; maimai binding is preserved. |
| `/mai upload B50 [QR code or target]` | Upload B50 to Diving Fish. |
| `/maiua [QR code or Lxns code] [target]` | Upload B50 to both Diving Fish and Lxns simultaneously (SGID can go through one flow). |

### 5.3 Lxns B50

| Command | Description |
|---------|-------------|
| `/mai bind lxns <code> [target]` | Bind Lxns code. |
| `/mai unbind lxns [target]` | Unbind Lxns code. |
| `/mai upload lxns b50 [code] [target]` | Upload B50 to Lxns. |

### 5.4 Tickets, Travel Distance, Collectibles, Version & Scores (`/mai --advanced` also has a summary)

| Command | Description |
|---------|-------------|
| `/mai ticket [multiplier] [target]` | Issue function ticket (e.g., 2-6x, default 2). |
| `/mai change version [QR code or target]` | Change game version number (supports caching). |
| `/mai get collectibles [SGID or @user]` | Interactively get collectibles. |
| `/mai upload song score [@user]` | Interactively upload a single song score. |
| `/mai delete score [@user]` | Interactively delete a single song score. |

#### `/mai get collectibles` Interactive Menu

After sending the command, the Bot will prompt you to select a collectible type:

| Number | Type |
|--------|------|
| 1 | Nameplate |
| 2 | Title |
| 3 | Avatar |
| 4 | Gift |
| 5 | Song |
| 6 | Unlock Master |
| 7 | Unlock Re:Master |
| 8 | Unlock Black Chart (not yet implemented) |
| 9 | Travel Partner |
| 10 | Partner |
| 11 | Background |
| 12 | Function Ticket |
| 13 | Intimacy Gift |

Enter the corresponding number (1-13), or enter `00` to cancel.

For song-related types, the Bot will further prompt for the Song ID.

### 5.5 Others

| Command | Description |
|---------|-------------|
| `/mai query opt <titleVer>` | Query Mai2 option file download URL. |
| `/mai redeem key [key]` | See Section 3. |
| `/mai cancel group priority` | See Section 3. |
| `/mai transfer group priority` / `/mai receive group priority` | See Section 3. |


---

## 6. Admin Commands

### 6.1 Permission Overview

| Type | Config / Condition | Default | Description |
|------|-------------------|---------|-------------|
| Key & priority management, `maibypass` | `authLevelForCardAdmin` | **4** | Generate/delete/export keys, directly modify personal/group priority, `/maibypass`, etc. |
| Cooldown bypass + auto permanent personal priority | `authority` **>** `adminBypassAuthority` | Threshold default **4** | Not a standalone command; handled by the plugin in cooldown logic. |


Optional **`-bypass`** commands are documented within the plugin (used to skip confirmations).

### 6.2 Requires `authority` >= `authLevelForCardAdmin` (default 4)

| Command | Description |
|---------|-------------|
| `/mai admin generate key [duration] [quantity]` | No params for interactive mode; supports **`-g`** group key, **`-u`** unbind key. Quick examples: `/mai admin generate key 7d 5`, `-g 30d 3`, `-u -1 10`. |
| `/mai admin delete key [key]` | Invalidate a key; supports multi-line or exported TSV batch; no params for interactive mode. |
| `/mai admin export keys [scope]` | Export as tab-separated text; quick: `all` / `unused` / `redeemed`; no params for interactive filtering. |
| `/mai admin cancel group priority [group ID]` | Cancel group priority for specified or current group. |
| `/mai admin cancel personal priority <target>` | Clear target user's personal priority record. |
| `/mai admin set personal priority <target> <spec>` | `spec` examples: `permanent`, `7d`, `clear`, etc. |
| `/mai admin set group priority <spec> [-g group ID]` | Directly set group priority; `-g` can be omitted when in group. |
| `/maibypass <target>` | Clear all command cooldowns for target user (alias: `/mai admin clear cooldown`). |

---

## 7. Community

- **Feedback QQ Group**: **1072033605**
- **Official Website**: https://awmc.cc

---
