// 文档内「问 AI」的后端：EdgeOne Pages Edge Function，路由为 POST /api/ask。
//
// 流程：从本站的 /llms-full.txt 里按关键词挑出最相关的几段文档（再加上用户当前所在页面的原文），
// 连同问题一起交给一个 OpenAI 兼容的 Chat Completions 接口，把回答以纯文本流的形式返回。
//
// 需要在 EdgeOne Pages 控制台配置环境变量：
//   AI_API_KEY   必填，模型服务的 API Key（未配置时接口返回 503，前端会退化为「去 ChatGPT / Claude 问」）
//   AI_BASE_URL  选填，OpenAI 兼容接口地址，默认 https://api.deepseek.com/v1
//   AI_MODEL     选填，模型名，默认 deepseek-chat
//
// 排查：浏览器直接打开 GET /api/ask 会返回配置与文档加载情况（不含密钥）。

const DEFAULT_BASE_URL = 'https://api.deepseek.com/v1'
const DEFAULT_MODEL = 'deepseek-chat'
// 本站自身地址取不到 llms-full.txt 时（例如请求走的是平台内部域名），退回到正式域名
const CANONICAL_ORIGIN = 'https://wiki.awmc.team'

const MAX_QUESTION_CHARS = 500
const MAX_HISTORY_MESSAGES = 6
const MAX_HISTORY_CHARS = 2000
const MAX_PAGE_CHARS = 12000
const MAX_CONTEXT_CHARS = 18000
const CHUNK_CHARS = 2500
const CORPUS_TTL_MS = 10 * 60 * 1000

// 单个边缘实例内的简单限流（不跨节点，只用来挡住最直接的刷接口）
const RATE_WINDOW_MS = 10 * 60 * 1000
const RATE_MAX_REQUESTS = 20
const rateBuckets = new Map()

let corpusCache = null // { origin, loadedAt, chunks }

const SYSTEM_PROMPT = `你是 AWMC 文档站（wiki.awmc.team）的问答助手。AWMC 提供舞萌 DX 查分 QQ 机器人（AWMC Bot）、谱面下载站、谱面预览以及若干开发者 API。

规则：
1. 只根据下面 <docs> 里提供的文档内容回答，不要编造文档里没有的指令、参数、价格或接口。
2. 文档里找不到答案时，直接说明「文档里没有提到」，并建议用户去 AWMC 论坛 https://bbs.wmc.pub 发帖或在交流群里咨询。
3. 回答要简洁，优先给出可以直接照做的步骤或指令；涉及指令、参数、接口路径时用 Markdown 代码格式。
4. 在回答末尾用 Markdown 链接列出你参考的文档页面（使用 <docs> 中给出的页面地址，去掉末尾的 .md）。
5. 使用与用户提问相同的语言回答。`

// 兼容 https://api.deepseek.com、.../v1、.../v1/chat/completions 等写法
function resolveConfig(env) {
  const apiKey = ((env && env.AI_API_KEY) || '').trim()
  const baseUrl = ((env && env.AI_BASE_URL) || DEFAULT_BASE_URL)
    .trim()
    .replace(/\/+$/, '')
    .replace(/\/chat\/completions$/, '')
  const model = ((env && env.AI_MODEL) || DEFAULT_MODEL).trim()
  return { apiKey, baseUrl, model }
}

export async function onRequestGet({ request, env }) {
  const { apiKey, baseUrl, model } = resolveConfig(env)
  const origin = new URL(request.url).origin
  let docs
  try {
    const chunks = await loadCorpus(origin)
    docs = { ok: true, chunks: chunks.length, source: corpusCache.source }
  } catch (e) {
    docs = { ok: false, error: String(e && e.message ? e.message : e) }
  }
  return json({
    configured: Boolean(apiKey),
    baseUrl,
    model,
    endpoint: `${baseUrl}/chat/completions`,
    docs
  })
}

