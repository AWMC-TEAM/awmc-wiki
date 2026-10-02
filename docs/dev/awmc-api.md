---
apiBaseUrl: https://api.wmc.pub
---
# 🔌 AWMC 网关公共 API（计费说明）

面向**使用者**：如何调用开放接口，以及 **Token 何时会扣费**。本文不讨论上游编解码实现。

::: tip 平台地址
平台地址：https://api.wmc.pub

在线文档：https://wiki.awmc.team/dev/awmc-api

使用 **AWMC 通行证（论坛账号）** 登录控制台，在个人中心生成 `gw_` 令牌或使用登录 JWT。
:::

::: warning 🔐 鉴权
业务请求须在请求头携带：

`Authorization: Bearer <令牌>`

- 浏览器登录后的 JWT，或在网站内生成的 **`gw_` 长期令牌**（勿泄露）。
:::

::: tip 购买 Token
额度通过 **卡密兑换** 充入账户。卡密可在[爱发电商城](https://afdian.com/a/AWMC_TEAM?tab=shop)购买。  
兑换：控制台个人中心，或 `POST /redeem`（需登录令牌）。
:::

::: info keychip
机台 `keychip` 由网关服务端注入，**调用方无需也不应传递**。请求体只需提供业务参数（如 `qrcode`）。
:::

::: danger 高风险操作（必读）
以下操作**极可能对账号产生不可逆转的严重后果**，请勿随意调用：

1. **改门**：`POST /v1/kaleidx-scope/upsert`（修改 Kaleidx Scope Gate 状态）。
2. **未验证收藏品写入**：通过 `POST /v1/item/upsert` 或 `POST /v1/user/upsert-all` 发送 **`itemKind` 为 `4`、`8`** 的道具数据。

网关不会替你拦截这些请求；调用即视为自行承担风险。
:::

## 1. 服务地址与路径兼容

所有业务路径接在 **网关根地址** 之后，前缀为 **`/v1`**。

- 上游已升级为 **AWMC API v2 / v2-3 双模式**；**对外路由保持旧路径不变**（例如仍用 `/v1/user/data`）。
- 网关会**自动探测**上游代次（约 60 秒缓存）：`GET /v1/health` 的响应带有 `upstreamVersion` 字段（`v2` 或 `v2-3`），以及 `sessionApi`（当前上游写接口是否为会话制）。
- **POST**：使用 **明文 JSON Body**（`Content-Type: application/json`）。zlib / Base64 由网关处理。
- 响应同时包含：
  - 上游字段：`returnCode`、`returnMessage`（成功时可能附带 `businessData`）
  - 兼容字段：业务成功时 **`code === 0`**，`msg` 尽量可二次 `JSON.parse`

**成功判定（扣费与业务）**

| 接口 | 上游成功条件 |
|------|----------------|
| `GET /v1/health` | `returnCode === 0`（ping） |
| 其它业务 | `returnCode === 1` |
| 会话制写接口（v2-3 上游） | 见 [§2.3 计费时机](#_2-3-会话制接口的计费时机-v2-3-上游) |

建议新客户端以 `returnCode` 为准；旧客户端可读 `code === 0`。

## 2. Token 计费规则

- 下表 **「消耗」**：本次请求在 **HTTP 2xx** 且上游业务成功时扣除的 Token；**0** 表示不扣费。
- 余额不足返回 **403** `Insufficient balance`。
- 建议客户端超时 **180** 秒（购买 Charge 等写入更慢；`?sync=1` 同步等待模式建议 200 秒）。
- **会话制写接口**（v2-3 上游下的所有 `upsert` 类）：**创建会话不扣费**，计费时机见 [§2.3](#_2-3-会话制接口的计费时机-v2-3-上游)；上游为旧版 v2 时仍为「业务成功即扣费」。

### 2.1 兼容旧路径

| 方法 | 路径 | 消耗 | 说明 |
|------|------|------|------|
| GET | `/v1/health` | 0 | 连通检查（映射 ping） |
| POST | `/v1/user/data` | 2 | 用户基础数据 |
| POST | `/v1/user/region` | 2 | 地区记录 |
| POST | `/v1/user/music` | 4 | 全部成绩 |
| POST | `/v1/user/charge` | 2 | 已持有 Charge（只读） |
| GET | `/v1/charge/queue` | 0 | **占位**：上游已无真实队列，固定返回空 `tasks` |
| POST | `/v1/charge` | 10 / 15 / 25 | 购买一张 Charge（`chargeId`/`charge` = **2 / 3 / 5** 时分别扣 **10 / 15 / 25** Token） |
| POST | `/v1/update-lx` | 5 | 同步到落雪 LXNS（`key`+`qrcode`；旧字段 `type` 可忽略） |
| POST | `/v1/update-fish` | 5 | 同步到 Diving-Fish（`token`+`qrcode`） |

配额分类中，`/v1/update-lx` 与 `/v1/update-fish` 属于**读取**（读取成绩并同步到外部服务）；其余 `upsert`、删除、清空和购票接口属于写入。详见[配额与限流](/dev/quota)。

### 2.2 新增路径

#### 基础读写（v2 时代新增）

| 方法 | 路径 | 消耗 | 说明 |
|------|------|------|------|
| POST | `/v1/user/preview` | 1 | 用户预览 |
| POST | `/v1/user/item-list` | 2 | 道具列表 |
| POST | `/v1/user/kaleidx-scope` | 2 | 读取 Gate 状态（仅 v2 上游；v2-3 返回 410，改用 `/v1/user/item-list`） |
| POST | `/v1/music/upsert` | 15 | 上传/覆盖成绩（v2：1–4 条同步返回；v2-3：**1–20 条，会话制**，见 §2.3） |
| POST | `/v1/music/delete` | 10 | 删除成绩（v2：1–4 条；v2-3：会话制，保留游玩次数累计） |
| POST | `/v1/item/upsert` | 20 | 添加/删除道具（**高风险见上文**；v2-3 支持**批量 `itemList`**，旧样式自动转换） |
| POST | `/v1/ticket/clear` | 5 | 清空 Charge（v2-3：会话制） |
| POST | `/v1/kaleidx-scope/upsert` | 30 | 改门（**高风险见上文**；v2-3 改映射 `upsert-kaleidx-gate`，`gateId` 限 **1–6**） |
| POST | `/v1/user/upsert-all` | 25 | 合并写入（**仅 v2 上游**；v2-3 已移除，返回 410，请拆分为单接口） |

#### 会话控制（v2-3 上游）

| 方法 | 路径 | 消耗 | 说明 |
|------|------|------|------|
| POST | `/v1/upsert/continue` | 0 | 确认上传会话。**宽容幂等**：会话已被网关自动确认时直接返回当前状态，不会报错 |
| POST | `/v1/upsert/check` | 0 | 轮询上传会话状态（幂等只读可重试）；`upsert_status=2` 时**触发结算**（见 §2.3） |

#### 资源查询（v2-3 上游，无需账号参数、同步返回）

| 方法 | 路径 | 消耗 | 说明 |
|------|------|------|------|
| POST | `/v1/user/ping` | 0 | 游戏连接检查（`get-ping`，v2-3 专属；可用于判断上游代次） |
| POST | `/v1/select/categories` | 1 | 资源分类列表 |
| POST | `/v1/select/resource` | 1 | 按分类分页查询资源（`category` 必填；`query` / `offset` / `limit` 可选） |
| POST | `/v1/select/music` | 1 | 分页查询曲目与谱面常量（含 `charts`，`constant` 定数） |
| POST | `/v1/select/music-unlock-plan` | 1 | 乐曲解锁候选清单（**资源候选**，非账号实时缺失清单） |

#### 账号资料修改（v2-3 上游，均会话制）

| 方法 | 路径 | 消耗 | 说明 |
|------|------|------|------|
| POST | `/v1/music/upsert-fuzzy` | 15 | 模糊上传成绩（`dxStar` 半星档 0–7，`dxScore=0` 时生效） |
| POST | `/v1/user/play-count` | 8 | 设置游玩次数（`playCount` 累计 / `currentPlayCount` 当前版本） |
| POST | `/v1/user/maimile` | 8 | 设置 maimile 点数（0–99999） |
| POST | `/v1/user/map-stock` | 8 | 设置地图库存（0–999） |
| POST | `/v1/user/rating` | 10 | 设置显示 Rating（不提升历史最高） |
| POST | `/v1/user/course-rank` | 8 | 设置段位（0–23，同时补通关记录） |
| POST | `/v1/user/class-rank` | 8 | 设置阶级（0–25，保留历史最高） |
| POST | `/v1/user/chara-slot` | 8 | 设置出击角色栏（0/1/5 个角色 ID） |
| POST | `/v1/user/character` | 8 | 修改角色等级 / 觉醒 / 使用次数 |
| POST | `/v1/user/intimate` | 8 | 修改搭档亲密度（`partnerId` 用查询返回的 `naviCharaId`） |
| POST | `/v1/user/map-complete` | 15 | 直接完成指定地图并补奖励（**高风险**） |
| POST | `/v1/user/map-challenge` | 15 | 推进地图到未获得挑战曲前（不允许进度回退，**高风险**） |
| POST | `/v1/user/login-bonus` | 8 | 设置登录奖励到差一个盖章 |
| POST | `/v1/version/reset` | 10 | 重置账号到当前游戏版本（不代替乐曲解锁） |

### 2.3 会话制接口的计费时机（v2-3 上游）

上游为 **v2-3** 时，所有写接口（成绩 / 道具 / 发票 / 资料）都是**会话制三步**：创建 → 确认 → 轮询。网关把其中两步做掉了：

```
① 创建    POST /v1/music/upsert（等业务接口）
          → 网关转发上游，返回会话对象（upsert_status=0，60 秒确认窗口）
② 确认    网关【自动】立即调用 upsert-continue，无需调用方操作
          → 返回给调用方的响应已是「已确认、后台上传中」（upsert_status=1）
③ 轮询    POST /v1/upsert/check  { "session_id": "..." }     ← 调用方自己做
          → upsert_status: 1 处理中 / 2 完成 / 3 错误
```

**计费规则**（与旧版 v2「成功即扣费」不同）：

- **创建与确认阶段不扣费**；
- 仅当 `/v1/upsert/check` 返回 `upsert_status === 2`（完成）时，按创建接口的定价**结算一次**（同一 `session_id` 永远只结算一次，幂等）；
- `upsert_status === 3`（上传失败）**不扣费**；
- `/v1/upsert/check` 与 `/v1/upsert/continue` 本身**消耗为 0**。

**会话响应结构**（`businessData`，创建 / 确认 / 查询均返回）：

```json
{
  "session_id": "32位小写十六进制",
  "upsert_kind": "upsert-music-exact",
  "upsert_status": 1,
  "upsert_message": {
    "text": "后台上传中",
    "phase": "uploading",
    "total_rounds": 2,
    "completed_rounds": 1,
    "estimated_remaining_seconds": 30
  }
}
```

`upsert_message.result`（完成时）含 `verified`、`uploadedMusicCount`、`skippedMusicCount`、`noOp` 等结果字段；失败时读 `upsert_message.error`。**创建成功 ≠ 上传完成**，请务必轮询到终态。

**`?sync=1` 同步模式**：给任何会话制写接口加查询参数 `?sync=1`（如 `POST /v1/music/upsert?sync=1`），网关会代为轮询直到终态（默认预算 180 秒）后**同步返回最终结果**——行为与旧版 v2 的同步语义一致，适合不想实现轮询的简单客户端。

**410 能力缺失**：当接口在当前上游代次不存在时，网关返回 `410` 与 `UPSTREAM_CAPABILITY_MISSING`（如 v2-3 上游下的 `/v1/user/upsert-all`、`/v1/user/game-event`、`/v1/user/kaleidx-scope`，或 v2 上游下的 `/v1/select/*`、`/v1/upsert/*`）。

**字段白名单**：v2-3 上游严格校验请求字段，多余字段会返回 `1205`。网关已按接口过滤（旧客户端的 `qr_text`、`type` 等历史遗留字段会被自动剔除），调用方按本文字段表传参即可。

### 充值 / 票券行为变更

1. `POST /v1/charge` 不再「入队」，而是直接购买 Charge；Body 可用 `charge` 或 `chargeId`，**仅允许 2 / 3 / 5**（2倍票 / 3倍票 / 5倍票），分别扣 **10 / 15 / 25** Token，其它值返回 400。
2. `GET /v1/charge/queue` 保留路径但**无真实任务**；请勿依赖队列状态轮询。
3. 查询已持有票券请用 `POST /v1/user/charge`。

## 3. 开放接口调试

在下方 **鉴权设置** 中填入有效令牌，再填写参数测试。

### 3.1 健康检查（不计费）

<ApiDemo 
  :options="[
    {
      title: '健康检查',
      method: 'GET',
      path: '/v1/health',
      description: '探测上游是否可用，不产生扣费。成功时 returnCode=0，并双写 code=0。upstreamVersion 标识探测到的上游代次（v2 / v2-3），sessionApi 标识写接口是否为会话制。',
      response: { returnCode: 0, returnMessage: 'pong', code: 0, msg: 'pong', upstreamVersion: 'v2-3', sessionApi: true }
    }
  ]"
/>

### 3.2 用户查询（计费 / JSON Body）

以下接口均为 **POST**，Body 字段 **`qrcode`**。

<ApiDemo 
  :options="[
    {
      title: '用户基础数据',
      method: 'POST',
      path: '/v1/user/data',
      paramsIn: 'json',
      description: '消耗 2 Token。成功 returnCode=1；msg / businessData 含业务 JSON。',
      params: [
        { name: 'qrcode', type: 'string', required: '必填', desc: '二维码内容', value: '' }
      ],
      response: { returnCode: 1, code: 0, businessData: { userId: 13699208 } }
    },
    {
      title: '用户预览',
      method: 'POST',
      path: '/v1/user/preview',
      paramsIn: 'json',
      description: '消耗 1 Token。',
      params: [
        { name: 'qrcode', type: 'string', required: '必填', desc: '二维码内容', value: '' }
      ],
      response: { returnCode: 1, code: 0 }
    },
    {
      title: '地区记录',
      method: 'POST',
      path: '/v1/user/region',
      paramsIn: 'json',
      description: '消耗 2 Token。',
      params: [
        { name: 'qrcode', type: 'string', required: '必填', desc: '二维码内容', value: '' }
      ],
      response: { returnCode: 1, code: 0 }
    },
    {
      title: '全部成绩',
      method: 'POST',
      path: '/v1/user/music',
      paramsIn: 'json',
      description: '消耗 4 Token。响应体积较大。',
      params: [
        { name: 'qrcode', type: 'string', required: '必填', desc: '二维码内容', value: '' }
      ],
      response: { returnCode: 1, code: 0 }
    },
    {
      title: '已持有 Charge',
      method: 'POST',
      path: '/v1/user/charge',
      paramsIn: 'json',
      description: '消耗 2 Token。只读查询已持有票券，不是商店列表。',
      params: [
        { name: 'qrcode', type: 'string', required: '必填', desc: '二维码内容', value: '' }
      ],
      response: { returnCode: 1, code: 0 }
    },
    {
      title: '道具列表',
      method: 'POST',
      path: '/v1/user/item-list',
      paramsIn: 'json',
      description: '消耗 2 Token。',
      params: [
        { name: 'qrcode', type: 'string', required: '必填', desc: '二维码内容', value: '' }
      ],
      response: { returnCode: 1, code: 0 }
    },
    {
      title: 'Kaleidx Gate 状态（只读）',
      method: 'POST',
      path: '/v1/user/kaleidx-scope',
      paramsIn: 'json',
      description: '消耗 2 Token。只读；改门请见高风险接口。',
      params: [
        { name: 'qrcode', type: 'string', required: '必填', desc: '二维码内容', value: '' }
      ],
      response: { returnCode: 1, code: 0, businessData: { userKaleidxScopeList: [] } }
    }
  ]"
/>

### 3.3 购买 Charge 与队列占位

<ApiDemo 
  :options="[
    {
      title: '购买 Charge',
      method: 'POST',
      path: '/v1/charge',
      paramsIn: 'json',
      description: '按 chargeId 扣费：2→10 / 3→15 / 5→25 Token。映射 upsert-ticket；可用 charge 或 chargeId（仅允许 2/3/5：2倍票 / 3倍票 / 5倍票）。耗时可能较长。',
      params: [
        { name: 'qrcode', type: 'string', required: '必填', desc: '二维码内容', value: '' },
        { name: 'chargeId', type: 'integer', required: '必填', desc: 'Charge ID（仅允许 2/3/5：2倍票 / 3倍票 / 5倍票；也可用字段名 charge）', value: 2 }
      ],
      response: { returnCode: 1, code: 0 }
    },
    {
      title: '充值队列（占位）',
      method: 'GET',
      path: '/v1/charge/queue',
      description: '不计费。上游 v2 已无真实队列，返回空 tasks。',
      response: { code: 0, returnCode: 1, tasks: [], workers: 0, msg: '上游 v2 已无充值队列' }
    }
  ]"
