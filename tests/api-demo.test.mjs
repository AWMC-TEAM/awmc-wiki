import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import vm from 'node:vm'
import test from 'node:test'

const source = await readFile(new URL('../docs/.vitepress/theme/components/ApiDemo.vue', import.meta.url), 'utf8')
const urlFunction = source.match(/const getFullUrl = \(\) => \{[\s\S]*?\n\}/)[0]
function buildUrl(path, values, encodePathParams) {
  return vm.runInNewContext(`${urlFunction}; getFullUrl()`, {
    currentApi: { value: { baseUrl: 'https://download.wmc.pub', path } },
    paramValues: { value: values },
    props: { encodePathParams },
    resolveParamsIn: () => 'query',
    URLSearchParams,
    encodeURIComponent
  })
}

test('cover demos encode each raw folder parameter rather than interpreting URL delimiters', () => {
  const url = new URL(buildUrl('/cdn/v1/img/:versionFolder/:songFolder', {
    versionFolder: 'BUDDiES', songFolder: '#song? A/B & C [DX]', w: '480'
  }, true))
  assert.equal(url.pathname, '/cdn/v1/img/BUDDiES/%23song%3F%20A%2FB%20%26%20C%20%5BDX%5D')
  assert.equal(url.hash, '')
  assert.equal(url.searchParams.get('w'), '480')
})

test('existing filename demos retain their intentional download query suffix', () => {
  assert.equal(buildUrl('/s/:shortid/:filename', { shortid: '011661', filename: 'track.mp3?dl=1' }, false),
    'https://download.wmc.pub/s/011661/track.mp3?dl=1')
})
