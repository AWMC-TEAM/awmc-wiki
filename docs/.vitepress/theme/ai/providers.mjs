// 国内网页 AI 未确认有稳定的预填协议，统一复制提问后打开官网。
export const aiProviders = [
  { name: 'DeepSeek', url: 'https://chat.deepseek.com/', mode: 'clipboard' },
  { name: '豆包', url: 'https://www.doubao.com/chat/', mode: 'clipboard' },
  { name: 'Kimi', url: 'https://www.kimi.com/', mode: 'clipboard' },
  { name: 'ChatGPT', url: 'https://chatgpt.com/?hints=search&prompt=', mode: 'prefill' },
  { name: 'Claude', url: 'https://claude.ai/new?q=', mode: 'prefill' }
]

export async function openInProvider(provider, prompt) {
  if (provider.mode === 'prefill') {
    window.open(provider.url + encodeURIComponent(prompt), '_blank', 'noopener')
    return 'opened'
  }

  let copying
  try {
    // 在同一次用户点击中启动复制和开窗，不能 await 后再开窗（会被拦截）。
    copying = navigator.clipboard.writeText(prompt)
  } catch {
    window.open(provider.url, '_blank', 'noopener')
    return 'copy_failed'
  }
  window.open(provider.url, '_blank', 'noopener')
  try {
    await copying
    return 'copied'
  } catch {
    return 'copy_failed'
  }
}
