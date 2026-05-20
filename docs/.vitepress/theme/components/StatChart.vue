<script setup>
import { ref, onMounted, computed } from 'vue'

const props = defineProps({
  baseUrl: {
    type: String,
    default: 'https://stat.awmc.cc'
  }
})

const data = ref(null)
const loading = ref(true)
const error = ref(null)
const isCollapsed = ref(true)
const hoveredPoint = ref(null)
const chartRef = ref(null)
const tooltipX = ref(0)
const tooltipY = ref(0)

const formatDate = (date) => {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d} 00:00:00`
}

const fetchData = async () => {
  try {
    const now = new Date()
    const tomorrow = new Date(now)
    tomorrow.setDate(tomorrow.getDate() + 1)
    
    const start = formatDate(now)
    const end = formatDate(tomorrow)
    
    const url = `${props.baseUrl}/api/realtime?type=req&start=${encodeURIComponent(start)}&end=${encodeURIComponent(end)}`
    const res = await fetch(url)
    if (!res.ok) throw new Error('Failed to fetch stats')
    data.value = await res.json()
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchData()
})

const totalReq = computed(() => {
  if (!data.value || !data.value.points) return 0
  return data.value.points.reduce((acc, curr) => acc + curr[1], 0)
})

const maxPoint = computed(() => {
  if (!data.value || !data.value.points || data.value.points.length === 0) return 1
  return Math.max(...data.value.points.map(p => p[1]))
})

const chartPoints = computed(() => {
  if (!data.value || !data.value.points) return []
  // 增加左右边距，防止端点被裁切
  const padding = 10
  const width = 1000 - (padding * 2)
  const height = 180 // 给顶部留一点空间
  const topPadding = 10
  const points = data.value.points
  if (points.length < 2) return []
  
  const step = width / (points.length - 1)
  return points.map((p, i) => {
    const x = i * step + padding
    const y = height - (p[1] / maxPoint.value) * height + topPadding
    return { x, y, value: p[1], timestamp: p[0] }
  })
})

const polylinePoints = computed(() => {
  return chartPoints.value.map(p => `${p.x},${p.y}`).join(' ')
})

const handleMouseMove = (e) => {
  if (!chartRef.value || !chartPoints.value.length) return
  
  const svg = chartRef.value
  const rect = svg.getBoundingClientRect()
  const mouseX = e.clientX - rect.left
  const svgWidth = rect.width
  
  // 映射鼠标位置到 SVG 坐标系 (0-1000)
  const xInSvg = (mouseX / svgWidth) * 1000
  
  // 寻找最近的点
  let closest = chartPoints.value[0]
  let minDiff = Math.abs(chartPoints.value[0].x - xInSvg)
  
  chartPoints.value.forEach(p => {
    const diff = Math.abs(p.x - xInSvg)
    if (diff < minDiff) {
      minDiff = diff
      closest = p
    }
  })
  
  hoveredPoint.value = closest
  
  // 设置 Tooltip 位置
  tooltipX.value = (closest.x / 1000) * svgWidth
  tooltipY.value = (closest.y / 200) * (rect.height)
}

const handleMouseLeave = () => {
  hoveredPoint.value = null
}

const formatTime = (ts) => {
  const d = new Date(ts)
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}
</script>

<template>
  <div class="stat-container">
    <div class="stat-header" @click="isCollapsed = !isCollapsed">
      <div class="stat-summary">
        <span class="stat-label">今日请求量</span>
        <span class="stat-value" v-if="loading">加载中...</span>
        <span class="stat-value" v-else-if="error">获取失败</span>
        <span class="stat-value" v-else>{{ totalReq.toLocaleString() }}</span>
      </div>
      <div class="stat-toggle">
        {{ isCollapsed ? '展开图表' : '收起图表' }}
        <span :class="['arrow', { rotated: !isCollapsed }]">▼</span>
      </div>
    </div>
    
    <transition name="fade">
      <div v-if="!isCollapsed" class="stat-content">
        <div v-if="loading" class="placeholder">数据加载中...</div>
        <div v-else-if="error" class="placeholder error">{{ error }}</div>
        <div v-else-if="data && data.points" class="chart-wrapper">
          <svg 
            ref="chartRef"
            viewBox="0 0 1000 200" 
            preserveAspectRatio="none" 
            class="chart-svg"
            @mousemove="handleMouseMove"
            @mouseleave="handleMouseLeave"
            style="overflow: visible;"
          >
            <!-- 渐变填充 -->
            <defs>
              <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="var(--vp-c-brand-1)" stop-opacity="0.2" />
                <stop offset="100%" stop-color="var(--vp-c-brand-1)" stop-opacity="0" />
              </linearGradient>
            </defs>
            
            <path
              v-if="chartPoints.length > 0"
              :d="`M ${chartPoints[0].x} 200 ` + chartPoints.map(p => `L ${p.x} ${p.y}`).join(' ') + ` L ${chartPoints[chartPoints.length-1].x} 200 Z`"
              fill="url(#gradient)"
            />

            <polyline
              fill="none"
              stroke="var(--vp-c-brand-1)"
              stroke-width="2"
              :points="polylinePoints"
            />

            <!-- 悬浮指示线 -->
            <line 
              v-if="hoveredPoint"
              :x1="hoveredPoint.x" 
              y1="0" 
              :x2="hoveredPoint.x" 
              y2="200" 
              stroke="var(--vp-c-divider)" 
              stroke-width="1"
              stroke-dasharray="4"
            />

            <!-- 悬浮点 -->
            <circle 
              v-if="hoveredPoint"
              :cx="hoveredPoint.x" 
              :cy="hoveredPoint.y" 
              r="4" 
              fill="var(--vp-c-brand-1)"
              stroke="var(--vp-c-bg-soft)"
              stroke-width="2"
            />
          </svg>

          <!-- Tooltip -->
          <div 
            v-if="hoveredPoint" 
            class="tooltip"
            :style="{ left: tooltipX + 'px', top: tooltipY + 'px' }"
          >
            <div class="tooltip-time">{{ formatTime(hoveredPoint.timestamp) }}</div>
            <div class="tooltip-value">{{ hoveredPoint.value }} 请求</div>
          </div>

          <div class="chart-info">
            <span>{{ data.start.split(' ')[0] }}</span>
            <span>{{ data.end.split(' ')[0] }}</span>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<style scoped>
.stat-container {
  margin: 1em 0 2em;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background-color: var(--vp-c-bg-soft);
  overflow: hidden;
  font-family: var(--vp-font-family-base);
}

.stat-header {
  padding: 12px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  transition: background-color 0.2s;
}

.stat-header:hover {
  background-color: var(--vp-c-bg-alt);
}

.stat-summary {
  display: flex;
  flex-direction: column;
}

.stat-label {
  font-size: 0.85em;
  color: var(--vp-c-text-2);
}

.stat-value {
  font-size: 1.5em;
  font-weight: 600;
  color: var(--vp-c-brand-1);
}

.stat-toggle {
  font-size: 0.9em;
  color: var(--vp-c-text-2);
  display: flex;
  align-items: center;
  gap: 4px;
}

.arrow {
  font-size: 0.7em;
  transition: transform 0.3s;
}

.arrow.rotated {
  transform: rotate(180deg);
}

.stat-content {
  padding: 16px;
  border-top: 1px solid var(--vp-c-divider);
}

.chart-wrapper {
  height: 120px;
  position: relative;
}

.chart-svg {
  width: 100%;
  height: 100px;
  display: block;
}

.tooltip {
  position: absolute;
  background-color: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 4px;
  padding: 4px 8px;
  font-size: 0.75em;
  pointer-events: none;
  transform: translate(-50%, -120%);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  z-index: 10;
  white-space: nowrap;
}

.tooltip-time {
  color: var(--vp-c-text-2);
}

.tooltip-value {
  font-weight: 600;
  color: var(--vp-c-brand-1);
}

.chart-info {
  display: flex;
  justify-content: space-between;
  font-size: 0.75em;
  color: var(--vp-c-text-3);
  margin-top: 8px;
}

.placeholder {
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: var(--vp-c-text-3);
}

.error {
  color: var(--vp-c-danger-1);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>
