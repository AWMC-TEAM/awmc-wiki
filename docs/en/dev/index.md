---
apiBaseUrl: https://status.awmc.team
statBaseUrl: https://stat.awmc.team
awmcApiBaseUrl: https://api.awmc.cc
assetsApiBaseUrl: https://assets.awmc.team
chartPreviewBaseUrl: https://v.awmc.team
---

# Developer Center

<br>
<StatChart :baseUrl="$frontmatter.statBaseUrl" />

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
Provides QR code parsing, user info preview, score upload (Diving Fish / Lxns), and ticket query endpoints.
:::

- **Authentication**: <Badge type="warning" text="Bearer Token" /> (Must be included in Authorization header)
- **Token Consumption**: Some endpoints deduct Tokens based on business logic. See billing details.
- **Documentation**: [View AWMC Public API Details](/en/dev/awmc-api)

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

## Quick Start

You can quickly access different module documentation via the following links:

- [**Status API**](/en/dev/status-api) - Get real-time service status, heartbeat records, and announcements.
- [**AWMC Public API**](/en/dev/awmc-api) - QR code recognition, score upload, and business function calls.
- [**Assets Static Resource API**](/en/dev/assets-api) - Jacket art, resource gallery, and other static file retrieval.
- [**Chart Preview**](/en/dev/chart-preview) - In-browser chart preview and query parameter documentation.
- [**More Features**] - Under development, stay tuned...

::: tip Suggestion
If you encounter any issues during development, feel free to submit an Issue on [GitHub](https://github.com/Michaelwucoc/awmc-wiki) or contact our team.
:::
