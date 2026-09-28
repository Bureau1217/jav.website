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
  // auto-fit (not auto-fill) so a row with fewer cards than the column cap
  // still stretches to fill the full width — a plain `repeat(4, 1fr)` left
  // an empty 4th track (and matching dead space) whenever there were only
  // 2 or 3 cards. The minmax lower bound is set to whichever is bigger,
  // 280px or 1/N of the row, so auto-fit can never pack in more than N
  // columns even on a very wide screen, while still collapsing any empty
  // trailing tracks so real cards grow to fill the row.
  // The lower bound accounts for the gap explicitly (100% minus the gaps a
  // full row would have, divided by the column count) — a plain percentage
  // like 25% looks right but, once gaps are subtracted from the actual
  // available space, is just barely too wide for N columns to fit, so
  // auto-fit silently drops to N-1 well before the cap is reached.
  grid-template-columns: repeat(auto-fit, minmax(max(280px, calc((100% - 3 * var(--spacing-xl)) / 4)), 1fr));
  gap: var(--spacing-xl);

  @media (max-width: 1400px) {
    grid-template-columns: repeat(auto-fit, minmax(max(260px, calc((100% - 2 * var(--spacing-xl)) / 3)), 1fr));
  }

  @media (max-width: 1100px) {
    grid-template-columns: repeat(auto-fit, minmax(max(240px, calc((100% - var(--spacing-xl)) / 2)), 1fr));
  }

  @media (max-width: $breakpoint-mobile) {
    grid-template-columns: 1fr;
  }
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
    margin: 0 0 var(--spacing-m);
  }

  :deep(p:last-child) {
    margin-bottom: 0;
  }

  :deep(strong) {
    font-weight: 800;
  }

  :deep(em) {
    font-style: italic;
  }

  // Global reset (typo.scss) strips every list's own marker/indent — restore
  // both here, same treatment as Text.global.vue, so the writer field's
  // bullet/numbered lists (and their nested, Tab-indented sub-lists)
  // actually render as such.
  :deep(ul),
  :deep(ol) {
    margin: 0 0 var(--spacing-m);
    padding-left: var(--spacing-xl);
  }

  :deep(ul) {
    list-style: disc;
  }

  :deep(ol) {
    list-style: decimal;
  }

  :deep(li) {
    margin-bottom: var(--spacing-xs);

    ul,
    ol {
      margin-top: var(--spacing-xs);
      margin-bottom: 0;
    }
  }

  :deep(li:last-child) {
    margin-bottom: 0;
  }
}
</style>
