<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useData, useRoute } from 'vitepress'
import { aiProviders, askAiOpen, isEnglish, markdownUrlOf, openInProvider, type AiProvider } from '../ai/shared'

const { lang, frontmatter } = useData()
const route = useRoute()

const en = computed(() => isEnglish(lang.value))
const t = computed(() =>
  en.value
    ? {
        ask: 'Ask AI',
        copy: 'Copy page',
        copied: 'Copied',
        failed: 'Copy failed',
        more: 'More options',
        view: 'View as Markdown',
        open: (name: string) => `Open in ${name}`,
        prompt: (url: string) => `Read from ${url} so I can ask questions about it.`
      }
    : {
        ask: '问 AI',
        copy: '复制本页',
        copied: '已复制',
        failed: '复制失败',
        more: '更多选项',
        view: '查看 Markdown 原文',
        open: (name: string) => `在 ${name} 中打开`,
        prompt: (url: string) => `请阅读 ${url} ，这是 AWMC（舞萌 DX 查分机器人及相关服务）的一篇文档，接下来我会就它提问。`
      }
)

const visible = computed(() => frontmatter.value.layout !== 'home' && frontmatter.value.pageActions !== false)

const menuOpen = ref(false)
const copyState = ref<'idle' | 'copied' | 'failed'>('idle')
const root = ref<HTMLElement>()

const markdownUrl = () => markdownUrlOf(route.path)

async function copyPage() {
  try {
    const res = await fetch(markdownUrl())
    if (!res.ok) throw new Error(String(res.status))
    await navigator.clipboard.writeText(await res.text())
    copyState.value = 'copied'
  } catch {
    copyState.value = 'failed'
  }
  setTimeout(() => (copyState.value = 'idle'), 2000)
}

function viewMarkdown() {
  window.open(markdownUrl(), '_blank', 'noopener')
  menuOpen.value = false
}

function openIn(provider: AiProvider) {
  openInProvider(provider, t.value.prompt(markdownUrl()))
  menuOpen.value = false
}

function onClickOutside(e: MouseEvent) {
  if (root.value && !root.value.contains(e.target as Node)) menuOpen.value = false
}
onMounted(() => document.addEventListener('click', onClickOutside))
onUnmounted(() => document.removeEventListener('click', onClickOutside))
</script>

<template>
  <div v-if="visible" ref="root" class="page-actions">
    <button class="pa-btn pa-ask" type="button" @click="askAiOpen = true">
      <span class="pa-icon" aria-hidden="true">✨</span>{{ t.ask }}
    </button>

    <div class="pa-split">
      <button class="pa-btn pa-main" type="button" @click="copyPage">
        <span class="pa-icon" aria-hidden="true">{{ copyState === 'copied' ? '✅' : copyState === 'failed' ? '⚠️' : '📋' }}</span>
        {{ copyState === 'copied' ? t.copied : copyState === 'failed' ? t.failed : t.copy }}
      </button>
      <button
        class="pa-btn pa-chevron"
        type="button"
        :aria-label="t.more"
        :aria-expanded="menuOpen"
        @click.stop="menuOpen = !menuOpen"
      >
        <svg :class="{ open: menuOpen }" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6" /></svg>
      </button>

      <div v-if="menuOpen" class="pa-menu" role="menu">
        <button class="pa-item" role="menuitem" type="button" @click="viewMarkdown">
          <span class="pa-icon" aria-hidden="true">📄</span>{{ t.view }}<span class="pa-ext" aria-hidden="true">↗</span>
        </button>
        <button v-for="p in aiProviders" :key="p.name" class="pa-item" role="menuitem" type="button" @click="openIn(p)">
          <span class="pa-icon" aria-hidden="true">💬</span>{{ t.open(p.name) }}<span class="pa-ext" aria-hidden="true">↗</span>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.page-actions {
  display: flex;
  justify-content: flex-end;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 12px;
}

.pa-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  font-size: 13px;
  line-height: 24px;
  color: var(--vp-c-text-1);
  background: transparent;
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  cursor: pointer;
  white-space: nowrap;
  transition: border-color 0.2s, background-color 0.2s;
}

.pa-btn:hover {
  border-color: var(--vp-c-brand-1);
}

.pa-ask {
  color: var(--vp-c-brand-1);
  border-color: var(--vp-c-brand-soft);
  background: var(--vp-c-brand-soft);
}

.pa-split {
  position: relative;
  display: inline-flex;
}

.pa-main {
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
}

.pa-chevron {
  padding: 4px 8px;
  border-left: none;
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
}

.pa-chevron svg {
  transition: transform 0.2s;
}

.pa-chevron svg.open {
  transform: rotate(180deg);
}

.pa-icon {
  font-size: 13px;
}

.pa-menu {
  position: absolute;
  top: calc(100% + 4px);
  right: 0;
  z-index: 30;
  min-width: 220px;
  padding: 4px;
  background: var(--vp-c-bg-elv);
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  box-shadow: var(--vp-shadow-3);
}

.pa-item {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  padding: 8px 10px;
  font-size: 13px;
  color: var(--vp-c-text-1);
  text-align: left;
  background: transparent;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.pa-item:hover {
  background: var(--vp-c-default-soft);
}

.pa-ext {
  margin-left: auto;
  color: var(--vp-c-text-3);
}
</style>