/>

### 3.4 成绩写入（传歌曲）— 详细说明

> **不要和** `POST /v1/user/music`（**查询**全部成绩）搞混。  
> **写入 / 覆盖**请用 `POST /v1/music/upsert`；**删除**用 `POST /v1/music/delete`；**模糊上传**用 `POST /v1/music/upsert-fuzzy`。

#### 一次请求能干什么？

- Body 里带 `qrcode` + `musicList`（数组）。
- `musicList` 长度：**v2 上游 1～4 条**；**v2-3 上游 1～20 条**（服务端自动分轮）。
- 每一项用 **`(musicId, level)`** 唯一确定一条谱面成绩。
- 消耗 **15 Token**；**v2 上游**成功条件为 `returnCode === 1`（同步返回）；**v2-3 上游**为会话制（见 §2.3），返回会话对象后轮询 `/v1/upsert/check`，或加 `?sync=1` 同步等待。

#### `level`（难度）

| 值 | 难度 |
|---:|------|
| 0 | BASIC |
| 1 | ADVANCED |
| 2 | EXPERT |
| 3 | MASTER |
| 4 | Re:MASTER |
| 10 | 宴会场 UTAGE |

#### 精确 / 模糊两种模式（最容易搞错）

**v2 上游**（旧契约，`fuzzy` 布尔开关）：

