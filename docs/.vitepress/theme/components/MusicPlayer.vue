<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue'

const STORAGE_KEY = 'terminus_music'
const VOL_KEY = 'terminus_music_vol'
const MUSIC_DIR = '/'

const isPlaying = ref(false)
const audio = ref(null)
const progress = ref(0)
const duration = ref(0)
const volume = ref(0.3)
const showVolume = ref(false)
const hasError = ref(false)
const songName = ref('')
const showTooltip = ref(false)
const isDraggingProgress = ref(false)
const isDraggingVolume = ref(false)
const progressRef = ref(null)
const volRef = ref(null)

const progressPercent = computed(() => {
  if (!duration.value) return 0
  return (progress.value / duration.value) * 100
})

function formatTime(sec) {
  if (!sec || !isFinite(sec)) return '0:00'
  const m = Math.floor(sec / 60)
  const s = Math.floor(sec % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}

async function detectMusic() {
  // Try to fetch directory listing to find mp3 files
  try {
    const res = await fetch(MUSIC_DIR)
    const html = await res.text()
    const match = html.match(/href="([^"]*\.mp3)"/i)
    if (match) {
      const filename = match[1].split('/').pop()
      songName.value = decodeURIComponent(filename).replace(/\.mp3$/i, '')
      return match[1]
    }
  } catch {}
  // Fallback: try common names
  const candidates = ['bgm.mp3', 'music.mp3', 'song.mp3']
  for (const name of candidates) {
    try {
      const res = await fetch(name, { method: 'HEAD' })
      if (res.ok) {
        songName.value = name.replace(/\.mp3$/i, '')
        return name
      }
    } catch {}
  }
  return null
}

async function initAudio() {
  const src = await detectMusic()
  if (!src) { hasError.value = true; return }

  audio.value = new Audio(src)
  audio.value.loop = true
  audio.value.volume = volume.value
  audio.value.preload = 'metadata'

  audio.value.addEventListener('loadedmetadata', () => {
    duration.value = audio.value.duration
  })

  audio.value.addEventListener('timeupdate', () => {
    if (!isDragging.value) {
      progress.value = audio.value.currentTime
    }
  })

  audio.value.addEventListener('error', () => {
    hasError.value = true
  })
}

