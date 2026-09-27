<template>
  <div class="v-block-list-wrap u-flex u-flex--column u-gap-xl u-gutter-x">
    <UiSectionHeader v-if="block.content.title" :title="block.content.title" />
    <UiDivider variant="thin" />
    <template v-for="(item, index) in block.content.items" :key="index">
      <component
        :is="item.link ? 'a' : 'div'"
        :href="item.link || undefined"
        :target="item.link ? '_blank' : undefined"
        :rel="item.link ? 'noopener' : undefined"
        class="v-block-list__item u-flex u-flex--column u-gap-l"
      >
        <div class="u-flex u-flex--align-center u-gap-m">
          <UiTag v-if="item.title">{{ item.title }}</UiTag>
          <span v-if="updatedLabel" class="v-block-list__date">{{ updatedLabel }}</span>
        </div>
        <div v-if="item.text" class="u-flex u-flex--align-center u-flex--justify-between u-gap-xl">
          <div class="v-block-list__text" v-html="item.text" />
          <span v-if="item.link" class="v-block-list__arrow" aria-hidden="true" />
        </div>
      </component>
      <UiDivider variant="thin" />
    </template>
  </div>
</template>

<script setup lang="ts">
import type { KqlBlock } from '~~/shared/types/kql'

const props = defineProps<{
  block: KqlBlock
  /** Page content's last-saved date ("Y-m-d") — items have no date field of
   * their own (see jav.cms/site/blueprints/blocks/list.yml), so every item
   * shows the same "mois année", same pattern as Resources.global.vue's
   * "MIS À JOUR EN ..." for link items. */
  pageModified?: string | null
}>()

const updatedLabel = computed(() => {
  if (!props.pageModified) return ''
  const date = new Date(props.pageModified)
  if (Number.isNaN(date.getTime())) return ''
  return new Intl.DateTimeFormat('fr-FR', { month: 'long', year: 'numeric' })
    .format(date)
    .toUpperCase()
})
</script>

<style lang="scss" scoped>
.v-block-list-wrap {
  color: var(--color-page-accent);
  padding-block: var(--block-spacing);
}

.v-block-list__item {
  text-decoration: none;
  color: inherit;
}

.v-block-list__date {
  @include type-tag-date;
  flex-shrink: 0;
}

.v-block-list__text {
  @include type-emphasis;

  :deep(p) {
    margin: 0;
  }
}

.v-block-list__item:hover .v-block-list__text {
  text-decoration: underline;
}

// Same icon/pattern as TheHeader.vue's nav-arrow and Gallery.global.vue's
// carousel arrows (mask-image so it inherits currentColor) — not to be
// confused with Resources.global.vue's download/external-link icons.
.v-block-list__arrow {
  flex-shrink: 0;
  width: 40px;
  height: 30px;
  background-color: currentColor;
  mask-image: url('/img/inconsnext.svg');
  -webkit-mask-image: url('/img/inconsnext.svg');
  mask-size: contain;
  -webkit-mask-size: contain;
  mask-repeat: no-repeat;
  -webkit-mask-repeat: no-repeat;
  mask-position: center;
  -webkit-mask-position: center;
}
</style>
