<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useI18n } from '../composables/useI18n.js'

const { locale, setLocale } = useI18n()
const open = ref(false)

const localeLabels = { 'zh-CN': 'ZH', 'en': 'EN', 'zh-TW': 'TW' }

function switchLocale(loc) {
  setLocale(loc)
  open.value = false
}

function onDocClick() { open.value = false }
function onKeydown(event) {
  if (event.key === 'Escape') open.value = false
}

onMounted(() => {
  document.addEventListener('click', onDocClick)
  document.addEventListener('keydown', onKeydown)
})
onUnmounted(() => {
  document.removeEventListener('click', onDocClick)
  document.removeEventListener('keydown', onKeydown)
})
</script>

<template>
  <div class="t-lang-switch" @click.stop>
    <button
      class="t-lang-btn"
      type="button"
      aria-label="切换界面语言"
      aria-haspopup="menu"
      :aria-expanded="open"
      @click="open = !open"
    >
      {{ localeLabels[locale] }}
    </button>
    <div v-if="open" class="t-lang-dropdown" role="menu" aria-label="界面语言">
      <button
        v-for="(label, code) in localeLabels"
        :key="code"
        :class="['t-lang-option', { 't-lang-option--active': locale === code }]"
        type="button"
        role="menuitemradio"
        :aria-checked="locale === code"
        @click="switchLocale(code)"
      >
        {{ label }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.t-lang-switch { position: relative; margin-left: 12px; }

.t-lang-btn {
  font-family: var(--ys-font-mono);
  font-weight: 600;
  font-size: 12px;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: var(--ys-muted);
  background: transparent;
  border: 1px solid var(--ys-border);
  padding: 4px 10px;
  cursor: pointer;
  transition: all 0.2s;
}
.t-lang-btn:hover {
  border-color: var(--ys-signal);
  color: var(--ys-signal);
}

.t-lang-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 4px;
  background: var(--ys-surface);
  border: 1px solid var(--ys-border);
  z-index: 100;
  min-width: 60px;
}

.t-lang-option {
  display: block;
  width: 100%;
  font-family: var(--ys-font-mono);
  font-weight: 600;
  font-size: 12px;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: var(--ys-muted);
  background: transparent;
  border: none;
  padding: 8px 14px;
  text-align: left;
  cursor: pointer;
  transition: all 0.2s;
}
.t-lang-option:hover {
  background: var(--ys-surface-raised);
  color: var(--ys-signal);
}
.t-lang-option--active {
  color: var(--ys-signal);
}
</style>
