import { ref } from 'vue'

// 「问 AI」面板的开关状态，页面顶部按钮和右下角浮动按钮共用
export const askAiOpen = ref(false)

export interface AiProvider {
  name: string
  // 预填提问内容的网页聊天入口，prompt 拼在末尾
  url: string
}

export const aiProviders: AiProvider[] = [
  { name: 'ChatGPT', url: 'https://chatgpt.com/?hints=search&prompt=' },
  { name: 'Claude', url: 'https://claude.ai/new?q=' }
]

export function openInProvider(provider: AiProvider, prompt: string) {
  window.open(provider.url + encodeURIComponent(prompt), '_blank', 'noopener')
}

// 当前页面对应的 LLM 版 Markdown 地址（由 vitepress-plugin-llms 在构建时生成）
export function markdownUrlOf(pathname: string, origin = location.origin) {
  const clean = pathname.replace(/\.html$/, '').replace(/\/+$/, '')
  return clean ? `${origin}${clean}.md` : `${origin}/index.md`
}

export function isEnglish(lang: string) {
  return lang.toLowerCase().startsWith('en')
}
