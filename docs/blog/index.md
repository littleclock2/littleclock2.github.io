---
title: 文章
description: YunSword 的嵌入式开发、MCU 与硬件设计实践记录。
---

<script setup>
import { data as posts } from '../.vitepress/data/blog.data.mjs'
</script>

# 文章

记录嵌入式开发、MCU、信号处理与硬件设计中的实践和判断。

<div class="ys-post-index">
  <article v-for="post in posts" :key="post.url" class="ys-post-row">
    <a :href="post.url" class="ys-post-row-link">
      <div class="ys-post-meta">
        <time :datetime="post.date">{{ post.date }}</time>
        <span v-for="tag in post.tags" :key="tag">{{ tag }}</span>
      </div>
      <h2>{{ post.title }}</h2>
      <p>{{ post.description }}</p>
    </a>
  </article>
</div>