export async function onRequestPost({ request, env }) {
  const url = new URL(request.url)

  const origin = request.headers.get('origin')
  if (origin) {
    try {
      if (new URL(origin).host !== url.host) return json({ error: 'forbidden' }, 403)
    } catch {
      return json({ error: 'forbidden' }, 403)
    }
  }

  const { apiKey, baseUrl, model } = resolveConfig(env)
  if (!apiKey) return json({ error: 'not_configured' }, 503)

  const ip =
    request.headers.get('eo-connecting-ip') ||
    request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    'unknown'
  if (!allowRequest(ip)) return json({ error: 'rate_limited' }, 429)

  let body
  try {
    body = await request.json()
  } catch {
    return json({ error: 'bad_request' }, 400)
  }

  const question = typeof body?.question === 'string' ? body.question.trim() : ''
  if (!question) return json({ error: 'empty_question' }, 400)
  if (question.length > MAX_QUESTION_CHARS) return json({ error: 'question_too_long' }, 400)

  const history = Array.isArray(body.history)
    ? body.history
        .filter(
          (m) =>
            m &&
            (m.role === 'user' || m.role === 'assistant') &&
            typeof m.content === 'string'
        )
        .slice(-MAX_HISTORY_MESSAGES)
        .map((m) => ({ role: m.role, content: m.content.slice(0, MAX_HISTORY_CHARS) }))
    : []

  const pagePath = typeof body.page === 'string' ? body.page : ''

  const context = await buildContext(url.origin, question, history, pagePath)

  let upstream
  try {
    upstream = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model,
        stream: true,
        temperature: 0.3,
        messages: [
          { role: 'system', content: `${SYSTEM_PROMPT}\n\n<docs>\n${context}\n</docs>` },
          ...history,
          { role: 'user', content: question }
        ]
      })
    })
  } catch {
    return json({ error: 'upstream_unreachable' }, 502)
  }

  if (!upstream.ok || !upstream.body) {
    let detail = ''
    try {
      detail = (await upstream.text()).slice(0, 300)
    } catch {}
    return json({ error: 'upstream_error', status: upstream.status, detail }, 502)
  }

  return new Response(sseToText(upstream.body), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-store',
      'X-Content-Type-Options': 'nosniff'
    }
  })
}

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' }
  })
}

function allowRequest(ip) {
  const now = Date.now()
  const bucket = rateBuckets.get(ip)
  if (!bucket || now - bucket.start > RATE_WINDOW_MS) {
    rateBuckets.set(ip, { start: now, count: 1 })
    if (rateBuckets.size > 5000) {
      for (const [key, b] of rateBuckets) if (now - b.start > RATE_WINDOW_MS) rateBuckets.delete(key)
    }
    return true
  }
  bucket.count += 1
  return bucket.count <= RATE_MAX_REQUESTS
}

