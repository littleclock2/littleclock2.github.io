<script setup>
import { useData } from 'vitepress'
import { ref, onMounted } from 'vue'

const { frontmatter } = useData()
const loaded = ref(false)

onMounted(() => {
  requestAnimationFrame(() => { loaded.value = true })
})
</script>

<template>
  <div v-if="frontmatter.layout === 'home'" :class="['ef-hero', { 'ef-hero--loaded': loaded }]">
    <!-- 斜条纹纹理 -->
    <div class="ef-hero-stripes"></div>
    <!-- 大型黄色斜块 -->
    <div class="ef-hero-yellow-block"></div>
    <!-- 水印文字 -->
    <div class="ef-hero-watermark">YUNSWORD</div>
    <!-- 左侧竖线 -->
    <div class="ef-hero-vbar"></div>
    <!-- 横线 -->
    <div class="ef-hero-hline"></div>
    <!-- 斜线 -->
    <div class="ef-hero-diagonal"></div>
    <!-- 坐标标签 -->
    <div class="ef-hero-coord ef-hero-coord--tl">X:0 Y:0</div>
    <div class="ef-hero-coord ef-hero-coord--br">X:1920 Y:1080</div>
  </div>
</template>

<style scoped>
.ef-hero {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  overflow: hidden;
}

/* 斜条纹 */
.ef-hero-stripes {
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(-55deg, rgba(255,241,0,0.015), rgba(255,241,0,0.015) 1px, transparent 1px, transparent 5px);
  opacity: 0;
  transition: opacity 2s ease;
}
.ef-hero--loaded .ef-hero-stripes { opacity: 1; }

/* 黄色大斜块 */
.ef-hero-yellow-block {
  position: absolute;
  top: -10%;
  right: -5%;
  width: 35%;
  height: 120%;
  background: var(--ef-yellow);
  transform: skewX(-8deg);
  opacity: 0;
  transition: opacity 1.2s ease 0.2s;
}
.ef-hero--loaded .ef-hero-yellow-block { opacity: 0.06; }

/* 水印 */
.ef-hero-watermark {
  position: absolute;
  top: 8%;
  right: -2%;
  font-family: 'Inter', sans-serif;
  font-weight: 900;
  font-size: clamp(80px, 14vw, 200px);
  letter-spacing: 8px;
  text-transform: uppercase;
  color: rgba(255,255,255,0.025);
  white-space: nowrap;
  user-select: none;
  opacity: 0;
  transition: opacity 2s ease 0.5s;
}
.ef-hero--loaded .ef-hero-watermark { opacity: 1; }

/* 竖线 */
.ef-hero-vbar {
  position: absolute;
  left: 6%;
  top: 10%;
  bottom: 30%;
  width: 2px;
  background: linear-gradient(180deg, transparent, var(--ef-yellow) 30%, var(--ef-yellow) 70%, transparent);
  opacity: 0;
  transition: opacity 1s ease 0.4s;
}
.ef-hero--loaded .ef-hero-vbar { opacity: 0.5; }

/* 横线 */
.ef-hero-hline {
  position: absolute;
  left: 6%;
  width: 30%;
  height: 1px;
  bottom: 35%;
  background: linear-gradient(90deg, var(--ef-yellow), rgba(255,241,0,0.3) 50%, transparent);
  opacity: 0;
  transition: opacity 1s ease 0.6s;
}
.ef-hero--loaded .ef-hero-hline { opacity: 0.5; }

/* 斜线 */
.ef-hero-diagonal {
  position: absolute;
  top: -10%;
  right: 25%;
  width: 1px;
  height: 130%;
  background: rgba(255,241,0,0.06);
  transform: rotate(12deg);
  transform-origin: top center;
  opacity: 0;
  transition: opacity 1.5s ease 0.3s;
}
.ef-hero--loaded .ef-hero-diagonal { opacity: 1; }

/* 坐标 */
.ef-hero-coord {
  position: absolute;
  font-family: 'Share Tech Mono', monospace;
  font-size: 10px;
  letter-spacing: 2px;
  color: rgba(255,241,0,0.18);
  opacity: 0;
  transition: opacity 0.8s ease 1s;
}
.ef-hero--loaded .ef-hero-coord { opacity: 1; }
.ef-hero-coord--tl { top: 30px; left: 6%; }
.ef-hero-coord--br { bottom: 30px; right: 6%; }
</style>
