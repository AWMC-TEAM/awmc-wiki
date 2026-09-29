# 🖼️ Assets 静态资源 & 谱面资源 API

AWMC 提供两类公开资源接口：**assets.awmc.team** 放图片等静态资源，**download.wmc.pub**（谱面下载站）放谱面的原始文件与打包。

两者都**免鉴权**：`download.wmc.pub` 自 2026-09-29 起，**单曲**（maidata / 音源 / 曲绘 / PV，以及这首曲子的 zip、adx）**不再要求人机验证**，拿到链接就能下；只有版本包、全版本包、删除曲包这些大包仍要先过验证码。

> 旧域名 `assets.awmc.cc` 已迁移到 **`assets.awmc.team`**，示例与集成请统一用新域名。

## 1. 资源根地址

| 根地址 | 内容 |
|---|---|
| `https://assets.awmc.team` | 曲绘等静态图片资源 |
| `https://download.wmc.pub` | 谱面文件、谱面索引、单曲打包 |

## 2. assets.awmc.team

<ApiDemo
  baseUrl="https://assets.awmc.team"
  :isImage="true"
  :options="[
    {
      title: '曲绘',
      method: 'GET',
      path: '/covers/:id',
      description: '获取指定 ID 的曲绘图片（需带上 .png 后缀）。',
      params: [
        { name: 'id', type: 'string', required: '必填', desc: '曲绘 ID (含后缀)', value: '0.png' }
      ]
    }
  ]"
/>

## 3. download.wmc.pub — 谱面资源

### 3.1 谱面列表 / 搜索

全站谱面索引：关键词、版本、类型、流派、删除曲、是否有 PV 都能过滤，分页返回。适合做外部工具、机器人、统计。

<ApiDemo
  baseUrl="https://download.wmc.pub"
  :options="[
    {
      title: '谱面列表 / 搜索',
      method: 'GET',
      path: '/api/v1/charts',
      description: '返回全站谱面列表（默认按 ID）。q 用空格分词，所有词都要命中；files=1 时内联每首的文件直链。',
      params: [
        { name: 'q', type: 'string', required: '可选', desc: '曲名 / 别名 / 曲师 / ID', value: 'apollo' },
        { name: 'type', type: 'string', required: '可选', desc: 'st / dx / utg', value: 'dx' },
        { name: 'sort', type: 'string', required: '可选', desc: 'id / title / version / popular', value: 'popular' },
        { name: 'limit', type: 'number', required: '可选', desc: '每页条数，默认 50，上限 500（0=全部）', value: '2' },
        { name: 'files', type: 'number', required: '可选', desc: '1 = 内联该曲的文件直链', value: '1' }
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
            level: 14.7,
            page: 'https://download.wmc.pub/song/011661',
            filesIndex: 'https://download.wmc.pub/s/011661',
            download: {
              zip: 'https://download.wmc.pub/api/download/BUDDiES/Apollo%20%5BDX%5D/zip',
              adx: 'https://download.wmc.pub/api/download/BUDDiES/Apollo%20%5BDX%5D/adx'
            }
          }
        ]
      }
    }
  ]"
/>

> 也支持 `version`（版本名或 `versionid`）、`genre`、`oc`（1/0）、`hasVideo`（1/0）、`page`、`raw=1`（保留原始记录字段）。
> 别名入口：`GET /cdn/v1/data/charts`。

### 3.2 单曲信息

