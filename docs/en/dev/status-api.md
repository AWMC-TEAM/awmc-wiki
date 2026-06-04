---
apiBaseUrl: https://status.awmc.cc
---

# Status API (Uptime Kuma)

AWMC TEAM uses [Uptime Kuma](https://status.awmc.cc) to monitor the operational status of all services. We provide public API endpoints for developers to access real-time service status data.

::: info No API Key Required
All APIs listed on this page are **public endpoints**. You do not need any API Key or authentication to make requests directly from a browser or script.
:::


## 1. Status Page Configuration & Structure

This endpoint retrieves the status page title, announcements (Incidents), maintenance schedules, and group structure.

<ApiDemo 
  :options="[
    {
      title: 'Maimai (Main)',
      path: '/api/status-page/maimai',
      description: 'Get the complete configuration, announcements, and all monitor items for the maimai status page.',
      response: { incidents: [], publicGroupList: [], maintenanceList: [] }
    },
    {
      title: 'Maimai Lite',
      path: '/api/status-page/maimai-lite',
      description: 'Get the configuration for the maimai-lite status page.',
      response: { incidents: [], publicGroupList: [], maintenanceList: [] }
    }
  ]"
/>

- **Endpoint**: `GET /api/status-page/[slug]`
- **Full Example**: `https://status.awmc.cc/api/status-page/maimai`

### Announcements & Incidents

::: tip Important
You can parse the `incidents` array to get pinned announcements or incident reports on the current status page.
:::

```json
{
  "incidents": [
    {
      "id": 16,
      "style": "info", 
      "title": "Announcement Title",
      "content": "Announcement Markdown content",
      "pin": true, 
      "active": true,
      "createdDate": "2026-03-28 07:46:17"
    }
  ]
}
```

### Groups & Monitor List (Public Groups)

```json
{
  "publicGroupList": [
    {
      "id": 1,
      "name": "maimai Service Group",
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

## 2. Real-time Status & Heartbeat Records

Since the base endpoint does not include real-time status, you need to call the dedicated heartbeat endpoint.

<ApiDemo 
  :options="[
    {
      title: 'Maimai Heartbeat',
      path: '/api/status-page/heartbeat/maimai',
      description: 'Get real-time online status and recent latency for maimai monitors.',
      response: { heartbeatList: {}, uptimeList: {} }
    },
    {
      title: 'Maimai Lite Heartbeat',
      path: '/api/status-page/heartbeat/maimai-lite',
      description: 'Get real-time online status and recent latency for maimai-lite monitors.',
      response: { heartbeatList: {}, uptimeList: {} }
    }
  ]"
/>

- **Endpoint**: `GET /api/status-page/heartbeat/[slug]`
- **Full Example**: `https://status.awmc.cc/api/status-page/heartbeat/maimai`

### Response Example (JSON)

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

::: warning Status Code Reference
In `heartbeatList`, the `status` field represents the current health of the service:
- **`1`**: **Up** - Service is responding normally, all OK.
- **`0`**: **Down** - Service has crashed or is unreachable.
- **`2`**: **Pending/Warning** - Service is online but may be responding very slowly or returning unexpected results.
- **`3`**: **Maintenance** - Service is in a planned maintenance phase (notifications are usually skipped).
:::

---

## 3. Scheduled Maintenance

When servers have planned downtime maintenance, you can retrieve it from `maintenanceList`.

::: details How to parse maintenance info?
If `maintenanceList` is not empty, you can get the following key information:
- `title`: Maintenance title.
- `description`: Detailed maintenance description.
- `start_date`: Maintenance start time.
- `end_date`: Expected maintenance end time.
:::

```json
{
  "maintenanceList": [
    {
      "id": 5,
      "title": "Routine Database Maintenance",
      "active": true,
      "interval": 0
    }
  ]
}
```

---

## Smart Live Status Preview

Below is a real-time **maimai** status preview fetched using the above API endpoints:
::: info Smart Sorting Logic
1. **Business Priority**: Sorted by NET Server > Cabinet Server > Member Server > QR Code Server > ALL.NET Server.
2. **ISP Priority**: Automatically detects your **domestic ISP** (China Unicom/China Telecom/China Mobile) and places matching servers at the top.
:::

