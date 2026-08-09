<template>
  <article class="v-page-default">
    <header v-if="page.headerTitle || page.title" class="v-page-default__header">
      <img
        v-if="page.headerImage"
        :src="page.headerImage.url"
        :alt="page.headerImage.alt ?? ''"
        class="v-page-default__header-image"
      >
      <h1>{{ page.headerTitle || page.title }}</h1>
      <p v-if="page.headerSubtitle">{{ page.headerSubtitle }}</p>
    </header>

    <Blocks :blocks="page.blocks" :images="page.images" :files="page.files" />
  </article>
</template>

<script setup lang="ts">
import type { KqlPage } from '~~/shared/types/kql'

defineProps<{
  page: KqlPage
}>()
</script>

<style lang="scss" scoped>
.v-page-default {
}
</style>
