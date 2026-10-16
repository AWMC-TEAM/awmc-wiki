---
title: 配额与限流
---

# 配额与限流

AWMC API 对有 Token 消耗的接口提供**个人 + 全站**双层配额。窗口为 **15 分钟、1 小时、5 小时**，且每个窗口从该窗口的**第一次成功请求**开始计时。配额按**成功请求次数**累计（失败请求不占额度）：

- **读取**：查询用户数据、成绩、票券、道具和 Gate 状态等，默认额度相对更高。
- **写入**：`upsert`、删除、清空以及 `POST /v1/charge` 购买票券等发送性质操作。
- `POST /v1/update-lx` 与 `POST /v1/update-fish` 用于读取并同步外部成绩结果，按读取额度计算。

## 超限响应

超限返回 HTTP `429`，同时带有 `Retry-After`（秒）和 `X-Quota-Reset`（ISO 时间）响应头：

```json
{
  "error": "quota_exceeded",
  "msg": "Reached Personal 1-Hour Quota Limit for Read requests. You may continue request after 2026-08-06 23:06:26 Beijing Time (UTC+8). If you want a higher quota, please get in touch on us https://bbs.wmc.pub.",
  "retryAfterSeconds": 1800,
  "quota": {
    "scope": "Personal",
    "category": "read",
    "window": "1h",
    "limit": 50,
    "used": 118,
    "requested": 4,
    "resetAt": "2026-08-06T15:06:26.000Z",
    "retryAtBeijing": "2026-08-06 23:06:26",
    "timeZone": "Asia/Shanghai"
  }
}
```

客户端应等待 `retryAfterSeconds` 或 `quota.resetAt` 后再重试，而不是立即循环请求。

## 查询当前配额

已登录用户可调用 `GET /me/quota`（`GET /quota` 为兼容别名）：

```bash
curl https://api.wmc.pub/me/quota \
  -H 'Authorization: Bearer <JWT 或 gw_令牌>'
```

返回 `windows.read` 与 `windows.write` 数组，每一项包含 `scope`、`window`、`limit`、`used`、`remaining`、`startedAt`、`resetAt`。尚未发起请求的窗口会显示 `startedAt: null`。

## 管理员设置

控制台的「配额与错误」页面可以修改：

- 保守、正常、宽松、自适应、自定义五种模式。保守/正常/宽松倍率为基准值的 50% / 100% / 150%。自适应根据近 30 分钟服务器内部错误率在保守与宽松之间调节。
- 个人与全站 read/write 三种窗口的 Token 基准值。
- 全站限制开关与全站窗口倍率（0.25–4 倍）。

「用户管理」的编辑窗口可以为单个用户设置六个 read/write 覆盖值，留空即跟随默认值，并可勾选「绕过全站配额」。个人配额仍然生效。

## 服务器内部错误

管理员页面提供近 7 天、30 分钟粒度的服务器内部错误图表。`httpStatus = 0`（转发异常）或 HTTP `>= 500` 均计入服务器内部错误，可用来定位错误发生的时间区间并选择合适的调节模式。
