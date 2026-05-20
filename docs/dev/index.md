---
apiBaseUrl: https://status.awmc.cc
statBaseUrl: https://stat.awmc.cc
awmcApiBaseUrl: https://api.awmc.cc
assetsApiBaseUrl: https://assets.awmc.cc
chartPreviewBaseUrl: https://v.awmc.cc
---

# 💻 开发者中心

<br>
<StatChart :baseUrl="$frontmatter.statBaseUrl" />

欢迎来到 AWMC 开发者中心。我们为开发者提供了多种接口和工具，帮助你构建属于自己的舞萌应用或集成服务。

## 📊 Status API (基准地址: `{{ $frontmatter.apiBaseUrl }}`)

::: info 💡 服务概述
实时监控 AWMC 所提供的舞萌服务的运行状态。
:::

- **鉴权方式**：<Badge type="tip" text="无需鉴权" /> (对所有用户公开)
- **访问限制**：`10 QPS` (每秒查询率)
- **详细文档**：[点击查看 Status API 详情](/dev/status-api)

<br>

## 🔌 AWMC 公共 API (基准地址: `{{ $frontmatter.awmcApiBaseUrl }}`)

::: info 💡 业务接口
提供二维码解析、用户信息预览、成绩上传（水鱼/落雪）及功能票查询等业务接口。
:::

- **鉴权方式**：<Badge type="warning" text="Bearer 令牌" /> (需在 Authorization 中携带)
- **消耗规则**：部分接口根据业务逻辑扣除 Token，详见计费说明。
- **详细文档**：[点击查看 AWMC 公共 API 详情](/dev/awmc-api)

## 🖼️ Assets 静态资源 API (基准地址: `{{ $frontmatter.assetsApiBaseUrl }}`)

::: info 💡 静态资源
提供了曲绘、UI 元素等游戏相关的高清静态资源，方便在您的应用中展示。
:::

- **鉴权方式**：<Badge type="tip" text="无需鉴权" /> (公开访问)
- **资源类型**：`.png` 格式的曲绘图。
- **详细文档**：[点击查看 Assets 静态资源 API 详情](/dev/assets-api)

## 🎵 谱面预览 (入口: `{{ $frontmatter.chartPreviewBaseUrl }}`)

::: info 💡 浏览器预览
在网页中查看舞萌谱面；参数与落雪乐曲 ID、谱面类型及难度档位对应，适合开发与分享链接。
:::

- **鉴权方式**：<Badge type="tip" text="无需鉴权" /> (公开访问)
- **详细文档**：[点击查看谱面预览说明](/dev/chart-preview)

## 🚀 快速上手

你可以通过以下链接快速访问不同模块的开发文档：

- [**舞萌状态 API**](/dev/status-api) - 获取服务实时在线状态、心跳记录及公告。
- [**AWMC 公共 API**](/dev/awmc-api) - 二维码识别、成绩上传及业务功能调用。
- [**Assets 静态资源 API**](/dev/assets-api) - 曲绘、资源图库等静态文件获取。
- [**谱面预览**](/dev/chart-preview) - 浏览器内谱面预览与 Query 参数说明。
- [**更多功能**] - 正在开发中，敬请期待...

::: tip 建议
如果你在开发过程中遇到任何问题，欢迎通过 [GitHub](https://github.com/Michaelwucoc/awmc-wiki) 提交 Issue 或联系我们的团队。
:::