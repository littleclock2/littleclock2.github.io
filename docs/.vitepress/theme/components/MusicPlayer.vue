<script setup>
import { computed, nextTick, onMounted, onUnmounted, ref } from 'vue'

const VOLUME_KEY = 'yunsword_bgm_volume'
const TRACK_KEY = 'yunsword_bgm_track'
const COLLAPSE_DELAY = 5000
const PROGRESS_RADIUS = 20
const PROGRESS_CIRCUMFERENCE = 2 * Math.PI * PROGRESS_RADIUS
const DEFAULT_TRACKS = [
  { title: '站点 BGM', src: '/bgm.mp3' },
  { title: '明天的云', src: '/music/tomorrows-cloud.mp3' },
  { title: '拾忆', src: '/music/memory-re0811.mp3' },
  { title: '宇宙的不可思议', src: '/music/cosmic-mystery.mp3' }
]
const DEFAULT_MUSIC = {
  enabled: true,
  defaultVolume: 0.3,
  tracks: DEFAULT_TRACKS
}

const audioRef = ref(null)
const music = ref({ ...DEFAULT_MUSIC })
const state = ref('loading')
const statusDetail = ref('正在读取音频')
const currentTime = ref(0)
const duration = ref(0)
const volume = ref(DEFAULT_MUSIC.defaultVolume)
const currentIndex = ref(0)
const expanded = ref(false)
const launcherRef = ref(null)
const panelRef = ref(null)
let collapseTimer = null
let restoreLauncherFocus = false
let focusFrame = null
let trackChangeSequence = 0

const currentTrack = computed(() => music.value.tracks[currentIndex.value] || DEFAULT_TRACKS[0])
const trackCount = computed(() => music.value.tracks.length)
const hasMultipleTracks = computed(() => trackCount.value > 1)
const trackPosition = computed(() => `${currentIndex.value + 1} / ${trackCount.value}`)
const canPlay = computed(() => ['ready', 'paused', 'playing'].includes(state.value))
const isPlaying = computed(() => state.value === 'playing')
const playLabel = computed(() => isPlaying.value ? '暂停 BGM' : '播放 BGM')
const progressPercent = computed(() => duration.value
  ? Math.min(100, Math.max(0, (currentTime.value / duration.value) * 100))
  : 0)
const progressOffset = computed(() => PROGRESS_CIRCUMFERENCE * (1 - progressPercent.value / 100))
const launcherLabel = computed(() => duration.value
  ? `展开 BGM 播放器，${currentTrack.value.title}，播放进度 ${Math.round(progressPercent.value)}%`
  : `展开 BGM 播放器，${currentTrack.value.title}`)
const statusText = computed(() => {
  if (state.value === 'playing') return '播放中'
  if (state.value === 'paused') return '已暂停'
  if (state.value === 'ready') return '准备播放'
  if (state.value === 'error') return statusDetail.value || 'BGM 文件不可用'
  return '正在载入'
})
const statusLine = computed(() => state.value === 'error'
  ? statusText.value
  : `${statusText.value} · ${formatTime(currentTime.value)} / ${formatTime(duration.value)}`)

function clampVolume(value) {
  const parsed = Number(value)
  if (!Number.isFinite(parsed)) return DEFAULT_MUSIC.defaultVolume
  return Math.min(1, Math.max(0, parsed))
}

function formatTime(seconds) {
  if (!Number.isFinite(seconds) || seconds <= 0) return '0:00'
  const minutes = Math.floor(seconds / 60)
  const remainder = Math.floor(seconds % 60).toString().padStart(2, '0')
  return `${minutes}:${remainder}`
}

function clearCollapseTimer() {
  if (collapseTimer !== null) {
    window.clearTimeout(collapseTimer)
    collapseTimer = null
  }
}

function clearFocusFrame() {
  if (focusFrame !== null) {
    window.cancelAnimationFrame(focusFrame)
    focusFrame = null
  }
}

function focusLauncherWhenReady() {
  focusFrame = null
  if (expanded.value || !restoreLauncherFocus) return

  if (launcherRef.value) {
    launcherRef.value.focus()
    restoreLauncherFocus = false
    return
  }

  focusFrame = window.requestAnimationFrame(focusLauncherWhenReady)
}

function scheduleCollapse() {
  clearCollapseTimer()
  if (!expanded.value) return
  collapseTimer = window.setTimeout(() => collapsePlayer(), COLLAPSE_DELAY)
}

function keepOpen() {
  if (expanded.value) scheduleCollapse()
}

