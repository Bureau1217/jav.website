<template>
  <div class="v-block-toggle">
    <details
      v-for="(item, index) in block.content.items"
      :key="index"
      class="v-block-toggle__item"
    >
      <summary>{{ item.titre }}</summary>
      <div v-html="item.contenu" />
    </details>
  </div>
</template>

<script setup lang="ts">
import type { KqlBlock } from '~~/shared/types/kql'

defineProps<{
  block: KqlBlock
}>()
</script>

<style lang="scss" scoped>
.v-block-toggle {
}
</style>
