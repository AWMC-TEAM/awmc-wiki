<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import { useData, useRoute } from 'vitepress'
import { aiProviders, askAiOpen, isEnglish, markdownUrlOf, openInProvider, type AiProvider } from '../ai/shared'
import { renderMarkdown } from '../ai/renderMarkdown'

interface Message {
  role: 'user' | 'assistant'
  content: string
  // 站内问答不可用时，给出「带着问题去 ChatGPT / Claude」的入口
  fallback?: string
  error?: boolean
  // 站内问答失败的原因，显示成小字方便排查
  reason?: string
}

const { lang } = useData()
const route = useRoute()

const en = computed(() => isEnglish(lang.value))
const t = computed(() =>
  en.value
    ? {
        title: 'Ask AI',
        subtitle: 'AWMC docs only · No roleplay or calculations · Answers may be inaccurate',
        placeholder: 'Ask a question about AWMC…',
        send: 'Send',
        stop: 'Stop',
        clear: 'Clear',
        close: 'Close',
        thinking: 'Thinking…',
        examples: ['How do I bind my maimai account?', 'How do I check my B50?', 'How do I import charts into AstroDX?'],
        unavailable: 'The built-in assistant is unavailable right now. You can ask the same question here:',
        rateLimited: 'Too many questions, please try again in a few minutes. Or ask here:',
        open: (name: string) => `Ask in ${name}`,
        prompt: (q: string, page: string, full: string) =>
          `I have a question about AWMC (a maimai DX score-query QQ bot and related services). Please answer based on its documentation.\nCurrent page: ${page}\nFull docs: ${full}\n\nQuestion: ${q}`
      }
    : {
        title: '问 AI',
        subtitle: '仅限 AWMC 文档问答 · 不接受角色扮演或算数 · 仅供参考',
        placeholder: '问点关于 AWMC 的问题…',
        send: '发送',
        stop: '停止',
        clear: '清空',
        close: '关闭',
        thinking: '思考中…',
        examples: ['怎么绑定舞萌账号？', '怎么查 B50？', '谱面怎么导入 AstroDX？'],
        unavailable: '站内 AI 暂时不可用，可以带着这个问题去这些地方问：',
        rateLimited: '提问太频繁了，请过几分钟再试。也可以去这些地方问：',
        open: (name: string) => `去 ${name} 问`,
        prompt: (q: string, page: string, full: string) =>
          `我有一个关于 AWMC（舞萌 DX 查分 QQ 机器人及相关服务）的问题，请根据它的文档回答。\n当前页面：${page}\n完整文档：${full}\n\n问题：${q}`
      }
)

const messages = ref<Message[]>([])
const input = ref('')
const loading = ref(false)
const listEl = ref<HTMLElement>()
const inputEl = ref<HTMLTextAreaElement>()
let controller: AbortController | null = null

watch(askAiOpen, async (open) => {
  if (!open) return
  await nextTick()
  inputEl.value?.focus()
})

function scrollToBottom() {
  nextTick(() => {
    if (listEl.value) listEl.value.scrollTop = listEl.value.scrollHeight
  })
}

function fallbackPrompt(question: string) {
  return t.value.prompt(question, markdownUrlOf(route.path), `${location.origin}/llms-full.txt`)
}

function openIn(provider: AiProvider, question: string) {
  openInProvider(provider, fallbackPrompt(question))
}

async function ask(text?: string) {
  const question = (text ?? input.value).trim()
  if (!question || loading.value) return
  input.value = ''

  const history = messages.value
    .filter((m) => !m.fallback && !m.error && m.content)
    .map(({ role, content }) => ({ role, content }))
  messages.value.push({ role: 'user', content: question })
  messages.value.push({ role: 'assistant', content: '' })
  const current = messages.value[messages.value.length - 1]
  loading.value = true
  scrollToBottom()

  controller = new AbortController()
  try {
    const res = await fetch('/api/ask', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question, history, page: route.path }),
      signal: controller.signal
    })
    const type = res.headers.get('content-type') || ''
    if (!res.ok || !res.body || type.includes('json') || type.includes('html')) {
      current.content = res.status === 429 ? t.value.rateLimited : t.value.unavailable
      current.fallback = question
      current.reason = await failureReason(res)
      return
    }
    const reader = res.body.getReader()
    const decoder = new TextDecoder()
    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      current.content += decoder.decode(value, { stream: true })
      scrollToBottom()
    }
    if (!current.content.trim()) {
      current.content = t.value.unavailable
      current.fallback = question
    }
  } catch (e) {
    if ((e as Error).name !== 'AbortError') {
      current.content = current.content || t.value.unavailable
      current.fallback = question
      current.reason = (e as Error).message
    }
  } finally {
    loading.value = false
    controller = null
    scrollToBottom()
  }
}