function expandPlayer() {
  clearFocusFrame()
  restoreLauncherFocus = false
  expanded.value = true
  scheduleCollapse()
}

function collapsePlayer() {
  restoreLauncherFocus = Boolean(panelRef.value?.contains(document.activeElement))
  clearCollapseTimer()
  expanded.value = false
  if (restoreLauncherFocus) nextTick(focusLauncherWhenReady)
}

function handleViewAfterEnter() {
  if (!expanded.value && restoreLauncherFocus) {
    launcherRef.value?.focus()
    restoreLauncherFocus = false
  }
}

function handlePanelKeydown(event) {
  if (event.key === 'Escape') {
    event.preventDefault()
    collapsePlayer()
    return
  }
  keepOpen()
}

async function loadSettings() {
  try {
    const response = await fetch('/site-config.json')
    if (!response.ok) return
    const config = await response.json()
    const configured = config?.music
    if (!configured || typeof configured !== 'object') return

    const configuredTracks = Array.isArray(configured.tracks)
      ? configured.tracks
          .map((track) => ({
            title: typeof track?.title === 'string' ? track.title.trim() : '',
            src: typeof track?.src === 'string' ? track.src.trim() : ''
          }))
          .filter((track) => track.title && track.src)
      : []
    const legacyTrack = typeof configured.src === 'string' && configured.src.trim()
      ? [{
          title: typeof configured.title === 'string' && configured.title.trim()
            ? configured.title.trim()
            : DEFAULT_TRACKS[0].title,
          src: configured.src.trim()
        }]
      : []

    music.value = {
      enabled: configured.enabled !== false,
      defaultVolume: clampVolume(configured.defaultVolume),
      tracks: configuredTracks.length
        ? configuredTracks
        : legacyTrack.length
          ? legacyTrack
          : DEFAULT_TRACKS.map((track) => ({ ...track }))
    }
  } catch {
    music.value = {
      ...DEFAULT_MUSIC,
      tracks: DEFAULT_TRACKS.map((track) => ({ ...track }))
    }
  }
}

function handleLoadedMetadata() {
  const audio = audioRef.value
  if (!audio) return
  duration.value = Number.isFinite(audio.duration) ? audio.duration : 0
  state.value = 'ready'
  statusDetail.value = ''
}

function handleTimeUpdate() {
  currentTime.value = audioRef.value?.currentTime || 0
}

function handleAudioError() {
  state.value = 'error'
  statusDetail.value = 'BGM 文件不可用'
  currentTime.value = 0
  duration.value = 0
}

function handlePause() {
  if (!['error', 'loading'].includes(state.value)) state.value = 'paused'
}

async function switchTrack(nextIndex, autoplay = null) {
  keepOpen()
  if (!trackCount.value) return

  const normalizedIndex = ((Number(nextIndex) % trackCount.value) + trackCount.value) % trackCount.value
  const audio = audioRef.value
  const shouldPlay = autoplay ?? Boolean(audio && !audio.paused && !audio.ended)

  if (normalizedIndex === currentIndex.value) {
    if (shouldPlay && audio?.paused) {
      try {
        await audio.play()
      } catch {
        state.value = 'paused'
        statusDetail.value = '浏览器未允许播放'
      }
    }
    return
  }

  const sequence = ++trackChangeSequence
  currentIndex.value = normalizedIndex
  localStorage.setItem(TRACK_KEY, currentTrack.value.src)
  currentTime.value = 0
  duration.value = 0
  state.value = 'loading'
  statusDetail.value = '正在读取音频'

  await nextTick()
  if (sequence !== trackChangeSequence || !audioRef.value) return

  audioRef.value.volume = volume.value
  audioRef.value.load()
  if (!shouldPlay) return

  try {
    await audioRef.value.play()
  } catch {
    state.value = 'paused'
    statusDetail.value = '浏览器未允许播放'
  }
}

function previousTrack() {
  return switchTrack(currentIndex.value - 1)
}

function nextTrack(autoplay = null) {
  return switchTrack(currentIndex.value + 1, autoplay)
}

function selectTrack(event) {
  return switchTrack(Number(event.target.value))
}

async function togglePlay() {
  keepOpen()
  const audio = audioRef.value
  if (!audio || !canPlay.value) return

  if (!audio.paused) {
    audio.pause()
    return
  }

  try {
    await audio.play()
  } catch {
    state.value = 'paused'
    statusDetail.value = '浏览器未允许播放'
  }
}

