<template>
  <div class="v-block-cartels">
    <UiCard
      v-for="(card, index) in block.content.cards"
      :key="index"
      background="var(--color-brand-05)"
      class="v-block-cartels__card u-flex u-flex--column u-gap-s"
    >
      <p v-if="card.tags" class="v-block-cartels__tags">{{ card.tags }}</p>
      <h3 v-if="card.title" v-html="card.title" />
      <div v-if="card.description" v-html="card.description" />
    </UiCard>
  </div>
</template>

<script setup lang="ts">
import type { KqlBlock } from '~~/shared/types/kql'

defineProps<{
  block: KqlBlock
}>()
</script>

<style lang="scss" scoped>
.v-block-cartels {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--spacing-xl);
  padding: var(--spacing-xl) var(--gutter);
  color: var(--color-brand-04);
}

.v-block-cartels__card {
  padding: var(--spacing-xl);

  div {
    font-family: var(--font-body);
    font-weight: 500;
    font-size: 24px;
    line-height: 1;
  }
}

.v-block-cartels__tags {
  font-family: var(--font-body);
  font-weight: 800;
  font-size: var(--spacing-m); // 16px
  line-height: 1;
}
</style>
