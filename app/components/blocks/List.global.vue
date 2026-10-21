<template>
  <div class="v-block-list-wrap u-flex u-flex--column u-gap-xl u-gutter-x">
    <UiSectionHeader v-if="block.content.title" :title="block.content.title" />

    <!-- "Image" items (Type de média = Image, with an actual image picked)
         — the block's original grid display, kept alongside the
         press-mentions list below for items that use it instead. -->
    <div v-if="imageItems.length" class="v-block-list__grid">
      <component
        :is="item.link ? 'a' : 'div'"
        v-for="{ item, image } in imageItems"
        :key="item._index"
        :href="item.link || undefined"
        :target="item.link ? '_blank' : undefined"
        :rel="item.link ? 'noopener' : undefined"
        class="v-block-list__grid-item u-flex u-flex--column u-flex--align-center u-gap-m"
      >
        <div class="v-block-list__grid-image">
          <img :src="image.url" :alt="image.alt ?? ''" :style="{ objectPosition: objectPosition(image) }">
        </div>
        <span v-if="item.title" class="v-block-list__grid-title">{{ item.title }}</span>
        <div v-if="item.text" class="v-block-list__grid-text" v-html="item.text" />
      </component>
    </div>

    <template v-if="listItems.length">
      <UiDivider variant="thin" />
      <template v-for="{ item } in listItems" :key="item._index">
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
    </template>
  </div>
</template>

<script setup lang="ts">
import type { KqlBlock, KqlFile } from '~~/shared/types/kql'

const props = defineProps<{
  block: KqlBlock
  images?: KqlFile[]
  files?: KqlFile[]
  /** Page content's last-saved date ("Y-m-d") — items have no date field of
   * their own (see jav.cms/site/blueprints/blocks/list.yml), so every item
   * shows the same "mois année", same pattern as Resources.global.vue's
   * "MIS À JOUR EN ..." for link items. */
  pageModified?: string | null
}>()

// Each item is either the original image-card display (a title + an actual
// image picked) or the press-mentions list row otherwise — split once here
// so the template doesn't have to branch per-item inside a single v-for.
//
// block.itemImages (see kqlPageQuery.ts) resolves each item's "image" field
// from anywhere on the site — but ONLY for top-level blocks; a List block
// nested inside a Section/Array-layout's own JSON-encoded content (see
// parseKqlBlocks.ts) never goes through that server-side resolution, so it
// always comes back null there. resolveKqlFile is the fallback for that
// case, matching by uuid against the page's own images (this field's own
// blueprint restricts picking to page.images anyway, see fields/image.yml),
// same pattern as Resources.global.vue.
const indexedItems = computed(() =>
  (props.block.content.items ?? []).map((item: Record<string, any>, index: number) => ({
    item: { ...item, _index: index },
    image: props.block.itemImages?.[index]?.image ?? resolveKqlFile(item.image, props.images) ?? null
  }))
)

const imageItems = computed(() =>
  indexedItems.value.filter(({ item, image }) => Boolean(item.title) && Boolean(image))
)

const listItems = computed(() =>
  indexedItems.value.filter(({ item, image }) => !(item.title && image))
)

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

// Full-width, 4 columns — same auto-fit formula as Cartels.global.vue so a
// row with fewer than 4 items still stretches to fill the width instead of
// leaving empty trailing tracks.
.v-block-list__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(max(220px, calc((100% - 3 * var(--spacing-xl)) / 4)), 1fr));
  gap: var(--spacing-xl);

  @media (max-width: 1100px) {
    grid-template-columns: repeat(auto-fit, minmax(max(220px, calc((100% - var(--spacing-xl)) / 2)), 1fr));
  }

  @media (max-width: $breakpoint-mobile) {
    grid-template-columns: 1fr;
  }
}

.v-block-list__grid-item {
  text-decoration: none;
  color: inherit;
  text-align: center;
}

.v-block-list__grid-image {
  width: 100%;
  aspect-ratio: 1;
  border-radius: var(--radius-m);
  overflow: hidden;
  background: var(--color-brand-00);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.v-block-list__grid-title {
  @include type-label;
}

.v-block-list__grid-text {
  @include type-body-large-bold;

  :deep(p) {
    margin: 0;
  }
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