// 把上游的 OpenAI SSE 流转换成只包含回答正文的纯文本流
function sseToText(stream) {
  const decoder = new TextDecoder()
  const encoder = new TextEncoder()
  let buffer = ''
  return stream.pipeThrough(
    new TransformStream({
      transform(chunk, controller) {
        buffer += decoder.decode(chunk, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop()
        for (const line of lines) emitLine(line, controller)
      },
      flush(controller) {
        if (buffer) emitLine(buffer, controller)
      }
    })
  )

  function emitLine(line, controller) {
    const trimmed = line.trim()
    if (!trimmed.startsWith('data:')) return
    const data = trimmed.slice(5).trim()
    if (!data || data === '[DONE]') return
    try {
      const delta = JSON.parse(data).choices?.[0]?.delta?.content
      if (delta) controller.enqueue(encoder.encode(delta))
    } catch {
      // 忽略无法解析的行（心跳等）
    }
  }
}

// ---------------- 文档检索 ----------------

async function loadCorpus(origin) {
  const now = Date.now()
  if (corpusCache && corpusCache.origin === origin && now - corpusCache.loadedAt < CORPUS_TTL_MS) {
    return corpusCache.chunks
  }
  const errors = []
  for (const source of [...new Set([origin, CANONICAL_ORIGIN])]) {
    try {
      const res = await fetch(`${source}/llms-full.txt`)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const chunks = splitCorpus(await res.text())
      if (!chunks.length) throw new Error('empty')
      corpusCache = { origin, source, loadedAt: now, chunks }
      return chunks
    } catch (e) {
      errors.push(`${source}/llms-full.txt: ${e && e.message ? e.message : e}`)
    }
  }
  throw new Error(errors.join('; '))
}

// llms-full.txt 由若干个页面组成，每个页面以 `---\nurl: ...\n---` 开头
function splitCorpus(text) {
  const pages = []
  const re = /^---\nurl: (\S+)\n---\n/gm
  let match
  let last = null
  while ((match = re.exec(text))) {
    if (last) last.body = text.slice(last.start, match.index)
    last = { url: match[1], start: re.lastIndex }
    pages.push(last)
  }
  if (last) last.body = text.slice(last.start)

  const chunks = []
  for (const page of pages) {
    const title = (page.body.match(/^# (.+)$/m) || [])[1] || page.url
    const pagePath = new URL(page.url).pathname
    // 按二级及以下标题切段，过长的段再按长度切开
    const sections = page.body.split(/\n(?=#{2,4} )/)
    for (const section of sections) {
      const heading = (section.match(/^#{1,4} (.+)$/m) || [])[1] || title
      for (let i = 0; i < section.length; i += CHUNK_CHARS) {
        const content = section.slice(i, i + CHUNK_CHARS).trim()
        if (content) chunks.push({ url: page.url, path: pagePath, title, heading, content, lower: content.toLowerCase() })
      }
    }
  }
  return chunks
}

// 中文按二元组、英文/数字按单词切词
function tokenize(text) {
  const tokens = new Set()
  const lower = text.toLowerCase()
  for (const word of lower.match(/[a-z0-9][a-z0-9_.-]*/g) || []) {
    if (word.length >= 2) tokens.add(word)
  }
  for (const run of lower.match(/[㐀-鿿]+/g) || []) {
    if (run.length === 1) tokens.add(run)
    for (let i = 0; i < run.length - 1; i++) tokens.add(run.slice(i, i + 2))
  }
  return [...tokens]
}

function countOccurrences(haystack, needle) {
  let count = 0
  let idx = haystack.indexOf(needle)
  while (idx !== -1 && count < 20) {
    count++
    idx = haystack.indexOf(needle, idx + needle.length)
  }
  return count
}

function rankChunks(chunks, query) {
  const tokens = tokenize(query)
  if (!tokens.length) return []
  const n = chunks.length
  const idf = new Map()
  for (const token of tokens) {
    let df = 0
    for (const c of chunks) if (c.lower.includes(token)) df++
    if (df > 0) idf.set(token, Math.log(1 + n / df))
  }
  const scored = []
  for (const c of chunks) {
    let score = 0
    const headingLower = c.heading.toLowerCase()
    for (const [token, weight] of idf) {
      const tf = countOccurrences(c.lower, token)
      if (!tf) continue
      score += weight * (1 + Math.log(tf))
      if (headingLower.includes(token)) score += weight
    }
    if (score > 0) scored.push({ chunk: c, score: score / Math.sqrt(1 + c.content.length / 1000) })
  }
  return scored.sort((a, b) => b.score - a.score).map((s) => s.chunk)
}

async function buildContext(origin, question, history, pagePath) {
  // 文档取不到时也照常回答（只是没有检索结果），不让整个问答挂掉
  let chunks = []
  try {
    chunks = await loadCorpus(origin)
  } catch {}
  const parts = []
  let used = 0

  // 用户当前所在页面的原文优先放进去（问的多半是这一页）
  const page = await loadCurrentPage(origin, pagePath)
  if (page) {
    const text = page.text.slice(0, MAX_PAGE_CHARS)
    parts.push(`<page url="${page.url}" current="true">\n${text}\n</page>`)
    used += text.length
  }

  const lastUserTurn = [...history].reverse().find((m) => m.role === 'user')
  const query = lastUserTurn ? `${question} ${lastUserTurn.content}` : question
  for (const c of rankChunks(chunks, query)) {
    if (page && c.path === page.path) continue
    if (used + c.content.length > MAX_CONTEXT_CHARS) {
      if (used > MAX_CONTEXT_CHARS * 0.8) break
      continue
    }
    parts.push(`<page url="${c.url}" title="${c.title}">\n${c.content}\n</page>`)
    used += c.content.length
  }

  return parts.join('\n\n') || '（没有检索到相关文档）'
}

async function loadCurrentPage(origin, pagePath) {
  if (!/^\/[A-Za-z0-9/_-]*$/.test(pagePath)) return null
  const clean = pagePath.replace(/\.html$/, '').replace(/\/+$/, '')
  const mdPath = clean ? `${clean}.md` : '/index.md'
  try {
    const res = await fetch(`${origin}${mdPath}`)
    if (!res.ok) return null
    const type = res.headers.get('content-type') || ''
    if (type.includes('text/html')) return null
    const text = (await res.text()).replace(/^---\nurl: \S+\n---\n/, '')
    return { url: `${origin}${mdPath}`, path: mdPath, text }
  } catch {
    return null
  }
}
