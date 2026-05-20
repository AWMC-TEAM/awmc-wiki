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
    // en: {
    //   label: 'English',
    //   lang: 'en-US',
    //   link: '/en/',
    //   themeConfig: {
    //     lastUpdatedText: 'Last Updated',
    //     outline: {
    //       level: [2, 6],
    //       label: 'On this page'
    //     },
    //     nav: [
    //       { text: 'Home', link: '/en/' },
    //       { text: 'Guide', link: '/en/guide/introduction' },
    //       { text: 'Dev', link: '/en/dev/' }
    //     ],
    //     sidebar: {
    //       '/en/guide/': [
    //         {
    //           text: '📖 Guide',
    //           items: [
    //             { text: 'What is AWMC?', link: '/en/guide/introduction' },
    //             { text: 'Getting Started', link: '/en/guide/getting-started' }
    //           ]
    //         }
    //       ],
    //       '/en/dev/': [
    //         {
    //           text: '💻 Developers',
    //           items: [
    //             { text: 'Dev Overview', link: '/en/dev/' },
    //             { text: 'API Reference', link: '/en/dev/api' }
    //           ]
    //         }
    //       ]
    //     }
    //   }
    // }
  },

  themeConfig: {
    search: {
      provider: 'local'
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' },
      { icon: 'maildotru', link: 'mailto:awmc@awmc.cc' }
    ],
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2026-present AWMC'
    }
  }
})
