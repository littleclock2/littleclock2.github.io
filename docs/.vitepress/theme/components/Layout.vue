<script setup>
import { useData } from 'vitepress'
import { ref, onMounted } from 'vue'
import DefaultTheme from 'vitepress/theme'
import HeroSection from './HeroSection.vue'

const { frontmatter } = useData()
const { Layout: DefaultLayout } = DefaultTheme

const stats = ref([
  { label: 'PROJECTS', value: '6+', icon: '◆' },
  { label: 'COMMITS', value: '200+', icon: '◈' },
  { label: 'STAR', value: '15+', icon: '◇' },
  { label: 'LANGUAGES', value: '5', icon: '◉' },
])
</script>

<template>
  <DefaultLayout>
    <template #home-hero-before>
      <HeroSection />
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
            <span class="t-section-label">LATEST TRANSMISSIONS</span>
            <span class="t-section-line"></span>
          </div>
          <div class="t-section-body">
            <div class="t-transmission-list">
              <a href="/blog/stm32-frequency-measurement" class="t-transmission">
                <span class="t-tx-num">01</span>
                <span class="t-tx-status"></span>
                <span class="t-tx-id">TX-001</span>
                <span class="t-tx-title">STM32 频率测量实践</span>
                <span class="t-tx-date">2026-05-26</span>
                <span class="t-tx-tag">STM32</span>
                <span class="t-tx-arrow">→</span>
              </a>
              <a href="/blog/mspm0-lc-meter" class="t-transmission">
                <span class="t-tx-num">02</span>
                <span class="t-tx-status"></span>
                <span class="t-tx-id">TX-002</span>
                <span class="t-tx-title">MSPM0 LC 表设计</span>
                <span class="t-tx-date">2026-05-26</span>
                <span class="t-tx-tag">MSPM0</span>
                <span class="t-tx-arrow">→</span>
              </a>
              <a href="/blog/ad9833-dds-signal-generator" class="t-transmission">
                <span class="t-tx-num">03</span>
                <span class="t-tx-status"></span>
                <span class="t-tx-id">TX-003</span>
                <span class="t-tx-title">AD9833 DDS 信号发生器</span>
                <span class="t-tx-date">2026-05-26</span>
                <span class="t-tx-tag">DDS</span>
                <span class="t-tx-arrow">→</span>
              </a>
            </div>
            <a href="/blog/" class="t-section-link">
              <span>VIEW ALL TRANSMISSIONS</span>
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
            <span class="t-section-label">ACTIVE MISSIONS</span>
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
                  <p class="t-mission-desc">STM32 基础外设示例集，包含频率测量等基础功能演示</p>
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
                  <p class="t-mission-desc">LC 表、信号发生器、万用表、功率分析仪等实用项目</p>
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
                  <p class="t-mission-desc">蓝牙通信工具、信号仿真器等 MCU 配套 Android 应用</p>
                  <div class="t-mission-tags">
                    <span class="t-mtag">Android</span>
                    <span class="t-mtag">Bluetooth</span>
                    <span class="t-mtag">Simulation</span>
                  </div>
                </div>
              </a>
            </div>
            <a href="/projects/" class="t-section-link">
              <span>VIEW ALL MISSIONS</span>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M3 7h8M8 3l3 4-3 4" stroke="currentColor" stroke-width="1.2"/>
              </svg>
            </a>
          </div>
        </section>
      </div>
    </template>
  </DefaultLayout>
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
@media (max-width: 768px) {
  .t-home-sections { padding: 40px 6% 80px; }
  .t-stats-grid { grid-template-columns: repeat(2, 1fr); }
  .t-mission-grid { grid-template-columns: 1fr; }
  .t-transmission { flex-wrap: wrap; gap: 8px; }
  .t-tx-date { display: none; }
  .t-tx-num { display: none; }
}
</style>
