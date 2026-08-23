<script setup>
import aboutData from '../../../public/about-data.json'

const { profile, skills, fields, projects, links } = aboutData
</script>

<template>
  <div class="ys-about">
    <section class="ys-about-intro" aria-labelledby="about-name">
      <a
        class="ys-about-avatar"
        :href="profile.avatarProfileUrl"
        target="_blank"
        rel="noopener noreferrer"
        :aria-label="`在 GitHub 查看 ${profile.name}`"
      >
        <img
          :src="profile.avatarUrl"
          :alt="`${profile.name} 的头像`"
          width="320"
          height="320"
          loading="eager"
          decoding="async"
          fetchpriority="high"
          referrerpolicy="no-referrer"
        >
        <span>GitHub · @littleclock2</span>
      </a>

      <div class="ys-about-intro-copy">
        <p class="ys-eyebrow">PROFILE</p>
        <h2 id="about-name">{{ profile.name }}</h2>
        <p class="ys-about-role">{{ profile.role }}</p>
        <p class="ys-about-summary">{{ profile.summary }}</p>
        <blockquote>{{ profile.quote }}</blockquote>
      </div>
    </section>

    <section class="ys-about-section" aria-labelledby="about-skills">
      <header>
        <p class="ys-eyebrow">TOOLKIT</p>
        <h2 id="about-skills">技术栈</h2>
      </header>
      <dl class="ys-skill-list">
        <div v-for="skill in skills" :key="skill.name" class="ys-skill-row">
          <dt>{{ skill.name }}</dt>
          <dd>{{ skill.tools }}</dd>
        </div>
      </dl>
    </section>

    <section class="ys-about-section" aria-labelledby="about-fields">
      <header>
        <p class="ys-eyebrow">FOCUS</p>
        <h2 id="about-fields">关注方向</h2>
      </header>
      <div class="ys-focus-grid">
        <article v-for="field in fields" :key="field.title">
          <h3>{{ field.title }}</h3>
          <p>{{ field.desc }}</p>
        </article>
      </div>
    </section>

    <section class="ys-about-section" aria-labelledby="about-projects">
      <header>
        <p class="ys-eyebrow">SELECTED WORK</p>
        <h2 id="about-projects">代表项目</h2>
      </header>
      <div class="ys-about-projects">
        <a
          v-for="project in projects"
          :key="project.name"
          :href="project.url"
          target="_blank"
          rel="noopener noreferrer"
        >
          <strong>{{ project.name }}</strong>
          <span>{{ project.description }}</span>
        </a>
      </div>
    </section>

    <section class="ys-about-section" aria-labelledby="about-links">
      <header>
        <p class="ys-eyebrow">CONTACT</p>
        <h2 id="about-links">联系</h2>
      </header>
      <div class="ys-contact-list">
        <a
          v-for="link in links"
          :key="link.url"
          :href="link.url"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span>{{ link.label }}</span>
          <strong>{{ link.value }}</strong>
        </a>
      </div>
    </section>
  </div>
</template>

<style scoped>
.ys-about {
  display: grid;
  gap: 3.5rem;
  width: 100%;
}

.ys-about-intro,
.ys-about-section {
  min-width: 0;
}

.ys-about-intro {
  display: grid;
  grid-template-columns: 10rem minmax(0, 1fr);
  gap: clamp(1.5rem, 4vw, 2.75rem);
  align-items: start;
  padding: 1.5rem 0 2.25rem;
  border-bottom: 1px solid var(--ys-border);
}

.ys-about-avatar {
  display: grid;
  gap: 0.55rem;
  color: var(--ys-muted);
  font-family: var(--ys-font-mono);
  font-size: 0.68rem;
  line-height: 1.35;
  text-decoration: none;
  letter-spacing: 0.02em;
}

.ys-about-avatar img {
  display: block;
  width: 100%;
  height: auto;
  aspect-ratio: 1;
  object-fit: cover;
  border: 1px solid var(--ys-border);
  background: var(--ys-surface);
  filter: saturate(0.82) contrast(1.04);
  transition: border-color 160ms ease, filter 160ms ease;
}

.ys-about-avatar:hover {
  color: var(--ys-signal);
}

.ys-about-avatar:hover img,
.ys-about-avatar:focus-visible img {
  border-color: var(--ys-signal);
  filter: saturate(1) contrast(1.04);
}

