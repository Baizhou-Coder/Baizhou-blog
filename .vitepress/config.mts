import { defineConfig } from 'vitepress'

import { setSidebar } from './utils/auto-sidebar'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  // 部署到 GitHub Pages 子路径
  base: '/Baizhou-blog/',

  head: [['link', { rel: 'icon', href: '/Baizhou-blog/logo.svg' }],],
  title: "Baizhou-blog",
  description: "A VitePress Site",
  themeConfig: {
    outlineTitle: '目录',
    outline: [2,6],
    logo: '/Baizhou-blog/logo.svg',
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '主页', link: '/' },
      { text: '示例文档', link: '/markdown-examples' },
      { text: '后端', link: '/backend/java/'}
    ],

    sidebar: {
      "/backend/java/": setSidebar("backend/java"),
    },

    // sidebar: [
    //   {
    //     text: '目录',
    //     items: [
    //       { text: 'Markdown Examples', link: '/markdown-examples' },
    //       { text: 'Runtime API Examples', link: '/api-examples' }
    //     ]
    //   },
    //   {
    //     text: '学习ruoyi和yudao',
    //     items: [
    //       { text: 'yudao-boot-mini vs spring-boot/ruoyi-vue-pro 后端对比分析', link: '/yudao-boot-mini vs spring-boot ruoyi-vue-pro 后端对比分析' },
    //       { text: 'Runtime API示例', link: '/api-examples' }
    //     ]
    //   }
    // ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/Baizhou-Coder' },
      {
        icon: {
          svg: '<svg t="1774871088808" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="14302" width="200" height="200"><path d="M512 1024C229.2224 1024 0 794.7776 0 512S229.2224 0 512 0s512 229.2224 512 512-229.2224 512-512 512z m259.1488-568.8832H480.4096a25.2928 25.2928 0 0 0-25.2928 25.2928l-0.0256 63.2064c0 13.952 11.3152 25.2928 25.2672 25.2928h177.024c13.9776 0 25.2928 11.3152 25.2928 25.2672v12.6464a75.8528 75.8528 0 0 1-75.8528 75.8528H366.592a25.2928 25.2928 0 0 1-25.2672-25.2928v-240.1792a75.8528 75.8528 0 0 1 75.8272-75.8528h353.9456a25.2928 25.2928 0 0 0 25.2672-25.2928l0.0768-63.2064a25.2928 25.2928 0 0 0-25.2672-25.2928H417.152a189.6192 189.6192 0 0 0-189.6192 189.6448v353.9456c0 13.9776 11.3152 25.2928 25.2928 25.2928h372.9408a170.6496 170.6496 0 0 0 170.6496-170.6496v-145.408a25.2928 25.2928 0 0 0-25.2928-25.2672z" fill="#C71D23" p-id="14303"></path></svg>'
        },
        link: 'https://github.com/Baizhou-Coder'
      }
    ],

    // 设置搜索框的样式
    search: {
      provider: "local",
      options: {
        translations: {
          button: {
            buttonText: "搜索文档",
            buttonAriaLabel: "搜索文档"
          },
          modal: {
            noResultsText: "无法找到相关结果",
            resetButtonTitle: "清除查询条件",
            footer: {
              selectText: "选择",
              navigateText: "切换"
            }
          }
        }
      }
    },

    // 底部配置
    footer: {
      copyright: "@copyright@ 2026 Baizhou-coder"
    }
  }
})
