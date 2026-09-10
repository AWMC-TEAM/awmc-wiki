# Interactive API Reference

Select a service to inspect endpoints, parameters, and response schemas.

::: tip Uploading scores (music upsert)
Open **AWMC Gateway API** → tag **Score**:

- `POST /v1/music/upsert` — write/overwrite scores (exact vs fuzzy `dxScore` explained in the operation description)
- `POST /v1/music/delete` — delete by `musicId` + `level`

Note: `POST /v1/user/music` **reads** all scores; it does not upload. See also [AWMC Public API](/en/dev/awmc-api).
:::

::: tip AWMCNET score sync
The **AWMCNET API** option in the Swagger service selector corresponds to
`https://net.wmc.pub/openapi.json`. Use `Bot-Token` authentication when calling
`/api/bot/sync`; when syncing many scores, follow the
[AWMCNET Bot API chunked snapshot guide](/en/dev/awmcnet-api#submitting-a-full-snapshot-in-chunks)
and reuse the same `snapshot_id`.
:::

::: warning Authentication
AWMC gateway tokens, Chart Preview API keys, and AWMCNET credentials are not interchangeable. Swagger UI credentials are cleared when you switch services to prevent accidental reuse or exposure.
:::

<ClientOnly>
  <SwaggerDocs />
</ClientOnly>
