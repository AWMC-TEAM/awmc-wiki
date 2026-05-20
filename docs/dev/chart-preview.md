---
chartPreviewBaseUrl: https://v.awmc.cc
---

# 🎵 谱面预览

在浏览器中预览舞萌谱面。本项目根据落雪相关思路与公开 API 制作了独立页面，素材与逻辑遵循上游开源许可证。

感谢 [落雪（maimai.lxns.net）](https://maimai.lxns.net) 提供的资源支持。

由 **P1Meng** 开发，源码仓库：[Pimeng/Maimai-Chart-Preview](https://github.com/Pimeng/Maimai-Chart-Preview)。

## 基准地址

正式入口：`{{ $frontmatter.chartPreviewBaseUrl }}/`

通过 **Query** 指定乐曲与谱面，完整 URL 形如：

`{{ $frontmatter.chartPreviewBaseUrl }}/?song=417&kind=standard&diff=5`

## 查询参数说明

| 参数 | 说明 |
|------|------|
| `song` | 乐曲 ID，以**落雪乐曲 ID**为准。 |
| `kind` | 谱面类型：`standard` 为标准谱，`dx` 为 DX 谱。 |
| `diff` | 难度分级。常见对应关系为：`2` Basic、`3` Advance、`4` Expert、`5` Master、`6` Re:Master。具体以对应乐曲的 `maidata.txt` 为准。 |

## 交互示例

点击下方组件中的「在新标签页打开」，将使用当前填写的参数在**新标签页**打开预览页（不会在文档内嵌入页面或展示 JSON 响应）。

<ApiDemo
  openInNewTab
  baseUrl="https://v.awmc.cc"
  :options="[
    {
      title: '谱面预览',
      method: 'GET',
      path: '/',
      description: '在浏览器中打开谱面预览；参数通过 Query 传递。',
      params: [
        { name: 'song', type: 'number', required: '必填', desc: '曲 ID（落雪乐曲 ID）', value: '417' },
        { name: 'kind', type: 'string', required: '必填', desc: 'standard 标准谱；dx 为 DX 谱', value: 'standard' },
        { name: 'diff', type: 'number', required: '必填', desc: '难度档位，参见上文与 maidata.txt', value: '5' }
      ]
    }
  ]"
/>

## 鉴权与使用注意

- **无需鉴权**：可直接在浏览器中访问上述地址。
- 若参数或乐曲数据有误，预览页可能无法正常加载，请核对落雪侧乐曲 ID 与 `maidata.txt` 中的难度定义。