function setVolume(event) {
  keepOpen()
  volume.value = clampVolume(event.target.value)
  if (audioRef.value) audioRef.value.volume = volume.value
  localStorage.setItem(VOLUME_KEY, volume.value.toString())
}

function seek(event) {
  keepOpen()
  const audio = audioRef.value
  if (!audio || !duration.value) return
  const nextTime = Math.min(duration.value, Math.max(0, Number(event.target.value)))
  audio.currentTime = nextTime
  currentTime.value = nextTime
}

onMounted(async () => {
  await loadSettings()
  if (!music.value.enabled) return

  const savedVolume = localStorage.getItem(VOLUME_KEY)
  volume.value = savedVolume === null
    ? music.value.defaultVolume
    : clampVolume(savedVolume)

  const savedTrack = localStorage.getItem(TRACK_KEY)
  const savedIndex = music.value.tracks.findIndex((track) => track.src === savedTrack)
  currentIndex.value = savedIndex >= 0 ? savedIndex : 0

  await nextTick()
  if (audioRef.value) {
    audioRef.value.volume = volume.value
    audioRef.value.load()
  }
})

onUnmounted(() => {
  clearCollapseTimer()
  clearFocusFrame()
  audioRef.value?.pause()
})
</script>

<template>
  <aside v-if="music.enabled" class="ys-music" :data-state="state" aria-label="背景音乐播放器">
    <audio
      ref="audioRef"
      :src="currentTrack.src"
      preload="metadata"
      :loop="!hasMultipleTracks"
      @loadedmetadata="handleLoadedMetadata"
      @timeupdate="handleTimeUpdate"
      @playing="state = 'playing'"
      @pause="handlePause"
      @ended="nextTrack(true)"
      @error="handleAudioError"
    />

    <Transition name="ys-music-view" mode="out-in" @after-enter="handleViewAfterEnter">
      <button
        v-if="!expanded"
        ref="launcherRef"
        key="launcher"
        class="ys-music-launcher"
        type="button"
        :aria-label="launcherLabel"
        title="展开 BGM 播放器"
        aria-expanded="false"
        @click="expandPlayer"
      >
        <svg viewBox="0 0 48 48" aria-hidden="true">
          <circle class="ys-music-ring-track" cx="24" cy="24" :r="PROGRESS_RADIUS" />
          <circle
            class="ys-music-ring-progress"
            cx="24"
            cy="24"
            :r="PROGRESS_RADIUS"
            :stroke-dasharray="PROGRESS_CIRCUMFERENCE"
            :stroke-dashoffset="progressOffset"
            transform="rotate(-90 24 24)"
          />
          <path class="ys-music-note" d="M29 13v17.2a5.4 5.4 0 1 1-2.8-4.7V16.8l11-2.2v12.7a5.4 5.4 0 1 1-2.8-4.7V13.9L29 15v-2Z" />
        </svg>
      </button>

      <div
        v-else
        id="ys-music-panel"
        ref="panelRef"
        key="panel"
        class="ys-music-panel"
        :data-state="state"
        @click="keepOpen"
        @pointerdown="keepOpen"
        @keydown="handlePanelKeydown"
      >
        <div class="ys-music-controls" role="group" aria-label="BGM 曲目控制">
          <button
            class="ys-music-skip"
            type="button"
            aria-label="上一首"
            title="上一首"
            :disabled="!hasMultipleTracks"
            @click="previousTrack"
          >
            <svg viewBox="0 0 20 20" aria-hidden="true">
              <path d="M5 4h2v12H5zM15 4.2v11.6L7.5 10 15 4.2z" fill="currentColor" />
            </svg>
          </button>

          <button
            class="ys-music-toggle"
            type="button"
            :aria-label="playLabel"
            :title="playLabel"
            :disabled="!canPlay"
            @click="togglePlay"
          >
            <svg v-if="isPlaying" viewBox="0 0 20 20" aria-hidden="true">
              <path d="M5 4h3v12H5zM12 4h3v12h-3z" fill="currentColor" />
            </svg>
            <svg v-else viewBox="0 0 20 20" aria-hidden="true">
              <path d="M6 3.8v12.4L16 10 6 3.8z" fill="currentColor" />
            </svg>
          </button>

          <button
            class="ys-music-skip"
            type="button"
            aria-label="下一首"
            title="下一首"
            :disabled="!hasMultipleTracks"
            @click="nextTrack()"
          >
            <svg viewBox="0 0 20 20" aria-hidden="true">
              <path d="M13 4h2v12h-2zM5 4.2v11.6l7.5-5.8L5 4.2z" fill="currentColor" />
            </svg>
          </button>
        </div>

        <div class="ys-music-copy">
          <span class="ys-music-label">BGM · {{ trackPosition }}</span>
          <select
            class="ys-music-track-select"
            :value="currentIndex"
            :title="currentTrack.title"
            aria-label="选择 BGM 曲目"
            @change="selectTrack"
          >
            <option
              v-for="(track, index) in music.tracks"
              :key="track.src"
              :value="index"
            >
              {{ track.title }}
            </option>
          </select>
          <span class="ys-music-status" role="status" aria-live="polite">
            {{ statusLine }}
          </span>
        </div>

        <label class="ys-music-volume">
          <span>音量 {{ Math.round(volume * 100) }}%</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            :value="volume"
            aria-label="BGM 音量"
            @input="setVolume"
          >
        </label>

        <button
          class="ys-music-collapse"
          type="button"
          aria-label="收起 BGM 播放器"
          title="收起播放器"
          @click="collapsePlayer"
        >
          <svg viewBox="0 0 16 16" aria-hidden="true">
            <path d="m4 6 4 4 4-4" fill="none" stroke="currentColor" stroke-width="1.5" />
          </svg>
        </button>

        <input
          class="ys-music-progress"
          type="range"
          min="0"
          :max="duration || 0"
          step="1"
          :value="currentTime"
          :disabled="!duration"
          aria-label="BGM 播放进度"
          @input="seek"
        >
      </div>
    </Transition>
  </aside>
