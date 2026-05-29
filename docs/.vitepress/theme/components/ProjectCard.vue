<script setup>
defineProps({
  title: { type: String, required: true },
  description: { type: String, required: true },
  tags: { type: Array, default: () => [] },
  repoUrl: { type: String, default: '' },
  status: { type: String, default: 'active' }
})
</script>

<template>
  <article class="ef-project">
    <div class="ef-project-top"></div>
    <div class="ef-project-body">
      <div class="ef-project-head">
        <span class="ef-project-status" :class="`ef-status--${status}`"></span>
        <h3 class="ef-project-name">{{ title }}</h3>
      </div>
      <p class="ef-project-desc">{{ description }}</p>
      <div v-if="tags.length" class="ef-project-tags">
        <span v-for="tag in tags" :key="tag" class="ef-tag">{{ tag }}</span>
      </div>
      <a v-if="repoUrl" :href="repoUrl" target="_blank" rel="noopener" class="ef-project-link">
        <span>REPO</span>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M3 9L9 3M9 3H4M9 3V8" stroke="currentColor" stroke-width="1"/>
        </svg>
      </a>
    </div>
  </article>
</template>

<style scoped>
.ef-project {
  display: flex;
  background: #141414;
  border: 1px solid #1e1e1e;
  overflow: hidden;
  transition: all 0.2s ease-out;
  position: relative;
}

.ef-project:hover {
  transform: translateY(-2px);
  border-color: #2a2a2a;
  box-shadow: 0 4px 20px rgba(0,0,0,0.3);
}

/* Yellow top accent bar */
.ef-project-top {
  width: 100%;
  height: 3px;
  position: absolute;
  top: 0;
  left: 0;
  background: var(--ef-yellow);
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

.ef-project-status {
  width: 6px;
  height: 6px;
  flex-shrink: 0;
}

.ef-status--active {
  background: #00ffa2;
  box-shadow: 0 0 8px rgba(0, 255, 162, 0.4);
}

.ef-status--completed {
  background: #6e6e6e;
}

.ef-status--archived {
  background: #999;
}

.ef-project-name {
  font-family: 'Inter', 'Noto Sans SC', sans-serif;
  font-weight: 800;
  font-size: 16px;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: #eee;
  margin: 0;
}

.ef-project-desc {
  font-size: 14px;
  color: #999;
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
  font-family: 'Share Tech Mono', monospace;
  font-size: 10px;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: var(--ef-yellow);
  border: 1px solid rgba(255,241,0,0.2);
  padding: 3px 10px;
  background: rgba(255,241,0,0.05);
}

.ef-project-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: 'Share Tech Mono', monospace;
  font-size: 10px;
  letter-spacing: 3px;
  color: #888;
  text-decoration: none;
  transition: all 0.3s ease;
}

.ef-project-link:hover {
  color: var(--ef-yellow);
}

.ef-project-link svg {
  transition: transform 0.3s ease;
}

.ef-project-link:hover svg {
  transform: translate(2px, -2px);
}
</style>
