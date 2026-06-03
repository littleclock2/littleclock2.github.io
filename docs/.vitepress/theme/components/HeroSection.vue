<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const loaded = ref(false)
const scrollY = ref(0)
const mouse = ref({ x: 0, y: 0 })
const time = ref('00:00:00')
let timer = null

function updateTime() {
  const now = new Date()
  time.value = now.toTimeString().slice(0, 8)
}

function onScroll() {
  scrollY.value = window.scrollY
}

function onMouseMove(e) {
  mouse.value = { x: e.clientX, y: e.clientY }
}

onMounted(() => {
  requestAnimationFrame(() => { loaded.value = true })
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('mousemove', onMouseMove, { passive: true })
  timer = setInterval(updateTime, 1000)
  updateTime()
})

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('mousemove', onMouseMove)
  clearInterval(timer)
})
</script>

<template>
  <div :class="['t-hero', { 't-hero--loaded': loaded }]">
    <!-- 背景层 -->
    <div class="t-hero-bg">
      <div class="t-hero-grid"></div>
      <div class="t-hero-scanlines"></div>
      <!-- 渐变网格背景 -->
      <div class="t-hero-mesh"></div>
      <div class="t-hero-fog"></div>
    </div>

    <!-- 装饰几何元素 -->
    <div class="t-hero-deco">
      <div class="t-hero-yellow-block"></div>
      <div class="t-hero-diag t-hero-diag--1"></div>
      <div class="t-hero-diag t-hero-diag--2"></div>
      <div class="t-hero-diag t-hero-diag--3"></div>
      <div class="t-hero-vbar"></div>
      <div class="t-hero-hline"></div>
      <!-- 六边形装饰 -->
      <div class="t-hex t-hex--1"></div>
      <div class="t-hex t-hex--2"></div>
      <div class="t-hex t-hex--3"></div>
      <!-- 电路线装饰 -->
      <svg class="t-circuit" viewBox="0 0 400 300" fill="none">
        <path d="M0 150 H120 L140 130 H200 L220 150 H400" stroke="rgba(255,241,0,0.08)" stroke-width="1"/>
        <path d="M0 200 H80 L100 180 H160 L180 200 H300 L320 180 H400" stroke="rgba(255,241,0,0.05)" stroke-width="1"/>
        <circle cx="120" cy="150" r="3" fill="rgba(255,241,0,0.15)"/>
        <circle cx="220" cy="150" r="3" fill="rgba(255,241,0,0.15)"/>
        <circle cx="100" cy="180" r="2" fill="rgba(255,241,0,0.1)"/>
        <circle cx="320" cy="180" r="2" fill="rgba(255,241,0,0.1)"/>
      </svg>
    </div>

    <!-- 浮动粒子 -->
    <div class="t-hero-particles">
      <span v-for="i in 30" :key="i" class="t-particle" :style="{
        left: (i * 3.7 % 100) + '%',
        top: (i * 5.3 % 100) + '%',
        animationDelay: (i * 0.5) + 's',
        animationDuration: (3 + i % 6) + 's',
        width: (1 + i % 3) + 'px',
        height: (1 + i % 3) + 'px'
      }"></span>
    </div>

    <!-- 鼠标跟随光晕 -->
    <div class="t-hero-glow" :style="{
      left: mouse.x + 'px',
      top: mouse.y + 'px'
    }"></div>

    <!-- 水印文字 -->
    <div class="t-hero-watermark">YUNSWORD</div>
    <div class="t-hero-watermark t-hero-watermark--sub">TERMINUS</div>

    <!-- 坐标标签 -->
    <div class="t-hero-coord t-hero-coord--tl">
      <span class="t-coord-label">SYS</span>
      <span class="t-coord-sep">/</span>
      <span>{{ time }}</span>
    </div>
    <div class="t-hero-coord t-hero-coord--tr">
      <span>LAT 31.2° N</span>
      <span class="t-coord-sep">·</span>
      <span>LON 121.5° E</span>
    </div>
    <div class="t-hero-coord t-hero-coord--bl">
      <span>SECTOR-07</span>
      <span class="t-coord-sep">/</span>
      <span>TERMINUS OS v2.0</span>
    </div>
    <div class="t-hero-coord t-hero-coord--br">
      <span>X:{{ mouse.x }}</span>
      <span class="t-coord-sep">·</span>
      <span>Y:{{ mouse.y }}</span>
    </div>

    <!-- 角落装饰 -->
    <div class="t-corner t-corner--tl"></div>
    <div class="t-corner t-corner--tr"></div>
    <div class="t-corner t-corner--bl"></div>
    <div class="t-corner t-corner--br"></div>

    <!-- 底部状态栏 -->
    <div class="t-hero-statusbar">
      <span class="t-status-dot"></span>
      <span class="t-status-text">ONLINE</span>
      <span class="t-status-sep">|</span>
      <span class="t-status-text">MCU · EMBEDDED · HARDWARE</span>
      <span class="t-status-sep">|</span>
      <span class="t-status-text">NODE 07.ACTIVE</span>
    </div>
  </div>
