import assert from 'node:assert/strict'
import test from 'node:test'
import { aiProviders, openInProvider } from './providers.mjs'

function browserHarness(clipboard) {
  const oldWindow = globalThis.window
  const oldNavigator = Object.getOwnPropertyDescriptor(globalThis, 'navigator')
  const opened = []
  globalThis.window = { open: (...args) => opened.push(args) }
  Object.defineProperty(globalThis, 'navigator', { configurable: true, value: { clipboard } })
  return {
    opened,
    restore() {
      if (oldWindow === undefined) delete globalThis.window
      else globalThis.window = oldWindow
      if (oldNavigator) Object.defineProperty(globalThis, 'navigator', oldNavigator)
      else delete globalThis.navigator
    }
  }
}

test('domestic AI services are first and do not claim unsupported prompt URLs', () => {
  assert.deepEqual(aiProviders.slice(0, 3).map(({ name }) => name), ['DeepSeek', '豆包', 'Kimi'])
  for (const provider of aiProviders.slice(0, 3)) {
    assert.equal(provider.mode, 'clipboard')
    assert.equal(new URL(provider.url).search, '')
  }
})

test('copy-based launch keeps the prompt out of the URL and opens before copy completes', async () => {
  let finishCopy
  let copiedText
  const browser = browserHarness({ writeText: (text) => {
    copiedText = text
    return new Promise((resolve) => { finishCopy = resolve })
  } })
  try {
    const provider = { name: 'DeepSeek', url: 'https://chat.deepseek.com/', mode: 'clipboard' }
    const prompt = '请阅读 https://wiki.awmc.team/guide/bot/intro.md\n怎么绑定？'
    const pending = openInProvider(provider, prompt)
    assert.deepEqual(browser.opened, [[provider.url, '_blank', 'noopener']])
    assert.equal(copiedText, prompt)
    finishCopy()
    assert.equal(await pending, 'copied')
  } finally {
    browser.restore()
  }
})

test('copy rejection still opens the service and returns a manual-copy outcome', async () => {
  const browser = browserHarness({ writeText: async () => { throw new Error('denied') } })
  try {
    assert.equal(await openInProvider({ url: 'https://www.kimi.com/', mode: 'clipboard' }, '文档'), 'copy_failed')
    assert.equal(browser.opened[0][0], 'https://www.kimi.com/')
  } finally {
    browser.restore()
  }
})

test('unavailable clipboard still opens the service and reports copy failure', async () => {
  const browser = browserHarness(undefined)
  try {
    assert.equal(await openInProvider({ url: 'https://www.doubao.com/chat/', mode: 'clipboard' }, '文档'), 'copy_failed')
    assert.equal(browser.opened.length, 1)
  } finally {
    browser.restore()
  }
})

test('prefill services retain encoded prompts without touching the clipboard', async () => {
  const browser = browserHarness({ writeText: () => { throw new Error('must not copy') } })
  try {
    const provider = aiProviders.find(({ name }) => name === 'ChatGPT')
    const prompt = 'AWMC 文档? & # /'
    assert.equal(await openInProvider(provider, prompt), 'opened')
    assert.deepEqual(browser.opened[0], [provider.url + encodeURIComponent(prompt), '_blank', 'noopener'])
  } finally {
    browser.restore()
  }
})
