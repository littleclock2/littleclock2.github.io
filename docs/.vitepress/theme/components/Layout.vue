<script setup>
import { useData, useRoute } from 'vitepress'
import { ref, computed, onMounted, watch, nextTick } from 'vue'
import DefaultTheme from 'vitepress/theme'
import HeroSection from './HeroSection.vue'
import ClickEffects from './ClickEffects.vue'
import { useI18n } from '../composables/useI18n.js'

const { frontmatter } = useData()
const route = useRoute()
const { Layout: DefaultLayout } = DefaultTheme
const { locale, t, T } = useI18n()

const stats = computed(() => [
  { label: T.value.stats.projects, value: '6+', icon: '◆' },
  { label: T.value.stats.commits, value: '200+', icon: '◈' },
  { label: T.value.stats.star, value: '15+', icon: '◇' },
  { label: T.value.stats.languages, value: '5', icon: '◉' },
])

const blogPosts = ref([])

onMounted(async () => {
  try {
    const res = await fetch('/blog-list.json')
    if (res.ok) blogPosts.value = await res.json()
  } catch {}
})

function patchHomeContent() {
  if (typeof document === 'undefined') return
  const tagline = document.querySelector('.VPHero .tagline')
  if (tagline) tagline.textContent = t('home.hero.tagline')
  const buttons = document.querySelectorAll('.VPHero .actions .action')
  if (buttons[0]) { const btn = buttons[0].querySelector('.VPButton'); if (btn) btn.textContent = t('home.hero.blogBtn') }
  if (buttons[1]) { const btn = buttons[1].querySelector('.VPButton'); if (btn) btn.textContent = t('home.hero.projectBtn') }
  const titles = document.querySelectorAll('.VPFeature .title')
  const details = document.querySelectorAll('.VPFeature .details')
  const keys = ['stm32', 'mspm0', 'android', 'hardware']
  titles.forEach((el, i) => { if (keys[i]) el.textContent = t(`home.features.${keys[i]}.title`) })
  details.forEach((el, i) => { if (keys[i]) el.textContent = t(`home.features.${keys[i]}.details`) })
}

function patchProjectContent() {
  if (typeof document === 'undefined') return
  const cards = document.querySelectorAll('.ef-project')
  const keys = ['stm32Examples', 'stm32Projects', 'mspm0Examples', 'mspm0Projects', 'androidApps', 'superOtto']
  cards.forEach((card, i) => {
    if (!keys[i]) return
    const desc = card.querySelector('.ef-project-desc')
    if (desc) desc.textContent = t(`projects.${keys[i]}.desc`)
  })
}

function patchDocUI() {
  if (typeof document === 'undefined') return
  const outlineLabel = document.querySelector('.VPDoc .outline-title')
  if (outlineLabel) outlineLabel.textContent = t('doc.outlineLabel')
  const lastUpdated = document.querySelector('.VPLastUpdated span')
  if (lastUpdated) lastUpdated.textContent = t('doc.lastUpdated')
  const pagers = document.querySelectorAll('.VPDocFooter .pager')
  if (pagers[0]) { const title = pagers[0].querySelector('.title'); if (title) title.textContent = t('doc.prev') }
  if (pagers[1]) { const title = pagers[1].querySelector('.title'); if (title) title.textContent = t('doc.next') }
}

function patchNavBar() {
  if (typeof document === 'undefined') return
  const navLinks = document.querySelectorAll('.VPNavBarMenuLink > span')
  const navKeys = ['home', 'blog', 'projects', 'editor', 'about']
  navLinks.forEach((el, i) => { if (navKeys[i]) el.textContent = t(`nav.${navKeys[i]}`) })
}

function patchAll() {
  nextTick(() => { patchHomeContent(); patchProjectContent(); patchDocUI(); patchNavBar() })
}

onMounted(patchAll)
watch(locale, patchAll)
watch(() => route.path, patchAll)
</script>

