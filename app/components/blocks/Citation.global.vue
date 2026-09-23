<template>
  <div class="v-block-citation-wrap u-flex u-flex--column u-gap-xl">
    <UiSectionHeader v-if="block.content.title" :title="block.content.title" />
    <blockquote class="v-block-citation u-flex u-flex--column u-flex--align-center u-gap-m">
      <div class="v-block-citation__content" v-html="contentHtml" />
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
// is never wrapped in <p> — but it's rendered inside a <div> here (a <p>
// can't validly nest inside another <p>). Strip one if present, so content
// saved before this field became inline still renders correctly instead of
// producing invalid nested markup.
const contentHtml = computed(() => {
  const raw = props.block.content.contenu ?? ''
  const match = raw.trim().match(/^<p>([\s\S]*)<\/p>$/i)
  return match ? match[1] : raw
})
</script>

<style lang="scss" scoped>
.v-block-citation-wrap {
  padding-block: calc(var(--spacing-7xl) + var(--spacing-6xl)); // 176px — a full standalone slab, not a tight inline quote
  margin-inline: var(--gutter);
  color: var(--color-page-accent);

  @media (max-width: $breakpoint-mobile) {
    padding-block: var(--spacing-6xl);
  }
}

// Centered statement, no quote-block styling (no left bar) — just the text
// itself, constrained to a readable line length and centered in the page.
// Vertical room now comes from the wrap's own padding-block above, so the
// section reads as a full standalone slab rather than a tight inline quote.
.v-block-citation {
  max-width: 70%;
  margin: 0 auto;
  text-align: center;
  color: var(--color-page-accent);
}

// A <div>, not a <h1> — this uses type-subtitle (48px, 104px line-height),
// unlike h1's canonical style (Inter, see typo.scss) — h1 is now reserved
// for "Titre de la section" fields.
.v-block-citation__content {
  @include type-subtitle; // 48px
  line-height: 1.2; // overrides the subtitle mixin's own loose 104px leading

  @media (max-width: $breakpoint-mobile) {
    font-size: 32px;
  }

  :deep(p) {
    margin: 0;
  }
}

// Doesn't map to a named type style — every uppercase-label style in the
// scale (label/tag-date) would force-uppercase this, but it's a person's
// name/role ("Camille, élève en pratique amateur") that needs to keep its
// normal casing.
cite {
  font-family: var(--font-body);
  font-weight: 800;
  font-size: 16px;
  line-height: 1;
  font-style: normal;
}
</style>
