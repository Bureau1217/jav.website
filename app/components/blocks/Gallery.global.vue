<template>
  <div class="v-block-gallery">
    <figure
      v-for="(item, index) in block.content.items"
      :key="index"
      class="v-block-gallery__item"
    >
      <img v-if="imageUrl(item)" :src="imageUrl(item)!" :alt="item.title ?? ''">
      <figcaption v-if="item.title">{{ item.title }}</figcaption>
      <div v-if="item.content" v-html="item.content" />
      <a v-if="item.link" :href="item.link">{{ item.link }}</a>
    </figure>
  </div>
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
.v-block-gallery {
}
</style>