<template>
  <DefaultLayout>
    <template #home-hero-before>
      <HeroSection />
    </template>
    <template #nav-bar-content-after>
      <LanguageSwitcher />
    </template>
    <template #home-features-after>
      <div v-if="frontmatter.layout === 'home'" class="t-home-sections">
        <!-- 系统状态统计 -->
        <section class="t-section t-stats-section">
          <div class="t-stats-grid">
            <div v-for="(s, i) in stats" :key="i" class="t-stat">
              <span class="t-stat-icon">{{ s.icon }}</span>
              <span class="t-stat-value">{{ s.value }}</span>
              <span class="t-stat-label">{{ s.label }}</span>
            </div>
          </div>
        </section>

        <!-- 分割线 -->
        <div class="t-divider">
          <span class="t-divider-line"></span>
          <span class="t-divider-dot"></span>
          <span class="t-divider-line"></span>
        </div>

        <!-- 最新传输 -->
        <section class="t-section">
          <div class="t-section-header">
            <span class="t-section-bar"></span>
            <span class="t-section-label">{{ T.home.transmissions.latest }}</span>
            <span class="t-section-line"></span>
          </div>
          <div class="t-section-body">
            <div class="t-transmission-list">
              <a v-for="post in blogPosts" :key="post.id" :href="post.link" class="t-transmission">
                <span class="t-tx-num">{{ post.num }}</span>
                <span class="t-tx-status"></span>
                <span class="t-tx-id">{{ post.id }}</span>
                <span class="t-tx-title">{{ post.title }}</span>
                <span class="t-tx-date">{{ post.date }}</span>
                <span class="t-tx-tag">{{ post.tag }}</span>
                <span class="t-tx-arrow">→</span>
              </a>
            </div>
            <a href="/blog/" class="t-section-link">
              <span>{{ T.home.transmissions.viewAll }}</span>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M3 7h8M8 3l3 4-3 4" stroke="currentColor" stroke-width="1.2"/>
              </svg>
            </a>
          </div>
        </section>

        <!-- 分割线 -->
        <div class="t-divider">
          <span class="t-divider-line"></span>
          <span class="t-divider-dot"></span>
          <span class="t-divider-line"></span>
        </div>

        <!-- 任务状态 -->
        <section class="t-section">
          <div class="t-section-header">
            <span class="t-section-bar"></span>
            <span class="t-section-label">{{ T.home.activeMissions }}</span>
            <span class="t-section-line"></span>
          </div>
          <div class="t-section-body">
            <div class="t-mission-grid">
              <a href="https://github.com/littleclock2/STM32-Examples" target="_blank" class="t-mission">
                <div class="t-mission-top"></div>
                <div class="t-mission-body">
                  <div class="t-mission-head">
                    <span class="t-mission-led t-led--active"></span>
                    <span class="t-mission-name">STM32-Examples</span>
                  </div>
                  <p class="t-mission-desc">{{ T.home.missions.stm32Examples.desc }}</p>
                  <div class="t-mission-tags">
                    <span class="t-mtag">STM32</span>
                    <span class="t-mtag">Embedded</span>
                    <span class="t-mtag">Examples</span>
                  </div>
                </div>
              </a>
              <a href="https://github.com/littleclock2/MSPM0-Projects" target="_blank" class="t-mission">
                <div class="t-mission-top"></div>
                <div class="t-mission-body">
                  <div class="t-mission-head">
                    <span class="t-mission-led t-led--active"></span>
                    <span class="t-mission-name">MSPM0-Projects</span>
                  </div>
                  <p class="t-mission-desc">{{ T.home.missions.mspm0Projects.desc }}</p>
                  <div class="t-mission-tags">
                    <span class="t-mtag">MSPM0</span>
                    <span class="t-mtag">Instruments</span>
                    <span class="t-mtag">Power</span>
                  </div>
                </div>
              </a>
              <a href="https://github.com/littleclock2/Android-Apps" target="_blank" class="t-mission">
                <div class="t-mission-top"></div>
                <div class="t-mission-body">
                  <div class="t-mission-head">
                    <span class="t-mission-led t-led--active"></span>
                    <span class="t-mission-name">Android-Apps</span>
                  </div>
                  <p class="t-mission-desc">{{ T.home.missions.androidApps.desc }}</p>
                  <div class="t-mission-tags">
                    <span class="t-mtag">Android</span>
                    <span class="t-mtag">Bluetooth</span>
                    <span class="t-mtag">Simulation</span>
                  </div>
                </div>
              </a>
            </div>
            <a href="/projects/" class="t-section-link">
              <span>{{ T.home.viewAllMissions }}</span>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M3 7h8M8 3l3 4-3 4" stroke="currentColor" stroke-width="1.2"/>
              </svg>
            </a>
          </div>
        </section>
      </div>
    </template>
  </DefaultLayout>
  <ClickEffects />
  <MusicPlayer />
