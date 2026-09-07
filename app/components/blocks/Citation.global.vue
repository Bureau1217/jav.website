<template>
  <div class="v-block-citation-wrap u-flex u-flex--column u-gap-m">
    <UiSectionHeader v-if="block.content.title" :title="block.content.title" />
    <blockquote class="v-block-citation u-flex u-flex--column u-flex--align-center u-gap-m">
      <h2 class="v-block-citation__content" v-html="contentHtml" />
      <cite v-if="block.content.signature">{{ block.content.signature }}</cite>
    </blockquote>
  </div>
</template>

<script setup lang="ts">
import type { KqlBlock } from '~~/shared/types/kql'

const props = defineProps<{
  block: KqlBlock
}>()

// The writer field is now inline (see citation.yml), so newly-saved content
// is never wrapped in <p> — but it's rendered inside a real <h2> here (per
// design), and a <p> can't validly nest inside a heading. Strip one if
// present, so content saved before this field became inline still renders
// correctly instead of producing invalid nested markup.
const contentHtml = computed(() => {
  const raw = props.block.content.contenu ?? ''
  const match = raw.trim().match(/^<p>([\s\S]*)<\/p>$/i)
  return match ? match[1] : raw
})
</script>

<style lang="scss" scoped>
.v-block-citation-wrap {
  padding-block: var(--spacing-6xl);
  margin-inline: var(--gutter);
  color: var(--color-brand-06);

  @media (max-width: $breakpoint-mobile) {
    padding-block: var(--spacing-3xl);
  }
}

// Centered statement, no quote-block styling (no left bar) — just the text
// itself, constrained to a readable line length and centered in the page.
// Vertical room now comes from the wrap's own padding-block above, so the
// section reads as a full standalone slab rather than a tight inline quote.
.v-block-citation {
  max-width: 700px;
  margin: 0 auto;
  text-align: center;
  color: var(--color-brand-06);
}

.v-block-citation__content {
  font-family: var(--font-body);
  font-weight: 600;
  font-size: var(--spacing-2xl); // 32px
  line-height: 1.3;

  :deep(p) {
    margin: 0;
  }
}

cite {
  font-family: var(--font-body);
  font-weight: 800;
  font-size: var(--spacing-m); // 16px
  line-height: 1;
  font-style: normal;
}
</style>