| 模式 | `fuzzy` | `achievement` | `dxScore` 含义 |
|------|---------|---------------|----------------|
| **精确** | `false` | 目标达成率，如 `100.9444` | **实际 DX 分数**（如 `2947`） |
| **模糊** | `true` | 希望达到的**最低**达成率 | **DX 星级 0～5**（不是实际 DX 分！） |

**v2-3 上游**（新契约，精确 / 模糊拆成两个接口）：

| 接口 | 说明 |
|------|------|
| `/v1/music/upsert`（→ `upsert-music-exact`） | 精确模式：`achievement` 推荐协议整数（`100% = 1000000`，**整数 100 不是 100%**）；`dxScore` 为实际 DX 分，不得超过谱面上限 |
| `/v1/music/upsert-fuzzy`（→ `upsert-music-fuzzy`） | 模糊模式：`dxStar` **半星档 0～7**（`dxScore=0` 时生效）；不足四位的百分比小数会在缺失位随机补 1–9 |

`dxStar` 最低完成度：`0` 不限 · `1` 85% · `1.5` 87.5% · `2` 90% · `2.5` 91.5% · `3` 93% · `3.5` 94% · `4` 95% · `4.5` 96% · `5` 97% · `5.5` 98% · `6` 99% · `6.5` 99.5% · `7` 100%。

