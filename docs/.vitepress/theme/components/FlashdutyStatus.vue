<script setup lang="ts">
// FlashCat（Flashduty）状态页组件：仅在浏览器端加载官方 widget 脚本并挂载自定义元素。
import { onMounted, ref } from 'vue'

const props = withDefaults(defineProps<{
  type?: 'banner' | 'badge'
  position?: 'top' | 'bottom'
  size?: 'small' | 'medium' | 'large'
}>(), { type: 'badge', position: 'top', size: 'medium' })

const SCRIPT_SRC = 'https://statuspage.flashcat.cloud/status-page-widget/1.0.1/widget.js'
const SCRIPT_SRI = 'sha384-UPNiiTsMdVbjrBGP/eTAW+OBpaWrL5bFa4L0IJkxrGelurQ+sELET6of/tdLcrOn'
const host = ref<HTMLElement | null>(null)

function ensureScript() {
  if (document.querySelector(`script[src="${SCRIPT_SRC}"]`)) return
  const script = document.createElement('script')
  script.async = true
  script.src = SCRIPT_SRC
  script.integrity = SCRIPT_SRI
  script.crossOrigin = 'anonymous'
  document.head.appendChild(script)
}

onMounted(() => {
  ensureScript()
  const widget = document.createElement('flashduty-status-widget')
  widget.setAttribute('page', 'https://up.wmc.pub')
  widget.setAttribute('type', props.type)
  widget.setAttribute('theme', 'auto')
  widget.setAttribute('locale', 'zh')
  if (props.type === 'banner') widget.setAttribute('position', props.position)
  else widget.setAttribute('size', props.size)
  host.value?.appendChild(widget)
})
</script>

<template>
  <span ref="host" class="flashduty-status-host" />
</template>
