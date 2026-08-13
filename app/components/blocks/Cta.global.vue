<template>
  <UiCard background="var(--color-brand-05)" color="var(--color-brand-04)" class="v-block-cta">
    <div v-if="block.content.title" class="v-block-cta__title" v-html="block.content.title" />
    <div
      v-if="block.content.description"
      class="v-block-cta__description"
      v-html="block.content.description"
    />
    <UiButton v-if="block.content.link" :to="block.content.link" class="v-block-cta__link">
      {{ block.content.link }}
    </UiButton>
  </UiCard>
</template>

<script setup lang="ts">
import type { KqlBlock } from '~~/shared/types/kql'

defineProps<{
  block: KqlBlock
}>()
</script>

<style lang="scss" scoped>
.v-block-cta {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--spacing-m);
  padding: var(--spacing-4xl) var(--spacing-6xl);
  margin: var(--spacing-xl) var(--spacing-6xl);

  @media (max-width: 900px) {
    padding: var(--spacing-xl);
    margin: var(--spacing-xl);
  }
}

.v-block-cta__title {
  @include heading-2;

  :deep(em) {
    font-style: italic;
  }
}

.v-block-cta__description {
  @include text-body-large;
}

.v-block-cta__link {
  --button-color: var(--color-brand-04);
  --button-text: var(--color-brand-00);
}
</style>
