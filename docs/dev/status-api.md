---
apiBaseUrl: https://status.awmc.cc
---

# 📊 Status API (Uptime Kuma)

AWMC TEAM 使用 [Uptime Kuma](https://status.awmc.cc) 监控所有服务的运行状态。我们提供了公开的 API 端点，方便开发者获取实时的服务状态数据。

::: info 💡 免密钥访问
本页列出的所有 API 均为**公开端点**。你不需要任何 API Key 或鉴权即可直接通过浏览器或脚本请求。
:::


## 1. 状态页配置与结构

该接口用于获取状态页的标题、公告（Incidents）、维护计划以及分组结构。

<ApiDemo 
  :options="[
    {
      title: 'Maimai (主站)',
      path: '/api/status-page/maimai',
      description: '获取 maimai 状态页面的完整配置、公告及所有监控项列表。',
      response: { incidents: [], publicGroupList: [], maintenanceList: [] }
    },
    {
      title: 'Maimai Lite (轻量)',
      path: '/api/status-page/maimai-lite',
      description: '获取 maimai-lite 状态页面的配置。',
      response: { incidents: [], publicGroupList: [], maintenanceList: [] }
    }
  ]"
/>

- **端点**: `GET /api/status-page/[slug]`
- **完整示例**: `https://status.awmc.cc/api/status-page/maimai`

### 📢 公告与故障信息 (Incidents)

::: tip 💡 重要提示
你可以通过解析 `incidents` 数组来获取当前状态页上的置顶公告或故障说明。
:::

```json
{
  "incidents": [
    {
      "id": 16,
      "style": "info", 
      "title": "公告标题",
      "content": "公告的 Markdown 内容",
      "pin": true, 
      "active": true,
      "createdDate": "2026-03-28 07:46:17"
    }
  ]
}
```

### 🛠️ 分组与监控列表 (Public Groups)

```json
{
  "publicGroupList": [
    {
      "id": 1,
      "name": "舞萌服务组",
      "monitorList": [
        {
          "id": 12,
          "name": "Maimai DX Proxy",
          "type": "http"
        }
      ]
    }
  ]
}
```

---

## 2. 实时状态与心跳记录

由于基础接口不含实时状态，你需要调用专门的心跳接口。

<ApiDemo 
  :options="[
    {
      title: 'Maimai 心跳',
      path: '/api/status-page/heartbeat/maimai',
      description: '获取 maimai 监控项的实时在线状态和最近延迟。',
      response: { heartbeatList: {}, uptimeList: {} }
    },
    {
      title: 'Maimai Lite 心跳',
      path: '/api/status-page/heartbeat/maimai-lite',
      description: '获取 maimai-lite 监控项的实时在线状态和最近延迟。',
      response: { heartbeatList: {}, uptimeList: {} }
    }
  ]"
/>

- **端点**: `GET /api/status-page/heartbeat/[slug]`
- **完整示例**: `https://status.awmc.cc/api/status-page/heartbeat/maimai`

### 返回示例 (JSON)

```json
{
  "heartbeatList": {
    "12": [
      {
        "status": 1, 
        "time": "2026-03-29 15:28:18",
        "msg": "200 OK",
        "ping": 32
      }
    ]
  }
}
```

::: warning ⚠️ 状态码解析
在 `heartbeatList` 中，`status` 字段代表了服务的当前健康状况：
- **`1`**: **正常 (Up)** —— 服务响应正常，一切 OK。 
- **`0`**: **离线 (Down)** —— 服务已崩溃或无法访问。 
- **`2`**: **待定/异常 (Pending/Warning)** —— 服务虽然在线但可能响应极慢或返回了非预期结果。 
- **`3`**: **维护中 (Maintenance)** —— 服务处于计划内的维护阶段（通常会跳过通知）。
:::

---

## 3. 计划维护 (Maintenance)

当服务器有计划内的停机维护时，你可以通过 `maintenanceList` 获取。

::: details 📅 如何解析维护信息？
如果 `maintenanceList` 不为空，你可以获取以下关键信息：
- `title`: 维护的标题。
- `description`: 维护的详细描述。
- `start_date`: 维护开始时间。
- `end_date`: 维护预计结束时间。
:::

```json
{
  "maintenanceList": [
    {
      "id": 5,
      "title": "数据库例行维护",
      "active": true,
      "interval": 0
    }
  ]
}
```

---

## 🌐 智能状态预览 (Smart Live Demo)

以下是使用上述 API 接口实时抓取的 **maimai** 状态预览：
::: info 💡 智能排序逻辑
1. **业务优先**：按 NET服务器 > 机台服务器 > 会员服务器 > 二维码服务器 > ALL.NET服务器 排序。
2. **运营商优先**：自动识别你的 **国内运营商**（联通/电信/移动），将匹配你线路的服务器置顶。
:::

