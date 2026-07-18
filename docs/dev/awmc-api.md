---
apiBaseUrl: https://api.wmc.pub
---
# 🔌 AWMC 网关公共 API（计费说明）

面向**使用者**：如何调用开放接口，以及 **Token 何时会扣费**。本文不讨论内部实现。

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
额度通过 **卡密兑换** 充入账户。卡密可在商店购买：https://store.awmc.cc/item?id=98  
兑换：控制台个人中心，或 `POST /redeem`（需登录令牌）。
:::

::: info keychip
机台 `keychip` 由网关服务端注入，**调用方无需也不应传递**。请求体只需提供业务参数（如 `qrcode`）。
:::

## 1. 服务地址与路径

所有业务路径接在 **网关根地址** 之后，前缀为 **`/v1`**。

- **GET**：一般无 Body（如健康检查、充值队列）。
- **POST**：使用 **JSON Body**，请求头加 `Content-Type: application/json`。
- 上游响应多为 `{ "code": 0, "msg": "..." }`；部分接口的 `msg` 为 **JSON 字符串**，需二次 `JSON.parse`。

## 2. Token 计费规则

- 下表 **「消耗」**：本次请求在 **HTTP 2xx** 且上游业务成功（通常为 **`code === 0`**）时扣除的 Token；**0** 表示不扣费。
- 余额不足返回 **403** `Insufficient balance`。

| 方法 | 路径 | 消耗 | 说明 |
|------|------|------|------|
| GET | `/v1/health` | 0 | 上游健康检查 |
| POST | `/v1/user/data` | 1 | 用户详细数据 |
| POST | `/v1/user/region` | 1 | 地区 / 段位 |
| POST | `/v1/user/music` | 2 | 全部谱面成绩（体积较大） |
| POST | `/v1/user/charge` | 1 | 发票 / 票券查询（只读） |
| GET | `/v1/charge/queue` | 0 | 本人充值队列（已过滤、脱敏） |
| POST | `/v1/charge` | 10 | 发票充值入队 |
| POST | `/v1/update-lx` | 5 | 上传成绩到落雪 LX |
| POST | `/v1/update-fish` | 5 | 上传成绩到 DivingFish |

### 充值绑定与队列

1. 调用 `POST /v1/charge` 时需提供 `qrcode` 与 `charge`。
2. 入队成功后，网关会用同一 `qrcode` 请求 `user/data`（**不计费**），解析 `userId` 并与当前网关账号绑定。
3. 之后 `GET /v1/charge/queue` **只返回**与你绑定的 `userId` 相关任务，并去除敏感字段 `qrToken`。

## 3. 开放接口调试

在下方 **鉴权设置** 中填入有效令牌，再填写参数测试。

### 3.1 健康检查（不计费）

<ApiDemo 
  :options="[
    {
      title: '健康检查',
      method: 'GET',
      path: '/v1/health',
      description: '探测上游是否可用，不产生扣费。',
      response: { code: 0 }
    }
  ]"
/>

### 3.2 用户查询（计费 / JSON Body）

以下接口均为 **POST**，Body 字段 **`qrcode`**（二维码文本，如 `SGWCMAID...`）。

