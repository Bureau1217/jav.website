<template>
  <div class="v-block-cartels-wrap u-flex u-flex--column u-gap-xl u-gutter-x">
    <UiSectionHeader v-if="block.content.title" :title="block.content.title" />
    <div class="v-block-cartels">
      <UiCard
        v-for="(card, index) in block.content.cards"
        :key="index"
        background="var(--color-brand-05)"
        color="var(--color-page-accent)"
        class="v-block-cartels__card u-flex u-flex--column"
      >
        <div v-if="card.format || tagList(card).length" class="v-block-cartels__row u-flex u-flex--align-start u-flex--justify-between u-gap-m">
          <span v-if="card.format" class="v-block-cartels__format">{{ card.format }}</span>
          <div v-if="tagList(card).length" class="v-block-cartels__tags u-flex u-gap-xs u-flex--wrap">
            <UiTag v-for="tag in tagList(card)" :key="tag">{{ tag }}</UiTag>
          </div>
        </div>
        <h3 v-if="card.title" class="v-block-cartels__title" v-html="card.title" />
        <div v-if="card.description" class="v-block-cartels__description" v-html="card.description" />
      </UiCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { KqlBlock } from '~~/shared/types/kql'

defineProps<{
  block: KqlBlock
}>()

// Kirby's "tags" field stores its raw value as a single comma-separated
// string (not an array) — split it into pills, same as the Section block.
function tagList(card: { tags?: string }): string[] {
  const raw = card.tags
  if (!raw) return []
  return String(raw).split(',').map((tag) => tag.trim()).filter(Boolean)
}
</script>

<style lang="scss" scoped>
.v-block-cartels-wrap {
  padding-block: var(--block-spacing);
  color: var(--color-page-accent);
}

.v-block-cartels {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: var(--spacing-xl);
}

// Filled pink by default; hovering swaps it to the bordered-cream look
// instead of alternating by card index. `!important` is needed because
// UiCard sets --ui-card-bg via an inline style (from its `background`
// prop), which otherwise always outranks a plain stylesheet rule.
.v-block-cartels__card {
  padding: var(--spacing-xl);
  min-height: 560px; // taller/more elongated, per updated design
  border: 2px solid transparent;
  transition: background-color 0.2s ease, border-color 0.2s ease;

  &:hover {
    --ui-card-bg: var(--color-brand-00) !important;
    border-color: var(--color-page-accent);
  }
}

.v-block-cartels__format {
  @include type-label;
}

.v-block-cartels__title {
  margin-top: var(--spacing-l);
}

.v-block-cartels__description {
  @include type-body-large;
  margin-top: auto;
  padding-top: var(--spacing-xl);

  :deep(p) {
    margin: 0;
  }
}
</style>
