<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { useI18n } from '../composables/useI18n.js'

const { T } = useI18n()
const STORAGE_KEY = 'terminus_music'
const MUSIC_SRC = '/bgm.mp3'

const isPlaying = ref(false)
const audio = ref(null)
const progress = ref(0)
const duration = ref(0)
const volume = ref(0.3)
const showVolume = ref(false)
const hasError = ref(false)

const progressPercent = computed(() => {
  if (!duration.value) return 0
  return (progress.value / duration.value) * 100
})

function initAudio() {
  audio.value = new Audio(MUSIC_SRC)
  audio.value.loop = true
  audio.value.volume = volume.value
  audio.value.preload = 'metadata'

  audio.value.addEventListener('loadedmetadata', () => {
    duration.value = audio.value.duration
  })

  audio.value.addEventListener('timeupdate', () => {
    progress.value = audio.value.currentTime
  })

  audio.value.addEventListener('error', () => {
    hasError.value = true
  })
}

function togglePlay() {
  if (!audio.value) initAudio()
  if (hasError.value) return

  if (isPlaying.value) {
    audio.value.pause()
    isPlaying.value = false
  } else {
    audio.value.play().then(() => {
      isPlaying.value = true
    }).catch(() => {
      hasError.value = true
    })
  }
  localStorage.setItem(STORAGE_KEY, isPlaying.value ? '1' : '0')
}

function setVolume(e) {
  const rect = e.currentTarget.getBoundingClientRect()
  const y = e.clientY - rect.top
  const pct = 1 - Math.max(0, Math.min(1, y / rect.height))
  volume.value = Math.round(pct * 100) / 100
  if (audio.value) audio.value.volume = volume.value
}

onMounted(() => {
  initAudio()
  if (localStorage.getItem(STORAGE_KEY) === '1') {
    setTimeout(() => {
      audio.value?.play().then(() => {
        isPlaying.value = true
      }).catch(() => {})
    }, 1000)
  }
})

onUnmounted(() => {
  if (audio.value) {
    audio.value.pause()
    audio.value.src = ''
  }
})
</script>

<template>
  <div
    class="ef-music"
    @mouseenter="showVolume = true"
    @mouseleave="showVolume = false"
  >
    <!-- Volume slider -->
    <Transition name="ef-music-vol">
      <div v-if="showVolume" class="ef-music-volume">
        <div class="ef-music-vol-track" @click="setVolume">
          <div class="ef-music-vol-fill" :style="{ height: (volume * 100) + '%' }"></div>
        </div>
        <span class="ef-music-vol-label">{{ Math.round(volume * 100) }}</span>
      </div>
    </Transition>

    <!-- Main toggle button -->
    <button
      class="ef-music-btn"
      :class="{ 'ef-music-btn--active': isPlaying, 'ef-music-btn--error': hasError }"
      @click="togglePlay"
      :title="hasError ? 'No BGM file' : (isPlaying ? 'Pause' : 'Play')"
    >
      <!-- Sound wave bars (playing) -->
      <div class="ef-music-bars" v-if="isPlaying">
        <span class="ef-music-bar"></span>
        <span class="ef-music-bar"></span>
        <span class="ef-music-bar"></span>
        <span class="ef-music-bar"></span>
        <span class="ef-music-bar"></span>
      </div>
      <!-- Play icon (paused) -->
      <svg v-else class="ef-music-icon" width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M5 3v12l10-6L5 3z" fill="currentColor"/>
      </svg>
    </button>

    <!-- Label -->
    <span class="ef-music-label" v-if="!hasError">BGM</span>

    <!-- Progress ring -->
    <svg class="ef-music-ring" width="52" height="52" viewBox="0 0 52 52">
      <circle cx="26" cy="26" r="24" fill="none" stroke="rgba(255,241,0,0.06)" stroke-width="1.5"/>
      <circle
        cx="26" cy="26" r="24"
        fill="none"
        stroke="rgba(255,241,0,0.3)"
        stroke-width="2"
        :stroke-dasharray="150.8"
        :stroke-dashoffset="150.8 - (150.8 * progressPercent / 100)"
        transform="rotate(-90 26 26)"
        stroke-linecap="round"
        style="transition: stroke-dashoffset 0.3s linear"
      />
    </svg>
  </div>
