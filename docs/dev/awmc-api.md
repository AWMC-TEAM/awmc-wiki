---
apiBaseUrl: https://api.awmc.cc
---
# 🔌 AWMC 网关公共 API（计费说明）

面向**使用者**：如何调用开放接口，以及 **Token 何时会扣费**。本文不讨论内部实现。

::: tip 平台地址
平台地址：https://api.awmc.cc

需要AWMC通行证登陆～
:::

::: warning 🔐 鉴权
业务请求须在请求头携带：

`Authorization: Bearer <令牌>`

- 浏览器登录后的 JWT，或在网站内生成的 **`gw_` 长期令牌**（勿泄露）。
:::

::: tip 购买Token
额度购买: https://store.awmc.cc/item?id=98
:::

## 1. 服务地址与路径

所有业务路径接在 **网关根地址** 之后，前缀为 **`/v1`**。

- **GET**：参数放在 URL Query，需 **URL 编码**。
- **POST**：按各接口要求使用 Query 或 JSON Body；传 JSON 时加 `Content-Type: application/json`。


## 2. Token 计费规则

- 下表 **「消耗」** 表示：本次请求在 **HTTP 成功** 且 **业务判定成功** 时，从账户扣除的 Token 数量；**0** 表示不扣费。
- 业务是否成功以响应 JSON 为准，常见如下：

| 接口 | 扣费前提（摘要） |
|------|------------------|
| `get_preview` | `UserID` 有效且不为 `-1` / `"-1"` |
| `upload_b50` / `upload_lx_b50` | `UploadStatus === true` |
| `get_charge` | `ChargeStatus === true` |
| `mai_ping` | 成功形态（如 `returnCode === 1` 等），非 `result: "down"` 等失败形态 |

- 余额不足时返回 **403**，需先增加账户余额。


## 3. 开放接口调试

直接在下方 **鉴权设置** 中填入有效令牌，然后输入参数即可在线测试接口。

### 3.1 连通性测试 (mai_ping)

<ApiDemo 
  :options="[
    {
      title: '连通性测试',
      method: 'GET',
      path: '/v1/mai_ping',
      description: '测试网关连通性，不产生扣费。',
      response: { returnCode: 1, result: 'ok' }
    }
  ]"
/>


### 3.2 用户信息与任务提交 (计费)

以下接口在业务成功时会产生 Token 消耗。

<ApiDemo 
  :options="[
    {
      title: '用户信息预览',
      method: 'GET',
      path: '/v1/get_preview',
      description: '获取用户信息预览，消耗 1 Token。',
      params: [
        { name: 'qr_text', type: 'string', required: '必填', desc: '二维码内容', value: '' }
      ],
      response: { UserID: '12345', UserName: 'Player', UploadStatus: true }
    },
    {
      title: '水鱼 B50 任务',
      method: 'POST',
      path: '/v1/upload_b50',
      description: '提交水鱼 B50 上传任务，消耗 5 Token。',
      params: [
        { name: 'qr_text', type: 'string', required: '必填', desc: '二维码内容', value: '' },
        { name: 'fish_token', type: 'string', required: '必填', desc: '水鱼 Token', value: '' }
      ],
      response: { UploadStatus: true, task_id: 'task_xxx' }
    },
    {
      title: '落雪 B50 任务',
      method: 'POST',
      path: '/v1/upload_lx_b50',
      description: '提交落雪 B50 上传任务，消耗 5 Token。',
      params: [
        { name: 'qr_text', type: 'string', required: '必填', desc: '二维码内容', value: '' },
        { name: 'lxns_code', type: 'string', required: '必填', desc: '15位落雪好友码', value: '' }
      ],
      response: { UploadStatus: true, task_id: 'task_xxx' }
    },
    {
      title: '功能票查询',
      method: 'GET',
      path: '/v1/get_charge',
      description: '查询功能票详情，消耗 1 Token。',
      params: [
        { name: 'qr_text', type: 'string', required: '必填', desc: '二维码内容', value: '' }
      ],
      response: { ChargeStatus: true, tickets: [] }
    }
  ]"
/>


### 3.3 任务状态查询 (不计费)

上传类任务提交后，请使用以下接口轮询进度。

