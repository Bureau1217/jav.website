<template>
  <div class="v-block-teachers-wrap u-flex u-flex--column u-gap-xl u-gutter-x">
    <UiSectionHeader
      v-if="block.content.title"
      :title="block.content.title"
      link-to="/enseignantexs"
      link-text="Voir tous les profils"
    />
    <div class="v-block-teachers">
      <UiCard
        v-for="teacher in block.teacherPages"
        :key="teacher.id"
        bordered
        background="var(--color-brand-00)"
        color="var(--color-page-accent)"
        class="v-block-teachers__item u-flex"
      >
        <div class="v-block-teachers__media">
          <img v-if="teacher.photo" :src="teacher.photo.url" :alt="teacher.photo.alt ?? teacher.title">
        </div>
        <div class="v-block-teachers__text u-flex u-flex--column u-flex--justify-center u-gap-s">
          <div class="u-flex u-flex--column u-gap-xs">
            <UiTag v-if="teacher.fonction" class="v-block-teachers__fonction">{{ teacher.fonction }}</UiTag>
            <h3 class="v-block-teachers__name">{{ teacher.title }}</h3>
          </div>
          <div v-if="teacher.bio" class="v-block-teachers__bio" v-html="teacher.bio" />
          <UiButton
            v-if="teacher.website"
            :to="teacher.website"
            external
            variant="secondary"
            class="v-block-teachers__site"
          >
            Site ↗
          </UiButton>
        </div>
      </UiCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { KqlBlock } from '~~/shared/types/kql'

defineProps<{
  block: KqlBlock
}>()
</script>

<style lang="scss" scoped>

.v-block-teachers-wrap {
  padding-block: var(--block-spacing);
  color: var(--color-page-accent);
}

.v-block-teachers {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--spacing-xl);

  @media (max-width: 1100px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: $breakpoint-mobile) {
    grid-template-columns: 1fr;
  }
}

// Cream card with an indigo border (UiCard's `bordered`) instead of a
// filled background — a photo pane on the left, full card height, and the
// name + fonction tag on the right. No longer a link (the individual
// teacher page isn't built yet) — the optional "Site" button below is the
// only actual link on the card, and a link nested inside another link
// would be invalid HTML anyway.
.v-block-teachers__item {
  min-height: 260px;
}

.v-block-teachers__media {
  position: relative;
  flex: 0 0 40%;

  img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.v-block-teachers__text {
  flex: 1;
  padding: var(--spacing-xl);
}

.v-block-teachers__fonction {
  align-self: flex-start;
}

// Real <h3> — no local override needed, typo.scss covers it entirely; only
// the color comes from UiCard's `color` prop (currentColor).
.v-block-teachers__name {
  margin-top: var(--spacing-xs);
}

// Bio (writer field) shown as a short quote, clamped to 3 lines so a long
// bio doesn't blow out the card's height — matches every other block's
// pattern of not touching real CMS content, just how much of it shows.
.v-block-teachers__bio {
  @include type-body-large-bold;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;

  :deep(p) {
    margin: 0;
  }
}

.v-block-teachers__site {
  align-self: flex-start;
}
</style>