</template>

<style scoped>
.ys-music {
  position: fixed;
  right: 1rem;
  bottom: 1rem;
  z-index: 40;
  font-family: var(--ys-font-mono);
}

.ys-music-panel {
  position: relative;
  display: grid;
  grid-template-columns: 8.75rem minmax(0, 1fr) 4.75rem;
  gap: 0.75rem;
  align-items: center;
  width: min(24rem, calc(100vw - 2rem));
  padding: 0.75rem;
  border: 1px solid var(--ys-border);
  background: var(--ys-canvas);
  color: var(--ys-text);
  font-family: var(--ys-font-mono);
}

.ys-music-panel[data-state='playing'] {
  border-top-color: var(--ys-signal);
}

.ys-music audio {
  display: none;
}

.ys-music-launcher {
  display: block;
  width: 3rem;
  height: 3rem;
  padding: 0;
  border: 1px solid var(--ys-border);
  border-radius: 0;
  background: var(--ys-canvas);
  color: var(--ys-text);
  cursor: pointer;
}

.ys-music-launcher:hover {
  border-color: var(--ys-signal);
  background: var(--ys-surface);
  color: var(--ys-signal);
}

.ys-music-launcher:active {
  background: var(--ys-signal);
  color: var(--ys-canvas);
}

.ys-music-launcher svg {
  display: block;
  width: 100%;
  height: 100%;
}

.ys-music-ring-track,
.ys-music-ring-progress {
  fill: none;
  stroke-width: 2;
}

.ys-music-ring-track {
  stroke: var(--ys-border);
}

.ys-music-ring-progress {
  stroke: var(--ys-signal);
  transition: stroke-dashoffset 220ms linear;
}

.ys-music-note {
  fill: currentColor;
}

.ys-music-controls {
  display: grid;
  grid-template-columns: repeat(3, 2.75rem);
  gap: 0.25rem;
}

.ys-music-toggle,
.ys-music-skip {
  display: grid;
  place-items: center;
  width: 2.75rem;
  height: 2.75rem;
  padding: 0;
  border: 1px solid var(--ys-signal);
  border-radius: 0;
  background: transparent;
  color: var(--ys-signal);
  cursor: pointer;
}

.ys-music-skip {
  border-color: var(--ys-border);
  color: var(--ys-text);
}

.ys-music-toggle:hover:not(:disabled),
.ys-music-skip:hover:not(:disabled) {
  background: var(--ys-signal);
  border-color: var(--ys-signal);
  color: var(--ys-canvas);
}

.ys-music-toggle:active:not(:disabled),
.ys-music-skip:active:not(:disabled) {
  background: var(--ys-text);
  border-color: var(--ys-text);
  color: var(--ys-canvas);
}

.ys-music-toggle:disabled,
.ys-music-skip:disabled {
  cursor: not-allowed;
  border-color: var(--ys-border);
  color: var(--ys-muted);
  opacity: 0.65;
}

