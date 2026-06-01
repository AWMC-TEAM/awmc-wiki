<script setup>
import { ref, computed } from 'vue'
import { useData } from 'vitepress'

const { frontmatter } = useData()

const props = defineProps({
  title: String,
  method: {
    type: String,
    default: 'GET'
  },
  path: String,
  baseUrl: String,
  description: String,
  params: {
    type: Array,
    default: () => []
  },
  /**
   * 请求参数位置：
   * - query: 所有参数（除 path params）拼到 query（默认，兼容旧用法）
   * - json:  参数（除 path params）作为 JSON body 发送（适合 POST/PUT/PATCH/DELETE）
   * - auto: GET/HEAD -> query，其它方法 -> json
   */
  paramsIn: {
    type: String,
    default: 'query'
  },
  response: {
    type: Object,
    default: null
  },
  isImage: {
    type: Boolean,
    default: false
  },
  options: {
    type: Array,
    default: () => []
  },
  /** 为 true 时：不 fetch、不展示响应区，仅在新标签页打开完整 URL（如前端预览页） */
  openInNewTab: {
    type: Boolean,
    default: false
  }
})

const activeOptionIndex = ref(0)

// 合并 props 和 options
const currentApi = computed(() => {
  let base = {}
  
  if (props.options && props.options.length > 0) {
    base = props.options[activeOptionIndex.value]
  }

  const finalBaseUrl = props.baseUrl || base.baseUrl || frontmatter.value.apiBaseUrl || 'https://status.awmc.cc'

  return {
    title: props.title || base.title || '未命名接口',
    // 当使用 options 时，优先使用选项中的 method，避免 props.method 默认值覆盖
    method: (props.options && props.options.length > 0)
      ? (base.method || props.method || 'GET')
      : (props.method || base.method || 'GET'),
    path: props.path || base.path || '/',
    baseUrl: finalBaseUrl,
    description: props.description || base.description || '',
    params: props.params.length > 0 ? props.params : (base.params || []),
    paramsIn: base.paramsIn || props.paramsIn || 'query',
    response: props.response || base.response || {},
    isImage: props.isImage || base.isImage || false
  }
})

// 管理参数值
const paramValues = ref({})
const isExpanded = ref(false)
const copySuccess = ref(false)
const isLoading = ref(false)
const isImageLoading = ref(false)
const executionResult = ref(null)
const authToken = ref('')

// 从 localStorage 加载令牌 (可选，提升用户体验)
import { onMounted } from 'vue'
onMounted(() => {
  const savedToken = localStorage.getItem('awmc_auth_token')
  if (savedToken) authToken.value = savedToken
})

// 初始化参数值
import { watchEffect } from 'vue'
watchEffect(() => {
  const vals = {}
  currentApi.value.params.forEach(p => {
    vals[p.name] = p.value !== undefined && p.value !== null ? p.value : ''
  })
  paramValues.value = vals
})

const copyUrl = () => {
  const fullUrl = getFullUrl()
  navigator.clipboard.writeText(fullUrl)
  copySuccess.value = true
  setTimeout(() => copySuccess.value = false, 2000)
}

const resolveParamsIn = () => {
  const method = String(currentApi.value.method || 'GET').toUpperCase()
  const mode = String(currentApi.value.paramsIn || 'query').toLowerCase()
  if (mode === 'auto') {
    return method === 'GET' || method === 'HEAD' ? 'query' : 'json'
  }
  return mode === 'json' ? 'json' : 'query'
}

const getFullUrl = () => {
  let url = currentApi.value.baseUrl + currentApi.value.path
  const query = new URLSearchParams()
  const paramsIn = resolveParamsIn()
  
    // 简单的路径参数替换 (例如 /api/:id)
    Object.keys(paramValues.value).forEach(key => {
      // 匹配 :key
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, paramValues.value[key])
      } else {
        if (paramsIn === 'query') query.append(key, paramValues.value[key])
      }
    })

  const queryString = query.toString()
  return queryString ? `${url}?${queryString}` : url
}

const coerceJsonBodyValue = (raw) => {
  if (raw === '' || raw === null || raw === undefined) return undefined
  const s = String(raw).trim()
  if (s === '') return undefined
  if ((s.startsWith('[') && s.endsWith(']')) || (s.startsWith('{') && s.endsWith('}'))) {
    try {
      return JSON.parse(s)
    } catch {
      return raw
    }
  }
  if (/^-?\d+$/.test(s)) return Number(s)
  if (/^-?\d+\.\d+$/.test(s)) return Number(s)
  return raw
}

