<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'

const STORAGE_KEY = 'terminus_music'
const MUSIC_SRC = '/bgm.mp3'

const isPlaying = ref(false)
const isVisible = ref(true)
const audio = ref(null)
const progress = ref(0)
const duration = ref(0)
const volume = ref(0.3)
const showVolume = ref(false)
const isLoaded = ref(false)
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
    isLoaded.value = true
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
  // Auto-play if previously playing
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
      <svg v-else class="ef-music-icon" width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M4 2.5v11l9-5.5L4 2.5z" fill="currentColor"/>
      </svg>
    </button>

    <!-- Progress ring (subtle) -->
    <svg class="ef-music-ring" width="44" height="44" viewBox="0 0 44 44">
      <circle cx="22" cy="22" r="20" fill="none" stroke="rgba(255,241,0,0.06)" stroke-width="1"/>
      <circle
        cx="22" cy="22" r="20"
        fill="none"
        stroke="rgba(255,241,0,0.25)"
        stroke-width="1.5"
        :stroke-dasharray="125.6"
        :stroke-dashoffset="125.6 - (125.6 * progressPercent / 100)"
        transform="rotate(-90 22 22)"
        stroke-linecap="round"
        style="transition: stroke-dashoffset 0.3s linear"
      />
    </svg>
  </div>
</template>

<style scoped>
.ef-music {
  position: fixed;
  bottom: 28px;
  right: 28px;
  z-index: 100;
  display: flex;
  align-items: center;
  gap: 10px;
}

.ef-music-ring {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
}

.ef-music-btn {
  position: relative;
  z-index: 2;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 1.5px solid rgba(255,241,0,0.2);
  background: rgba(10,10,10,0.85);
  backdrop-filter: blur(12px);
  color: rgba(255,241,0,0.5);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  box-shadow: 0 0 20px rgba(0,0,0,0.4);
}

.ef-music-btn:hover {
  border-color: rgba(255,241,0,0.4);
  color: var(--ef-yellow);
  box-shadow: 0 0 30px rgba(255,241,0,0.1);
}

.ef-music-btn--active {
  border-color: rgba(255,241,0,0.35);
  color: var(--ef-yellow);
}

.ef-music-btn--error {
  opacity: 0.3;
  cursor: not-allowed;
}

.ef-music-icon {
  margin-left: 2px;
}

/* Sound wave bars */
.ef-music-bars {
  display: flex;
  align-items: center;
  gap: 2px;
  height: 16px;
}

.ef-music-bar {
  width: 2.5px;
  background: var(--ef-yellow);
  border-radius: 1px;
  animation: ef-music-wave 1.2s ease-in-out infinite;
}

.ef-music-bar:nth-child(1) { height: 40%; animation-delay: 0s; }
.ef-music-bar:nth-child(2) { height: 70%; animation-delay: 0.15s; }
.ef-music-bar:nth-child(3) { height: 100%; animation-delay: 0.3s; }
.ef-music-bar:nth-child(4) { height: 60%; animation-delay: 0.45s; }
.ef-music-bar:nth-child(5) { height: 30%; animation-delay: 0.6s; }

@keyframes ef-music-wave {
  0%, 100% { transform: scaleY(0.4); }
  50% { transform: scaleY(1); }
}

/* Volume control */
.ef-music-volume {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 6px;
  background: rgba(10,10,10,0.85);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255,241,0,0.1);
}

.ef-music-vol-track {
  width: 4px;
  height: 48px;
  background: rgba(255,241,0,0.08);
  position: relative;
  cursor: pointer;
}

.ef-music-vol-fill {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  background: var(--ef-yellow);
  transition: height 0.1s ease;
}

.ef-music-vol-label {
  font-family: 'Share Tech Mono', monospace;
  font-size: 8px;
  letter-spacing: 1px;
  color: rgba(255,241,0,0.4);
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
  .ef-music-btn { width: 38px; height: 38px; }
}
</style>
