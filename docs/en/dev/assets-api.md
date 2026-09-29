# 🖼️ Assets & Chart Resource API

AWMC exposes two kinds of public resource APIs: **assets.awmc.team** serves images and other static assets, and **download.wmc.pub** (the chart download site) serves chart files and packages.

Both are **unauthenticated**. Since 2026-09-29, **single-chart** resources on `download.wmc.pub` (maidata / audio / jacket / PV, plus that chart's zip and adx) **no longer require the human verification step** — a link is enough. Only the big packages (version packs, all-versions pack, deleted-song pack) still ask for a captcha.

> The old `assets.awmc.cc` domain has moved to **`assets.awmc.team`**; please use the new domain in examples and integrations.

## 1. Resource root paths

| Root path | Contents |
|---|---|
| `https://assets.awmc.team` | Jackets and other static images |
| `https://download.wmc.pub` | Chart files, chart index, single-chart packages |

## 2. assets.awmc.team

<ApiDemo
  baseUrl="https://assets.awmc.team"
  :isImage="true"
  :options="[
    {
      title: 'Covers',
      method: 'GET',
      path: '/covers/:id',
      description: 'Fetch the jacket image for a given ID (include the .png suffix).',
      params: [
        { name: 'id', type: 'string', required: 'Required', desc: 'Jacket ID (with suffix)', value: '0.png' }
      ]
    }
  ]"
/>

## 3. download.wmc.pub — chart resources

### 3.1 Chart list / search

A full chart index: filter by keyword, version, chart type, genre, deleted charts and PV availability, with pagination.

<ApiDemo
  baseUrl="https://download.wmc.pub"
  :options="[
    {
      title: 'Chart list / search',
      method: 'GET',
      path: '/api/v1/charts',
      description: 'Returns the chart list (sorted by ID by default). q is split on spaces and every token must match; files=1 inlines the direct file links for every chart.',
      params: [
        { name: 'q', type: 'string', required: 'Optional', desc: 'Title / alias / artist / ID', value: 'apollo' },
        { name: 'type', type: 'string', required: 'Optional', desc: 'st / dx / utg', value: 'dx' },
        { name: 'sort', type: 'string', required: 'Optional', desc: 'id / title / version / popular', value: 'popular' },
        { name: 'limit', type: 'number', required: 'Optional', desc: 'Page size, default 50, max 500 (0 = all)', value: '2' },
        { name: 'files', type: 'number', required: 'Optional', desc: '1 = inline direct file links', value: '1' }
      ],
      response: {
        total: 1893,
        matched: 1,
        page: 1,
        limit: 2,
        charts: [
          {
            shortid: '011661',
            title: 'Apollo',
            type: 'DX',
            version: 'BUDDiES',
            page: 'https://download.wmc.pub/song/011661',
            download: {
              zip: 'https://download.wmc.pub/api/download/BUDDiES/Apollo%20%5BDX%5D/zip'
            }
          }
        ]
      }
    }
  ]"
/>

> Also supported: `version` (version name or `versionid`), `genre`, `oc` (1/0), `hasVideo` (1/0), `page`, and `raw=1` (keep raw record fields).
> Alias endpoint: `GET /cdn/v1/data/charts`.

### 3.2 Chart info

<ApiDemo
  baseUrl="https://download.wmc.pub"
  :options="[
    {
      title: 'Chart info',
      method: 'GET',
      path: '/api/v1/charts/:shortid',
      description: 'Look up one chart by ID: constants, chart designers, BPM, genre, download count, plus its file list and package links.',
      params: [
        { name: 'shortid', type: 'string', required: 'Required', desc: 'Chart ID (with leading zeros)', value: '011661' }
      ],
      response: {
        shortid: '011661',
        title: 'Apollo',
        artist: 'TJ.hangneil',
        version: 'BUDDiES',
        bpm: 339,
        levels: { 5: { raw: '14.7', num: 14.7 } },
        files: [{ name: 'maidata.txt', size: 11828, url: 'https://download.wmc.pub/s/011661/maidata.txt' }]
      }
    }
  ]"
/>

### 3.3 File list for one chart (direct links)

<ApiDemo
  baseUrl="https://download.wmc.pub"
  :options="[
    {
      title: 'File list (JSON)',
      method: 'GET',
      path: '/s/:shortid',
      description: 'Lists the chart files with absolute links (maidata.txt / track.mp3 / bg.png / pv.mp4). The url can be shared as-is; downloadUrl adds ?dl=1 to force a download.',
      params: [
        { name: 'shortid', type: 'string', required: 'Required', desc: 'Chart ID (with leading zeros)', value: '011661' }
      ],
      response: {
        shortid: '011661',
        versionFolder: 'BUDDiES',
        songFolder: 'Apollo [DX]',
        files: [
          {
            name: 'maidata.txt',
            size: 11828,
            mime: 'text/plain; charset=utf-8',
            url: 'https://download.wmc.pub/s/011661/maidata.txt',
            downloadUrl: 'https://download.wmc.pub/s/011661/maidata.txt?dl=1'
          }
        ],
        download: { zip: 'https://download.wmc.pub/api/download/BUDDiES/Apollo%20%5BDX%5D/zip' }
      }
    }
  ]"
