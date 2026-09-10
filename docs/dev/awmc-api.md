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

- 上游已升级为 **AWMC API v2**；**对外路由尽量保持旧路径不变**（例如仍用 `/v1/user/data`）。
- **POST**：使用 **明文 JSON Body**（`Content-Type: application/json`）。zlib / Base64 由网关处理。
- 响应同时包含：
  - 上游字段：`returnCode`、`returnMessage`（成功时可能附带 `businessData`）
  - 兼容字段：业务成功时 **`code === 0`**，`msg` 尽量可二次 `JSON.parse`

**成功判定（扣费与业务）**

| 接口 | 上游成功条件 |
|------|----------------|
| `GET /v1/health` | `returnCode === 0`（ping） |
| 其它业务 | `returnCode === 1` |

建议新客户端以 `returnCode` 为准；旧客户端可读 `code === 0`。

## 2. Token 计费规则

- 下表 **「消耗」**：本次请求在 **HTTP 2xx** 且上游业务成功时扣除的 Token；**0** 表示不扣费。
- 余额不足返回 **403** `Insufficient balance`。
- 建议客户端超时 **180** 秒（购买 Charge 等写入更慢）。

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

| 方法 | 路径 | 消耗 | 说明 |
|------|------|------|------|
| POST | `/v1/user/preview` | 1 | 用户预览 |
| POST | `/v1/user/item-list` | 2 | 道具列表 |
| POST | `/v1/user/kaleidx-scope` | 2 | 读取 Gate 状态 |
| POST | `/v1/music/upsert` | 15 | 上传/覆盖 1–4 条成绩 |
| POST | `/v1/music/delete` | 10 | 删除 1–4 条成绩 |
| POST | `/v1/item/upsert` | 20 | 添加/删除道具（**高风险见上文**） |
| POST | `/v1/ticket/clear` | 5 | 清空 Charge |
| POST | `/v1/kaleidx-scope/upsert` | 30 | 改门（**高风险见上文**） |
| POST | `/v1/user/upsert-all` | 25 | 合并写入（**高风险见上文**） |

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
      description: '探测上游是否可用，不产生扣费。成功时 returnCode=0，并双写 code=0。',
      response: { returnCode: 0, returnMessage: 'pong', code: 0, msg: 'pong' }
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
> **写入 / 覆盖**请用 `POST /v1/music/upsert`；**删除**用 `POST /v1/music/delete`。

#### 一次请求能干什么？

- Body 里带 `qrcode` + `musicList`（数组）。
- `musicList` 长度 **1～4**：可以一次写多首歌，也可以同一首歌的多个难度。
- 每一项用 **`(musicId, level)`** 唯一确定一条谱面成绩。
- 消耗 **15 Token**；成功条件为上游 `returnCode === 1`。

#### `level`（难度）

| 值 | 难度 |
|---:|------|
| 0 | BASIC |
| 1 | ADVANCED |
| 2 | EXPERT |
| 3 | MASTER |
| 4 | Re:MASTER |
| 10 | 宴会场 UTAGE |

#### `fuzzy` 两种模式（最容易搞错）

| 模式 | `fuzzy` | `achievement` | `dxScore` 含义 |
|------|---------|---------------|----------------|
| **精确** | `false` | 目标达成率，如 `100.9444` | **实际 DX 分数**（如 `2947`） |
| **模糊** | `true` | 希望达到的**最低**达成率 | **DX 星级 0～5**（不是实际 DX 分！） |

模糊星级对应最低 DX 完成度：`0` 不限 · `1` 85% · `2` 90% · `3` 93% · `4` 95% · `5` 97%。

#### Combo / Sync 常用字符串

- Combo：`none` · `fc` · `fcp` · `ap` · `app`（也可传 0～4）
- Sync：`none` · `fs` · `fsp` · `fsd`/`fdx` · `fsdp`/`fdxp` · `sync`（也可传 0～5）

#### 最小可用示例（精确模式）

```json
{
  "qrcode": "SGWCMAID...",
  "musicList": [
    {
      "musicId": 11479,
      "level": 3,
      "achievement": 100.5,
      "dxScore": 2100,
      "comboStatus": "ap",
      "syncStatus": "fsd",
      "fuzzy": false
    }
  ]
}
```

#### 模糊模式注意