.ys-about-avatar:focus-visible {
  outline: 2px solid var(--ys-signal);
  outline-offset: 4px;
}

.ys-about-avatar:active {
  color: var(--ys-text);
}

.ys-about-intro-copy {
  min-width: 0;
}

.ys-about-intro h2 {
  margin: 0.25rem 0 0.5rem;
  padding: 0;
  border: 0;
  color: var(--ys-text);
  font-family: var(--ys-font-mono);
  font-size: clamp(2rem, 8vw, 4.5rem);
  line-height: 1;
  letter-spacing: 0.08em;
  overflow-wrap: anywhere;
}

.ys-about-intro h2::before,
.ys-about-intro h2::after {
  display: none;
}

.ys-about-role {
  margin: 0;
  color: var(--ys-signal);
  font-size: 0.85rem;
  letter-spacing: 0.05em;
}

.ys-about-summary {
  max-width: 42rem;
  margin: 1.5rem 0 0;
  color: var(--ys-muted);
  line-height: 1.9;
}

.ys-about-intro blockquote {
  margin: 1.5rem 0 0;
  padding: 0 0 0 1rem;
  border-left: 2px solid var(--ys-signal);
  background: transparent;
  color: var(--ys-text);
}

.ys-about-section > header {
  margin-bottom: 1.25rem;
}

.ys-about-section h2 {
  margin: 0.25rem 0 0;
  padding: 0;
  border: 0;
  color: var(--ys-text);
  font-family: var(--ys-font-mono);
  font-size: 1.25rem;
  letter-spacing: 0.02em;
}

.ys-about-section h2::after {
  display: none;
}

.ys-skill-list {
  margin: 0;
  border-top: 1px solid var(--ys-border);
}

.ys-skill-row {
  display: grid;
  grid-template-columns: minmax(8rem, 0.6fr) minmax(0, 1.4fr);
  gap: 1rem;
  padding: 1rem 0;
  border-bottom: 1px solid var(--ys-border);
}

.ys-skill-row dt {
  color: var(--ys-text);
  font-weight: 600;
}

.ys-skill-row dd {
  margin: 0;
  color: var(--ys-muted);
}

.ys-focus-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  border-top: 1px solid var(--ys-border);
  border-left: 1px solid var(--ys-border);
}

.ys-focus-grid article {
  min-width: 0;
  padding: 1.25rem;
  border-right: 1px solid var(--ys-border);
  border-bottom: 1px solid var(--ys-border);
  background: var(--ys-surface);
}

.ys-focus-grid h3 {
  margin: 0 0 0.5rem;
  color: var(--ys-text);
  font-size: 0.95rem;
}

.ys-focus-grid p {
  margin: 0;
  color: var(--ys-muted);
  font-size: 0.85rem;
}

.ys-about-projects,
.ys-contact-list {
  border-top: 1px solid var(--ys-border);
}

.ys-about-projects a,
.ys-contact-list a {
  display: grid;
  grid-template-columns: minmax(9rem, 0.75fr) minmax(0, 1.25fr);
  gap: 1rem;
  padding: 1rem 0;
  border-bottom: 1px solid var(--ys-border);
  color: inherit;
  text-decoration: none;
}

.ys-about-projects a:hover,
.ys-contact-list a:hover {
  color: var(--ys-signal);
}

.ys-about-projects strong,
.ys-contact-list span {
  color: var(--ys-text);
  overflow-wrap: anywhere;
}

.ys-about-projects span,
.ys-contact-list strong {
  color: var(--ys-muted);
  font-weight: 400;
  overflow-wrap: anywhere;
}

@media (max-width: 640px) {
  .ys-about {
    gap: 2.75rem;
  }

  .ys-about-intro {
    grid-template-columns: 7.5rem minmax(0, 1fr);
    gap: 1.25rem;
  }

  .ys-about-intro h2 {
    font-size: clamp(1.8rem, 10vw, 2.8rem);
  }

  .ys-skill-row,
  .ys-about-projects a,
  .ys-contact-list a {
    grid-template-columns: 1fr;
    gap: 0.35rem;
  }

  .ys-focus-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 430px) {
  .ys-about-intro {
    grid-template-columns: 1fr;
  }

  .ys-about-avatar {
    width: 10rem;
  }
}

@media (prefers-reduced-motion: reduce) {
  .ys-about-avatar img {
    transition: none;
  }
}
</style>