<ApiDemo 
  :options="[
    {
      title: '水鱼任务状态 (按用户)',
      method: 'GET',
      path: '/v1/get_b50_task_status',
      description: '根据 mai_uid 查询水鱼任务状态。',
      params: [
        { name: 'mai_uid', type: 'string', required: '必填', desc: '用户 ID', value: '' }
      ]
    },
    {
      title: '水鱼任务详情 (按ID)',
      method: 'GET',
      path: '/v1/get_b50_task_byid',
      description: '根据 task_id 查询水鱼任务详情。',
      params: [
        { name: 'task_id', type: 'string', required: '必填', desc: '任务 ID', value: '' }
      ]
    },
    {
      title: '落雪任务状态 (按用户)',
      method: 'GET',
      path: '/v1/get_lx_b50_task_status',
      description: '根据 mai_uid 查询落雪任务状态。',
      params: [
        { name: 'mai_uid', type: 'string', required: '必填', desc: '用户 ID', value: '' }
      ]
    },
    {
      title: '落雪任务详情 (按ID)',
      method: 'GET',
      path: '/v1/get_lx_b50_task_byid',
      description: '根据 task_id 查询落雪任务详情。',
      params: [
        { name: 'task_id', type: 'string', required: '必填', desc: '任务 ID', value: '' }
      ]
    }
  ]"
/>

### 3.4 功能票获取 (计费)

获取功能票（倍数票）。该接口使用 **Query** 传参，业务成功时消耗 **10 Token**。

<ApiDemo 
  :options="[
    {
      title: '获取功能票（倍数票）',
      method: 'POST',
      path: '/v1/get_ticket',
      description: '获取功能票（倍数票），Query：ticket_id、qr_text 等；业务成功时消耗 10 Token。',
      params: [
        { name: 'qr_text', type: 'string', required: '建议必填', desc: '二维码内容', value: '' },
        { name: 'ticket_id', type: 'string', required: '可选', desc: '功能票 ID（如有）', value: '' }
      ],
      response: { TicketStatus: true, ticket: {} }
    }
  ]"
/>

### 3.5 手动操作端点 (计费 / JSON Body)

以下接口均为 **POST**，请求体为 **JSON**；网关会在业务侧执行约 **60 秒安全等待**（队列/风控），浏览器端点击「运行」后请耐心等待。

在 **鉴权设置** 中填入有效令牌，按表格填写参数后运行即可（`level_range` 请填写 JSON 数组字面量，如 `[0,1,2,3]`）。