</template>

<style scoped>
.t-hero {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
}

/* ═══ 背景 ═══════════════════════════════════════ */
.t-hero-bg { position: absolute; inset: 0; }

.t-hero-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(255,241,0,0.03) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255,241,0,0.03) 1px, transparent 1px);
  background-size: 80px 80px;
  opacity: 0;
  transition: opacity 2s ease;
}
.t-hero--loaded .t-hero-grid { opacity: 1; }

.t-hero-scanlines {
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    rgba(255,241,0,0.008) 2px,
    rgba(255,241,0,0.008) 4px
  );
  animation: t-scanline-scroll 8s linear infinite;
}

@keyframes t-scanline-scroll {
  from { background-position: 0 0; }
  to { background-position: 0 100px; }
}

/* 渐变网格背景 */
.t-hero-mesh {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(ellipse 50% 40% at 20% 50%, rgba(255,241,0,0.04) 0%, transparent 70%),
    radial-gradient(ellipse 40% 50% at 80% 30%, rgba(255,241,0,0.03) 0%, transparent 60%),
    radial-gradient(ellipse 60% 30% at 50% 80%, rgba(255,241,0,0.02) 0%, transparent 50%);
  opacity: 0;
  transition: opacity 3s ease 0.5s;
}
.t-hero--loaded .t-hero-mesh { opacity: 1; }

.t-hero-fog {
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse 80% 60% at 50% 100%, rgba(10,10,10,0) 0%, #0a0a0a 100%);
}

/* ═══ 装饰几何 ═══════════════════════════════════════ */
.t-hero-yellow-block {
  position: absolute;
  top: -15%;
  right: -8%;
  width: 40%;
  height: 130%;
  background: var(--ef-yellow);
  transform: skewX(-10deg);
  opacity: 0;
  transition: opacity 1.5s ease 0.3s;
}
.t-hero--loaded .t-hero-yellow-block { opacity: 0.04; }

.t-hero-diag {
  position: absolute;
  width: 1px;
  background: rgba(255,241,0,0.06);
  transform-origin: top center;
  opacity: 0;
  transition: opacity 1.2s ease;
}
.t-hero--loaded .t-hero-diag { opacity: 1; }

.t-hero-diag--1 { top: -20%; right: 28%; height: 150%; transform: rotate(12deg); }
.t-hero-diag--2 { top: -10%; right: 35%; height: 130%; transform: rotate(8deg); }
.t-hero-diag--3 { top: -5%; right: 22%; height: 120%; transform: rotate(15deg); background: rgba(255,241,0,0.03); }

.t-hero-vbar {
  position: absolute;
  left: 6%;
  top: 8%;
  bottom: 25%;
  width: 2px;
  background: linear-gradient(180deg, transparent, var(--ef-yellow) 25%, var(--ef-yellow) 75%, transparent);
  opacity: 0;
  transition: opacity 1s ease 0.5s;
}
.t-hero--loaded .t-hero-vbar { opacity: 0.4; }

.t-hero-hline {
  position: absolute;
  left: 6%;
  width: 25%;
  height: 1px;
  bottom: 30%;
  background: linear-gradient(90deg, var(--ef-yellow), rgba(255,241,0,0.2) 50%, transparent);
  opacity: 0;
  transition: opacity 1s ease 0.7s;
}
.t-hero--loaded .t-hero-hline { opacity: 0.4; }

/* 六边形 */
.t-hex {
  position: absolute;
  width: 60px;
  height: 35px;
  background: transparent;
  border: 1px solid rgba(255,241,0,0.06);
  opacity: 0;
  transition: opacity 2s ease 1s;
  clip-path: polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%);
}
.t-hero--loaded .t-hex { opacity: 1; }
.t-hex--1 { top: 20%; right: 15%; animation: t-hex-float 6s ease-in-out infinite; }
.t-hex--2 { top: 60%; right: 40%; width: 40px; height: 23px; animation: t-hex-float 8s ease-in-out infinite 1s; }
.t-hex--3 { top: 40%; left: 15%; width: 50px; height: 29px; animation: t-hex-float 7s ease-in-out infinite 2s; }

@keyframes t-hex-float {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-10px) rotate(5deg); }
}

/* 电路线 */
.t-circuit {
  position: absolute;
  bottom: 15%;
  left: 0;
  width: 100%;
  height: 300px;
  opacity: 0;
  transition: opacity 2s ease 0.8s;
}
.t-hero--loaded .t-circuit { opacity: 1; }

