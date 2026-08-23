<script setup>
import { nextTick, onMounted, watch } from 'vue'
import { useData, useRoute } from 'vitepress'
import DefaultTheme from 'vitepress/theme'
import { data as posts } from '../../data/blog.data.mjs'
import HeroSection from './HeroSection.vue'
import LanguageSwitcher from './LanguageSwitcher.vue'
import MusicPlayer from './MusicPlayer.vue'
import { useI18n } from '../composables/useI18n.js'

const { frontmatter } = useData()
const route = useRoute()
const { Layout: DefaultLayout } = DefaultTheme
const { locale, t } = useI18n()

const featuredProjects = [
  {
    name: 'STM32-Examples',
    description: 'STM32 基础外设示例与频率测量实践。',
    url: 'https://github.com/littleclock2/STM32-Examples'
  },
  {
    name: 'MSPM0-Projects',
    description: 'LC 表、功率分析与信号发生器等仪器项目。',
    url: 'https://github.com/littleclock2/MSPM0-Projects'
  },
  {
    name: 'Android-Apps',
    description: '面向 MCU 开发的蓝牙通信与信号仿真工具。',
    url: 'https://github.com/littleclock2/Android-Apps'
  }
]

function patchHomeContent() {
  if (typeof document === 'undefined') return
  const tagline = document.querySelector('.VPHero .tagline')
  if (tagline) tagline.textContent = t('home.hero.tagline')
  const buttons = document.querySelectorAll('.VPHero .actions .action')
  const blogButton = buttons[0]?.querySelector('.VPButton')
  const projectButton = buttons[1]?.querySelector('.VPButton')
  if (blogButton) blogButton.textContent = t('home.hero.blogBtn')
  if (projectButton) projectButton.textContent = t('home.hero.projectBtn')
}

function patchProjectContent() {
  if (typeof document === 'undefined') return
  const cards = document.querySelectorAll('.ef-project')
  const keys = ['stm32Examples', 'stm32Projects', 'mspm0Examples', 'mspm0Projects', 'androidApps', 'superOtto']

  cards.forEach((card, index) => {
    if (!keys[index]) return
    const description = card.querySelector('.ef-project-desc')
    if (description) description.textContent = t(`projects.${keys[index]}.desc`)
  })
}

function patchDocUI() {
  if (typeof document === 'undefined') return
  const outlineLabel = document.querySelector('.VPDoc .outline-title')
  if (outlineLabel) outlineLabel.textContent = t('doc.outlineLabel')

  const lastUpdated = document.querySelector('.VPLastUpdated span')
  if (lastUpdated) lastUpdated.textContent = t('doc.lastUpdated')

  const pagers = document.querySelectorAll('.VPDocFooter .pager')
  const previousTitle = pagers[0]?.querySelector('.title')
  const nextTitle = pagers[1]?.querySelector('.title')
  if (previousTitle) previousTitle.textContent = t('doc.prev')
  if (nextTitle) nextTitle.textContent = t('doc.next')
}

function patchNavBar() {
  if (typeof document === 'undefined') return
  const navLinks = document.querySelectorAll('.VPNavBarMenuLink > span')
  const navKeys = ['home', 'blog', 'projects', 'about']
  navLinks.forEach((element, index) => {
    if (navKeys[index]) element.textContent = t(`nav.${navKeys[index]}`)
  })
}

function patchAll() {
  nextTick(() => {
    patchHomeContent()
    patchProjectContent()
    patchDocUI()
    patchNavBar()
  })
}

onMounted(patchAll)
watch(locale, patchAll)
watch(() => route.path, patchAll)
</script>

<template>
  <DefaultLayout>
    <template #home-hero-before>
      <HeroSection v-if="frontmatter.layout === 'home'" />
    </template>

    <template #nav-bar-content-after>
      <LanguageSwitcher />
    </template>

    <template #home-features-after>
      <main v-if="frontmatter.layout === 'home'" class="ys-home-sections">
        <section class="ys-home-section" aria-labelledby="latest-posts-title">
          <header class="ys-section-header">
            <div>
              <p class="ys-eyebrow">JOURNAL</p>
              <h2 id="latest-posts-title">最新文章</h2>
            </div>
            <a class="ys-text-link" href="/blog/">全部文章</a>
          </header>

          <div class="ys-home-posts">
            <a v-for="post in posts.slice(0, 3)" :key="post.url" :href="post.url" class="ys-home-post">
              <time :datetime="post.date">{{ post.date }}</time>
              <span class="ys-home-post-copy">
                <strong>{{ post.title }}</strong>
                <span>{{ post.description }}</span>
              </span>
            </a>
          </div>
        </section>

        <section class="ys-home-section" aria-labelledby="featured-projects-title">
          <header class="ys-section-header">
            <div>
              <p class="ys-eyebrow">WORKBENCH</p>
              <h2 id="featured-projects-title">项目选集</h2>
            </div>
            <a class="ys-text-link" href="/projects/">全部项目</a>
          </header>

          <div class="ys-home-projects">
            <a
              v-for="project in featuredProjects"
              :key="project.name"
              :href="project.url"
              class="ys-home-project"
              target="_blank"
              rel="noopener noreferrer"
            >
              <strong>{{ project.name }}</strong>
              <span>{{ project.description }}</span>
            </a>
          </div>
        </section>
      </main>
    </template>
  </DefaultLayout>
  <MusicPlayer />
</template>
