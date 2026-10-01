<template>
  <div class="v-block-inclusif u-flex u-flex--column u-gap-xl">
    <div class="v-block-inclusif__header u-flex u-flex--column u-flex--align-center u-gap-xl u-gutter-x">
      <div v-if="block.content.title" class="v-block-inclusif__title-row u-flex u-flex--align-center u-gap-m">
        <span class="v-block-inclusif__sparkle" aria-hidden="true" />
        <h1 class="v-block-inclusif__title" v-html="titleHtml" />
        <span class="v-block-inclusif__sparkle" aria-hidden="true" />
      </div>
      <div v-if="image" class="v-block-inclusif__media">
        <img :src="image.url" :alt="image.alt ?? ''" class="v-block-inclusif__image" :style="{ objectPosition: objectPosition(image) }">
      </div>
    </div>

    <div v-if="parsedContent.length" class="v-block-inclusif__content">
      <Blocks :blocks="parsedContent" :images="images" :files="files" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { KqlBlock, KqlFile } from '~~/shared/types/kql'

const props = defineProps<{
  block: KqlBlock
  images?: KqlFile[]
  files?: KqlFile[]
}>()

const image = computed(() => props.block.inclusifImage ?? null)
const parsedContent = computed(() => parseKqlBlocks(props.block.content.content))

// The "title" field is inline (see inclusif.yml), so newly-saved content is
// never wrapped in <p> — but content saved before it became inline still
// is, and this renders it inside an <h1>, where a nested <p> isn't valid
// HTML. Strip one if present — same fix as Citation/Text.global.vue.
const titleHtml = computed(() => {
  const raw = props.block.content.title ?? ''
  const match = raw.trim().match(/^<p>([\s\S]*)<\/p>$/i)
  return match ? match[1] : raw
})
</script>

<style lang="scss" scoped>
// Fixed pink/green pair, not the page-accent theme — this block's own
// look, per the reference mockup, not themed per-page like Gallery.
.v-block-inclusif {
  background: var(--color-brand-05);
  color: var(--color-brand-02);
  padding-block: var(--block-spacing);
}

.v-block-inclusif__title-row {
  max-width: 100%;
}

// A <div>, not a <p> — this uses the decorative script accent style
// (Feroniapi), same font as Formations.global.vue's banner subtitle, not
// typo.scss's canonical h1 (Inter/GT Maru).
.v-block-inclusif__title {
  @include type-accent-italic;
  font-size: 48px;
  text-align: center;

  @media (max-width: $breakpoint-mobile) {
    font-size: 32px;
  }
}

// Real exported icon (public/img), flanking the title, per the reference
// mockup — a mask-image (not <img>) so it's recolored via `color` to always
// match the block's own green via currentColor, same pattern as
// TheHeader.vue's logo mark / Resources.global.vue's icons.
.v-block-inclusif__sparkle {
  flex-shrink: 0;
  width: 28px;
  height: 28px;
  background-color: currentColor;
  mask: url('/img/emojiinclusif.svg') center / contain no-repeat;
  -webkit-mask: url('/img/emojiinclusif.svg') center / contain no-repeat;

  @media (max-width: $breakpoint-mobile) {
    width: 20px;
    height: 20px;
  }
}

// Same size/shape as Gallery.global.vue's own media — capped width, wide
// aspect ratio, near-pill corners.
.v-block-inclusif__media {
  width: 100%;
  max-width: 1096px;
}

.v-block-inclusif__image {
  width: 100%;
  aspect-ratio: 1096 / 471;
  object-fit: cover;
  border-radius: 999px;

  // Same mobile treatment as Gallery.global.vue's own image — taller/bigger
  // (the desktop ratio is a wide, short strip) with a fixed 150px radius
  // instead of the desktop full pill.
  @media (max-width: $breakpoint-mobile) {
    aspect-ratio: 3 / 4;
    border-radius: 150px;
  }
}

// Nested blocks (rendered via <Blocks> above) — scopes --block-spacing down
// to 48px for every block rendered inside, same treatment as Section's own
// nested content (see Section.global.vue). Also overrides the page-theme
// variables that themed blocks (Tableau avec colonnes, CtA...) read from,
// so their column dividers/titles/buttons pick up this block's own fixed
// green-on-pink pair instead of whatever the surrounding page is themed
// (green by default too, but this stays fixed even on a maroon/orange page)
// — per the reference mockup.
.v-block-inclusif__content {
  --block-spacing: var(--spacing-4xl);
  --heading-1-size: 32px;
  --color-page-accent: var(--color-brand-02);
  --color-page-on-accent: var(--color-brand-05);
  // Any UiButton nested in here (a CtA block's own button, Section's header
  // link...) — filled green pill, light pink text, per the reference
  // mockup, overriding UiButton's own site-wide default (cream bg/indigo
  // text) since custom properties cascade straight through child
  // components regardless of their own scoped styles.
  --button-color: var(--color-brand-02);
  --button-text: var(--color-brand-05);

  // CtA's own button (Cta.global.vue's .v-block-cta__link) sets
  // --button-color/--button-text itself (inverted: page-on-accent/
  // page-accent, i.e. pink bg/green text here) — needs its own override at
  // higher specificity to actually win over that, the generic one above
  // isn't enough.
  :deep(.v-block-cta__link) {
    --button-color: var(--color-brand-02);
    --button-text: var(--color-brand-05);
  }

  // A CtA block right after a Text block, per the reference mockup, isn't
  // its own full-bleed colored card — it's just the button sitting directly
  // under the text, same pink background throughout, no dividers/card
  // padding. background/color need !important: UiCard sets them via an
  // inline style (--ui-card-bg/--ui-card-color), which otherwise beats any
  // external rule regardless of selector specificity.
  :deep(.v-block-cta) {
    background: transparent !important;
    color: inherit !important;
    padding-block: 0;
    border-radius: 0;

    .v-block-cta__rule {
      display: none;
    }

    .v-block-cta__content {
      align-items: flex-start;
      text-align: left;
      padding-block: 0;
      gap: var(--spacing-m);
    }
  }
}
</style>
