import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'YunSword',
  description: '嵌入式开发与硬件探索 — YunSword',
  lang: 'zh-CN',
  lastUpdated: true,
  appearance: 'dark',

  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
    ['meta', { name: 'theme-color', content: '#0B0C0A' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }],
    ['link', { href: 'https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600;700&family=Inter:wght@400;700;900&family=Noto+Sans+SC:wght@300;400;500;700;900&family=Share+Tech+Mono&family=Source+Sans+3:wght@300;400;500;600;700;800&display=swap', rel: 'stylesheet' }],
  ],

  sitemap: {
    hostname: 'https://littleclock2.github.io'
  },

  themeConfig: {
    siteTitle: false,
    sidebar: false,

    nav: [
      { text: '首页', link: '/' },
      { text: '文章', link: '/blog/' },
      { text: '项目', link: '/projects/' },
      { text: '关于', link: '/about' },
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/littleclock2' },
    ],

    footer: {
      message: 'YUNSWORD',
      copyright: `© ${new Date().getFullYear()} YunSword`
    },

    editLink: {
      pattern: 'https://github.com/littleclock2/littleclock2.github.io/edit/main/docs/:path',
      text: '在 GitHub 上编辑'
    },

    search: {
      provider: 'local',
      options: {
        translations: {
          button: { buttonText: '搜索', buttonAriaLabel: '搜索' },
          modal: {
            noResultsText: '无匹配结果',
            resetButtonTitle: '重置',
            footer: { selectText: '选择', navigateText: '切换' }
          }
        }
      }
    },

    outline: { label: '页面导航' },
    lastUpdated: { text: '更新于' },
    docFooter: { prev: '上一篇', next: '下一篇' }
  }
})