</template>

<style scoped>
.t-home-sections {
  max-width: 1000px;
  margin: 0 auto;
  padding: 60px 6% 120px;
}

/* ═══ 统计区 ═══════════════════════════════════════ */
.t-stats-section {
  margin-bottom: 40px;
}

.t-stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 3px;
}

.t-stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 28px 16px;
  background: rgba(14,14,14,0.4);
  border: 1px solid rgba(255,241,0,0.04);
  transition: all 0.3s ease;
}

.t-stat:hover {
  background: rgba(20,20,20,0.7);
  border-color: rgba(255,241,0,0.1);
}

.t-stat-icon {
  color: var(--ef-yellow);
  font-size: 14px;
  opacity: 0.6;
}

.t-stat-value {
  font-family: 'Inter', sans-serif;
  font-weight: 900;
  font-size: 28px;
  color: #fff;
  letter-spacing: 2px;
}

.t-stat-label {
  font-family: 'Share Tech Mono', monospace;
  font-size: 9px;
  letter-spacing: 3px;
  color: rgba(255,241,0,0.4);
}

/* ═══ 分割线 ═══════════════════════════════════════ */
.t-divider {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 48px 0;
}

.t-divider-line {
  flex: 1;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255,241,0,0.1) 50%, transparent);
}

.t-divider-dot {
  width: 4px;
  height: 4px;
  background: var(--ef-yellow);
  opacity: 0.4;
  transform: rotate(45deg);
}

/* ═══ Section Header ═══════════════════════════════════════ */
.t-section { margin-bottom: 16px; }

.t-section-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 28px;
}

.t-section-bar {
  width: 3px;
  height: 16px;
  background: var(--ef-yellow);
  flex-shrink: 0;
}

.t-section-label {
  font-family: 'Inter', sans-serif;
  font-weight: 800;
  font-size: 12px;
  letter-spacing: 4px;
  color: rgba(255,255,255,0.5);
  text-transform: uppercase;
  flex-shrink: 0;
}

.t-section-line {
  flex: 1;
  height: 1px;
  background: linear-gradient(90deg, rgba(255,241,0,0.15), transparent);
}

