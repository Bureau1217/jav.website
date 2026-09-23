<template>
  <article class="v-page-default">
    <header
      v-if="page.headerTitle || page.title"
      class="v-page-default__header u-flex u-flex--column u-flex--justify-end u-gutter-x"
      :class="[
        page.headerImage ? 'v-page-default__header--hero' : 'v-page-default__header--plain',
        !page.headerImage && !hasThemeOverride ? 'v-page-default__header--plain-no-bg' : ''
      ]"
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
            <div class="h-hero">{{ page.headerTitle || page.title }}</div>
            <div v-if="page.headerSubtitle" class="v-page-default__header-subtitle">{{ page.headerSubtitle }}</div>
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

    <Blocks :blocks="page.blocks" :images="page.images" :files="page.files" :page-modified="page.pageModified" />
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

// Per-page color theme (--color-page-accent / --color-page-on-accent) is
// applied at the app root, not here — see usePageTheme.ts and app.vue —
// so it also reaches TheFooter, a sibling of this component.

// Whether a page-specific theme override is active (Formation Pro, Pratique
// Amateur, or an event page) — null means we're on the default theme (home
// or any other untouched page). Used below to give the "plain" (no image)
// header variant a flat, colorless treatment on default-theme pages only —
// themed pages keep their solid colored panel exactly as before.
const pageTheme = usePageTheme()
const hasThemeOverride = computed(() => pageTheme.value !== null)
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
  // Follows the page you're on, same as every other block now (see
  // usePageTheme.ts) — mint by default, e.g. white on Formation Pro. Safe
  // for the photo "hero" variant too: only a page with headerImage AND its
  // own theme override would ever see this move off mint, and no such page
  // exists yet — the homepage (the only headerImage page today) has no
  // override, so its hero stays mint exactly as before.
  color: var(--color-page-on-accent);
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
// other default page): flat brand-02 panel, shorter, two dividers.
.v-page-default__header--plain {
  min-height: 700px;
  background: var(--color-page-accent);

  @media (max-width: $breakpoint-mobile) {
    min-height: 420px;
  }
}

// Default-theme variant of "plain" — no colored panel at all, just the
// page's cream background straight through. Only applied when there's no
// active page theme override (see hasThemeOverride above), so Formation Pro
// / Pratique Amateur are untouched. Text switches from the light
// --color-page-on-accent (mint, meant to sit on a colored panel) to the dark
// --color-page-accent itself, since it's now reading directly on cream.
.v-page-default__header--plain-no-bg {
  background: none;
  color: var(--color-page-accent);
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
  // Fades to the page's own theme color (see usePageTheme.ts) instead of a
  // fixed indigo — green by default, e.g. maroon if a themed page ever uses
  // the photo "hero" variant instead of the flat panel.
  background: linear-gradient(to bottom, transparent 0%, var(--color-page-accent) 100%);
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

.v-page-default__header .h-hero {
  @media (max-width: $breakpoint-mobile) {
    font-size: 48px;
  }
}

// A <div>, not a <p> — this subtitle is styled differently from the
// site-wide p default (Inter body-large, see typo.scss) on purpose, so it
// uses a non-canonical tag instead of overriding a <p>'s own style.
.v-page-default__header-subtitle {
  font-family: var(--font-body);
  font-weight: 600;
  font-size: 48px;
  line-height: 1.04;

  @media (max-width: $breakpoint-mobile) {
    font-size: 24px;
  }
}

</style>