const getJsonBody = () => {
  const body = {}
  let url = currentApi.value.baseUrl + currentApi.value.path
  Object.keys(paramValues.value).forEach(key => {
    if (url.includes(`:${key}`)) return
    const coerced = coerceJsonBodyValue(paramValues.value[key])
    if (coerced !== undefined) body[key] = coerced
  })
  return body
}

const runRequest = async () => {
  if (props.openInNewTab) {
    const url = getFullUrl()
    window.open(url, '_blank', 'noopener,noreferrer')
    return
  }

  isLoading.value = true
  executionResult.value = null
  
  if (currentApi.value.isImage) {
    // 图片模式直接通过 <img> 标签加载，不需要 fetch
    isImageLoading.value = true
    setTimeout(() => {
      isLoading.value = false
      // 我们通过重置 executionResult 为一个空对象或特定标识来触发 <img> 重新渲染（如果需要）
      // 或者干脆什么都不做，因为 :src 已经绑定了 getFullUrl()
      executionResult.value = { isImage: true }
    }, 300)
    return
  }

  try {
    const paramsIn = resolveParamsIn()
    const url = getFullUrl()
    const options = {
      method: currentApi.value.method,
      headers: {
        'Content-Type': 'application/json'
      }
    }
    
    // 如果填了 Auth Token，则携带 Bearer 头
    if (authToken.value) {
      options.headers['Authorization'] = `Bearer ${authToken.value}`
      localStorage.setItem('awmc_auth_token', authToken.value)
    }

    // 非 query 模式时发送 JSON body（避免 GET/HEAD 带 body）
    const method = String(currentApi.value.method || 'GET').toUpperCase()
    if (paramsIn === 'json' && method !== 'GET' && method !== 'HEAD') {
      options.body = JSON.stringify(getJsonBody())
    }
    
    const response = await fetch(url, options)
    const data = await response.json()
    executionResult.value = data
  } catch (e) {
    executionResult.value = { error: e.message }
  } finally {
    isLoading.value = false
  }
}

const formatMethod = (method) => {
  const colors = {
    'GET': '#00b386',
    'POST': '#e6a23c',
    'PUT': '#409eff',
    'DELETE': '#f56c6c'
  }
  return colors[method] || 'var(--vp-c-brand-1)'
}
</script>