</template>

<style scoped>
.ef-music {
  position: fixed;
  bottom: 32px;
  right: 32px;
  z-index: 100;
  display: flex;
  align-items: center;
  gap: 8px;
}

.ef-music-ring {
  position: absolute;
  top: 50%;
  left: 26px;
  transform: translate(-50%, -50%);
  pointer-events: none;
}

.ef-music-btn {
  position: relative;
  z-index: 2;
  width: 52px;
  height: 52px;
  border-radius: 50%;
  border: 2px solid rgba(255,241,0,0.35);
  background: rgba(10,10,10,0.92);
  backdrop-filter: blur(16px);
  color: rgba(255,241,0,0.6);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  box-shadow: 0 0 24px rgba(0,0,0,0.5), inset 0 0 12px rgba(255,241,0,0.03);
}

.ef-music-btn:hover {
  border-color: rgba(255,241,0,0.6);
  color: var(--ef-yellow);
  box-shadow: 0 0 32px rgba(255,241,0,0.15), inset 0 0 16px rgba(255,241,0,0.06);
  transform: scale(1.05);
}

.ef-music-btn--active {
  border-color: rgba(255,241,0,0.5);
  color: var(--ef-yellow);
  box-shadow: 0 0 28px rgba(255,241,0,0.12), inset 0 0 14px rgba(255,241,0,0.05);
}

.ef-music-btn--error {
  opacity: 0.25;
  cursor: not-allowed;
}

.ef-music-icon {
  margin-left: 2px;
}

.ef-music-label {
  position: relative;
  z-index: 2;
  font-family: 'Share Tech Mono', monospace;
  font-size: 10px;
  letter-spacing: 3px;
  color: rgba(255,241,0,0.45);
  pointer-events: none;
}

.ef-music-btn--active ~ .ef-music-label {
  color: rgba(255,241,0,0.65);
}

/* Sound wave bars */
.ef-music-bars {
  display: flex;
  align-items: center;
  gap: 2.5px;
  height: 20px;
}

.ef-music-bar {
  width: 3px;
  background: var(--ef-yellow);
  border-radius: 1.5px;
  animation: ef-music-wave 1.2s ease-in-out infinite;
}

.ef-music-bar:nth-child(1) { height: 35%; animation-delay: 0s; }
.ef-music-bar:nth-child(2) { height: 65%; animation-delay: 0.15s; }
.ef-music-bar:nth-child(3) { height: 100%; animation-delay: 0.3s; }
.ef-music-bar:nth-child(4) { height: 55%; animation-delay: 0.45s; }
.ef-music-bar:nth-child(5) { height: 25%; animation-delay: 0.6s; }

@keyframes ef-music-wave {
  0%, 100% { transform: scaleY(0.35); }
  50% { transform: scaleY(1); }
}

/* Volume control */
.ef-music-volume {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 8px;
  background: rgba(10,10,10,0.92);
  backdrop-filter: blur(16px);
  border: 1.5px solid rgba(255,241,0,0.15);
}

.ef-music-vol-track {
  width: 5px;
  height: 56px;
  background: rgba(255,241,0,0.08);
  position: relative;
  cursor: pointer;
  border-radius: 2px;
}

.ef-music-vol-fill {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  background: var(--ef-yellow);
  transition: height 0.1s ease;
  border-radius: 2px;
}

.ef-music-vol-label {
  font-family: 'Share Tech Mono', monospace;
  font-size: 9px;
  letter-spacing: 1px;
  color: rgba(255,241,0,0.5);
  text-align: center;
}

/* Volume transition */
.ef-music-vol-enter-active { transition: all 0.2s ease; }
.ef-music-vol-leave-active { transition: all 0.15s ease; }
.ef-music-vol-enter-from,
.ef-music-vol-leave-to {
  opacity: 0;
  transform: translateX(8px);
}

@media (max-width: 768px) {
  .ef-music { bottom: 16px; right: 16px; }
  .ef-music-btn { width: 44px; height: 44px; }
  .ef-music-label { font-size: 9px; }
}
</style>
