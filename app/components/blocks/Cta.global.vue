<template>
  <UiCard background="var(--color-brand-06)" color="var(--color-brand-00)" class="v-block-cta u-gutter-x">
    <div class="v-block-cta__rule u-flex u-flex--column u-gap-xs">
      <UiDivider />
      <UiDivider />
    </div>
    <div class="v-block-cta__content u-flex u-flex--column u-flex--align-center u-gap-m">
      <div v-if="block.content.title" class="v-block-cta__title" v-html="block.content.title" />
      <div
        v-if="block.content.description"
        class="v-block-cta__description"
        v-html="block.content.description"
      />
      <UiButton
        v-if="block.content.link?.link_url"
        :to="block.content.link.link_url"
        class="v-block-cta__link"
      >
        {{ block.content.link.link_text || 'En savoir plus' }}
      </UiButton>
    </div>
    <div class="v-block-cta__rule u-flex u-flex--column u-gap-xs">
      <UiDivider />
      <UiDivider />
    </div>
  </UiCard>
</template>

<script setup lang="ts">
import type { KqlBlock } from '~~/shared/types/kql'

defineProps<{
  block: KqlBlock
}>()
</script>

<style lang="scss" scoped>
// Full-bleed: the maroon background spans the entire viewport width (no
// horizontal margin), while the actual text/button content still sits
// inset from the edges via the `u-gutter-x` class on the card itself.
.v-block-cta {
  padding-block: var(--spacing-xl);
  margin-block: var(--spacing-xl);
  border-radius: 0;
}

.v-block-cta__content {
  padding-block: var(--spacing-2xl);
  text-align: center;

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

// Inverted from the card's own colors: cream pill with maroon text, so the
// button pops against the maroon card background.
.v-block-cta__link {
  --button-color: var(--color-brand-00);
  --button-text: var(--color-brand-06);
}
</style>
