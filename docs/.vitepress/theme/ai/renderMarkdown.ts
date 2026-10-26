// AI 回答用的极简 Markdown 渲染：先整体转义 HTML，再处理代码块、行内代码、粗体、链接和列表。
// 只认 http(s) 与站内相对链接，回答内容里的任何 HTML 都不会被执行。

function escapeHtml(s: string) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

function renderInline(text: string) {
  const codes: string[] = []
  let out = text.replace(/`([^`\n]+)`/g, (_, code) => {
    codes.push(`<code>${code}</code>`)
    return `\u0000${codes.length - 1}\u0000`
  })
  out = out
    .replace(/\*\*([^*\n]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\[([^\]\n]+)\]\(((?:https?:\/\/|\/)[^\s)]+)\)/g, (_, label, href) => {
      const external = /^https?:/.test(href) && !href.startsWith(location.origin)
      return `<a href="${href}"${external ? ' target="_blank" rel="noopener"' : ''}>${label}</a>`
    })
    .replace(/(^|[\s(（])(https?:\/\/[^\s<)）]+)/g, '$1<a href="$2" target="_blank" rel="noopener">$2</a>')
  return out.replace(/\u0000(\d+)\u0000/g, (_, i) => codes[Number(i)])
}

export function renderMarkdown(source: string) {
  const escaped = escapeHtml(source)
  const blocks = escaped.split(/```[^\n]*\n?([\s\S]*?)(?:```|$)/)
  let html = ''
  blocks.forEach((block, i) => {
    if (i % 2 === 1) {
      html += `<pre><code>${block.replace(/\n$/, '')}</code></pre>`
      return
    }
    let list: 'ul' | 'ol' | null = null
    const closeList = () => {
      if (list) html += `</${list}>`
      list = null
    }
    for (const raw of block.split('\n')) {
      const line = raw.trimEnd()
      const ul = line.match(/^\s*[-*]\s+(.*)$/)
      const ol = line.match(/^\s*\d+[.)]\s+(.*)$/)
      const heading = line.match(/^#{1,6}\s+(.*)$/)
      if (ul || ol) {
        const kind = ul ? 'ul' : 'ol'
        if (list !== kind) {
          closeList()
          html += `<${kind}>`
          list = kind
        }
        html += `<li>${renderInline((ul || ol)![1])}</li>`
      } else if (heading) {
        closeList()
        html += `<p><strong>${renderInline(heading[1])}</strong></p>`
      } else if (line.trim()) {
        closeList()
        html += `<p>${renderInline(line)}</p>`
      } else {
        closeList()
      }
    }
    closeList()
  })
  return html
}