async function failureReason(res: Response) {
  let reason = `HTTP ${res.status}`
  try {
    const data = await res.json()
    if (data && data.error) {
      reason += ` · ${data.error}`
      if (data.status) reason += ` ${data.status}`
      if (data.detail) reason += ` · ${String(data.detail).slice(0, 200)}`
    }
  } catch {}
  return reason
}

function stop() {
  controller?.abort()
}

function clear() {
  stop()
  messages.value = []
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Enter' && !e.shiftKey && !e.isComposing) {
    e.preventDefault()
    ask()
  } else if (e.key === 'Escape') {
    askAiOpen.value = false
  }
}
</script>

<template>
  <button v-if="!askAiOpen" class="ask-fab" type="button" :aria-label="t.title" @click="askAiOpen = true">
    <span aria-hidden="true">✨</span>
    <span class="ask-fab-label">{{ t.title }}</span>
  </button>

  <Transition name="ask-panel">
    <section v-if="askAiOpen" class="ask-panel" role="dialog" :aria-label="t.title" @keydown.esc="askAiOpen = false">
      <header class="ask-header">
        <div>
          <div class="ask-title">✨ {{ t.title }}</div>
          <div class="ask-subtitle">{{ t.subtitle }}</div>
        </div>
        <div class="ask-header-actions">
          <button v-if="messages.length" class="ask-text-btn" type="button" @click="clear">{{ t.clear }}</button>
          <button class="ask-close" type="button" :aria-label="t.close" @click="askAiOpen = false">✕</button>
        </div>
      </header>

      <div ref="listEl" class="ask-list">
        <div v-if="!messages.length" class="ask-examples">
          <button v-for="q in t.examples" :key="q" class="ask-example" type="button" @click="ask(q)">{{ q }}</button>
        </div>

        <div v-for="(m, i) in messages" :key="i" class="ask-msg" :class="m.role">
          <div v-if="m.role === 'user'" class="ask-bubble">{{ m.content }}</div>
          <div v-else class="ask-bubble">
            <div v-if="!m.content && loading" class="ask-thinking">{{ t.thinking }}</div>
            <div v-else class="ask-md" v-html="renderMarkdown(m.content)" />
            <div v-if="m.reason" class="ask-reason">{{ m.reason }}</div>
            <div v-if="m.fallback" class="ask-fallback">
              <button v-for="p in aiProviders" :key="p.name" class="ask-text-btn" type="button" @click="openIn(p, m.fallback)">
                {{ t.open(p.name) }} ↗
              </button>
            </div>
          </div>
        </div>
      </div>

      <form class="ask-form" @submit.prevent="ask()">
        <textarea
          ref="inputEl"
          v-model="input"
          class="ask-input"
          rows="2"
          maxlength="500"
          :placeholder="t.placeholder"
          @keydown="onKeydown"
        />
        <button v-if="loading" class="ask-send" type="button" @click="stop">{{ t.stop }}</button>
        <button v-else class="ask-send" type="submit" :disabled="!input.trim()">{{ t.send }}</button>
      </form>
    </section>
  </Transition>
</template>

<style scoped>
.ask-fab {
  position: fixed;
  right: 24px;
  bottom: 24px;
  z-index: 40;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 16px;
  font-size: 14px;
  font-weight: 600;
  color: var(--vp-c-white);
  background: var(--vp-c-brand-1);
  border: none;
  border-radius: 999px;
  box-shadow: var(--vp-shadow-3);
  cursor: pointer;
  transition: background-color 0.2s, transform 0.2s;
}

.ask-fab:hover {
  background: var(--vp-c-brand-2);
  transform: translateY(-1px);
}

.ask-panel {
  position: fixed;
  right: 24px;
  bottom: 24px;
  z-index: 50;
  display: flex;
  flex-direction: column;
  width: 400px;
  height: min(600px, calc(100vh - 120px));
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  box-shadow: var(--vp-shadow-5);
  overflow: hidden;
}