::: tip 旧客户端兼容
v2 时代「`musicList` 项内 `fuzzy: true`」的老写法在 v2-3 上游下仍可用——网关检测到后会**自动改投** `upsert-music-fuzzy` 并清理该字段；`fuzzy` 标记必须整批一致，否则返回 400。
:::

#### Combo / Sync 枚举

- Combo：`none` / `fc` / `fcp` / `ap` / `app`（v2 可传字符串；v2-3 传整数 0～4）
- Sync：`none` / `fs` / `fsp` / `fsd` / `fsdp` / `sync`（v2 可传字符串；v2-3 传整数 0～5）

#### 最小可用示例（v2-3 精确模式）

```json
{
  "qrcode": "SGWCMAID...",
  "musicList": [
    {
      "musicId": 11479,
      "level": 3,
      "achievement": 1009444,
      "dxScore": 2100,
      "comboStatus": 4,
      "syncStatus": 0
    }
  ]
}
```

#### 模糊模式示例（v2-3，dxStar 半星档）

```json
{
  "qrcode": "SGWCMAID...",
  "musicList": [
    { "musicId": 11176, "level": 2, "achievement": 1000000, "dxScore": 0, "dxStar": 3, "comboStatus": 2, "syncStatus": 0 }
  ]
}
```

`musicId` 必须换成当前版本真实存在的曲目 ID，否则上游可能返回 `5004`；`dxScore` 超过谱面上限返回 `5009`。