下面这条里 `dxScore: 3` 表示「至少 3 星 / 约 93% DX 完成度」，**不是** DX 分等于 3：

```json
{
  "musicId": 11176,
  "level": 2,
  "achievement": 100.0,
  "dxScore": 3,
  "comboStatus": "fcp",
  "syncStatus": "fsp",
  "fuzzy": true
}
```

`musicId` 必须换成当前版本真实存在的曲目 ID，否则上游可能返回 `5004`。

更完整的字段表与示例也可在 [API 调试 / Swagger](/dev/api-docs) 中打开 **Score → `/v1/music/upsert`** 查看。

<ApiDemo 
  :options="[
    {
      title: '上传成绩（精确）',
      method: 'POST',
      path: '/v1/music/upsert',
      paramsIn: 'json',
      description: '消耗 15 Token。fuzzy=false：dxScore 填实际 DX 分。一次 1～4 条。',
      params: [
        { name: 'qrcode', type: 'string', required: '必填', desc: '二维码', value: '' },
        { name: 'musicList', type: 'array', required: '必填', desc: '成绩数组', value: [{ musicId: 11479, level: 3, achievement: 100.5, dxScore: 2100, comboStatus: 'ap', syncStatus: 'fsd', fuzzy: false }] }
      ],
      response: { returnCode: 1, code: 0 }
    },
    {
      title: '上传成绩（模糊星级）',
      method: 'POST',
      path: '/v1/music/upsert',
      paramsIn: 'json',
      description: 'fuzzy=true：dxScore 填 0～5 星，不是实际 DX 分。',
      params: [
        { name: 'qrcode', type: 'string', required: '必填', desc: '二维码', value: '' },
        { name: 'musicList', type: 'array', required: '必填', desc: '成绩数组', value: [{ musicId: 11176, level: 2, achievement: 100.0, dxScore: 3, comboStatus: 'fcp', syncStatus: 'fsp', fuzzy: true }] }
      ],
      response: { returnCode: 1, code: 0 }
    },
    {
      title: '删除成绩',
      method: 'POST',
      path: '/v1/music/delete',
      paramsIn: 'json',
      description: '消耗 10 Token。每项只能有 musicId + level。',
      params: [
        { name: 'qrcode', type: 'string', required: '必填', desc: '二维码', value: '' },
        { name: 'musicList', type: 'array', required: '必填', desc: '待删成绩', value: [{ musicId: 799, level: 4 }] }
      ],
      response: { returnCode: 1, code: 0 }
    }
  ]"
/>

### 3.5 高风险写入（请先阅读顶部警告）

<ApiDemo 
  :options="[
    {
      title: '改门（高风险）',
      method: 'POST',
      path: '/v1/kaleidx-scope/upsert',
      paramsIn: 'json',
      description: '消耗 30 Token。【高风险】改门极可能对账号造成不可逆严重后果。',
      params: [
        { name: 'qrcode', type: 'string', required: '必填', desc: '二维码', value: '' },
        { name: 'gateId', type: 'integer', required: '必填', desc: '门 ID', value: 7 },
        { name: 'isKeyFound', type: 'boolean', required: '选填', desc: '状态字段至少一项', value: true }
      ],
      response: { returnCode: 1, code: 0 }
    },
    {
      title: '道具写入（高风险种类）',
      method: 'POST',
      path: '/v1/item/upsert',
      paramsIn: 'json',
      description: '消耗 20 Token。【高风险】itemKind 为 4/8 时极可能对账号造成不可逆严重后果。',
      params: [
        { name: 'qrcode', type: 'string', required: '必填', desc: '二维码', value: '' },
        { name: 'itemKind', type: 'integer', required: '必填', desc: '种类；避免未验证的 4/8', value: 2 },
        { name: 'itemId', type: 'integer', required: '必填', desc: '目标 ID', value: 11 },
        { name: 'operation', type: 'string', required: '必填', desc: 'add 或 del', value: 'add' }
      ],
      response: { returnCode: 1, code: 0 }
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
| **4001** 等 | 上游业务错误（如用户正在登录中），见 `returnMessage` |
| **500 / 502** | 转发或解码失败 |

::: tip 建议
先调用 **`/v1/health`**；再调用查询类接口。  
购买票券用 **`/v1/charge`**，不要依赖 **`/v1/charge/queue`**。  
切勿在日志中记录二维码与第三方 Token。
:::