<ApiDemo
  :options="[
    {
      title: '手动上传单曲成绩',
      method: 'POST',
      path: '/v1/upload_score_manual',
      paramsIn: 'json',
      description: '消耗 15 Token。参数：qr_code、musicId、levelId、achievement、combo、sync、dxScore、rank；可选 playcount、iscover、isforce、detailmode。',
      params: [
        { name: 'qr_code', type: 'string', required: '必填', desc: '二维码文本', value: '' },
        { name: 'musicId', type: 'integer', required: '必填', desc: '歌曲 ID（如 11538）', value: 11538 },
        { name: 'levelId', type: 'integer', required: '必填', desc: '难度 0 绿 / 1 黄 / 2 红 / 3 紫 / 4 白', value: 4 },
        { name: 'achievement', type: 'integer', required: '必填', desc: '成就值 0–1010000（如 1005000 表示 100.5000%）', value: 1005000 },
        { name: 'combo', type: 'integer', required: '必填', desc: '0 无 / 1 FC / 2 FC+ / 3 AP / 4 AP+', value: 2 },
        { name: 'sync', type: 'integer', required: '必填', desc: '0 无 / 1 FS / 2 FS+ / 3 FDX / 4 FDX+ / 5 SYNC', value: 2 },
        { name: 'dxScore', type: 'integer', required: '必填', desc: 'DX 分数', value: 1234 },
        { name: 'rank', type: 'integer', required: '必填', desc: '评价等级（如 10:SS, 11:SS+, 12:SSS, 13:SSS+）', value: 12 },
        { name: 'playcount', type: 'integer', required: '可选', desc: '游玩次数，默认 1', value: 1 },
        { name: 'iscover', type: 'integer', required: '可选', desc: '是否覆盖 0/1，默认 0', value: 0 },
        { name: 'isforce', type: 'integer', required: '可选', desc: '是否强制更新 0/1，默认 0', value: 0 },
        { name: 'detailmode', type: 'integer', required: '可选', desc: '是否详情模式 0/1，默认 0', value: 0 }
      ],
      response: {}
    },
    {
      title: '手动批量上传成绩',
      method: 'POST',
      path: '/v1/batch_upload_score_manual',
      paramsIn: 'json',
      description: '消耗 20 Token。参数：qr_code、musicId、level_range（JSON 数组）、combo、sync、dxScore。',
      params: [
        { name: 'qr_code', type: 'string', required: '必填', desc: '二维码文本', value: '' },
        { name: 'musicId', type: 'integer', required: '必填', desc: '歌曲 ID', value: 11538 },
        { name: 'level_range', type: 'array', required: '必填', desc: '难度 ID 数组 JSON，如 [0,1,2,3]', value: '[0,1,2,3]' },
        { name: 'combo', type: 'integer', required: '必填', desc: '连击状态 0–4', value: 0 },
        { name: 'sync', type: 'integer', required: '必填', desc: '同步状态 0–5', value: 0 },
        { name: 'dxScore', type: 'integer', required: '必填', desc: 'DX 星级 0–5', value: 5 }
      ],
      response: {}
    },
    {
      title: '手动解锁单个物品',
      method: 'POST',
      path: '/v1/unlock_single_item_manual',
      paramsIn: 'json',
      description: '消耗 10 Token。参数：qr_code、item_id、item_kind；可选 item_stock。',
      params: [
        { name: 'qr_code', type: 'string', required: '必填', desc: '二维码文本', value: '' },
        { name: 'item_id', type: 'integer', required: '必填', desc: '物品 ID', value: 123 },
        { name: 'item_kind', type: 'integer', required: '必填', desc: '1 姓名框 / 2 称号 / 3 头像 / 10 搭档 / 11 背景板 / 12 票据等', value: 2 },
        { name: 'item_stock', type: 'integer', required: '可选', desc: '数量，默认 1', value: 1 }
      ],
      response: {}
    },
    {
      title: '手动解锁单首乐曲',
      method: 'POST',
      path: '/v1/unlock_music_manual',
      paramsIn: 'json',
      description: '消耗 10 Token。参数：qr_code、music_id；可选 item_stock、remaster。',
      params: [
        { name: 'qr_code', type: 'string', required: '必填', desc: '二维码文本', value: '' },
        { name: 'music_id', type: 'integer', required: '必填', desc: '乐曲 ID', value: 11538 },
        { name: 'item_stock', type: 'integer', required: '可选', desc: '数量，默认 1', value: 1 },
        { name: 'remaster', type: 'integer', required: '可选', desc: 'Re:MASTER：0 否 / 1 是 / 2 仅白谱，默认 0', value: 0 }
      ],
      response: {}
    }
  ]"
/>

### 3.6 删除单曲成绩 (计费 / JSON Body)

删除指定乐曲的成绩记录。该接口使用 **JSON Body** 传参。

<ApiDemo
  :options="[
    {
      title: '手动删除单曲成绩',
      method: 'POST',
      path: '/v1/delete_score_manual',
      paramsIn: 'json',
      description: '删除指定乐曲的成绩记录。参数：qr_code、musicId、levelId。',
      params: [
        { name: 'qr_code', type: 'string', required: '必填', desc: '用户二维码文本', value: '' },
        { name: 'musicId', type: 'integer', required: '必填', desc: '乐曲 ID', value: 11538 },
        { name: 'levelId', type: 'integer', required: '必填', desc: '难度 ID：0 Basic / 1 Advanced / 2 Expert / 3 Master / 4 Re:Master', value: 4 }
      ],
      response: {}
    }
  ]"
/>

## 4. 公开 JSON 目录

```http
GET https://api.awmc.cc/api/docs
```

返回各路径、方法、**消耗** 与简要说明，便于脚本读取。


## 5. 常见错误

| HTTP | 说明 |
|------|------|
| **401** | 令牌缺失或无效 |
| **403** | 余额不足等 |
| **404** | 路径或资源不存在 |
| **5xx** | 服务异常，可稍后重试 |


::: tip 建议
先调用 **`/v1/mai_ping`**（不扣费）确认地址与令牌，再调用 **带消耗** 的接口；上传类务必保存 **`task_id`** 并用查询接口跟进。
:::
