<template>
  <div class="v-block-gallery u-flex u-flex--column u-flex--align-center u-gap-4xl u-gutter-x">
    <UiSectionHeader :title="block.content.title || 'JAV en image'" class="v-block-gallery__header" />

    <div v-if="current" class="v-block-gallery__media">
      <img v-if="currentImage" :src="currentImage.url" :alt="currentImage.alt ?? current.title ?? ''" class="v-block-gallery__image">
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
        <p v-if="current.title" class="v-block-gallery__title">{{ current.title }}</p>
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
  background: var(--color-brand-04);
  color: var(--color-brand-00);
  padding-block: var(--spacing-7xl);

  @media (max-width: $breakpoint-mobile) {
    padding-block: var(--spacing-4xl);
  }
}

.v-block-gallery__media {
  width: 100%;
  max-width: 1096px;
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

.v-block-gallery__title {
  font-family: var(--font-body);
  font-weight: 800;
  font-size: var(--spacing-2xl); // 32px
  line-height: 1;
}

.v-block-gallery__text {
  font-family: var(--font-body);
  font-weight: 500;
  font-size: 24px;
  line-height: 1;
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

  // Active dot gets a real accent color (mint) instead of just full opacity
  // on the same white, so it actually stands out against the others.
  &.is-active {
    background: var(--color-brand-01);
    opacity: 1;
  }
}
</style>