<ApiDemo 
  :options="[
    {
      title: '用户详细数据',
      method: 'POST',
      path: '/v1/user/data',
      paramsIn: 'json',
      description: '消耗 1 Token。msg 常为 JSON 字符串，需二次解析；内含 userId、userData 等。',
      params: [
        { name: 'qrcode', type: 'string', required: '必填', desc: '二维码内容（SGWCMAID... 或官方链接）', value: '' }
      ],
      response: { code: 0, msg: '{\"userId\": 13699208, \"userData\": {}}' }
    },
    {
      title: '地区 / 段位',
      method: 'POST',
      path: '/v1/user/region',
      paramsIn: 'json',
      description: '消耗 1 Token。查询地区与段位信息；msg 可能需二次解析。',
      params: [
        { name: 'qrcode', type: 'string', required: '必填', desc: '二维码内容', value: '' }
      ],
      response: { code: 0, msg: '{}' }
    },
    {
      title: '全部谱面成绩',
      method: 'POST',
      path: '/v1/user/music',
      paramsIn: 'json',
      description: '消耗 2 Token。返回体积较大；msg 可能需二次解析。',
      params: [
        { name: 'qrcode', type: 'string', required: '必填', desc: '二维码内容', value: '' }
      ],
      response: { code: 0, msg: '[]' }
    },
    {
      title: '发票 / 票券查询',
      method: 'POST',
      path: '/v1/user/charge',
      paramsIn: 'json',
      description: '消耗 1 Token。只读查询用户发票与票券信息。',
      params: [
        { name: 'qrcode', type: 'string', required: '必填', desc: '二维码内容', value: '' }
      ],
      response: { code: 0 }
    }
  ]"
/>

### 3.3 发票充值与队列

<ApiDemo 
  :options="[
    {
      title: '充值入队',
      method: 'POST',
      path: '/v1/charge',
      paramsIn: 'json',
      description: '消耗 10 Token。加入发票充值队列；成功后会绑定 mai userId。请确认后再发送。',
      params: [
        { name: 'qrcode', type: 'string', required: '必填', desc: '二维码内容', value: '' },
        { name: 'charge', type: 'integer', required: '必填', desc: '充值张数 / 档位（按上游约定）', value: 5 }
      ],
      response: { code: 0, boundMaiUserId: '13699208' }
    },
    {
      title: '充值队列查询',
      method: 'GET',
      path: '/v1/charge/queue',
      description: '不计费。仅返回当前账号已绑定 userId 的任务；不含 qrToken。未充值绑定过则 tasks 为空。',
      response: { code: 0, tasks: [], workers: 1 }
    }
  ]"
/>

### 3.4 成绩上传（计费 / JSON Body）

<ApiDemo 
  :options="[
    {
      title: '上传到落雪 LX',
      method: 'POST',
      path: '/v1/update-lx',
      paramsIn: 'json',
      description: '消耗 5 Token。请确认后再发送。',
      params: [
        { name: 'qrcode', type: 'string', required: '必填', desc: '二维码内容', value: '' },
        { name: 'key', type: 'string', required: '必填', desc: '落雪相关密钥 / 好友码等（按上游要求）', value: '' },
        { name: 'type', type: 'string', required: '必填', desc: '类型，如 maimai', value: 'maimai' }
      ],
      response: { code: 0 }
    },
    {
      title: '上传到 DivingFish',
      method: 'POST',
      path: '/v1/update-fish',
      paramsIn: 'json',
      description: '消耗 5 Token。请确认后再发送。',
      params: [
        { name: 'qrcode', type: 'string', required: '必填', desc: '二维码内容', value: '' },
        { name: 'token', type: 'string', required: '必填', desc: '水鱼 Import-Token', value: '' }
      ],
      response: { code: 0 }
    }
  ]"
/>

## 4. 公开 JSON 目录

```http
GET https://api.wmc.pub/api/docs
```

返回各路径、方法、**消耗** 与简要说明，便于脚本读取。

## 5. 常见错误

| HTTP | 说明 |
|------|------|
| **401** | 令牌缺失或无效 |
| **403** | 余额不足等 |
| **404** | 路径或资源不存在 |
| **500** | 转发失败 / 未配置上游等，见响应 `msg` |
| **5xx** | 服务异常，可稍后重试 |

::: tip 建议
先调用 **`/v1/health`**（不扣费）确认地址与令牌；再调用查询类接口。  
发起充值请用 **`/v1/charge`**，用 **`/v1/charge/queue`** 查看是否成功。  
旧路径（如 `/v1/get_preview`、`/v1/upload_b50`）已移除，请改用上表新路径。
:::
