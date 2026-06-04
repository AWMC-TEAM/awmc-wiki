import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "AWMC Bot & Services",
  description: "AWMC Bot 及其相关服务的官方帮助文档",
  cleanUrls: true,
  lastUpdated: true,

  head: [
    ['link', { rel: 'icon', href: '/favicon.ico' }], // 这里引用 public 目录下的 favicon.ico
    [
      'script',
      { 
        async: '', 
        defer: '', 
        src: 'https://s.awmc.cc/script.js', 
        'data-website-id': '0f856a4e-ed22-4f01-9071-74c373477974' 
      }
    ],
    [
      'script',
      {
        src: '//js.llk.hk',
        'data-site-id': '4f76f700',
        async: ''
      }
    ],
    [
      'script',
      {},
      `if(location.hostname.endsWith('awmc.cc')){document.addEventListener('DOMContentLoaded',function(){var t=setInterval(function(){var f=document.querySelector('.VPFooter');if(!f)return;clearInterval(t);var d=document.createElement('div');d.style.cssText='margin-top:8px;text-align:center;font-size:12px';d.innerHTML='<a href="https://beian.miit.gov.cn/" target="_blank" rel="noopener" style="color:var(--vp-c-text-2);text-decoration:none">晋ICP备2025069504号-7</a><span style="margin:0 4px;color:var(--vp-c-text-3)">|</span><img src="/images/gongan.png" alt="" style="width:14px;height:14px;vertical-align:middle;margin-right:2px"/><a href="https://beian.mps.gov.cn/#/query/webSearch?code=14070302000140" target="_blank" rel="noopener" style="color:var(--vp-c-text-2);text-decoration:none">晋公网安备14070302000140号</a>';f.querySelector('.container').appendChild(d)},200)})}`
    ]
  ],

  sitemap: {
    hostname: 'https://wiki.awmc.cc' // 开启 Sitemap 自动生成功能
  },

  locales: {
    root: {
      label: '简体中文',
      lang: 'zh-CN',
      themeConfig: {
        lastUpdatedText: '最后更新于',
        outline: {
          level: [2, 6],
          label: '本页大纲'
        },
        editLink: {
          pattern: 'https://github.com/Michaelwucoc/awmc-wiki/edit/main/docs/:path', // 记得改成你自己的仓库地址！
          text: '在 GitHub 上编辑此页'
        },
        nav: [
          { text: '首页', link: '/' },
          { text: '帮助文档', link: '/guide/introduction' },
          { text: '开发指南', link: '/dev/' }
        ],
        sidebar: {
          '/guide/': [
            {
              text: '📖 基础指南',
              items: [
                { text: 'AWMC 是什么?', link: '/guide/introduction' },
                { text: '快速开始', link: '/guide/getting-started' },
                { text: '更新日志', link: '/guide/update' }
              ]
            },
            {
              text: '🤖 AWMC BOT',
              items: [
                {text: '服务协议与隐私政策', link: '/guide/bot/terms'},
                { text: '基础教程', link: '/guide/bot/intro' },
                { text: '进阶教程', link: '/guide/bot/advanced' },
                { text: '术语解释', link: '/guide/bot/explain' },
                { text: '指令调用', link: '/guide/bot/commands'},
                { text: '授权获取', link: '/guide/bot/verify'},
              ]
            }
          ],
          '/dev/': [
            {
              text: '💻 开发者中心',
              items: [
                { text: '开发概览', link: '/dev/' },
              ]
            },
            {
              text: '📊 舞萌状态',
              items: [
                {text: '舞萌状态API', link: '/dev/status-api'},
              ]
            },
            {
              text: '🔧 AWMC API',
              items: [
                {text: 'AWMC 功能 API', link: '/dev/awmc-api'},
                {text: 'Assets 静态资源 API', link: '/dev/assets-api'}
              ]
            },
            {
              text: '🎵 谱面预览',
              items: [
                { text: '谱面预览', link: '/dev/chart-preview' }
              ]
            }
          ]
        }
      }
    },
    en: {
      label: 'English',
      lang: 'en-US',
      link: '/en/',
      themeConfig: {
        lastUpdatedText: 'Last Updated',
        outline: {
          level: [2, 6],
          label: 'On this page'
        },
        editLink: {
          pattern: 'https://github.com/Michaelwucoc/awmc-wiki/edit/main/docs/:path',
          text: 'Edit this page on GitHub'
        },
        nav: [
          { text: 'Home', link: '/en/' },
          { text: 'Guide', link: '/en/guide/introduction' },
          { text: 'Dev', link: '/en/dev/' }
        ],
        sidebar: {
          '/en/guide/': [
            {
              text: '📖 Guide',
              items: [
                { text: 'What is AWMC?', link: '/en/guide/introduction' },
                { text: 'Getting Started', link: '/en/guide/getting-started' },
                { text: 'Changelog', link: '/en/guide/update' }
              ]
            },
            {
              text: '🤖 AWMC BOT',
              items: [
                { text: 'Terms of Service & Privacy', link: '/en/guide/bot/terms' },
                { text: 'Basic Tutorial', link: '/en/guide/bot/intro' },
                { text: 'Advanced Tutorial', link: '/en/guide/bot/advanced' },
                { text: 'Terminology', link: '/en/guide/bot/explain' },
                { text: 'Commands', link: '/en/guide/bot/commands' },
                { text: 'Authorization', link: '/en/guide/bot/verify' }
              ]
            }
          ],
          '/en/dev/': [
            {
              text: '💻 Developer Center',
              items: [
                { text: 'Dev Overview', link: '/en/dev/' }
              ]
            },
            {
              text: '📊 Status',
              items: [
                { text: 'Status API', link: '/en/dev/status-api' }
              ]
            },
            {
              text: '🔧 AWMC API',
              items: [
                { text: 'AWMC Public API', link: '/en/dev/awmc-api' },
                { text: 'Assets Static Resource API', link: '/en/dev/assets-api' }
              ]
            },
            {
              text: '🎵 Chart Preview',
              items: [
                { text: 'Chart Preview', link: '/en/dev/chart-preview' }
              ]
            }
          ]
        }
      }
    }
  },

  themeConfig: {
    search: {
      provider: 'local'
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/Michaelwucoc/awmc-wiki' },
      { icon: 'maildotru', link: 'mailto:awmc@awmc.cc' }
    ],
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2026-present AWMC'
    }
  }
})
