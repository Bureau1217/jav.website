<template>
  <UiCard background="var(--color-brand-05)" color="var(--color-brand-04)" class="v-block-cta u-flex u-flex--column u-flex--align-start u-gap-m u-gutter-x">
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
  padding-block: var(--spacing-4xl);
  margin: var(--spacing-xl) var(--gutter);

  @media (max-width: $breakpoint-mobile) {
    padding-block: var(--spacing-xl);
  }
}

.v-block-cta__title {
  font-family: var(--font-heading);
  font-weight: 700;
  font-size: var(--spacing-4xl); // 48px
  line-height: 1;

  :deep(em) {
    font-style: italic;
  }
}

.v-block-cta__description {
  font-family: var(--font-body);
  font-weight: 500;
  font-size: 24px;
  line-height: 1;
}

.v-block-cta__link {
  --button-color: var(--color-brand-04);
  --button-text: var(--color-brand-00);
}
</style>
