<template>
  <div class="v-block-cta">
    <div v-if="block.content.title" class="v-block-cta__title" v-html="block.content.title" />
    <div
      v-if="block.content.description"
      class="v-block-cta__description"
      v-html="block.content.description"
    />
    <a v-if="block.content.link" :href="block.content.link" class="v-block-cta__link">
      {{ block.content.link }}
    </a>
  </div>
</template>

<script setup lang="ts">
import type { KqlBlock } from '~~/shared/types/kql'

defineProps<{
  block: KqlBlock
}>()
</script>

<style lang="scss" scoped>
.v-block-cta {
}
</style>
