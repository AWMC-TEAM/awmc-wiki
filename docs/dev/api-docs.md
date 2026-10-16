# API 调试文档

选择服务后可查看接口定义、请求参数和响应结构。

::: tip 传歌曲（成绩写入）
打开服务 **AWMC 网关 API** → 标签 **Score**：

- `POST /v1/music/upsert`：上传/覆盖成绩（文档内详细说明精确/模糊模式、`dxScore` 含义）
- `POST /v1/music/delete`：按 `musicId` + `level` 删除成绩

注意：`POST /v1/user/music` 是**查询**全部成绩，不是上传。文字版说明见 [AWMC 公共 API · 成绩写入](/dev/awmc-api#_3-4-成绩写入-传歌曲-—-详细说明)。
:::

::: tip AWMCNET 成绩同步
Swagger 服务选择器中的 **AWMCNET API** 对应 `https://net.wmc.pub/openapi.json`。
调用 `/api/bot/sync` 时使用 `Bot-Token` 鉴权；成绩较多时请按
[AWMCNET Bot API 分块快照说明](/dev/awmcnet-api#分块提交全量快照) 复用同一个
`snapshot_id` 分块提交。
:::

::: warning 鉴权说明
AWMC 网关令牌、谱面平台 API Key 与 AWMCNET 的凭证并不通用。切换服务时，页面会主动清除 Swagger UI 中已填写的凭证，避免误用或泄露。
:::

<ClientOnly>
  <SwaggerDocs />
</ClientOnly>
