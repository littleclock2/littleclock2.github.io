<script setup>
import { useI18n } from '../composables/useI18n.js'
const { T } = useI18n()

defineProps({
  title: { type: String, required: true },
  description: { type: String, required: true },
  tags: { type: Array, default: () => [] },
  repoUrl: { type: String, default: '' }
})
</script>

<template>
  <article class="ef-project">
    <div class="ef-project-body">
      <div class="ef-project-head">
        <h3 class="ef-project-name">{{ title }}</h3>
      </div>
      <p class="ef-project-desc">{{ description }}</p>
      <div v-if="tags.length" class="ef-project-tags">
        <span v-for="tag in tags" :key="tag" class="ef-tag">{{ tag }}</span>
      </div>
      <a v-if="repoUrl" :href="repoUrl" target="_blank" rel="noopener noreferrer" class="ef-project-link">
        <span>{{ T.projects.repo }}</span>
      </a>
    </div>
  </article>
</template>

<style scoped>
.ef-project {
  display: flex;
  background: var(--ys-surface);
  border: 1px solid var(--ys-border);
  overflow: hidden;
  transition: border-color 160ms ease, background-color 160ms ease;
  position: relative;
}

.ef-project:hover {
  background: var(--ys-surface-raised);
  border-color: var(--ys-signal);
}

.ef-project-body {
  padding: 20px 24px;
  flex: 1;
}

.ef-project-head {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
}

.ef-project-name {
  font-family: var(--ys-font-mono);
  font-weight: 600;
  font-size: 16px;
  letter-spacing: 0.02em;
  color: var(--ys-text);
  margin: 0;
  overflow-wrap: anywhere;
}

.ef-project-desc {
  font-size: 14px;
  color: var(--ys-muted);
  line-height: 1.7;
  margin: 0 0 14px;
}

.ef-project-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 14px;
}

.ef-tag {
  font-family: var(--ys-font-mono);
  font-size: 10px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--ys-signal);
  border: 1px solid var(--ys-border);
  padding: 3px 10px;
  background: transparent;
}

.ef-project-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: var(--ys-font-mono);
  font-size: 10px;
  letter-spacing: 3px;
  color: var(--ys-muted);
  text-decoration: none;
  transition: all 0.3s ease;
}

.ef-project-link:hover {
  color: var(--ys-signal);
}
</style>
