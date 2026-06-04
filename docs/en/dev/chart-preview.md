---
chartPreviewBaseUrl: https://v.awmc.cc
---

# Chart Preview

Preview maimai charts in the browser. This project is built as an independent page based on Lxns-related concepts and public APIs. Assets and logic follow upstream open-source licenses.

Thanks to [Lxns (maimai.lxns.net)](https://maimai.lxns.net) for resource support.

Developed by **P1Meng**, source repository: [Pimeng/Maimai-Chart-Preview](https://github.com/Pimeng/Maimai-Chart-Preview).

## Base URL

Official entry: `{{ $frontmatter.chartPreviewBaseUrl }}/`

Specify the song and chart via **Query** parameters. The full URL looks like:

`{{ $frontmatter.chartPreviewBaseUrl }}/?song=417&kind=standard&diff=5`

## Query Parameters

| Parameter | Description |
|-----------|-------------|
| `song` | Song ID, based on **Lxns song ID**. |
| `kind` | Chart type: `standard` for Standard chart, `dx` for DX chart. |
| `diff` | Difficulty level. Common mappings: `2` Basic, `3` Advance, `4` Expert, `5` Master, `6` Re:Master. Refer to the corresponding song's `maidata.txt` for specifics. |

## Interactive Demo

Click "Open in new tab" in the component below to open the preview page with the current parameters in a **new tab** (it will not embed the page or display JSON responses within the documentation).

<ApiDemo
  openInNewTab
  baseUrl="https://v.awmc.cc"
  :options="[
    {
      title: 'Chart Preview',
      method: 'GET',
      path: '/',
      description: 'Open chart preview in browser; parameters are passed via Query.',
      params: [
        { name: 'song', type: 'number', required: 'Required', desc: 'Song ID (Lxns song ID)', value: '417' },
        { name: 'kind', type: 'string', required: 'Required', desc: 'standard for Standard chart; dx for DX chart', value: 'standard' },
        { name: 'diff', type: 'number', required: 'Required', desc: 'Difficulty level, see above and maidata.txt', value: '5' }
      ]
    }
  ]"
/>

## Authentication & Usage Notes

- **No Authentication Required**: You can directly access the above URL in a browser.
- If parameters or song data are incorrect, the preview page may fail to load. Please verify the Lxns song ID and difficulty definitions in `maidata.txt`.
