<template>
  <div class="v-block-list-wrap u-flex u-flex--column u-gap-xl u-gutter-x">
    <UiSectionHeader v-if="block.content.title" :title="block.content.title" />
    <ul class="v-block-list">
      <li v-for="(item, index) in block.content.items" :key="index" class="v-block-list__item u-flex u-flex--column u-gap-s">
        <img v-if="imageUrl(item)" :src="imageUrl(item)!" :alt="item.title ?? ''">
        <h3 v-if="item.title">{{ item.title }}</h3>
        <div v-if="item.text" v-html="item.text" />
        <UiButton v-if="item.link" variant="secondary" :to="item.link" class="v-block-list__link">
          {{ item.link }}
        </UiButton>
      </li>
    </ul>
  </div>
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
.v-block-list-wrap {
  color: var(--color-page-accent);
  padding-block: var(--block-spacing);
}

.v-block-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: var(--spacing-xl);
}

.v-block-list__item {
  img {
    width: 100%;
    aspect-ratio: 4 / 3;
    object-fit: cover;
    border-radius: var(--radius-m);
  }

  div {
    @include type-body;
  }
}

.v-block-list__link {
  align-self: flex-start;
}
</style>