.ask-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
  padding: 12px 16px;
  border-bottom: 1px solid var(--vp-c-divider);
}

.ask-title {
  font-weight: 600;
}

.ask-subtitle {
  font-size: 12px;
  color: var(--vp-c-text-3);
}

.ask-header-actions {
  display: flex;
  align-items: center;
  gap: 4px;
}

.ask-close {
  width: 28px;
  height: 28px;
  color: var(--vp-c-text-2);
  border-radius: 6px;
}

.ask-close:hover {
  background: var(--vp-c-default-soft);
}

.ask-list {
  flex: 1;
  overflow-y: auto;
  padding: 12px 16px;
}

.ask-examples {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
}

.ask-example {
  padding: 6px 12px;
  font-size: 13px;
  color: var(--vp-c-text-2);
  border: 1px solid var(--vp-c-divider);
  border-radius: 999px;
}

.ask-example:hover {
  color: var(--vp-c-brand-1);
  border-color: var(--vp-c-brand-1);
}

.ask-msg {
  display: flex;
  margin-bottom: 12px;
}

.ask-msg.user {
  justify-content: flex-end;
}

.ask-bubble {
  max-width: 90%;
  padding: 8px 12px;
  font-size: 14px;
  line-height: 1.6;
  border-radius: 10px;
  overflow-wrap: anywhere;
}

.ask-msg.user .ask-bubble {
  white-space: pre-wrap;
  color: var(--vp-c-white);
  background: var(--vp-c-brand-1);
}

.ask-msg.assistant .ask-bubble {
  background: var(--vp-c-bg-soft);
}

.ask-thinking {
  color: var(--vp-c-text-3);
}

.ask-md :deep(p) {
  margin: 4px 0;
}

.ask-md :deep(ul),
.ask-md :deep(ol) {
  margin: 4px 0;
  padding-left: 20px;
}

.ask-md :deep(ul) {
  list-style: disc;
}

.ask-md :deep(ol) {
  list-style: decimal;
}

.ask-md :deep(code) {
  padding: 1px 4px;
  font-size: 0.9em;
  background: var(--vp-c-default-soft);
  border-radius: 4px;
}

.ask-md :deep(pre) {
  margin: 6px 0;
  padding: 8px 10px;
  overflow-x: auto;
  background: var(--vp-code-block-bg);
  border-radius: 6px;
}

.ask-md :deep(pre code) {
  padding: 0;
  background: none;
}

.ask-md :deep(a) {
  color: var(--vp-c-brand-1);
  text-decoration: underline;
}

.ask-reason {
  margin-top: 4px;
  font-size: 12px;
  color: var(--vp-c-text-3);
  overflow-wrap: anywhere;
}

.ask-fallback {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 6px;
}

.ask-text-btn {
  padding: 2px 8px;
  font-size: 13px;
  color: var(--vp-c-brand-1);
  border: 1px solid var(--vp-c-brand-soft);
  border-radius: 6px;
}

.ask-text-btn:hover {
  background: var(--vp-c-brand-soft);
}

.ask-form {
  display: flex;
  align-items: flex-end;
  gap: 8px;
  padding: 10px 12px;
  border-top: 1px solid var(--vp-c-divider);
}

.ask-input {
  font-family: inherit;
  flex: 1;
  resize: none;
  padding: 6px 10px;
  font-size: 14px;
  line-height: 1.5;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
}

.ask-input:focus {
  border-color: var(--vp-c-brand-1);
  outline: none;
}

.ask-send {
  padding: 6px 14px;
  font-size: 14px;
  font-weight: 600;
  color: var(--vp-c-white);
  background: var(--vp-c-brand-1);
  border-radius: 8px;
}

.ask-send:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.ask-panel-enter-active,
.ask-panel-leave-active {
  transition: opacity 0.2s, transform 0.2s;
}

.ask-panel-enter-from,
.ask-panel-leave-to {
  opacity: 0;
  transform: translateY(12px);
}

@media (max-width: 640px) {
  .ask-fab {
    right: 16px;
    bottom: 16px;
    padding: 10px 12px;
  }

  .ask-fab-label {
    display: none;
  }

  .ask-panel {
    right: 0;
    bottom: 0;
    left: 0;
    width: auto;
    height: 80vh;
    border-radius: 12px 12px 0 0;
  }
}
</style>