<div style="padding: 1.5rem; border: 1px solid var(--vp-c-divider); border-radius: 12px; background: var(--vp-c-bg-soft); margin-top: 1rem;">
  <div v-if="loading" style="text-align: center; color: var(--vp-c-text-2);">
    🔍 正在识别你的运营商并同步服务状态...
  </div>
  <div v-else-if="error" style="color: var(--vp-c-danger-1); text-align: center;">
    ❌ 状态获取失败，请检查网络并刷新。
  </div>
  <div v-else>
    <div style="margin-bottom: 1rem; display: flex; justify-content: space-between; align-items: center;">
      <div style="font-size: 0.9rem; color: var(--vp-c-brand-1); font-weight: bold;">
        检测到你的运营商：{{ userISP || '识别中...' }}
      </div>
      <button 
        @click="fetchStatus" 
        :disabled="loading"
        style="font-size: 0.8rem; padding: 4px 12px; border: 1px solid var(--vp-c-brand-1); border-radius: 6px; color: var(--vp-c-brand-1); cursor: pointer; transition: all 0.2s;"
        onmouseover="this.style.background='var(--vp-c-brand-3)'"
        onmouseout="this.style.background='transparent'"
      >
        {{ loading ? '🔄 刷新中' : '🔄 手动刷新' }}
      </button>
    </div>
    <div v-for="monitor in statusList" :key="monitor.id" style="display: flex; justify-content: space-between; align-items: center; padding: 0.75rem 0; border-bottom: 1px solid var(--vp-c-divider);">
      <div style="display: flex; flex-direction: column; gap: 4px;">
        <div style="display: flex; align-items: center; gap: 8px;">
           <span style="font-weight: 500;">{{ monitor.name }}</span>
           <span v-if="monitor.isMatch" style="font-size: 0.7rem; background: var(--vp-c-brand-3); color: var(--vp-c-brand-1); padding: 2px 6px; border-radius: 4px;">推荐线路</span>
        </div>
        <div style="display: flex; gap: 2px;">
           <span v-for="(h, idx) in monitor.history" :key="idx" 
             :title="h.time"
             :style="{
               width: '8px',
               height: '14px',
               borderRadius: '2px',
               background: h.status === 1 ? '#10b981' : (h.status === 2 ? '#f59e0b' : '#ef4444'),
               opacity: 0.3 + (idx / 10)
             }"
           ></span>
           <span style="font-size: 0.7rem; color: var(--vp-c-text-3); margin-left: 4px;">最近心跳</span>
        </div>
      </div>
      <div style="display: flex; align-items: center; gap: 8px;">
        <span style="font-size: 0.85rem; color: var(--vp-c-text-2);">{{ monitor.ping }} ms</span>
        <span 
          :style="{
            display: 'inline-block',
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            background: monitor.status === 1 ? '#10b981' : (monitor.status === 2 ? '#f59e0b' : '#ef4444'),
            boxShadow: `0 0 8px ${monitor.status === 1 ? '#10b98188' : (monitor.status === 2 ? '#f59e0b88' : '#ef444488')}`
          }"
        ></span>
      </div>
    </div>
    <div style="margin-top: 1rem; font-size: 0.8rem; color: var(--vp-c-text-3); text-align: right;">
      ⚡ 最后同步: {{ lastSync }}
    </div>
  </div>
</div>

