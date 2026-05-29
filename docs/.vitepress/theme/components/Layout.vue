<script setup>
import DefaultTheme from 'vitepress/theme'
import HeroSection from './HeroSection.vue'

const { Layout: DefaultLayout } = DefaultTheme
</script>

<template>
  <DefaultLayout>
    <template #home-hero-before>
      <HeroSection />
    </template>
  </DefaultLayout>
</template>
