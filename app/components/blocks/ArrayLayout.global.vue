<template>
  <div class="v-block-array-layout u-flex u-flex--column u-gap-xl">
    <h3 v-if="block.content.title" v-html="block.content.title" />
    <div class="v-block-array-layout__columns u-flex u-gap-2xl">
      <div
        v-for="(column, index) in block.content.columns"
        :key="index"
        class="v-block-array-layout__column u-flex u-flex--column u-gap-m"
      >
        <div v-if="column.columns_title" v-html="column.columns_title" />
        <Blocks :blocks="parseKqlBlocks(column.columns_content)" :images="images" :files="files" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { KqlBlock, KqlFile } from '~~/shared/types/kql'

defineProps<{
  block: KqlBlock
  images?: KqlFile[]
  files?: KqlFile[]
}>()
</script>

<style lang="scss" scoped>
.v-block-array-layout {
  padding: var(--spacing-xl) var(--gutter);
  color: var(--color-brand-04);
}

.v-block-array-layout__columns {
  @media (max-width: $breakpoint-mobile) {
    flex-direction: column;
  }
}

.v-block-array-layout__column {
  flex: 1;

  > div:first-child {
    font-family: var(--font-body);
    font-weight: 800;
    font-size: var(--spacing-m); // 16px
    line-height: 1;
  }
}
</style>
