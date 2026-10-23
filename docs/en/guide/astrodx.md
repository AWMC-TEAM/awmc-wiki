# Importing Charts into AstroDX

::: tip In one sentence
Download a chart in **ADX** format from the [AWMC-MaiArchive download site](https://download.wmc.pub),
tap the file in your phone's file manager and choose "Open with AstroDX" — done!
:::

This page explains how to import charts downloaded from [download.wmc.pub](https://download.wmc.pub)
into **AstroDX**, the mobile maimai simulator. It follows the AstroDX documentation and the
packages the download site actually produces. For installing or updating AstroDX itself, the
[official AstroDX guide](https://astrodx.notion.site/Installation-Guide-for-Android-3f2ec5041ad5413ab45500472bb4ceba)
is authoritative.

## 0. Quick start

1. **Install AstroDX and open it once** — the first launch creates its folders, which makes importing work smoothly.
2. **Open the download site in your system browser** — search for a song on
   [download.wmc.pub](https://download.wmc.pub) and open its download dialog. In-app browsers
   (QQ, WeChat) cannot save files; use "Open in browser".
3. **Pick "ADX · 无背景视频" (ADX, no background video)** — smaller and faster to import.
   Choose "ADX · 含背景视频" if you want the background video.
4. **Open it with AstroDX** — tap the `.adx` file in your Downloads folder and choose
   "Open with → AstroDX". The game installs the song automatically.

Single-song downloads need **no captcha**; version packs and multi-select downloads do.

## 1. Before you start

### Install AstroDX

- **Android**: download the latest `.apk` from
  [AstroDX GitHub Releases](https://github.com/2394425147/maipaddx/releases). The official guide
  recommends the newest build, even if it is a pre-release. If Android blocks installing unknown
  apps, allow it for your browser in system settings.
- **iOS**: AstroDX is not on the App Store. See the announcements in the official AstroDX Discord
  ([sht.moe/astrodx](https://sht.moe/astrodx)); this wiki does not distribute builds.

**Open the game once** after installing so it can initialise. It starts with no songs — that is normal.

### Choose the right format

Each song on the download site has four buttons:

| Button | File | Best for |
|------|------|------|
| **ADX · 无背景视频** (no video) | `[DX] Title.adx` | ⭐ Recommended. One-tap import, small |
| ADX · 含背景视频 (with video) | `[DX] Title.adx` | Background video (PV) while playing; can be tens of MB per song |
| ZIP · 无背景视频 (no video) | `[DX] Title.zip` | Manual import, or if your phone can't open `.adx` with AstroDX |
| ZIP · 含背景视频 (with video) | `[DX] Title.zip` | Same, with background video |

::: info ADX vs ZIP
The contents are identical: `maidata.txt` (chart), `track.mp3` (audio), `bg.png` / `bg.jpg`
(jacket), plus `pv.mp4` in the "with video" version. An `.adx` file is just a renamed `.zip`;
the difference is that AstroDX can open `.adx` directly and install it.
:::

The `[DX]` / `[ST]` prefix is added by the download site to tell apart DX and Standard charts
with the same title; 宴会場 (Utage) charts have no prefix.

## 2. Method 1: one-tap ADX import (recommended)

AstroDX recommends importing via ADX archives (Beta 2 Patch 4 and later).

1. Download the chart in **ADX** format;
2. Open your phone's file manager and go to the Downloads folder;
3. Tap the `.adx` file and choose **Open with → AstroDX**;
4. AstroDX opens and installs the song; it appears on the song select screen.

After an ADX import the song's folder in AstroDX is named `[DX] Title.Artist`.
**Importing a song with the same name again overwrites the old one.**

::: warning No "Open with AstroDX" option?
Some phones (e.g. Xiaomi and some Samsung models) don't offer it in the stock file manager. Either:

- install [ZArchiver](https://play.google.com/store/apps/details?id=ru.zdevs.zarchiver) or
  [Files (Marc apps)](https://play.google.com/store/apps/details?id=com.marc.files) and open the
  `.adx` from there; or
- rename `.adx` back to `.zip` and import manually as in [Method 2](#manual-import).
:::

## 3. Method 2: manual ZIP import {#manual-import}

Manual import means placing song folders into AstroDX's `levels` folder.

### Find the AstroDX folder

On Android the path is:

```text
Android/data/com.Reflektone.AstroDX/files/
├── levels/          ← songs go here, one folder per song
│   └── [DX] Title/
│       ├── maidata.txt   (required) chart
│       ├── track.mp3     (required) audio, or track.ogg
│       ├── bg.png        (optional) jacket, or bg.jpg
│       └── pv.mp4        (optional) background video, H.264 / H.265
└── collections/     ← category collections (see section 5)
```

A song needs at least **`maidata.txt` and an audio file** to be recognised.

::: warning Can't open Android/data on Android 11+?
Since Android 11 ordinary apps can't access `Android/data`. You can:

- use a file manager that can, such as [ZArchiver](https://play.google.com/store/apps/details?id=ru.zdevs.zarchiver);
- use [Files (Marc apps)](https://play.google.com/store/apps/details?id=com.marc.files) (the workaround AstroDX recommends);
- install [Shizuku](https://shizuku.rikka.app/) and use a Shizuku-capable file manager;
- connect to a computer over USB (MTP / file transfer) and copy the folder in.
:::

### Extract into its own folder

::: danger The most common mistake
A single-song ZIP from the download site **extracts straight to four files with no folder around
them**. Create a **new folder** inside `levels/` first (any name, e.g. `[DX] Title`), then extract
the ZIP into that folder. Extracting directly into `levels/` scatters the files and the game won't find them.
:::

1. Go to `Android/data/com.Reflektone.AstroDX/files/levels/`;
2. Create a folder, e.g. `[DX] Title`;
3. Extract the `.zip` into it and check that `maidata.txt`, `track.mp3` etc. sit directly inside;
4. Reopen AstroDX and find the song on song select.

::: tip Don't rename or move songs afterwards
AstroDX stores scores and offsets by **folder path**. Renaming, moving or deleting a song folder
after import loses its records.
:::

## 4. Importing a whole version / many songs

"批量下载" (bulk download) on the site packs a version, all versions, or a hand-picked selection
("自定义下载歌曲"). Bulk downloads require a captcha.

A bulk pack is **one big archive containing one small package per song**:

- with **ADX** you get `舞萌DX 2024.adx` containing many `[DX] Title.adx` files;
- with **ZIP** you get `舞萌DX 2024.zip` containing many `[DX] Title.zip` files.

To import:

1. Rename the outer `舞萌DX 2024.adx` to `舞萌DX 2024.zip` (not needed for ZIP) and extract it anywhere on your phone;
2. **Tap each inner `.adx` → open with AstroDX**; for inner `.zip` files, use Method 2 for each one.

::: warning Note
The outer pack **cannot be opened by AstroDX directly** — it is an archive of packages, not a
structure AstroDX understands. A version can be hundreds of MB to several GB (more with video), so
check free space and use Wi-Fi.
:::

## 5. Category collections (collections.zip)

The **"索引下载" (index download)** button at the top of the site gives you `collections.zip`,
with collections by chart type, genre and version:

```text
collections/
├── DX Chart/manifest.json
├── SD Chart/manifest.json
├── 宴会場/manifest.json
├── POPSアニメ/manifest.json
├── maimai DX BUDDiES/manifest.json
└── …
```

1. Click "索引下载" and download `collections.zip` (no captcha, tiny file);
2. Extract it and put the `collections/` folder into `Android/data/com.Reflektone.AstroDX/files/`,
   **next to `levels/`** (merge if `collections/` already exists);
3. Reopen AstroDX; the collections appear on song select.

A collection is only a list of songs, not the songs themselves — **it shows whatever you have
imported**. The index matches both folder names: `[DX] Title` from manual ZIP import and
`[DX] Title.Artist` from ADX import.

## 6. FAQ

### I put a .zip / .rar into levels and nothing shows up

AstroDX doesn't read archives. Extract first and make sure the layout is
`levels/` → song folder → `maidata.txt`. An extra nested folder (`levels/A/A/maidata.txt`) also won't load.

### The jacket shows but there's no background video

You downloaded the "no video" version. Download "ADX · 含背景视频" again and check that the song folder contains `pv.mp4`.

### The same song appears twice

It was imported once via ADX (folder `Title.Artist`) and once via ZIP (folder `Title`). Delete one
folder — its scores go with it.

### Download does nothing / fails halfway

- Use a system browser (Chrome, Edge, Safari …), not QQ / WeChat;
- Bulk downloads are packed on the server; "状态与健康" at the top of the site shows the queue —
  please be patient at peak times;
- Retry single songs directly; if it still fails, report it on the
  [forum](https://bbs.wmc.pub/misc/contact) with the song title and format.

### Can I use an SD card?

AstroDX does not currently read songs from an SD card; keep them in internal storage at the path above.

## Links

- Download site: [download.wmc.pub](https://download.wmc.pub)
- Online chart preview: [Chart Preview](/en/dev/chart-preview)
- AstroDX Android guide: [Installation Guide for Android](https://astrodx.notion.site/Installation-Guide-for-Android-3f2ec5041ad5413ab45500472bb4ceba)
- ADX archive structures: [ADX Archive Details](https://astrodx.notion.site/ADX-Archive-Details-a8346048819a40b18f0a6c014c19b0b3)
- Collection format: [Collection Manifest Details](https://astrodx.notion.site/Collection-Manifest-Details-8f966de6971748e0ac01c0a0a6054594)
