<template>
  <article class="v-page-default">
    <header
      v-if="page.headerTitle || page.title"
      class="v-page-default__header"
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
      <div class="v-page-default__header-content">
        <h1>{{ page.headerTitle || page.title }}</h1>
        <p v-if="page.headerSubtitle">{{ page.headerSubtitle }}</p>
        <UiDivider />
        <UiDivider v-if="!page.headerImage" />
      </div>
    </header>

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
defineProps<{
  page: KqlPage
}>()
</script>

<style lang="scss" scoped>
.v-page-default__header {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: var(--spacing-4xl) var(--spacing-6xl);
  color: var(--color-brand-01);
  overflow: hidden;

  @media (max-width: 900px) {
    padding: var(--spacing-xl);
  }
}

// Hero variant — page.headerImage is set (Figma: homepage "Hero"): big
// full-bleed photo with a gradient fading to brand-04 at the bottom.
.v-page-default__header--hero {
  min-height: 800px;

  @media (max-width: 900px) {
    min-height: 560px;
  }
}

// Plain variant — no image (Figma: "Training Nav" header used on every
// other default page): flat brand-06 panel, shorter, two dividers.
.v-page-default__header--plain {
  min-height: 600px;
  background: var(--color-brand-06);

  @media (max-width: 900px) {
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
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xl);
  position: relative;
}

.v-page-default__header h1 {
  @include heading-display;
  font-size: var(--spacing-7xl);

  @media (max-width: 900px) {
    font-size: var(--spacing-4xl);
  }
}

.v-page-default__header p {
  @include text-subtitle;

  @media (max-width: 900px) {
    font-size: var(--spacing-xl);
  }
}

</style>