<template>
  <div class="api-demo-container">
    <div class="api-header" @click="isExpanded = !isExpanded">
      <div class="api-info">
        <span class="method-badge" :style="{ backgroundColor: formatMethod(currentApi.method) }">{{ currentApi.method }}</span>
        <span class="api-title">{{ currentApi.title }}</span>
      </div>
      <div class="api-actions">
        <span class="api-path">{{ currentApi.path }}</span>
        <span :class="['arrow', { rotated: isExpanded }]">▼</span>
      </div>
    </div>

    <transition name="slide">
      <div v-if="isExpanded" class="api-body">
        <!-- 选项切换 -->
        <div v-if="props.options && props.options.length > 1" class="options-tabs">
          <button 
            v-for="(opt, index) in props.options" 
            :key="index"
            :class="['tab-btn', { active: activeOptionIndex === index }]"
            @click="activeOptionIndex = index"
          >
            {{ opt.title || `选项 ${index + 1}` }}
          </button>
        </div>

        <div class="api-description">
          {{ currentApi.description }}
        </div>

        <!-- 鉴权部分 (仅针对 awmc-api 场景) -->
        <div v-if="currentApi.baseUrl.includes('api.awmc.')" class="auth-section">
          <div class="section-title">鉴权设置 (Authorization)</div>
          <div class="auth-box">
            <span class="auth-prefix">Bearer</span>
            <input 
              v-model="authToken" 
              class="auth-input"
              placeholder="请输入您的 gw_ 令牌或 JWT"
            />
          </div>
          <div class="auth-tips">填写的令牌将用于此后的所有请求。</div>
        </div>

        <!-- 请求部分 -->
        <div class="section-title">请求地址</div>
        <div class="url-box">
          <code class="full-url">{{ getFullUrl() }}</code>
          <div class="url-actions">
            <button class="run-btn" @click.stop="runRequest" :disabled="isLoading && !openInNewTab">
              {{
                openInNewTab
                  ? '在新标签页打开'
                  : isLoading
                    ? '运行中...'
                    : '运行'
              }}
            </button>
            <button class="copy-btn" @click.stop="copyUrl">
              {{ copySuccess ? '已复制' : '复制' }}
            </button>
          </div>
        </div>

        <!-- 参数部分 -->
        <div class="section-title">
          请求参数 ({{ resolveParamsIn() === 'json' ? 'JSON Body' : 'Query' }})
        </div>
        <table class="params-table">
          <thead>
            <tr>
              <th>参数名</th>
              <th>类型</th>
              <th>说明</th>
              <th>值 (可修改)</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="param in currentApi.params" :key="param.name">
              <td><code class="param-name">{{ param.name }}</code></td>
              <td><span class="param-type">{{ param.type }}</span></td>
              <td class="param-desc">{{ param.desc }}</td>
              <td>
                <input 
                  v-model="paramValues[param.name]" 
                  class="param-input"
                  :placeholder="param.required"
                />
              </td>
            </tr>
            <tr v-if="currentApi.params.length === 0">
              <td colspan="4" style="text-align: center; color: var(--vp-c-text-3);">无需参数</td>
            </tr>
          </tbody>
        </table>

        <template v-if="!openInNewTab">
          <!-- 响应预览 -->
          <div class="section-title">
            {{ currentApi.isImage ? '响应预览 (图片)' : '响应示例 (JSON)' }}
          </div>
          <div v-if="executionResult" class="response-header">
            实际响应结果：
            <button class="clear-btn" @click="executionResult = null">清除</button>
          </div>
          
          <!-- 图片预览模式 -->
          <div v-if="currentApi.isImage" class="image-preview-box" :class="{ 'loading': isImageLoading }">
            <div v-if="isImageLoading" class="image-loader">正在加载图片...</div>
            <img 
              :src="getFullUrl()" 
              alt="Preview"
              class="preview-img"
              :style="{ opacity: isImageLoading ? 0.3 : 1 }"
              @load="isImageLoading = false"
              @error="isImageLoading = false; executionResult = { error: '图片加载失败，请检查 ID 是否正确' }"
            />
          </div>

          <!-- JSON 预览模式 -->
          <div v-else class="response-box" :class="{ 'execution-res': executionResult }">
            <pre><code>{{ JSON.stringify(executionResult || currentApi.response, null, 2) }}</code></pre>
          </div>
        </template>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.api-demo-container {
  margin: 1.5rem 0;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background-color: var(--vp-c-bg-soft);
  overflow: hidden;
  font-family: var(--vp-font-family-base);
}

.api-header {
  padding: 12px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  background-color: var(--vp-c-bg-alt);
  transition: background-color 0.2s;
}

.api-header:hover {
  filter: brightness(0.95);
}

.api-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.method-badge {
  color: white;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: bold;
  min-width: 48px;
  text-align: center;
}

.api-title {
  font-weight: 600;
  font-size: 0.95rem;
}

.api-actions {
  display: flex;
  align-items: center;
  gap: 12px;
  color: var(--vp-c-text-2);
}

.api-path {
  font-family: var(--vp-font-family-mono);
  font-size: 0.85rem;
}

.arrow {
  font-size: 0.7rem;
  transition: transform 0.3s;
}

.arrow.rotated {
  transform: rotate(180deg);
}

.api-body {
  padding: 16px;
  border-top: 1px solid var(--vp-c-divider);
}

.api-description {
  font-size: 0.9rem;
  color: var(--vp-c-text-2);
  margin-bottom: 1.5rem;
  line-height: 1.6;
}

.section-title {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--vp-c-text-1);
  margin: 1.2rem 0 0.6rem;
  padding-left: 8px;
  border-left: 3px solid var(--vp-c-brand-1);
}

.url-box {
  display: flex;
  background-color: var(--vp-c-bg-alt);
  padding: 8px 12px;
  border-radius: 6px;
  align-items: center;
  justify-content: space-between;
  border: 1px solid var(--vp-c-divider);
  gap: 12px;
}

.full-url {
  font-family: var(--vp-font-family-mono);
  font-size: 0.85rem;
  word-break: break-all;
  color: var(--vp-c-brand-1);
  font-weight: 500;
}

