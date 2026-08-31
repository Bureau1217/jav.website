<template>
  <div class="v-block-resources u-flex u-flex--column u-gap-xl">
    <UiSectionHeader v-if="block.content.title" :title="block.content.title" />
    <ul class="v-block-resources__list u-flex u-flex--column">
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
  </div>
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
  padding: var(--spacing-xl) var(--gutter);
  color: var(--color-brand-04);
}

.v-block-resources__item {
  border-top: 2px solid var(--color-brand-04);
  padding: var(--spacing-m) 0;

  &:last-child {
    border-bottom: 2px solid var(--color-brand-04);
  }

  a {
    font-family: var(--font-body);
    font-weight: 700;
    font-size: 24px;
    line-height: 1;
    color: inherit;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
}
</style>
