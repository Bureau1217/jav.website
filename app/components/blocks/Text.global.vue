<template>
  <div class="v-block-text-wrap u-flex u-flex--column u-gap-xl">
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
  padding-block: var(--block-spacing);
  padding-inline: var(--gutter);
  color: var(--color-page-accent);
  max-width: 860px;
}

.v-block-text {
  @include type-body-large;

  :deep(p) {
    margin: 0 0 var(--spacing-m);
  }

  :deep(a) {
    color: inherit;
    text-decoration: underline;
  }
}
</style>
