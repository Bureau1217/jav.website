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
// Fixed pink/indigo pair, not the page-accent theme — this block's own
// look, per the reference mockup, not themed per-page like Gallery.
.v-block-inclusif {
  background: var(--color-brand-05);
  color: var(--color-brand-04);
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

// Small 4-point sparkle flanking the title, per the reference mockup —
// a mask-image (inline SVG data-uri, no separate asset needed) so it
// always matches the block's own indigo via currentColor.
.v-block-inclusif__sparkle {
  flex-shrink: 0;
  width: 28px;
  height: 28px;
  background-color: currentColor;
  mask-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 0c0 5-1 8-3 10s-5 3-9 2c4-1 7-2 9-4s3-4 3-8Zm0 24c0-5 1-8 3-10s5-3 9-2c-4 1-7 2-9 4s-3 4-3 8Zm0-14c0-2 .4-3.5 1.3-4.7A6.9 6.9 0 0 1 17 3c-2 .4-3.5 1-4.4 2S12 7.5 12 10Zm0 4c0 2-.4 3.5-1.3 4.7A6.9 6.9 0 0 1 7 21c2-.4 3.5-1 4.4-2S12 16.5 12 14Z"/></svg>');
  -webkit-mask-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 0c0 5-1 8-3 10s-5 3-9 2c4-1 7-2 9-4s3-4 3-8Zm0 24c0-5 1-8 3-10s5-3 9-2c-4 1-7 2-9 4s-3 4-3 8Zm0-14c0-2 .4-3.5 1.3-4.7A6.9 6.9 0 0 1 17 3c-2 .4-3.5 1-4.4 2S12 7.5 12 10Zm0 4c0 2-.4 3.5-1.3 4.7A6.9 6.9 0 0 1 7 21c2-.4 3.5-1 4.4-2S12 16.5 12 14Z"/></svg>');
  mask-size: contain;
  -webkit-mask-size: contain;
  mask-repeat: no-repeat;
  -webkit-mask-repeat: no-repeat;
  mask-position: center;
  -webkit-mask-position: center;

  @media (max-width: $breakpoint-mobile) {
    width: 20px;
    height: 20px;
  }
}

// Full width, heavily rounded corners (not a capped/narrower pill like
// Gallery.global.vue) — per the reference mockup.
.v-block-inclusif__media {
  width: 100%;
}

.v-block-inclusif__image {
  width: 100%;
  aspect-ratio: 1096 / 471;
  object-fit: cover;
  border-radius: var(--radius-pill);

  @media (max-width: $breakpoint-mobile) {
    border-radius: var(--radius-l);
  }
}

// Nested blocks (rendered via <Blocks> above) — scopes --block-spacing down
// to 48px for every block rendered inside, same treatment as Section's own
// nested content (see Section.global.vue). Also overrides the page-theme
// variables that themed blocks (Tableau avec colonnes, CtA...) read from,
// so their column dividers/titles/buttons pick up this block's own fixed
// indigo-on-pink pair instead of whatever the surrounding page is themed
// (green by default) — per the reference mockup.
.v-block-inclusif__content {
  --block-spacing: var(--spacing-4xl);
  --heading-1-size: 32px;
  --color-page-accent: var(--color-brand-04);
  --color-page-on-accent: var(--color-brand-05);
}
</style>
