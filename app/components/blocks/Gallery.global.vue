<template>
  <div class="v-block-gallery">
    <UiSectionHeader title="JAV en image" class="v-block-gallery__header" />

    <div v-if="current" class="v-block-gallery__media">
      <img v-if="imageUrl(current)" :src="imageUrl(current)!" :alt="current.title ?? ''" class="v-block-gallery__image">
    </div>

    <div v-if="current" class="v-block-gallery__carousel">
      <button
        type="button"
        class="v-block-gallery__arrow"
        :disabled="items.length < 2"
        aria-label="Élément précédent"
        @click="prev"
      >
        ‹
      </button>

      <div class="v-block-gallery__content">
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

    <div v-if="items.length > 1" class="v-block-gallery__dots">
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

function imageUrl(item: { image?: string[] }): string | null {
  return resolveKqlFile(item.image, props.images)?.url ?? null
}

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
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-4xl);
  background: var(--color-brand-04);
  color: var(--color-brand-00);
  padding: var(--spacing-7xl) var(--spacing-6xl);

  @media (max-width: 900px) {
    padding: var(--spacing-4xl) var(--spacing-xl);
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

  @media (max-width: 900px) {
    border-radius: var(--radius-l);
  }
}

.v-block-gallery__carousel {
  display: flex;
  align-items: center;
  gap: var(--spacing-xl);
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
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-s);
  text-align: center;
  max-width: 676px;
  margin: 0 auto;
}

.v-block-gallery__title {
  @include text-emphasis;
}

.v-block-gallery__text {
  @include text-body-large;
}

.v-block-gallery__dots {
  display: flex;
  gap: var(--spacing-s);
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

  &.is-active {
    opacity: 1;
  }
}
</style>
