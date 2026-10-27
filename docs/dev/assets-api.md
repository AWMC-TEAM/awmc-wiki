# 🖼️ Assets 静态资源 & 谱面资源 API

AWMC 的静态图片、谱面索引、原始文件与单曲打包，统一从 **[download.wmc.pub](https://download.wmc.pub)**（谱面下载站）访问。

公开接口**免鉴权**：自 2026-09-29 起，**单曲**（maidata / 音源 / 曲绘 / PV，以及这首曲子的 zip、adx）**不再要求人机验证**；版本包、全版本包、删除曲包及自定义多选等批量下载仍需验证码。

> 旧资源域名已停用，不能只替换域名继续使用 `/covers/:id`；请改用下面的实际封面路径或单曲文件入口。文件请求可能重定向到对象存储 CDN，请允许跟随重定向。
>
> 已于 2026-10-27 对照 MaiArchive 源码与生产只读 HTTP 核验：封面、单曲信息与文件清单可访问；示例响应仅展示部分字段，文件与大小以实时清单为准。

## 1. 资源根地址

| 根地址 | 内容 |
|---|---|
| `https://download.wmc.pub` | 曲绘等静态图片、谱面文件、谱面索引、单曲打包 |

## 2. 曲绘封面

封面按版本目录与曲目目录访问，不使用旧曲绘 ID 或 `.png` 后缀。目录名取自 3.1 的 `versionFolder` / `folderName`，或 3.3 的 `versionFolder` / `songFolder`；构造 URL 时分别编码每段目录名。

<ApiDemo
  baseUrl="https://download.wmc.pub"
  :isImage="true"
  :encodePathParams="true"
  :options="[
    {
      title: '曲绘封面',
      method: 'GET',
      path: '/cdn/v1/img/:versionFolder/:songFolder',
      description: '获取曲目封面。w 可选，缩略图宽度会选取最接近的支持档位；实际格式以 Content-Type 为准。',
      params: [
        { name: 'versionFolder', type: 'string', required: '必填', desc: '版本目录名', value: 'BUDDiES' },
        { name: 'songFolder', type: 'string', required: '必填', desc: '曲目目录名', value: 'Apollo [DX]' },
        { name: 'w', type: 'number', required: '可选', desc: '缩略图宽度（160 / 240 / 320 / 360 / 480）', value: '480' }
      ]
    }
  ]"
/>

例如：`https://download.wmc.pub/cdn/v1/img/BUDDiES/Apollo%20%5BDX%5D?w=480`。谱面包内原始曲绘见 3.5。

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

> 2026-10-27 实测：`/s/011661/bg.png`、`/s/011661/track.mp3` 与目录形式的原图入口返回 **302**，目标为 `oss.awmc.cc`。Node fetch 及从 Wiki 页面发起的浏览器 fetch 跟随并请求 `Range: bytes=0-31` 后均得到 **206**，类型分别为 `image/png` / `audio/mpeg`，最终响应带 `Access-Control-Allow-Origin: *`；`maidata.txt` 则直接返回 **200** 文本，不是所有文件都跳转。部分客户端探测（urllib HEAD / 单字节 Range）触发了 Cloudflare **403 / 1010**，排查时应记录客户端、方法与最终响应，不能仅凭 HEAD 或首跳 302 判断下载失败。展示封面也可使用第 2 节的缩略封面入口。

<ApiDemo
  baseUrl="https://download.wmc.pub"
  :isImage="true"
  :options="[
    {
      title: '曲绘 bg.png',
      method: 'GET',
      path: '/s/:shortid/bg.png',
      description: '谱面包内原始曲绘；实际文件名以清单为准（也可能是 bg.jpg）。缩略封面见第 2 节 /cdn/v1/img/<版本>/<曲目>?w=480。',
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
- **缓存与重定向**：直接返回的文件通常带 `ETag` 与 `Cache-Control: public`，列表接口支持 `ETag` + 304；跳转响应可能为 `no-store`，请以最终响应头为准。不要硬编码对象存储目标地址，继续使用本站公开入口。
- **限流**：文件接口按 IP 限速（约 600 请求/分钟）；量大的时候请错峰、复用连接，别并发几百个。
- **文件格式**：原始曲绘是 `.png` / `.jpg`，缩略封面还可能返回 WebP（以 `Content-Type` 为准）；音源是 `.mp3` 或 `.ogg`，PV 是 `.mp4`，谱面是纯文本 `maidata.txt`。
- **更新来源**：页面与数据的实时状态以 [download.wmc.pub](https://download.wmc.pub) 为准；谱面预览与评价分析见 [谱面预览 API](/dev/chart-preview-api)。
