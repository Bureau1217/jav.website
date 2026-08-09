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
}
</style>