/* ═══ 粒子 ═══════════════════════════════════════ */
.t-hero-particles { position: absolute; inset: 0; }

.t-particle {
  position: absolute;
  background: var(--ef-yellow);
  opacity: 0;
  animation: t-float linear infinite;
}

@keyframes t-float {
  0% { opacity: 0; transform: translateY(0) scale(1); }
  20% { opacity: 0.5; }
  80% { opacity: 0.5; }
  100% { opacity: 0; transform: translateY(-100px) scale(0.3); }
}

/* ═══ 鼠标光晕 ═══════════════════════════════════════ */
.t-hero-glow {
  position: fixed;
  width: 500px;
  height: 500px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255,241,0,0.05) 0%, transparent 70%);
  transform: translate(-50%, -50%);
  pointer-events: none;
  z-index: 1;
  transition: left 0.15s ease-out, top 0.15s ease-out;
}

/* ═══ 水印 ═══════════════════════════════════════ */
.t-hero-watermark {
  position: absolute;
  font-family: 'Inter', sans-serif;
  font-weight: 900;
  letter-spacing: 10px;
  text-transform: uppercase;
  white-space: nowrap;
  user-select: none;
  opacity: 0;
  transition: opacity 2.5s ease 0.8s;
}
.t-hero--loaded .t-hero-watermark { opacity: 1; }

.t-hero-watermark:not(.t-hero-watermark--sub) {
  top: 6%;
  right: -3%;
  font-size: clamp(80px, 15vw, 220px);
  color: rgba(255,255,255,0.02);
}

.t-hero-watermark--sub {
  bottom: 18%;
  left: -2%;
  font-size: clamp(40px, 8vw, 120px);
  color: rgba(255,255,255,0.015);
  letter-spacing: 20px;
}

/* ═══ 坐标标签 ═══════════════════════════════════════ */
.t-hero-coord {
  position: absolute;
  font-family: 'Share Tech Mono', monospace;
  font-size: 10px;
  letter-spacing: 2px;
  color: rgba(255,241,0,0.2);
  display: flex;
  align-items: center;
  gap: 6px;
  opacity: 0;
  transition: opacity 0.8s ease 1.2s;
}
.t-hero--loaded .t-hero-coord { opacity: 1; }

.t-coord-label { color: var(--ef-yellow); font-weight: 700; }
.t-coord-sep { color: rgba(255,241,0,0.1); }

.t-hero-coord--tl { top: 28px; left: 6%; }
.t-hero-coord--tr { top: 28px; right: 6%; }
.t-hero-coord--bl { bottom: 60px; left: 6%; }
.t-hero-coord--br { bottom: 60px; right: 6%; }

/* ═══ 角落装饰 ═══════════════════════════════════════ */
.t-corner {
  position: absolute;
  width: 20px;
  height: 20px;
  opacity: 0;
  transition: opacity 1s ease 1s;
}
.t-hero--loaded .t-corner { opacity: 1; }
.t-corner::before, .t-corner::after { content: ''; position: absolute; background: var(--ef-yellow); }
.t-corner::before { width: 1px; height: 100%; }
.t-corner::after { width: 100%; height: 1px; }

.t-corner--tl { top: 20px; left: 20px; }
.t-corner--tl::before { top: 0; left: 0; }
.t-corner--tl::after { top: 0; left: 0; }
.t-corner--tr { top: 20px; right: 20px; }
.t-corner--tr::before { top: 0; right: 0; }
.t-corner--tr::after { top: 0; right: 0; }
.t-corner--bl { bottom: 20px; left: 20px; }
.t-corner--bl::before { bottom: 0; left: 0; }
.t-corner--bl::after { bottom: 0; left: 0; }
.t-corner--br { bottom: 20px; right: 20px; }
.t-corner--br::before { bottom: 0; right: 0; }
.t-corner--br::after { bottom: 0; right: 0; }

/* ═══ 底部状态栏 ═══════════════════════════════════════ */
.t-hero-statusbar {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  gap: 10px;
  font-family: 'Share Tech Mono', monospace;
  font-size: 9px;
  letter-spacing: 2px;
  color: rgba(255,241,0,0.3);
  opacity: 0;
  transition: opacity 1s ease 1.5s;
}
.t-hero--loaded .t-hero-statusbar { opacity: 1; }

.t-status-dot {
  width: 5px;
  height: 5px;
  background: #00ffa2;
  box-shadow: 0 0 8px rgba(0,255,162,0.5);
  animation: t-pulse 2s ease-in-out infinite;
}

@keyframes t-pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}

.t-status-text { text-transform: uppercase; }
.t-status-sep { color: rgba(255,241,0,0.1); }
</style>
