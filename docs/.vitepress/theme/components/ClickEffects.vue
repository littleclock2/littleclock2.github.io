<script setup>
import { onMounted, onUnmounted } from 'vue'

const PARTICLE_COUNT = 12
const DURATION = 600

function createBurst(x, y) {
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const p = document.createElement('div')
    p.className = 't-click-particle'

    const angle = (Math.PI * 2 / PARTICLE_COUNT) * i + (Math.random() - 0.5) * 0.5
    const distance = 30 + Math.random() * 50
    const size = 2 + Math.random() * 3
    const duration = DURATION + Math.random() * 200

    const dx = Math.cos(angle) * distance
    const dy = Math.sin(angle) * distance

    p.style.left = x + 'px'
    p.style.top = y + 'px'
    p.style.width = size + 'px'
    p.style.height = size + 'px'
    p.style.setProperty('--dx', dx + 'px')
    p.style.setProperty('--dy', dy + 'px')
    p.style.animationDuration = duration + 'ms'

    document.body.appendChild(p)
    setTimeout(() => p.remove(), duration)
  }

  // 中心闪光
  const flash = document.createElement('div')
  flash.className = 't-click-flash'
  flash.style.left = x + 'px'
  flash.style.top = y + 'px'
  document.body.appendChild(flash)
  setTimeout(() => flash.remove(), 300)
}

function onClick(e) {
  if (e.target.closest('button, a, input, textarea, select')) return
  createBurst(e.clientX, e.clientY)
}

onMounted(() => {
  document.addEventListener('click', onClick, { passive: true })
})

onUnmounted(() => {
  document.removeEventListener('click', onClick)
})
</script>

<template></template>

<style>
/* 粒子爆裂点击特效 */
.t-click-particle {
  position: fixed;
  z-index: 99999;
  pointer-events: none;
  background: var(--ef-yellow);
  border-radius: 50%;
  box-shadow: 0 0 6px rgba(255,241,0,0.6);
  animation: t-particle-burst ease-out forwards;
}

@keyframes t-particle-burst {
  0% {
    opacity: 1;
    transform: translate(-50%, -50%) translate(0, 0) scale(1);
  }
  100% {
    opacity: 0;
    transform: translate(-50%, -50%) translate(var(--dx), var(--dy)) scale(0);
  }
}

/* 中心闪光 */
.t-click-flash {
  position: fixed;
  z-index: 99999;
  pointer-events: none;
  width: 8px;
  height: 8px;
  margin-left: -4px;
  margin-top: -4px;
  background: #fff;
  border-radius: 50%;
  box-shadow: 0 0 20px rgba(255,241,0,0.8), 0 0 40px rgba(255,241,0,0.4);
  animation: t-flash-out 0.3s ease-out forwards;
}

@keyframes t-flash-out {
  0% {
    opacity: 1;
    transform: scale(1);
  }
  100% {
    opacity: 0;
    transform: scale(3);
  }
}
</style>
