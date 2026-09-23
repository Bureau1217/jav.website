<template>
  <div class="v-block-array-layout u-flex u-flex--column u-gap-xl u-gutter-x">
    <h1 v-if="block.content.title" v-html="block.content.title" />
    <div class="v-block-array-layout__columns u-flex u-gap-2xl">
      <div
        v-for="(column, index) in block.content.columns"
        :key="index"
        class="v-block-array-layout__column u-flex u-flex--column u-gap-xl"
      >
        <template v-for="(item, itemIndex) in columnItems(column)" :key="itemIndex">
          <!-- "cta" items are shown as a compact pink badge (caption + bold
               label) instead of the big full-bleed CTA used standalone
               elsewhere — see Cta.global.vue for that other treatment. -->
          <UiCard
            v-if="item.type === 'cta'"
            :to="item.content.link?.link_url || undefined"
            background="var(--color-brand-05)"
            color="var(--color-page-accent)"
            class="v-block-array-layout__cta u-flex u-flex--column u-flex--align-center u-gap-xs"
          >
            <span v-if="item.content.link?.link_text" class="v-block-array-layout__cta-caption">
              {{ item.content.link.link_text }}
            </span>
            <span v-if="item.content.title" class="v-block-array-layout__cta-title" v-html="item.content.title" />
          </UiCard>

          <template v-else>
            <h3 v-if="column.columns_title && itemIndex === 0" v-html="column.columns_title" />
            <UiDivider v-if="column.columns_title && itemIndex === 0" variant="thin" />
            <div class="v-block-array-layout__item" v-html="item.content.text" />
            <UiDivider variant="thin" />
          </template>
        </template>
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

function columnItems(column: { columns_content?: string }) {
  return parseKqlBlocks(column.columns_content)
}
</script>

<style lang="scss" scoped>
.v-block-array-layout {
  padding-block: var(--block-spacing);
  color: var(--color-page-accent);
}

.v-block-array-layout__columns {
  @media (max-width: $breakpoint-mobile) {
    flex-direction: column;
  }
}

.v-block-array-layout__column {
  flex: 1;
  padding-inline: var(--spacing-xl);
  border-left: 3px solid var(--color-page-accent);

  &:first-child {
    padding-left: 0;
    border-left: none;
  }

  // "Titre de la colonne" — Inter instead of the canonical h3 (GT Maru),
  // type-text-heading-1 already matches the target size (32px).
  h3 {
    @include type-text-heading-1;
  }
}

// A <div>, not a <p> — this is bold (type-body-large-bold), unlike a <p>'s
// canonical style (type-body-large, weight 500).
.v-block-array-layout__item {
  @include type-body-large-bold;
}

.v-block-array-layout__cta {
  padding: var(--spacing-l) var(--spacing-xl);
  text-align: center;
  text-decoration: none;
}

.v-block-array-layout__cta-caption {
  @include type-body;
}

.v-block-array-layout__cta-title {
  @include type-text-heading-1;
}
</style>