更完整的字段表与示例也可在 [API 调试 / Swagger](/dev/api-docs) 中打开 **Score → `/v1/music/upsert`** 查看。

<ApiDemo 
  :options="[
    {
      title: '上传成绩（精确）',
      method: 'POST',
      path: '/v1/music/upsert',
      paramsIn: 'json',
      description: '消耗 15 Token。v2：fuzzy=false、dxScore 填实际 DX 分、1～4 条同步返回；v2-3：1～20 条，会话制——返回会话对象（upsert_status=1），请轮询 /v1/upsert/check 或加 ?sync=1。',
      params: [
        { name: 'qrcode', type: 'string', required: '必填', desc: '二维码', value: '' },
        { name: 'musicList', type: 'array', required: '必填', desc: '成绩数组（v2-3 最多 20 条）', value: [{ musicId: 11479, level: 3, achievement: 1005000, dxScore: 2100, comboStatus: 4, syncStatus: 0 }] }
      ],
      response: { returnCode: 1, code: 0, autoConfirmed: true, gatewayBilling: { deferred: true, settleOn: '/v1/upsert/check' }, businessData: { session_id: 'a1b2...', upsert_status: 1 } }
    },
    {
      title: '上传成绩（模糊星级）',
      method: 'POST',
      path: '/v1/music/upsert-fuzzy',
      paramsIn: 'json',
      description: '消耗 15 Token。v2-3 专属：dxStar 半星档 0–7（dxScore=0 时生效）；dxScore 超上限或传错位置会 5009/1205。',
      params: [
        { name: 'qrcode', type: 'string', required: '必填', desc: '二维码', value: '' },
        { name: 'musicList', type: 'array', required: '必填', desc: '成绩数组（项含 dxStar）', value: [{ musicId: 11176, level: 2, achievement: 1000000, dxScore: 0, dxStar: 3, comboStatus: 2, syncStatus: 0 }] }
      ],
      response: { returnCode: 1, code: 0, businessData: { session_id: 'c3d4...', upsert_status: 1 } }
    },
    {
      title: '删除成绩',
      method: 'POST',
      path: '/v1/music/delete',
      paramsIn: 'json',
      description: '消耗 10 Token。每项只能有 musicId + level；v2-3 为会话制，删除后保留成绩记录与游玩次数累计。',
      params: [
        { name: 'qrcode', type: 'string', required: '必填', desc: '二维码', value: '' },
        { name: 'musicList', type: 'array', required: '必填', desc: '待删成绩', value: [{ musicId: 799, level: 4 }] }
      ],
      response: { returnCode: 1, code: 0 }
    }
  ]"
