<template>
  <UiCard background="var(--color-page-accent)" color="var(--color-page-on-accent)" class="v-block-cta u-gutter-x">
    <div class="v-block-cta__rule u-flex u-flex--column u-gap-xs">
      <UiDivider />
      <UiDivider />
    </div>
    <div class="v-block-cta__content u-flex u-flex--column u-flex--align-center u-gap-m">
      <h1 v-if="block.content.title" class="v-block-cta__title" v-html="block.content.title" />
      <p
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
// Full-bleed: the dark green background spans the entire viewport width (no
// horizontal margin), while the actual text/button content still sits
// inset from the edges via the `u-gutter-x` class on the card itself.
.v-block-cta {
  // 96px lives inside the card as padding (not an outer margin) so the
  // dark green background itself fills the vertical gap to neighboring blocks.
  padding-block: var(--block-spacing);
  border-radius: 0;
}

.v-block-cta__content {
  padding-block: var(--spacing-2xl);
  text-align: center;

  @media (max-width: $breakpoint-mobile) {
    padding-block: var(--spacing-xl);
  }
}

// Real <h1> — same tag as every other block's "Titre de la section" field
// (rendered via UiSectionHeader elsewhere); no local font override needed,
// typo.scss's bare tag rule covers it entirely.
.v-block-cta__title {
  :deep(em) {
    font-style: italic;
  }
}

// Real <p> — no local font override needed either, typo.scss's bare tag
// rule covers it entirely (Inter body-large).

// Inverted from the card's own colors: mint pill with dark green text, so
// the button pops against the dark green card background.
.v-block-cta__link {
  --button-color: var(--color-page-on-accent);
  --button-text: var(--color-page-accent);
}
</style>
