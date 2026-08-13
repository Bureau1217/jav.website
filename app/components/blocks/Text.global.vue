<template>
  <div class="v-block-text" v-html="block.content.text" />
</template>

<script setup lang="ts">
import type { KqlBlock } from '~~/shared/types/kql'

defineProps<{
  block: KqlBlock
}>()
</script>

<style lang="scss" scoped>
.v-block-text {
  @include text-body-large;
  padding: var(--spacing-xl) var(--spacing-6xl);
  color: var(--color-brand-04);
  max-width: 860px;

  @media (max-width: 900px) {
    padding: var(--spacing-xl);
  }

  :deep(p) {
    margin: 0 0 var(--spacing-m);
  }

  :deep(a) {
    color: inherit;
    text-decoration: underline;
  }
}
</style>