/>

### 3.4b 会话轮询（v2-3 上游）

会话制写接口返回的 `businessData.session_id` 用在这两个接口上：

<ApiDemo 
  :options="[
    {
      title: '轮询会话状态（结算点）',
      method: 'POST',
      path: '/v1/upsert/check',
      paramsIn: 'json',
      description: '消耗 0 Token。幂等只读可重试；upsert_status=2 时结算该会话费用（gatewayBilling.billed=true），status=3 失败不扣费。断线后可凭 session_id 续查。',
      params: [
        { name: 'session_id', type: 'string', required: '必填', desc: '创建会话时返回的 session_id', value: '' }
      ],
      response: { returnCode: 1, code: 0, gatewayBilling: { billed: true, cost: 15 }, businessData: { session_id: 'a1b2...', upsert_status: 2, upsert_message: { result: { verified: true, uploadedMusicCount: 1 } } } }
    },
    {
      title: '确认会话（宽容幂等）',
      method: 'POST',
      path: '/v1/upsert/continue',
      paramsIn: 'json',
      description: '消耗 0 Token。通常无需调用——网关在创建时已自动确认；手动重复调用不会报错，会直接返回当前会话状态。',
      params: [
        { name: 'session_id', type: 'string', required: '必填', desc: '会话 ID', value: '' }
      ],
      response: { returnCode: 1, code: 0, businessData: { session_id: 'a1b2...', upsert_status: 1 } }
    }
  ]"
/>

### 3.5 高风险写入（请先阅读顶部警告）

#### 道具写入契约（v2-3 上游）

v2-3 支持**批量 `itemList`**（同 `itemKind`/`itemId` 不重复）：

```json
{
  "qrcode": "SGWCMAID...",
  "itemList": [
    { "itemKind": 5, "itemId": 10030, "stock": 1, "isValid": true }
  ]
}
```

- `itemKind`：1 姓名牌 / 2 称号 / 3 头像 / 4 礼物 / 5 乐曲 / 6 MASTER / 7 Re:MASTER / 10 搭档 / 11 底板
- 普通道具 `stock=1, isValid=true` 拥有、`stock=0, isValid=false` 移除
- 礼物（`itemKind=4`）的 `stock` 为**绝对库存**（非负整数），`itemId` 编码 = 来源类型 × 1000000 + 资源 ID
- 全部跳过时上游返回 `noOp=true`，不上传

