<template>
  <article class="v-page-default">
    <header
      v-if="page.headerTitle || page.title"
      class="v-page-default__header u-flex u-flex--column u-flex--justify-end u-gutter-x"
      :class="page.headerImage ? 'v-page-default__header--hero' : 'v-page-default__header--plain'"
    >
      <div v-if="page.headerImage" class="v-page-default__header-media" aria-hidden="true">
        <img
          :src="page.headerImage.url"
          :alt="page.headerImage.alt ?? ''"
          class="v-page-default__header-image"
        >
        <div class="v-page-default__header-gradient" />
      </div>
      <div class="v-page-default__header-content u-flex u-flex--column u-gap-xl">
        <div class="v-page-default__header-row u-flex u-flex--align-end u-flex--justify-between u-gap-xl u-flex--wrap">
          <div class="v-page-default__header-titles u-flex u-flex--column u-gap-m">
            <h1>{{ page.headerTitle || page.title }}</h1>
            <p v-if="page.headerSubtitle">{{ page.headerSubtitle }}</p>
          </div>
          <!-- Fixed quick links to the two flagship programs — homepage hero
               only, per design (not a generic hero-page feature). -->
          <div v-if="isHome && page.headerImage" class="v-page-default__header-actions u-flex u-gap-m u-flex--wrap">
            <UiButton to="/formation-professionnelle">Formation Pro</UiButton>
            <UiButton to="/pratique-amateur">Pratique Amateur</UiButton>
          </div>
        </div>
        <UiDivider />
        <UiDivider v-if="!page.headerImage" />
      </div>
    </header>

    <!-- Homepage only — the scrolling banner isn't shown on any other page. -->
    <TheScrollingBanner v-if="isHome" />

    <Blocks :blocks="page.blocks" :images="page.images" :files="page.files" />
  </article>
</template>

<script setup lang="ts">
import type { KqlPage } from '~~/shared/types/kql'

// Two header treatments driven by a single signal — whether page.headerImage
// is set in Kirby: with an image we get the big full-bleed "Hero" (Figma:
// home page, 800px, gradient over the photo); without one we fall back to
// the flat-color "Training Nav"-style header used on every other default
// page (Formation Pro, Pratique Amateur, Agenda...), 600px, solid brand-06,
// two stacked dividers instead of one. Any page can opt into the hero
// treatment just by uploading a header image in Kirby — it's not hardcoded
// to the homepage.
withDefaults(defineProps<{
  page: KqlPage
  /** True only for the homepage — gates the "Formation Pro" / "Pratique
   * Amateur" quick-link buttons shown on its hero, see [...slug].vue. */
  isHome?: boolean
}>(), {
  isHome: false
})
</script>

<style lang="scss" scoped>
// Every page's top section — photo Hero or flat color panel alike — rises
// up underneath TheHeader (always transparent now, see TheHeader.vue) so
// there's no plain cream gap above it. z-index: 1 keeps it below the header
// (1000), which still paints normally on top where it now overlaps it.
.v-page-default__header {
  position: relative;
  z-index: 1;
  margin-top: -88px; // pulled up by the header's own height (~88px)
  padding-block: var(--spacing-4xl);
  color: var(--color-brand-01);
  overflow: hidden;

  @media (max-width: $breakpoint-mobile) {
    padding-block: var(--spacing-xl);
  }
}

// Hero variant — page.headerImage is set (Figma: homepage "Hero"): big
// full-bleed photo with a gradient fading to brand-04 at the bottom.
.v-page-default__header--hero {
  min-height: 800px;

  @media (max-width: $breakpoint-mobile) {
    min-height: 560px;
  }
}

// Plain variant — no image (Figma: "Training Nav" header used on every
// other default page): flat brand-06 panel, shorter, two dividers.
.v-page-default__header--plain {
  min-height: 600px;
  background: var(--color-brand-06);

  @media (max-width: $breakpoint-mobile) {
    min-height: 420px;
  }
}

.v-page-default__header-media {
  position: absolute;
  inset: 0;
  z-index: -1;
}

.v-page-default__header-image {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.v-page-default__header-gradient {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, rgba(41, 15, 161, 0) 0%, var(--color-brand-04) 100%);
}

.v-page-default__header-content {
  position: relative;
}

.v-page-default__header-actions {
  .ui-button {
    --button-color: var(--color-brand-01);
    --button-text: var(--color-brand-04);
  }
}

.v-page-default__header h1 {
  @media (max-width: $breakpoint-mobile) {
    font-size: var(--spacing-4xl);
  }
}

.v-page-default__header p {
  font-family: var(--font-body);
  font-weight: 600;
  font-size: var(--spacing-4xl); // 48px
  line-height: 1.04;

  @media (max-width: $breakpoint-mobile) {
    font-size: var(--spacing-xl);
  }
}

</style>
