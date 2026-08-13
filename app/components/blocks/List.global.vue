<template>
  <ul class="v-block-list">
    <li v-for="(item, index) in block.content.items" :key="index" class="v-block-list__item">
      <img v-if="imageUrl(item)" :src="imageUrl(item)!" :alt="item.title ?? ''">
      <h3 v-if="item.title">{{ item.title }}</h3>
      <div v-if="item.text" v-html="item.text" />
      <UiButton v-if="item.link" variant="secondary" :to="item.link" class="v-block-list__link">
        {{ item.link }}
      </UiButton>
    </li>
  </ul>
</template>

<script setup lang="ts">
import type { KqlBlock, KqlFile } from '~~/shared/types/kql'

const props = defineProps<{
  block: KqlBlock
  images?: KqlFile[]
}>()

function imageUrl(item: { image?: string[] }): string | null {
  return resolveKqlFile(item.image, props.images)?.url ?? null
}
</script>

<style lang="scss" scoped>
.v-block-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: var(--spacing-xl);
  padding: var(--spacing-6xl);
  color: var(--color-brand-04);

  @media (max-width: 900px) {
    padding: var(--spacing-xl);
  }
}

.v-block-list__item {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-s);

  img {
    width: 100%;
    aspect-ratio: 4 / 3;
    object-fit: cover;
    border-radius: var(--radius-m);
  }

  h3 {
    @include heading-3;
  }

  div {
    @include text-body;
  }
}

.v-block-list__link {
  align-self: flex-start;
}
</style>