/>

### 3.4 Fetch a single file

No captcha. Allowed filenames: `maidata.txt`, `track.mp3`, `track.ogg`, `bg.png`, `bg.jpg`, `pv.mp4`. Add `?dl=1` to download instead of playing/previewing inline.

<ApiDemo
  baseUrl="https://download.wmc.pub"
  :openInNewTab="true"
  :options="[
    {
      title: 'Chart file maidata.txt',
      method: 'GET',
      path: '/s/:shortid/:filename',
      description: 'Chart text (a [ST]/[DX]/[UTG] prefix is added automatically).',
      params: [
        { name: 'shortid', type: 'string', required: 'Required', desc: 'Chart ID', value: '011661' },
        { name: 'filename', type: 'string', required: 'Required', desc: 'File name', value: 'maidata.txt' }
      ]
    }
  ]"
/>

<ApiDemo
  baseUrl="https://download.wmc.pub"
  :openInNewTab="true"
  :options="[
    {
      title: 'Audio track.mp3',
      method: 'GET',
      path: '/s/:shortid/:filename',
      description: 'Track audio (a few charts use track.ogg). ?dl=1 downloads it.',
      params: [
        { name: 'shortid', type: 'string', required: 'Required', desc: 'Chart ID', value: '011661' },
        { name: 'filename', type: 'string', required: 'Required', desc: 'File name', value: 'track.mp3?dl=1' }
      ]
    }
  ]"
/>

<ApiDemo
  baseUrl="https://download.wmc.pub"
  :openInNewTab="true"
  :options="[
    {
      title: 'PV pv.mp4',
      method: 'GET',
      path: '/s/:shortid/:filename',
      description: 'Background video (not every chart has one).',
      params: [
        { name: 'shortid', type: 'string', required: 'Required', desc: 'Chart ID', value: '011661' },
        { name: 'filename', type: 'string', required: 'Required', desc: 'File name', value: 'pv.mp4' }
      ]
    }
  ]"
/>

You can also address files by folder: `GET /f/<versionFolder>/<songFolder>/<filename>`, e.g.
`https://download.wmc.pub/f/BUDDiES/Apollo%20%5BDX%5D/maidata.txt`; the matching index is `GET /f/<versionFolder>/<songFolder>`.

### 3.5 Jacket preview

<ApiDemo
  baseUrl="https://download.wmc.pub"
  :isImage="true"
  :options="[
    {
      title: 'Jacket bg.png',
      method: 'GET',
      path: '/s/:shortid/bg.png',
      description: 'The square jacket shipped inside the chart package. For the framed cover image use /cdn/v1/img/<version>/<song>?w=600.',
      params: [
        { name: 'shortid', type: 'string', required: 'Required', desc: 'Chart ID', value: '011661' }
      ]
    }
  ]"
/>

### 3.6 Single-chart package (zip / adx)

<ApiDemo
  baseUrl="https://download.wmc.pub"
  :openInNewTab="true"
  :options="[
    {
      title: 'Single-chart ZIP',
      method: 'GET',
      path: '/api/download/:versionFolder/:songFolder/:format',
      description: 'Zip of this chart (use adx for AstroDX). Add ?novideo=1 to drop the PV and shrink the file. No captcha.',
      params: [
        { name: 'versionFolder', type: 'string', required: 'Required', desc: 'Version folder name', value: 'BUDDiES' },
        { name: 'songFolder', type: 'string', required: 'Required', desc: 'Song folder name', value: 'Apollo [DX]' },
        { name: 'format', type: 'string', required: 'Required', desc: 'zip / adx', value: 'zip' }
      ]
    }
  ]"
/>

> Folder names come from the `versionFolder` / `songFolder` (= `folderName`) fields in 3.1 or 3.3.
> Version packs (~1GB), the all-versions pack and the deleted-song pack still require the captcha: `/api/download-version/:versionId/:format`, `/api/download-all-versions/:format`, `/api/download-oc/:format`.

## 4. Usage notes

- **No auth**: every endpoint above is anonymous; JSON responses and files both send `Access-Control-Allow-Origin: *`, so they can be fetched directly from a web page.
- **Caching**: files carry `ETag` and `Cache-Control: public`; the list API supports `ETag` + 304. Cache on your side too — chart data only changes with version updates (roughly monthly).
- **Rate limits**: file endpoints are limited per IP (about 600 requests/minute). For bulk work, pace yourself instead of opening hundreds of parallel connections.
- **File formats**: images are `.png` / `.jpg`, audio is `.mp3` or `.ogg`, PV is `.mp4`, and charts are plain text `maidata.txt`.
- **Source of truth**: see [download.wmc.pub](https://download.wmc.pub) for live state. For chart preview and rating analysis, see the [Chart Preview API](/en/dev/chart-preview-api).
