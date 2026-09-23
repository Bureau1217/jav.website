<template>
  <div class="v-block-gallery u-flex u-flex--column u-flex--align-center u-gap-xl u-gutter-x">
    <UiSectionHeader :title="block.content.title || 'JAV en image'" class="v-block-gallery__header" />

    <div class="v-block-gallery__body u-flex u-flex--column u-flex--align-center u-gap-4xl">
      <div v-if="current" class="v-block-gallery__media">
        <component
          :is="current.link ? 'a' : 'div'"
          v-if="currentImage"
          :href="current.link || undefined"
          :target="current.link ? '_blank' : undefined"
          :rel="current.link ? 'noopener' : undefined"
          class="v-block-gallery__image-wrap"
        >
          <img :src="currentImage.url" :alt="currentImage.alt ?? current.title ?? ''" class="v-block-gallery__image">
          <img v-if="current.link" src="/img/play-button.svg" alt="" aria-hidden="true" class="v-block-gallery__play">
        </component>
      </div>

      <div v-if="current" class="v-block-gallery__carousel u-flex u-flex--align-center u-gap-xl">
        <button
          type="button"
          class="v-block-gallery__arrow"
          :disabled="items.length < 2"
          aria-label="Élément précédent"
          @click="prev"
        >
          ‹
        </button>

        <div class="v-block-gallery__content u-flex u-flex--column u-flex--align-center u-gap-s">
          <div v-if="current.title" class="v-block-gallery__title">{{ current.title }}</div>
          <div v-if="current.content" class="v-block-gallery__text" v-html="current.content" />
        </div>

        <button
          type="button"
          class="v-block-gallery__arrow"
          :disabled="items.length < 2"
          aria-label="Élément suivant"
          @click="next"
        >
          ›
        </button>
      </div>

      <div v-if="items.length > 1" class="v-block-gallery__dots u-flex u-gap-s">
        <button
          v-for="(item, index) in items"
          :key="index"
          type="button"
          class="v-block-gallery__dot"
          :class="{ 'is-active': index === activeIndex }"
          :aria-label="`Aller à l'élément ${index + 1}`"
          @click="activeIndex = index"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { KqlBlock, KqlFile } from '~~/shared/types/kql'

const props = defineProps<{
  block: KqlBlock
  images?: KqlFile[]
}>()

const items = computed(() => (props.block.content.items ?? []) as Array<{
  title?: string
  content?: string
  image?: string[]
  link?: string
}>)

const activeIndex = ref(0)
const current = computed(() => items.value[activeIndex.value])

// Items pick their image from anywhere on the site (a file:// UUID), not
// just from files uploaded to this page — so the block's own resolved
// itemImages (see server/utils/kqlPageQuery.ts) is the primary source.
// resolveKqlFile against the page's own images/files is kept as a fallback
// for the (rare) case an image was actually uploaded straight to this page.
const currentImage = computed(() =>
  props.block.itemImages?.[activeIndex.value]?.image
  ?? resolveKqlFile(current.value?.image, props.images)
)

function prev() {
  if (items.value.length < 2) return
  activeIndex.value = (activeIndex.value - 1 + items.value.length) % items.value.length
}

function next() {
  if (items.value.length < 2) return
  activeIndex.value = (activeIndex.value + 1) % items.value.length
}
</script>

<style lang="scss" scoped>
.v-block-gallery {
  background: var(--color-page-accent);
  color: var(--color-brand-00);
  padding-block: var(--block-spacing);
}

// Full width, like .ui-section-header above it — so it doesn't shrink to
// fit its own content and instead lets .v-block-gallery__media's own
// max-width (below) govern how wide the media actually renders.
.v-block-gallery__body {
  width: 100%;
}

.v-block-gallery__media {
  width: 100%;
  max-width: 1096px;
}

.v-block-gallery__image-wrap {
  position: relative;
  display: block;
}

.v-block-gallery__image {
  width: 100%;
  aspect-ratio: 1096 / 471;
  object-fit: cover;
  border-radius: 999px;

  @media (max-width: $breakpoint-mobile) {
    border-radius: var(--radius-l);
  }
}

// Only shown when the item's "Lien" field is filled — signals the image is
// clickable and leads to that link (e.g. a video hosted elsewhere), instead
// of embedding a player straight in the page.
.v-block-gallery__play {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 88px;
  height: 88px;
  pointer-events: none;

  @media (max-width: $breakpoint-mobile) {
    width: 56px;
    height: 56px;
  }
}

.v-block-gallery__carousel {
  width: 100%;
}

.v-block-gallery__arrow {
  flex-shrink: 0;
  background: transparent;
  border: none;
  color: var(--color-brand-00);
  font-size: 40px;
  line-height: 1;
  cursor: pointer;

  &:disabled {
    opacity: 0.3;
    cursor: default;
  }
}

.v-block-gallery__content {
  flex: 1;
  text-align: center;
  max-width: 676px;
  margin: 0 auto;
}

// A <div>, not a <p> — this uses type-text-heading-1 (Inter 700/32px),
// unlike a <p>'s canonical style (type-body-large, 500/24px).
.v-block-gallery__title {
  @include type-text-heading-1;
}

.v-block-gallery__text {
  @include type-body-large;
}

.v-block-gallery__dot {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--color-brand-00);
  opacity: 0.35;
  border: none;
  padding: 0;
  cursor: pointer;

  // Active dot gets a real accent color (mint, white on some pages — see
  // usePageTheme.ts) instead of just full opacity on the same white, so it
  // actually stands out against the others.
  &.is-active {
    background: var(--color-page-on-accent);
    opacity: 1;
  }
}
</style>
