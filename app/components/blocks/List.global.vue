<template>
  <ul class="v-block-list">
    <li v-for="(item, index) in block.content.items" :key="index" class="v-block-list__item">
      <img v-if="imageUrl(item)" :src="imageUrl(item)!" :alt="item.title ?? ''">
      <h3 v-if="item.title">{{ item.title }}</h3>
      <div v-if="item.text" v-html="item.text" />
      <a v-if="item.link" :href="item.link">{{ item.link }}</a>
    </li>
  </ul>
</template>

<script setup lang="ts">
import type { KqlBlock, KqlFile } from '~~/shared/types/kql'

const props = defineProps<{
  block: KqlBlock
  images?: KqlFile[]
}>()

function imageUrl(item: { image?: string[] }): string | null {
  return resolveKqlFile(item.image, props.images)?.url ?? null
}
</script>

<style lang="scss" scoped>
.v-block-list {
}
</style>
