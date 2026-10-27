# 🖼️ Assets & Chart Resource API

AWMC serves static images, the chart index, chart files and single-chart packages through one public entry point: **[download.wmc.pub](https://download.wmc.pub)** (the chart download site).

Public endpoints are **unauthenticated**. Since 2026-09-29, **single-chart** resources (maidata / audio / jacket / PV, plus that chart's zip and adx) **no longer require human verification**. Version packs, the all-versions pack, the deleted-song pack and custom multi-chart downloads still require a captcha.

> The old asset domains are retired. Replacing the hostname is not enough: `/covers/:id` is not supported here. Use the cover route or single-chart file routes below. File requests may redirect to an object-storage CDN; allow redirects.
>
> Verified against MaiArchive source and read-only production HTTP on 2026-10-27: the cover, chart info and file index were accessible. Response examples show selected fields; use the live file index for filenames and sizes.

## 1. Resource root paths

| Root path | Contents |
|---|---|
| `https://download.wmc.pub` | Jackets and static images, chart files, chart index, single-chart packages |

## 2. Cover images

Address covers by version and song folder, not by the old jacket ID or a `.png` suffix. Use `versionFolder` / `folderName` from 3.1, or `versionFolder` / `songFolder` from 3.3; URL-encode each folder segment separately.

<ApiDemo
  baseUrl="https://download.wmc.pub"
  :isImage="true"
  :encodePathParams="true"
  :options="[
    {
      title: 'Cover image',
      method: 'GET',
      path: '/cdn/v1/img/:versionFolder/:songFolder',
      description: 'Fetch a cover. Optional w selects the nearest supported thumbnail width; check Content-Type for the actual image format.',
      params: [
        { name: 'versionFolder', type: 'string', required: 'Required', desc: 'Version folder name', value: 'BUDDiES' },
        { name: 'songFolder', type: 'string', required: 'Required', desc: 'Song folder name', value: 'Apollo [DX]' },
        { name: 'w', type: 'number', required: 'Optional', desc: 'Thumbnail width (160 / 240 / 320 / 360 / 480)', value: '480' }
      ]
    }
  ]"
/>

Example: `https://download.wmc.pub/cdn/v1/img/BUDDiES/Apollo%20%5BDX%5D?w=480`. For the original jacket inside the chart package, see 3.5.

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
        chart: {
          shortid: '011661',
          title: 'Apollo',
          artist: 'TJ.hangneil',
          version: 'BUDDiES',
          versionFolder: 'BUDDiES',
          folderName: 'Apollo [DX]',
          bpm: 339,
          levels: { 5: { raw: '14.7', num: 14.7 } }
        },
        files: [{ name: 'maidata.txt', size: 11823, url: 'https://download.wmc.pub/s/011661/maidata.txt' }]
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
            size: 11823,
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

> Verified on 2026-10-27: `/s/011661/bg.png`, `/s/011661/track.mp3` and the directory-based original-image route return **302** to `oss.awmc.cc`. Following with Node fetch and browser fetch from the Wiki, using `Range: bytes=0-31`, returned **206**, with `image/png` / `audio/mpeg` and `Access-Control-Allow-Origin: *` on the final response. `maidata.txt` returned **200** text directly; not every file redirects. Some probes (urllib HEAD / one-byte Range) triggered Cloudflare **403 / 1010**. Record the client, method and final response when diagnosing; HEAD or the initial 302 alone does not establish a failed download. For display, the thumbnail route in section 2 is also available.

<ApiDemo
  baseUrl="https://download.wmc.pub"
  :isImage="true"
  :options="[
    {
      title: 'Jacket bg.png',
      method: 'GET',
      path: '/s/:shortid/bg.png',
      description: 'Original jacket in the chart package; check the file index for the actual filename (it may be bg.jpg). For a thumbnail see section 2: /cdn/v1/img/<version>/<song>?w=480.',
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
- **Caching and redirects**: directly served files generally carry `ETag` and `Cache-Control: public`; the list API supports `ETag` + 304. Redirect responses may use `no-store`; respect the final response headers. Keep using the public entry point rather than hard-coding an object-storage target.
- **Rate limits**: file endpoints are limited per IP (about 600 requests/minute). For bulk work, pace yourself instead of opening hundreds of parallel connections.
- **File formats**: original jackets are `.png` / `.jpg`; thumbnails may also return WebP (check `Content-Type`). Audio is `.mp3` or `.ogg`, PV is `.mp4`, and charts are plain text `maidata.txt`.
- **Source of truth**: see [download.wmc.pub](https://download.wmc.pub) for live state. For chart preview and rating analysis, see the [Chart Preview API](/en/dev/chart-preview-api).