.ys-music-toggle svg,
.ys-music-skip svg {
  width: 1.1rem;
  height: 1.1rem;
}

.ys-music-copy {
  display: grid;
  min-width: 0;
}

.ys-music-label {
  color: var(--ys-signal);
  font-size: 0.62rem;
  font-weight: 700;
  letter-spacing: 0.12em;
}

.ys-music-track-select {
  width: 100%;
  min-width: 0;
  height: 1.45rem;
  margin: 0;
  padding: 0 0.2rem;
  border: 1px solid transparent;
  border-radius: 0;
  background: var(--ys-canvas);
  overflow: hidden;
  color: var(--ys-text);
  cursor: pointer;
  font-family: var(--ys-font-mono);
  font-size: 0.78rem;
  font-weight: 700;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.ys-music-track-select:hover {
  border-color: var(--ys-border);
  background: var(--ys-surface);
}

.ys-music-track-select:focus-visible,
.ys-music-toggle:focus-visible,
.ys-music-skip:focus-visible,
.ys-music-collapse:focus-visible,
.ys-music-launcher:focus-visible {
  outline: 2px solid var(--ys-signal);
  outline-offset: 2px;
}

.ys-music-status,
.ys-music-volume span {
  color: var(--ys-muted);
  font-size: 0.62rem;
  line-height: 1.45;
}

.ys-music-volume {
  display: grid;
  gap: 0.35rem;
  min-width: 0;
  padding-right: 1.5rem;
}

.ys-music-collapse {
  position: absolute;
  top: 0.35rem;
  right: 0.35rem;
  display: grid;
  place-items: center;
  width: 1.5rem;
  height: 1.5rem;
  padding: 0;
  border: 0;
  border-radius: 0;
  background: transparent;
  color: var(--ys-muted);
  cursor: pointer;
}

.ys-music-collapse:hover {
  background: var(--ys-surface);
  color: var(--ys-signal);
}

.ys-music-collapse:active {
  background: var(--ys-signal);
  color: var(--ys-canvas);
}

.ys-music-collapse svg {
  width: 0.9rem;
  height: 0.9rem;
}

.ys-music-volume input,
.ys-music-progress {
  width: 100%;
  height: 0.75rem;
  margin: 0;
  padding: 0;
  appearance: none;
  border: 0;
  border-radius: 0;
  background: transparent;
  cursor: pointer;
}

.ys-music-volume input::-webkit-slider-runnable-track,
.ys-music-progress::-webkit-slider-runnable-track {
  height: 2px;
  background: var(--ys-border);
}

.ys-music-volume input::-moz-range-track,
.ys-music-progress::-moz-range-track {
  height: 2px;
  background: var(--ys-border);
}

.ys-music-volume input::-webkit-slider-thumb,
.ys-music-progress::-webkit-slider-thumb {
  width: 0.65rem;
  height: 0.65rem;
  margin-top: -0.27rem;
  appearance: none;
  border: 0;
  border-radius: 0;
  background: var(--ys-signal);
}

.ys-music-volume input::-moz-range-thumb,
.ys-music-progress::-moz-range-thumb {
  width: 0.65rem;
  height: 0.65rem;
  border: 0;
  border-radius: 0;
  background: var(--ys-signal);
}

.ys-music-progress {
  grid-column: 1 / -1;
}

.ys-music-progress:disabled {
  cursor: not-allowed;
  opacity: 0.45;
}

.ys-music-view-enter-active,
.ys-music-view-leave-active {
  transition: opacity 160ms ease, transform 160ms ease;
}

.ys-music-view-enter-from,
.ys-music-view-leave-to {
  opacity: 0;
  transform: translateY(0.35rem);
}

@media (max-width: 480px) {
  .ys-music {
    right: 0.75rem;
    bottom: 0.75rem;
  }

  .ys-music-panel {
    grid-template-columns: 8.75rem minmax(0, 1fr) 4.75rem;
    gap: 0.5rem;
    width: calc(100vw - 1.5rem);
    padding: 0.65rem;
  }
}

@media (max-width: 360px) {
  .ys-music-panel {
    grid-template-columns: 8.75rem minmax(0, 1fr);
  }

  .ys-music-volume {
    grid-column: 1 / -1;
    grid-template-columns: auto minmax(0, 1fr);
    align-items: center;
  }
}

@media (prefers-reduced-motion: reduce) {
  .ys-music-toggle,
  .ys-music-ring-progress,
  .ys-music-view-enter-active,
  .ys-music-view-leave-active {
    transition: none;
  }
}
</style>