<ApiDemo
  baseUrl="https://download.wmc.pub"
  :options="[
    {
      title: '单曲信息',
      method: 'GET',
      path: '/api/v1/charts/:shortid',
      description: '按 ID 查一首曲子的完整信息：定数、谱师、BPM、流派、下载次数，以及这首的文件清单与打包直链。',
      params: [
        { name: 'shortid', type: 'string', required: '必填', desc: '曲目 ID（含前导零）', value: '011661' }
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

### 3.3 单曲文件清单（拿到直链）

<ApiDemo
  baseUrl="https://download.wmc.pub"
  :options="[
    {
      title: '文件清单（JSON）',
      method: 'GET',
      path: '/s/:shortid',
      description: '列出这首曲子的文件与绝对直链（maidata.txt / track.mp3 / bg.png / pv.mp4），url 可以直接贴给别人，downloadUrl 带 ?dl=1 强制下载。',
      params: [
        { name: 'shortid', type: 'string', required: '必填', desc: '曲目 ID（含前导零）', value: '011661' }
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

### 3.4 直接取一个文件

免人机验证，点开即下。允许的文件名：`maidata.txt`、`track.mp3`、`track.ogg`、`bg.png`、`bg.jpg`、`pv.mp4`；加 `?dl=1` 走浏览器下载而不是页内播放/预览。

<ApiDemo
  baseUrl="https://download.wmc.pub"
  :openInNewTab="true"
  :options="[
    {
      title: '谱面 maidata.txt',
      method: 'GET',
      path: '/s/:shortid/:filename',
      description: '取谱面文本（会自动补上 [ST]/[DX]/[UTG] 前缀）。',
      params: [
        { name: 'shortid', type: 'string', required: '必填', desc: '曲目 ID', value: '011661' },
        { name: 'filename', type: 'string', required: '必填', desc: '文件名', value: 'maidata.txt' }
      ]
    }
  ]"
/>

<ApiDemo
  baseUrl="https://download.wmc.pub"
  :openInNewTab="true"
  :options="[
    {
      title: '音源 track.mp3',
      method: 'GET',
      path: '/s/:shortid/:filename',
      description: '取音源（少数曲目是 track.ogg），?dl=1 直接下载。',
      params: [
        { name: 'shortid', type: 'string', required: '必填', desc: '曲目 ID', value: '011661' },
        { name: 'filename', type: 'string', required: '必填', desc: '文件名', value: 'track.mp3?dl=1' }
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
      description: '取背景动画（不是每首都有）。',
      params: [
        { name: 'shortid', type: 'string', required: '必填', desc: '曲目 ID', value: '011661' },
        { name: 'filename', type: 'string', required: '必填', desc: '文件名', value: 'pv.mp4' }
      ]
    }
  ]"
/>

也支持用目录名访问：`GET /f/<版本目录>/<曲目目录>/<文件名>`，例如
`https://download.wmc.pub/f/BUDDiES/Apollo%20%5BDX%5D/maidata.txt`；同名清单是 `GET /f/<版本目录>/<曲目目录>`。

### 3.5 曲绘预览

<ApiDemo
  baseUrl="https://download.wmc.pub"
  :isImage="true"
  :options="[
    {
      title: '曲绘 bg.png',
      method: 'GET',
      path: '/s/:shortid/bg.png',
      description: '谱面包内自带的曲绘（正方形版）。想要带框的封面图可用 /cdn/v1/img/<版本>/<曲目>?w=600。',
      params: [
        { name: 'shortid', type: 'string', required: '必填', desc: '曲目 ID', value: '011661' }
      ]
    }
  ]"
/>

### 3.6 单曲打包（zip / adx）

<ApiDemo
  baseUrl="https://download.wmc.pub"
  :openInNewTab="true"
  :options="[
    {
      title: '单曲打包 ZIP',
      method: 'GET',
      path: '/api/download/:versionFolder/:songFolder/:format',
      description: '这首曲子的 zip（AstroDX 用 adx）。加 ?novideo=1 去掉 PV，体积更小。免人机验证。',
      params: [
        { name: 'versionFolder', type: 'string', required: '必填', desc: '版本目录名', value: 'BUDDiES' },
        { name: 'songFolder', type: 'string', required: '必填', desc: '曲目目录名', value: 'Apollo [DX]' },
        { name: 'format', type: 'string', required: '必填', desc: 'zip / adx', value: 'zip' }
      ]
    }
  ]"
/>

> 目录名从 3.1 或 3.3 的 `versionFolder` / `songFolder`（= `folderName`）里拿。
> 版本包（约 1GB）、全版本包、删除曲包仍要人机验证：`/api/download-version/:versionId/:format`、`/api/download-all-versions/:format`、`/api/download-oc/:format`。

## 4. 使用说明

- **无需鉴权**：以上接口都可匿名直接调用；JSON 响应与文件都带 `Access-Control-Allow-Origin: *`，可以直接在网页里 fetch。
- **缓存**：文件带 `ETag` 与 `Cache-Control: public`，列表接口带 `ETag` + 304，建议客户端也缓存一份（曲目数据约每月随版本更新一次）。
- **限流**：文件接口按 IP 限速（约 600 请求/分钟）；量大的时候请错峰、复用连接，别并发几百个。
- **文件格式**：图片是 `.png` / `.jpg`，音源是 `.mp3` 或 `.ogg`，PV 是 `.mp4`，谱面是纯文本 `maidata.txt`。
- **更新来源**：页面与数据的实时状态以 [download.wmc.pub](https://download.wmc.pub) 为准；谱面预览与评价分析见 [谱面预览 API](/dev/chart-preview-api)。
