<template>
  <section class="v-block-section">
    <header v-if="block.content.title || block.content.text" class="v-block-section__header">
      <h2 v-if="block.content.title">{{ block.content.title }}</h2>
      <p v-if="block.content.tags">{{ block.content.tags }}</p>
      <div v-if="block.content.text" v-html="block.content.text" />
      <a v-if="block.content.link?.link_url" :href="block.content.link.link_url">
        {{ block.content.link.link_text }}
      </a>
    </header>

    <Blocks :blocks="parseKqlBlocks(block.content.content)" :images="images" :files="files" />
  </section>
</template>

<script setup lang="ts">
import type { KqlBlock, KqlFile } from '~~/shared/types/kql'

defineProps<{
  block: KqlBlock
  images?: KqlFile[]
  files?: KqlFile[]
}>()
</script>

<style lang="scss" scoped>
.v-block-section {
}
</style>
