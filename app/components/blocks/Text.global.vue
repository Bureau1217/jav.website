<template>
  <div class="v-block-text-wrap u-flex u-flex--column u-gap-m">
    <UiSectionHeader v-if="block.content.title" :title="block.content.title" />
    <div class="v-block-text" v-html="block.content.text" />
  </div>
</template>

<script setup lang="ts">
import type { KqlBlock } from '~~/shared/types/kql'

defineProps<{
  block: KqlBlock
}>()
</script>

<style lang="scss" scoped>
.v-block-text-wrap {
  padding: var(--spacing-xl) var(--gutter);
  color: var(--color-brand-04);
  max-width: 860px;
}

.v-block-text {
  font-family: var(--font-body);
  font-weight: 500;
  font-size: 24px;
  line-height: 1;

  :deep(p) {
    margin: 0 0 var(--spacing-m);
  }

  :deep(a) {
    color: inherit;
    text-decoration: underline;
  }
}
</style>