<div style="padding: 1.5rem; border: 1px solid var(--vp-c-divider); border-radius: 12px; background: var(--vp-c-bg-soft); margin-top: 1rem;">
  <div v-if="loading" style="text-align: center; color: var(--vp-c-text-2);">
    Detecting your ISP and syncing service status...
  </div>
  <div v-else-if="error" style="color: var(--vp-c-danger-1); text-align: center;">
    Failed to fetch status. Please check your network and refresh.
  </div>
  <div v-else>
    <div style="margin-bottom: 1rem; display: flex; justify-content: space-between; align-items: center;">
      <div style="font-size: 0.9rem; color: var(--vp-c-brand-1); font-weight: bold;">
        Detected ISP: {{ userISP || 'Detecting...' }}
      </div>
      <button 
        @click="fetchStatus" 
        :disabled="loading"
        style="font-size: 0.8rem; padding: 4px 12px; border: 1px solid var(--vp-c-brand-1); border-radius: 6px; color: var(--vp-c-brand-1); cursor: pointer; transition: all 0.2s;"
        onmouseover="this.style.background='var(--vp-c-brand-3)'"
        onmouseout="this.style.background='transparent'"
      >
        {{ loading ? 'Refreshing...' : 'Refresh' }}
      </button>
    </div>
    <div v-for="monitor in statusList" :key="monitor.id" style="display: flex; justify-content: space-between; align-items: center; padding: 0.75rem 0; border-bottom: 1px solid var(--vp-c-divider);">
      <div style="display: flex; flex-direction: column; gap: 4px;">
        <div style="display: flex; align-items: center; gap: 8px;">
           <span style="font-weight: 500;">{{ monitor.name }}</span>
           <span v-if="monitor.isMatch" style="font-size: 0.7rem; background: var(--vp-c-brand-3); color: var(--vp-c-brand-1); padding: 2px 6px; border-radius: 4px;">Recommended</span>
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
           <span style="font-size: 0.7rem; color: var(--vp-c-text-3); margin-left: 4px;">Recent heartbeats</span>
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
      Last sync: {{ lastSync }}
    </div>
  </div>
</div>

---

### How Developers Can Implement "ISP Priority Sorting"

When developing a status page, you can refer to the following core logic. The key is **keyword matching** on server names.

```javascript
// 1. Get user ISP info (cross-origin compatible approach) 
async function getUserISP() {
  try {
    // Recommended: use myip.ipip.net with HTTPS (plain text format)
    const res = await fetch('https://myip.ipip.net/'); 
    const text = await res.text();
    if (text.includes('联通')) return 'China Unicom';
    if (text.includes('电信')) return 'China Telecom';
    if (text.includes('移动')) return 'China Mobile';
    return 'Domestic';
  } catch (e) {
    return 'Detection Failed';
  }
}

// 2. Define business type sort weights (higher = higher priority) 
const TYPE_WEIGHT = {
  "NET服务器": 500,
  "机台服务器": 400,
  "会员服务器": 300,
  "二维码服务器": 200,
  "ALL.NET服务器": 100
};

// 3. Execute smart sorting algorithm
const userISP = await getUserISP();

monitors.sort((a, b) => {
  let scoreA = 0;
  let scoreB = 0;

  // A. Add score based on business type
  Object.keys(TYPE_WEIGHT).forEach(key => {
    if (a.name.includes(key)) scoreA += TYPE_WEIGHT[key];
    if (b.name.includes(key)) scoreB += TYPE_WEIGHT[key];
  });

  // B. If name contains user's ISP, add large bonus (pin to top)
  if (a.name.includes(userISP)) scoreA += 1000; 
  if (b.name.includes(userISP)) scoreB += 1000;

  return scoreB - scoreA; // Higher score goes first
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
    const res = await fetch('https://myip.ipip.net/').catch(() => null)
    if (res) {
      const text = await res.text()
      if (text.includes('联通')) userISP.value = '联通'
      else if (text.includes('电信')) userISP.value = '电信'
      else if (text.includes('移动')) userISP.value = '移动'
      else userISP.value = 'Domestic'
      return
    }
  } catch (e) {
    userISP.value = 'Domestic'
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
            history: hbs.slice(0, 10).reverse(), 
            isMatch: userISP.value !== 'Unknown' && monitor.name.includes(userISP.value)
          })
        }
      })
    })

    const TYPE_ORDER = ["NET服务器", "机台服务器", "会员服务器", "二维码服务器", "ALL.NET服务器"]
    
    monitors.sort((a, b) => {
      let scoreA = 0, scoreB = 0
      
      TYPE_ORDER.forEach((name, idx) => {
        const weight = (TYPE_ORDER.length - idx) * 100
        if (a.name.includes(name)) scoreA += weight
        if (b.name.includes(name)) scoreB += weight
      })
      
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

::: tip Integration Advice
If you want to implement a "service status light" feature in your own app:
1. **First fetch** `status-page/maimai` to get `publicGroupList` (determine which services exist).
2. **Then fetch** `status-page/heartbeat/maimai` to get the latest `status` (light up the corresponding indicator).
3. **Don't forget** to check the `incidents` array. If there's an `active: true` announcement, you can show a popup to alert users.
:::
