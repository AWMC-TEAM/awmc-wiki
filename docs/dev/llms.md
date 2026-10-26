---
description: 本站提供的 AI 问答、llms.txt / llms-full.txt 与每页 Markdown 原文，方便用 ChatGPT、Claude 等大模型阅读 AWMC 文档
---

# 🤖 AI 问答与 llms.txt

本站对大语言模型（LLM）做了适配：你可以直接在站内问 AI，也可以把文档一键交给 ChatGPT、Claude 等网页 AI，或者在自己的程序 / Agent 里读取纯文本版本的文档。

## ✨ 站内问 AI

每个页面右下角都有 **✨ 问 AI** 按钮（文档页顶部也有一个）。AI 会先在本站文档里检索与问题相关的段落，再结合你当前所在的页面作答，并在回答末尾附上参考的文档链接。

::: warning 注意
回答由 AI 根据文档自动生成，可能出错。涉及计费、协议、封禁等重要事项，请以文档原文为准。
:::

如果站内 AI 暂时不可用，对话框会给出「去 ChatGPT 问」「去 Claude 问」按钮，带着你的问题和文档链接跳转过去。

## 📋 复制本页 / 在 ChatGPT、Claude 中打开

文档页标题上方的按钮：

| 按钮 | 作用 |
| --- | --- |
| 📋 复制本页 | 把本页的 Markdown 原文复制到剪贴板，可以直接粘贴给任何 AI |
| 📄 查看 Markdown 原文 | 在新标签页打开本页的 `.md` 版本 |
| 💬 在 ChatGPT / Claude 中打开 | 打开对应的网页聊天，并预填「请阅读本页」的提问 |

## 📄 给 LLM 读的文件

| 地址 | 内容 |
| --- | --- |
| [`/llms.txt`](https://wiki.awmc.team/llms.txt) | 全站文档目录，遵循 [llmstxt.org](https://llmstxt.org/) 规范 |
| [`/llms-full.txt`](https://wiki.awmc.team/llms-full.txt) | 全部中文文档合并成的一个纯文本文件 |
| 页面地址 + `.md` | 单个页面的 Markdown 原文，例如 [`/guide/bot/intro.md`](https://wiki.awmc.team/guide/bot/intro.md) |

在自己的 Bot、Agent 或 Cursor 等工具里接入 AWMC 文档时，推荐直接把 `https://wiki.awmc.team/llms-full.txt` 作为上下文来源。