/* ═══ Transmission List ═══════════════════════════════════════ */
.t-transmission-list {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.t-transmission {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px 20px;
  background: rgba(14,14,14,0.6);
  border: 1px solid rgba(255,241,0,0.04);
  text-decoration: none;
  transition: all 0.3s ease;
}

.t-transmission:hover {
  background: rgba(20,20,20,0.9);
  border-color: rgba(255,241,0,0.12);
  transform: translateX(4px);
}

.t-tx-num {
  font-family: 'Inter', sans-serif;
  font-weight: 900;
  font-size: 20px;
  color: rgba(255,241,0,0.1);
  min-width: 30px;
}

.t-tx-status {
  width: 6px;
  height: 6px;
  background: #00ffa2;
  box-shadow: 0 0 8px rgba(0,255,162,0.4);
  flex-shrink: 0;
}

.t-tx-id {
  font-family: 'Share Tech Mono', monospace;
  font-size: 10px;
  letter-spacing: 2px;
  color: rgba(255,241,0,0.4);
  min-width: 50px;
}

.t-tx-title {
  font-family: 'Source Sans 3', 'Noto Sans SC', sans-serif;
  font-size: 14px;
  font-weight: 600;
  color: #ccc;
  flex: 1;
  transition: color 0.3s ease;
}
.t-transmission:hover .t-tx-title { color: #fff; }

.t-tx-date {
  font-family: 'Share Tech Mono', monospace;
  font-size: 10px;
  color: #555;
  letter-spacing: 1px;
}

.t-tx-tag {
  font-family: 'Share Tech Mono', monospace;
  font-size: 9px;
  letter-spacing: 2px;
  color: var(--ef-yellow);
  border: 1px solid rgba(255,241,0,0.15);
  padding: 2px 8px;
  background: rgba(255,241,0,0.04);
}

.t-tx-arrow {
  color: #333;
  font-size: 14px;
  transition: all 0.3s ease;
}
.t-transmission:hover .t-tx-arrow {
  color: var(--ef-yellow);
  transform: translateX(4px);
}

/* ═══ Mission Grid ═══════════════════════════════════════ */
.t-mission-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 3px;
}

.t-mission {
  display: flex;
  flex-direction: column;
  background: rgba(14,14,14,0.6);
  border: 1px solid rgba(255,241,0,0.04);
  text-decoration: none;
  overflow: hidden;
  transition: all 0.3s ease;
}

.t-mission:hover {
  border-color: rgba(255,241,0,0.12);
  transform: translateY(-3px);
  box-shadow: 0 12px 40px rgba(0,0,0,0.3);
}

.t-mission-top {
  width: 100%;
  height: 3px;
  background: var(--ef-yellow);
  opacity: 0.6;
  transition: opacity 0.3s ease;
}
.t-mission:hover .t-mission-top { opacity: 1; }

.t-mission-body { padding: 20px; }

.t-mission-head {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.t-mission-led {
  width: 5px;
  height: 5px;
  flex-shrink: 0;
}
.t-led--active {
  background: #00ffa2;
  box-shadow: 0 0 8px rgba(0,255,162,0.4);
}

.t-mission-name {
  font-family: 'Inter', sans-serif;
  font-weight: 800;
  font-size: 13px;
  letter-spacing: 1px;
  color: #ddd;
  text-transform: uppercase;
}

.t-mission-desc {
  font-size: 12px;
  color: #777;
  line-height: 1.6;
  margin: 0 0 12px;
}

.t-mission-tags { display: flex; gap: 6px; }

.t-mtag {
  font-family: 'Share Tech Mono', monospace;
  font-size: 9px;
  letter-spacing: 1.5px;
  color: rgba(255,241,0,0.6);
  border: 1px solid rgba(255,241,0,0.1);
  padding: 2px 8px;
}

/* ═══ Section Link ═══════════════════════════════════════ */
.t-section-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-top: 24px;
  font-family: 'Source Sans 3', sans-serif;
  font-size: 11px;
  font-weight: 600;
  letter-spacing: 3px;
  color: #555;
  text-decoration: none;
  text-transform: uppercase;
  transition: all 0.3s ease;
}
.t-section-link:hover { color: var(--ef-yellow); }
.t-section-link svg { transition: transform 0.3s ease; }
.t-section-link:hover svg { transform: translateX(4px); }

/* ═══ Responsive ═══════════════════════════════════════ */
@media (max-width: 900px) {
  .t-stats-grid { grid-template-columns: repeat(3, 1fr); }
}
@media (max-width: 768px) {
  .t-home-sections { padding: 40px 6% 80px; }
  .t-stats-grid { grid-template-columns: repeat(2, 1fr); }
  .t-mission-grid { grid-template-columns: 1fr; }
  .t-transmission { flex-wrap: wrap; gap: 8px; }
  .t-tx-date { display: none; }
  .t-tx-num { display: none; }
}
</style>
