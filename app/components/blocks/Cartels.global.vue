<template>
  <div class="v-block-cartels">
    <article
      v-for="(card, index) in block.content.cards"
      :key="index"
      class="v-block-cartels__card"
    >
      <p v-if="card.tags" class="v-block-cartels__tags">{{ card.tags }}</p>
      <h3 v-if="card.title">{{ card.title }}</h3>
      <div v-if="card.description" v-html="card.description" />
    </article>
  </div>
</template>

<script setup lang="ts">
import type { KqlBlock } from '~~/shared/types/kql'

defineProps<{
  block: KqlBlock
}>()
</script>

<style lang="scss" scoped>
.v-block-cartels {
}
</style>
