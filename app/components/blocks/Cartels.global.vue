<template>
  <div class="v-block-cartels">
    <UiCard
      v-for="(card, index) in block.content.cards"
      :key="index"
      background="var(--color-brand-05)"
      class="v-block-cartels__card"
    >
      <p v-if="card.tags" class="v-block-cartels__tags">{{ card.tags }}</p>
      <h3 v-if="card.title">{{ card.title }}</h3>
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
  padding: var(--spacing-xl) var(--spacing-6xl);
  color: var(--color-brand-04);

  @media (max-width: 900px) {
    padding: var(--spacing-xl);
  }
}

.v-block-cartels__card {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-s);
  padding: var(--spacing-xl);

  h3 {
    @include heading-3;
  }

  div {
    @include text-body-large;
  }
}

.v-block-cartels__tags {
  @include text-label;
  text-transform: none;
}
</style>
