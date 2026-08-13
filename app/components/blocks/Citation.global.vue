<template>
  <blockquote class="v-block-citation">
    <div class="v-block-citation__content" v-html="block.content.contenu" />
    <cite v-if="block.content.signature">{{ block.content.signature }}</cite>
  </blockquote>
</template>

<script setup lang="ts">
import type { KqlBlock } from '~~/shared/types/kql'

defineProps<{
  block: KqlBlock
}>()
</script>

<style lang="scss" scoped>
.v-block-citation {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-m);
  margin: var(--spacing-xl) var(--spacing-6xl);
  padding: var(--spacing-xl);
  border-left: 6px solid var(--color-brand-04);
  color: var(--color-brand-04);

  @media (max-width: 900px) {
    margin: var(--spacing-xl);
  }
}

.v-block-citation__content {
  @include text-emphasis;

  :deep(p) {
    margin: 0;
  }
}

cite {
  @include text-label;
  text-transform: none;
  font-style: normal;
}
</style>