function togglePlay() {
  if (!audio.value) { initAudio(); return }
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

function startProgressDrag(e) {
  isDraggingProgress.value = true
  updateProgress(e)
  document.addEventListener('mousemove', onProgressDrag)
  document.addEventListener('mouseup', stopProgressDrag)
}

function onProgressDrag(e) {
  if (isDraggingProgress.value) updateProgress(e)
}

function stopProgressDrag() {
  isDraggingProgress.value = false
  document.removeEventListener('mousemove', onProgressDrag)
  document.removeEventListener('mouseup', stopProgressDrag)
}

function updateProgress(e) {
  if (!audio.value || !duration.value || !progressRef.value) return
  const rect = progressRef.value.getBoundingClientRect()
  const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
  audio.value.currentTime = x * duration.value
  progress.value = audio.value.currentTime
}

function startVolDrag(e) {
  isDraggingVolume.value = true
  updateVolume(e)
  document.addEventListener('mousemove', onVolDrag)
  document.addEventListener('mouseup', stopVolDrag)
}

function onVolDrag(e) {
  if (isDraggingVolume.value) updateVolume(e)
}

function stopVolDrag() {
  isDraggingVolume.value = false
  document.removeEventListener('mousemove', onVolDrag)
  document.removeEventListener('mouseup', stopVolDrag)
}

function updateVolume(e) {
  if (!volRef.value) return
  const rect = volRef.value.getBoundingClientRect()
  const y = e.clientY - rect.top
  const pct = 1 - Math.max(0, Math.min(1, y / rect.height))
  volume.value = Math.round(pct * 100) / 100
  if (audio.value) audio.value.volume = volume.value
  localStorage.setItem(VOL_KEY, volume.value.toString())
}

onMounted(async () => {
  // Restore saved volume
  const savedVol = localStorage.getItem(VOL_KEY)
  if (savedVol !== null) volume.value = parseFloat(savedVol)

  await initAudio()

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
  document.removeEventListener('mousemove', onProgressDrag)
  document.removeEventListener('mouseup', stopProgressDrag)
  document.removeEventListener('mousemove', onVolDrag)
  document.removeEventListener('mouseup', stopVolDrag)
  if (audio.value) {
    audio.value.pause()
    audio.value.src = ''
  }
})
</script>

<template>
  <div
    class="ef-music"
    @mouseenter="showVolume = true; showTooltip = true"
    @mouseleave="showVolume = false; showTooltip = false"
  >
    <!-- Song name tooltip (above button) -->
    <Transition name="ef-music-tip">
      <div v-if="showTooltip && songName && !hasError" class="ef-music-tooltip">
        <span class="ef-music-tip-title">{{ songName }}</span>
        <span class="ef-music-tip-time">{{ formatTime(progress) }} / {{ formatTime(duration) }}</span>
      </div>
    </Transition>

    <!-- Progress bar -->
    <div v-if="songName && !hasError" class="ef-music-progress-wrap">
      <div ref="progressRef" class="ef-music-progress" @mousedown.prevent="startProgressDrag">
        <div class="ef-music-progress-fill" :style="{ width: progressPercent + '%' }"></div>
        <div class="ef-music-progress-handle" :style="{ left: progressPercent + '%' }"></div>
      </div>
    </div>

    <!-- Main row: volume + button + label -->
    <div class="ef-music-row">
      <!-- Volume slider (left side) -->
      <Transition name="ef-music-vol">
        <div v-if="showVolume" class="ef-music-volume">
          <div ref="volRef" class="ef-music-vol-track" @mousedown.prevent="startVolDrag">
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
      >
        <div class="ef-music-bars" v-if="isPlaying">
          <span class="ef-music-bar"></span>
          <span class="ef-music-bar"></span>
          <span class="ef-music-bar"></span>
          <span class="ef-music-bar"></span>
          <span class="ef-music-bar"></span>
        </div>
        <svg v-else class="ef-music-icon" width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d="M5 3v12l10-6L5 3z" fill="currentColor"/>
        </svg>
      </button>

      <span class="ef-music-label" v-if="!hasError">BGM</span>
    </div>
  </div>
</template>

<style scoped>
.ef-music {
  position: fixed;
  bottom: 32px;
  right: 32px;
  z-index: 100;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 6px;
}

.ef-music-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* Tooltip */
.ef-music-tooltip {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;
  padding: 8px 12px;
  background: rgba(10,10,10,0.95);
  backdrop-filter: blur(16px);
  border: 1.5px solid rgba(255,241,0,0.2);
  box-shadow: 0 4px 20px rgba(0,0,0,0.5);
}

.ef-music-tip-title {
  font-family: 'Source Sans 3', 'Noto Sans SC', sans-serif;
  font-size: 12px;
  font-weight: 600;
  color: #ddd;
  letter-spacing: 0.5px;
  max-width: 180px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.ef-music-tip-time {
  font-family: 'Share Tech Mono', monospace;
  font-size: 10px;
  letter-spacing: 1px;
  color: rgba(255,241,0,0.5);
}

/* Progress bar */
.ef-music-progress-wrap {
  width: 120px;
  padding: 6px 0;
  display: flex;
  align-items: center;
}

.ef-music-progress {
  position: relative;
  width: 100%;
  height: 3px;
  background: rgba(255,241,0,0.1);
  cursor: pointer;
}

.ef-music-progress-fill {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  background: var(--ef-yellow);
  pointer-events: none;
}

.ef-music-progress-handle {
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 10px;
  height: 10px;
  background: var(--ef-yellow);
  border-radius: 50%;
  opacity: 0;
  transition: opacity 0.2s ease;
  pointer-events: none;
}

.ef-music-progress:hover .ef-music-progress-handle {
  opacity: 1;
}

/* Button */
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

.ef-music-icon { margin-left: 2px; }

.ef-music-label {
  position: relative;
  z-index: 2;
  font-family: 'Share Tech Mono', monospace;
  font-size: 10px;
  letter-spacing: 3px;
  color: rgba(255,241,0,0.45);
  pointer-events: none;
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

/* Transitions */
.ef-music-vol-enter-active { transition: all 0.2s ease; }
.ef-music-vol-leave-active { transition: all 0.15s ease; }
.ef-music-vol-enter-from,
.ef-music-vol-leave-to {
  opacity: 0;
  transform: translateX(8px);
}

.ef-music-tip-enter-active { transition: all 0.2s ease; }
.ef-music-tip-leave-active { transition: all 0.15s ease; }
.ef-music-tip-enter-from,
.ef-music-tip-leave-to {
  opacity: 0;
  transform: translateY(4px);
}

@media (max-width: 768px) {
  .ef-music { bottom: 16px; right: 16px; }
  .ef-music-btn { width: 44px; height: 44px; }
  .ef-music-label { font-size: 9px; }
  .ef-music-progress { width: 100px; }
}
</style>