/* 选项切换样式 */
.options-tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 1.2rem;
  border-bottom: 1px solid var(--vp-c-divider);
  padding-bottom: 8px;
  overflow-x: auto;
}

.tab-btn {
  font-size: 0.85rem;
  padding: 4px 12px;
  border-radius: 4px;
  border: 1px solid var(--vp-c-divider);
  background-color: var(--vp-c-bg-alt);
  color: var(--vp-c-text-2);
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.tab-btn:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}

.tab-btn.active {
  background-color: var(--vp-c-brand-1);
  border-color: var(--vp-c-brand-1);
  color: white;
}

.url-actions {
  display: flex;
  gap: 8px;
}

.run-btn {
  font-size: 0.75rem;
  padding: 4px 10px;
  background-color: #00b386;
  color: white;
  border-radius: 4px;
  cursor: pointer;
  white-space: nowrap;
}

.run-btn:hover {
  filter: brightness(1.1);
}

.run-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.copy-btn {
  font-size: 0.75rem;
  padding: 4px 10px;
  background-color: var(--vp-c-brand-1);
  color: white;
  border-radius: 4px;
  cursor: pointer;
  white-space: nowrap;
}

.copy-btn:hover {
  filter: brightness(1.1);
}

.param-input {
  width: 100%;
  padding: 4px 8px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 4px;
  background-color: var(--vp-c-bg);
  color: var(--vp-c-text-1);
  font-size: 0.85rem;
}

.param-input:focus {
  border-color: var(--vp-c-brand-1);
  outline: none;
}

.auth-section {
  margin-bottom: 1.5rem;
}

.auth-box {
  display: flex;
  align-items: center;
  background-color: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 6px;
  overflow: hidden;
}

.auth-prefix {
  padding: 4px 12px;
  background-color: var(--vp-c-bg-alt);
  color: var(--vp-c-text-2);
  font-size: 0.85rem;
  font-weight: 600;
  border-right: 1px solid var(--vp-c-divider);
}

.auth-input {
  flex: 1;
  padding: 6px 12px;
  border: none;
  background-color: transparent;
  color: var(--vp-c-text-1);
  font-size: 0.85rem;
  font-family: var(--vp-font-family-mono);
}

.auth-input:focus {
  outline: none;
}

.auth-tips {
  font-size: 0.75rem;
  color: var(--vp-c-text-3);
  margin-top: 4px;
  padding-left: 4px;
}

.response-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.8rem;
  color: var(--vp-c-text-2);
  margin-top: 1rem;
}

.clear-btn {
  font-size: 0.7rem;
  color: var(--vp-c-brand-1);
  cursor: pointer;
}

.execution-res {
  border: 1px solid var(--vp-c-brand-1) !important;
}

.params-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 8px;
  font-size: 0.85rem;
}

.params-table th {
  text-align: left;
  padding: 8px;
  background-color: var(--vp-c-bg-alt);
  border-bottom: 2px solid var(--vp-c-divider);
}

.params-table td {
  padding: 8px;
  border-bottom: 1px solid var(--vp-c-divider);
}

.param-name {
  color: var(--vp-c-brand-1);
}

.param-type {
  color: #00b386;
}

.param-required {
  color: #f56c6c;
}

.response-box {
  background-color: #1e1e1e;
  border-radius: 6px;
  padding: 12px;
  margin-top: 8px;
  max-height: 300px;
  overflow-y: auto;
}

.response-box pre {
  margin: 0;
  font-size: 0.85rem;
  color: #dcdcdc;
}

.image-preview-box {
  margin-top: 8px;
  background-color: var(--vp-c-bg-alt);
  border-radius: 6px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 200px;
  border: 1px solid var(--vp-c-divider);
  position: relative;
}

.image-loader {
  position: absolute;
  font-size: 0.85rem;
  color: var(--vp-c-text-2);
  z-index: 1;
}

.preview-img {
  max-width: 100%;
  max-height: 400px;
  border-radius: 4px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  transition: opacity 0.3s;
}

/* 动画 */
.slide-enter-active, .slide-leave-active {
  transition: all 0.3s ease-out;
  max-height: 1000px;
}

.slide-enter-from, .slide-leave-to {
  max-height: 0;
  opacity: 0;
  padding-top: 0;
  padding-bottom: 0;
  overflow: hidden;
}

/* 适配深色模式 */
:deep(.dark) .api-header {
  background-color: #2a2a2a;
}
</style>
