<template>
  <ul class="v-block-resources">
    <li
      v-for="(item, index) in block.content.resource_items"
      :key="index"
      class="v-block-resources__item"
    >
      <a v-if="item.resource_type === 'file'" :href="fileUrl(item) ?? '#'" target="_blank" rel="noopener">
        {{ item.resource_title }}
      </a>
      <a v-else :href="item.resource_link">
        {{ item.resource_title }}
      </a>
    </li>
  </ul>
</template>

<script setup lang="ts">
import type { KqlBlock, KqlFile } from '~~/shared/types/kql'

const props = defineProps<{
  block: KqlBlock
  files?: KqlFile[]
}>()

function fileUrl(item: { resource_file?: string[] }): string | null {
  return resolveKqlFile(item.resource_file, props.files)?.url ?? null
}
</script>

<style lang="scss" scoped>
.v-block-resources {
  display: flex;
  flex-direction: column;
  padding: var(--spacing-xl) var(--spacing-6xl);
  color: var(--color-brand-04);

  @media (max-width: 900px) {
    padding: var(--spacing-xl);
  }
}

.v-block-resources__item {
  border-top: 2px solid var(--color-brand-04);
  padding: var(--spacing-m) 0;

  &:last-child {
    border-bottom: 2px solid var(--color-brand-04);
  }

  a {
    @include text-body-large-bold;
    color: inherit;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
}
</style>
