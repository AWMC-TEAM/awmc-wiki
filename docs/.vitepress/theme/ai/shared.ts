import { ref } from 'vue'

// 「问 AI」面板的开关状态，页面顶部按钮和右下角浮动按钮共用
export const askAiOpen = ref(false)

export interface AiProvider {
  name: string
  url: string
  mode: 'clipboard' | 'prefill'
}

export { aiProviders, openInProvider } from './providers.mjs'

// 当前页面对应的 LLM 版 Markdown 地址（由 vitepress-plugin-llms 在构建时生成）
export function markdownUrlOf(pathname: string, origin = location.origin) {
  const clean = pathname.replace(/\.html$/, '').replace(/\/+$/, '')
  return clean ? `${origin}${clean}.md` : `${origin}/index.md`
}

export function isEnglish(lang: string) {
  return lang.toLowerCase().startsWith('en')
}
