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
onMounted(() => document.addEventListener('click', onDocClick))
onUnmounted(() => document.removeEventListener('click', onDocClick))
</script>

<template>
  <div class="t-lang-switch" @click.stop>
    <button class="t-lang-btn" @click="open = !open">
      {{ localeLabels[locale] }}
    </button>
    <div v-if="open" class="t-lang-dropdown">
      <button
        v-for="(label, code) in localeLabels"
        :key="code"
        :class="['t-lang-option', { 't-lang-option--active': locale === code }]"
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
  font-family: 'Source Sans 3', sans-serif;
  font-weight: 600;
  font-size: 12px;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: #999;
  background: transparent;
  border: 1px solid #2a2a2a;
  padding: 4px 10px;
  cursor: pointer;
  transition: all 0.2s;
}
.t-lang-btn:hover {
  border-color: var(--ef-yellow);
  color: var(--ef-yellow);
}

.t-lang-dropdown {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 4px;
  background: #111;
  border: 1px solid #2a2a2a;
  z-index: 100;
  min-width: 60px;
}

.t-lang-option {
  display: block;
  width: 100%;
  font-family: 'Source Sans 3', sans-serif;
  font-weight: 600;
  font-size: 12px;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: #777;
  background: transparent;
  border: none;
  padding: 8px 14px;
  text-align: left;
  cursor: pointer;
  transition: all 0.2s;
}
.t-lang-option:hover {
  background: rgba(255,241,0,0.06);
  color: var(--ef-yellow);
}
.t-lang-option--active {
  color: var(--ef-yellow);
}
</style>
