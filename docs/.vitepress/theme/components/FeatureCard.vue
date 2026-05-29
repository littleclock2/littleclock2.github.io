<script setup>
defineProps({
  icon: { type: String, required: true },
  title: { type: String, required: true },
  details: { type: String, required: true },
  link: { type: String, default: '' },
  linkText: { type: String, default: 'EXPLORE' }
})
</script>

<template>
  <article class="ef-card">
    <div class="ef-card-stripe"></div>
    <div class="ef-card-body">
      <div class="ef-card-icon">{{ icon }}</div>
      <h3 class="ef-card-title">{{ title }}</h3>
      <p class="ef-card-desc">{{ details }}</p>
      <a v-if="link" :href="link" class="ef-card-link">
        <span class="ef-card-link-text">{{ linkText }}</span>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M3 9L9 3M9 3H4M9 3V8" stroke="currentColor" stroke-width="1"/>
        </svg>
      </a>
    </div>
  </article>
</template>

<style scoped>
.ef-card {
  display: flex;
  background: #141414;
  border: 1px solid #1e1e1e;
  overflow: hidden;
  transition: all 0.2s ease-out;
  position: relative;
}

.ef-card:hover {
  transform: translateY(-2px);
  border-color: #2a2a2a;
  box-shadow: 0 4px 20px rgba(0,0,0,0.3);
}

/* Yellow top accent bar */
.ef-card-stripe {
  width: 100%;
  height: 3px;
  position: absolute;
  top: 0;
  left: 0;
  background: var(--ef-yellow);
}

.ef-card-body {
  padding: 28px 24px;
  padding-top: 20px;
}

.ef-card-icon {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255,241,0,0.1);
  border: 1px solid rgba(255,241,0,0.15);
  font-size: 18px;
  margin-bottom: 16px;
}

.ef-card-title {
  font-family: 'Inter', 'Noto Sans SC', sans-serif;
  font-weight: 800;
  font-size: 16px;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  color: #eee;
  margin: 0 0 10px;
}

.ef-card-desc {
  font-size: 14px;
  color: #999;
  line-height: 1.6;
  margin: 0;
}

.ef-card-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-top: 16px;
  text-decoration: none;
  transition: all 0.3s ease;
}

.ef-card-link-text {
  font-family: 'Source Sans 3', sans-serif;
  font-size: 10px;
  letter-spacing: 3px;
  color: #888;
  transition: color 0.3s ease;
}

.ef-card-link svg {
  color: #888;
  transition: all 0.3s ease;
}

.ef-card-link:hover .ef-card-link-text {
  color: var(--ef-yellow);
}

.ef-card-link:hover svg {
  color: var(--ef-yellow);
  transform: translate(2px, -2px);
}
</style>
