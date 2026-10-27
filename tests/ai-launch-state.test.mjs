import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import vm from 'node:vm'
import test from 'node:test'

for (const component of ['PageActions', 'AskAI']) {
  const source = await readFile(new URL(`../docs/.vitepress/theme/components/${component}.vue`, import.meta.url), 'utf8')
  const launch = source.match(/async function openIn\([\s\S]*?\n\}/)[0]
    .replace(/: AiProvider/g, '').replace(/: string/g, '')
  test(`${component}: an older clipboard result cannot overwrite a newer launch`, async () => {
    let finishOld
    const launchState = { value: 'idle' }
    const manualPrompt = { value: '' }
    const openIn = vm.runInNewContext(`let launchSequence = 0; ${launch}; openIn`, {
      launchState, manualPrompt, menuOpen: { value: true },
      t: { value: { prompt: () => 'page prompt' } }, markdownUrl: () => 'page.md',
      fallbackPrompt: (question) => question,
      openInProvider: (provider) => provider.name === 'old'
        ? new Promise((resolve) => { finishOld = resolve }) : Promise.resolve('opened')
    })
    const pending = openIn({ name: 'old' }, 'old prompt')
    await openIn({ name: 'new' }, 'new prompt')
    finishOld('copy_failed')
    await pending
    assert.equal(launchState.value, 'idle')
    assert.equal(manualPrompt.value, '')
  })
}