[//]: # (## 4. 自定义接口演示 &#40;Custom Demo&#41;)

[//]: # ()
[//]: # (你可以直接在 Markdown 中配置接口端点进行演示：)

[//]: # ()
[//]: # (<ApiDemo )

[//]: # (  title="自定义测试接口")

[//]: # (  method="GET")

[//]: # (  path="/api/realtime")

[//]: # (  baseUrl="https://stat.awmc.cc")

[//]: # (  description="这是一个直接在 Markdown 中配置的示例，用于演示自定义端点和参数修改功能。")

[//]: # (  :params="[)

[//]: # (    { name: 'type', type: 'string', required: '必填', desc: '数据类型', value: 'req' },)

[//]: # (    { name: 'start', type: 'string', required: '必填', desc: '开始时间', value: '2026-03-30 00:00:00' })

[//]: # (  ]")

[//]: # (  :response="{ 'info': '这是预设的响应示例' }")

[//]: # (/>)

---

### 💻 开发者如何实现“运营商优先排序”？

在开发状态页时，你可以参考以下核心代码逻辑。关键在于对服务器名称进行**关键词匹配**。

```javascript
// 1. 获取用户运营商信息 (支持跨域的方案) 
async function getUserISP() {
  try {
    // 推荐使用支持 HTTPS 的 myip.ipip.net (纯文本格式)
    const res = await fetch('https://myip.ipip.net/'); 
    const text = await res.text();
    if (text.includes('联通')) return '联通';
    if (text.includes('电信')) return '电信';
    if (text.includes('移动')) return '移动';
    return '国内线路';
  } catch (e) {
    return '识别失败';
  }
}

// 2. 定义业务类型排序权重 (数值越大越靠前) 
const TYPE_WEIGHT = {
  "NET服务器": 500,
  "机台服务器": 400,
  "会员服务器": 300,
  "二维码服务器": 200,
  "ALL.NET服务器": 100
};

// 3. 执行智能排序算法 // 
const userISP = await getUserISP();

monitors.sort((a, b) => {
  let scoreA = 0;
  let scoreB = 0;

  // A. 根据业务类型加分 // 
  Object.keys(TYPE_WEIGHT).forEach(key => {
    if (a.name.includes(key)) scoreA += TYPE_WEIGHT[key];
    if (b.name.includes(key)) scoreB += TYPE_WEIGHT[key];
  });

  // B. 如果名称包含用户运营商，大幅加分 (置顶)
  if (a.name.includes(userISP)) scoreA += 1000; 
  if (b.name.includes(userISP)) scoreB += 1000;

  return scoreB - scoreA; // 分数高的排前面
});
```


<script setup>
import { ref, onMounted } from 'vue'

const statusList = ref([])
const loading = ref(true)
const error = ref(false)
const lastSync = ref('')
const userISP = ref('')

async function fetchUserISP() {
  try {
    // 方案 1: 使用 myip.ipip.net (国内访问速度快，返回纯文本)
    const res = await fetch('https://myip.ipip.net/').catch(() => null)
    if (res) {
      const text = await res.text()
      if (text.includes('联通')) userISP.value = '联通'
      else if (text.includes('电信')) userISP.value = '电信'
      else if (text.includes('移动')) userISP.value = '移动'
      else userISP.value = '国内线路'
      return
    }
  } catch (e) {
    userISP.value = '国内线路'
  }
}

async function fetchStatus() {
  try {
    await fetchUserISP()
    
    const [baseRes, hbRes] = await Promise.all([
      fetch('https://status.awmc.cc/api/status-page/maimai'),
      fetch('https://status.awmc.cc/api/status-page/heartbeat/maimai')
    ])
    
    const baseData = await baseRes.json()
    const hbData = await hbRes.json()
    
    const monitors = []
    baseData.publicGroupList.forEach(group => {
      group.monitorList.forEach(monitor => {
        if (monitor.type !== 'group') {
          const hbs = hbData.heartbeatList[monitor.id] || []
          const latest = hbs[0] || { status: 0, ping: 0 }
          
          monitors.push({
            id: monitor.id,
            name: monitor.name,
            status: latest.status,
            ping: latest.ping,
            // 截取最近 10 条心跳记录 (大概代表最近 10-20 分钟)
            history: hbs.slice(0, 10).reverse(), 
            isMatch: userISP.value !== '未知' && monitor.name.includes(userISP.value)
          })
        }
      })
    })

    // 排序逻辑
    const TYPE_ORDER = ["NET服务器", "机台服务器", "会员服务器", "二维码服务器", "ALL.NET服务器"]
    
    monitors.sort((a, b) => {
      let scoreA = 0, scoreB = 0
      
      // 业务类型权重
      TYPE_ORDER.forEach((name, idx) => {
        const weight = (TYPE_ORDER.length - idx) * 100
        if (a.name.includes(name)) scoreA += weight
        if (b.name.includes(name)) scoreB += weight
      })
      
      // 运营商匹配极大加分
      if (a.isMatch) scoreA += 1000
      if (b.isMatch) scoreB += 1000
      
      return scoreB - scoreA
    })
    
    statusList.value = monitors
    lastSync.value = new Date().toLocaleTimeString()
    loading.value = false
  } catch (e) {
    error.value = true
    loading.value = false
  }
}

onMounted(fetchStatus)
</script>

---

::: tip 🛠️ 接入建议
如果你想在自己的 App 中实现类似“服务状态灯”的功能：
1. **先获取** `status-page/maimai` 拿到 `publicGroupList`（确定有哪些服务）。
2. **再获取** `status-page/heartbeat/maimai` 拿到最新的 `status`（点亮对应的灯）。
3. **别忘了** 检查 `incidents` 数组，如果有 `active: true` 的公告，可以弹窗提醒用户。
:::