::: tip 旧样式兼容
v2 时代的单件写法 `{ "itemKind": 2, "itemId": 11, "operation": "add" }`（`operation`：`add` / `del`）在 v2-3 上游下仍可用，网关自动转换为单元素 `itemList`。
:::

<ApiDemo 
  :options="[
    {
      title: '改门（高风险）',
      method: 'POST',
      path: '/v1/kaleidx-scope/upsert',
      paramsIn: 'json',
      description: '消耗 30 Token。【高风险】改门极可能对账号造成不可逆严重后果。v2-3 上游改映射 upsert-kaleidx-gate：gateId 仅允许 1–6，字段为 gateList。',
      params: [
        { name: 'qrcode', type: 'string', required: '必填', desc: '二维码', value: '' },
        { name: 'gateList', type: 'array', required: 'v2-3 必填', desc: '[{gateId, isGateFound, isKeyFound}]（gateId 限 1–6，两个布尔至少一项）', value: [{ gateId: 1, isGateFound: true, isKeyFound: true }] },
        { name: 'gateId', type: 'integer', required: 'v2 旧样式', desc: '门 ID（v2 上游用）', value: 7 }
      ],
      response: { returnCode: 1, code: 0 }
    },
    {
      title: '道具写入（批量，高风险种类）',
      method: 'POST',
      path: '/v1/item/upsert',
      paramsIn: 'json',
      description: '消耗 20 Token。【高风险】itemKind 为 4/8 时极可能对账号造成不可逆严重后果。v2-3 支持批量 itemList（旧样式 itemKind/itemId/operation 自动转换）。',
      params: [
        { name: 'qrcode', type: 'string', required: '必填', desc: '二维码', value: '' },
        { name: 'itemList', type: 'array', required: '新契约', desc: '[{itemKind, itemId, stock, isValid}]', value: [{ itemKind: 2, itemId: 11, stock: 1, isValid: true }] }
      ],
      response: { returnCode: 1, code: 0, businessData: { session_id: 'e5f6...', upsert_status: 1 } }
    }
  ]"
/>

### 3.6 成绩上传到第三方

<ApiDemo 
  :options="[
    {
      title: '上传到落雪 LX',
      method: 'POST',
      path: '/v1/update-lx',
      paramsIn: 'json',
      description: '消耗 5 Token。',
      params: [
        { name: 'qrcode', type: 'string', required: '必填', desc: '二维码', value: '' },
        { name: 'key', type: 'string', required: '必填', desc: 'LXNS X-User-Token', value: '' }
      ],
      response: { returnCode: 1, code: 0 }
    },
    {
      title: '上传到 DivingFish',
      method: 'POST',
      path: '/v1/update-fish',
      paramsIn: 'json',
      description: '消耗 5 Token。',
      params: [
        { name: 'qrcode', type: 'string', required: '必填', desc: '二维码', value: '' },
        { name: 'token', type: 'string', required: '必填', desc: '水鱼 Import-Token', value: '' }
      ],
      response: { returnCode: 1, code: 0 }
    }
  ]"
/>

### 3.7 资源查询（v2-3 上游）

无需账号参数（不用传 `qrcode`），同步返回，每接口消耗 1 Token：

<ApiDemo 
  :options="[
    {
      title: '曲目与谱面常量',
      method: 'POST',
      path: '/v1/select/music',
      paramsIn: 'json',
      description: '消耗 1 Token。分页查询曲目：每项含名称/类型/版本与 charts（level、constant 定数、maxDxScore）。多项条件取交集。',
      params: [
        { name: 'query', type: 'string', required: '选填', desc: '曲名关键词（不区分大小写）', value: 'PANDORA' },
        { name: 'level', type: 'integer', required: '选填', desc: '难度 0–4', value: '' },
        { name: 'offset', type: 'integer', required: '选填', desc: '默认 0', value: 0 },
        { name: 'limit', type: 'integer', required: '选填', desc: '默认 10，最大 20', value: 10 }
      ],
      response: { returnCode: 1, code: 0, businessData: { total: 1, items: [{ id: 11479, name: 'PANDORA PARADOXXX', charts: [{ level: 3, constant: '13.9', maxDxScore: 2100 }] }] } }
    },
    {
      title: '按分类查询资源',
      method: 'POST',
      path: '/v1/select/resource',
      paramsIn: 'json',
      description: '消耗 1 Token。category 取自 /v1/select/categories（partner / title / icon 等），支持 query 关键词与分页。',
      params: [
        { name: 'category', type: 'string', required: '必填', desc: '资源分类（先查 /v1/select/categories）', value: 'partner' },
        { name: 'query', type: 'string', required: '选填', desc: '名称关键词', value: '' }
      ],
      response: { returnCode: 1, code: 0, businessData: { category: 'partner', total: 0, items: [] } }
    }
  ]"
