---
apiBaseUrl: https://status.awmc.cc
awmcApiBaseUrl: https://api.wmc.pub
assetsApiBaseUrl: https://assets.awmc.cc
chartPreviewBaseUrl: https://v.awmc.cc
---

# Developer Center

<br>
Welcome to the AWMC Developer Center. We provide developers with various APIs and tools to help you build your own maimai applications or integration services.

## Status API (Base URL: `{{ $frontmatter.apiBaseUrl }}`)

::: info Service Overview
Real-time monitoring of the operational status of maimai services provided by AWMC.
:::

- **Authentication**: <Badge type="tip" text="No Auth Required" /> (Public access for all users)
- **Rate Limit**: `10 QPS` (Queries Per Second)
- **Documentation**: [View Status API Details](/en/dev/status-api)

<br>

## AWMC Public API (Base URL: `{{ $frontmatter.awmcApiBaseUrl }}`)

::: info Business API
User data / chart queries, charge enqueue & queue, and score upload (DivingFish / Lxns) via the new `/v1/user/*` and `/v1/charge` routes.
:::

- **Authentication**: <Badge type="warning" text="Bearer Token" /> (Must be included in Authorization header)
- **Token Consumption**: Charged on HTTP success and upstream business success (`returnCode===1`, or `0` for health/ping). Public paths stay mostly compatible with legacy `/v1/*`.
- **Documentation**: [View AWMC Public API Details](/en/dev/awmc-api)

## AWMCNET Bot API (Base URL: `https://net.wmc.pub`)

::: info Score Mirror & Queries
Score sync interfaces for QueryBot and score checkers, supporting full-snapshot
submission in chunks with a shared `snapshot_id` to avoid timeouts from large
score packages in one request.
:::

- **Authentication**: <Badge type="warning" text="Bot-Token" />
- **Main Endpoints**: `POST /api/bot/sync`, `GET /api/bot/player/{qq}`
- **Documentation**: [View AWMCNET Bot API Details](/en/dev/awmcnet-api)

## Assets Static Resource API (Base URL: `{{ $frontmatter.assetsApiBaseUrl }}`)

::: info Static Resources
Provides game-related HD static resources such as jacket art and UI elements for use in your applications.
:::

- **Authentication**: <Badge type="tip" text="No Auth Required" /> (Public access)
- **Resource Type**: `.png` format jacket art images.
- **Documentation**: [View Assets Static Resource API Details](/en/dev/assets-api)

## Chart Preview (Entry: `{{ $frontmatter.chartPreviewBaseUrl }}`)

::: info Browser Preview
Preview maimai charts in the browser. Parameters correspond to Lxns song IDs, chart types, and difficulty levels, suitable for development and sharing links.
:::

- **Authentication**: <Badge type="tip" text="No Auth Required" /> (Public access)
- **Documentation**: [View Chart Preview Details](/en/dev/chart-preview)

## Chart Review & Analysis API (Base URL: `https://v.wmc.pub/api/v1/`)

::: info REST API
Public REST API for the Chart Preview platform, supporting chart queries, comments, ratings, score submissions, rankings, and more. Requires API Key authentication.
:::

- **Authentication**: <Badge type="warning" text="Bearer API Key" /> (Must be included in Authorization header)
- **Documentation**: [View Chart Review & Analysis API Details](/en/dev/chart-preview-api)

## Quick Start

You can quickly access different module documentation via the following links:

- [**Status API**](/en/dev/status-api) - Get real-time service status, heartbeat records, and announcements.
- [**AWMC Public API**](/en/dev/awmc-api) - User queries, charge queue, score upload (DivingFish / Lxns).
- [**AWMCNET Bot API**](/en/dev/awmcnet-api) - Score mirroring, player queries, and chunked snapshot sync.
- [**Assets Static Resource API**](/en/dev/assets-api) - Jacket art, resource gallery, and other static file retrieval.
- [**Chart Preview**](/en/dev/chart-preview) - In-browser chart preview and query parameter documentation.
- [**Chart Review & Analysis API**](/en/dev/chart-preview-api) - REST API for chart queries, comments, ratings, score submissions, and rankings.
- [**More Features**] - Under development, stay tuned...

::: tip Suggestion
If you encounter any issues during development, feel free to submit an Issue on [GitHub](https://github.com/Michaelwucoc/awmc-wiki) or contact our team.
:::