/>

### 3.8 账号资料修改（v2-3 上游，会话制）

示例：设置游玩次数 / Rating。其余接口（`maimile`、`character`、`map-*` 等）见 [§2.2 账号资料修改表](#_2-2-新增路径)，均为会话制（同 §2.3：创建 → 自动确认 → 轮询）：

<ApiDemo 
  :options="[
    {
      title: '设置游玩次数',
      method: 'POST',
      path: '/v1/user/play-count',
      paramsIn: 'json',
      description: '消耗 8 Token。playCount（累计）与 currentPlayCount（当前版本）至少传一个；当前版本次数不得超过累计。',
      params: [
        { name: 'qrcode', type: 'string', required: '必填', desc: '二维码', value: '' },
        { name: 'playCount', type: 'integer', required: '至少一项', desc: '累计游玩次数', value: 100 },
        { name: 'currentPlayCount', type: 'integer', required: '至少一项', desc: '当前版本次数', value: 10 }
      ],
      response: { returnCode: 1, code: 0, businessData: { session_id: 'b7c8...', upsert_status: 1 } }
    },
    {
      title: '设置显示 Rating',
      method: 'POST',
      path: '/v1/user/rating',
      paramsIn: 'json',
      description: '消耗 10 Token。仅改显示 Rating，不提升历史最高。',
      params: [
        { name: 'qrcode', type: 'string', required: '必填', desc: '二维码', value: '' },
        { name: 'playerRating', type: 'integer', required: '必填', desc: '目标 Rating', value: 15000 }
      ],
      response: { returnCode: 1, code: 0, businessData: { session_id: 'b7c8...', upsert_status: 1 } }
    }
  ]"
/>

## 4. 公开 JSON 目录

```http
GET https://api.wmc.pub/api/docs
```

返回各路径、方法、**消耗** 与简要说明（含风险提示文案）。

## 5. 调用用量与失败率

### 5.1 用量统计（需鉴权）

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/me/usage` | 本人调用明细分页 |
| GET | `/me/usage/stats` | 本人日粒度统计；`days`=7/14/30 |

### 5.2 失败率（半小时精度）

| 方法 | 路径 | 鉴权 | 范围 |
|------|------|------|------|
| GET | `/usage/failure-rate` | 无需 | 全站 |
| GET | `/me/usage/failure-rate` | Bearer | 本人 |

固定近 7 天、30 分钟一桶。`codeZero` 表示业务成功计数（ping 的 `returnCode=0` 或其它业务的 `1`）。

## 6. 常见错误

| HTTP / returnCode | 说明 |
|------|------|
| **401** | 令牌缺失或无效 |
| **403** | 余额不足等 |
| **410** | 接口在当前上游代次不可用（`UPSTREAM_CAPABILITY_MISSING`，见 §2.3） |
| **4001** 等 | 上游业务错误（如用户正在登录中），见 `returnMessage` |
| **5004 / 5009** | 谱面不存在 / DX 分超出谱面上限 |
| **5101 / 5106** | 会话不存在或已清理 / 会话未在 60 秒内确认（v2-3；网关自动确认下罕见） |
| **500 / 502** | 转发或解码失败 |

::: tip 建议
先调用 **`/v1/health`**（看 `upstreamVersion` 判断上游代次）；再调用查询类接口。  
购买票券用 **`/v1/charge`**，不要依赖 **`/v1/charge/queue`**。  
v2-3 上游下：会话制写接口拿到 `session_id` 后**务必轮询** `/v1/upsert/check` 到 `upsert_status` 为 2/3；忘记轮询不会丢结果（会话保留在上游，可随时续查），但计费只发生在轮询看到 `2` 时。  
切勿在日志中记录二维码与第三方 Token。
:::
