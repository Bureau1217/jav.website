<template>
  <div class="v-block-formations u-flex u-flex--column u-gap-xl u-gutter-x">
    <UiSectionHeader v-if="block.content.title" :title="block.content.title" />
    <div class="v-block-formations__body u-flex u-flex--column u-gap-2xl">
      <div class="v-block-formations__cards">
        <!-- Each program's big heading now lives inside its own card, right
             above its image — previously these two sat in their own shared
             row above the whole grid, which looked fine side-by-side on
             desktop but left both headings stacked together, disconnected
             from their own image/description, once the grid dropped to a
             single mobile column. -->
        <article v-for="card in cards" :key="card.uri" class="v-block-formations__card u-flex u-flex--column u-gap-2xl">
          <h1 class="v-block-formations__title" v-html="card.heading" />
          <NuxtLink :to="card.href" class="v-block-formations__card-image">
            <img v-if="card.image" :src="card.image" :alt="card.imageAlt" :style="{ objectPosition: card.imagePosition }">
            <img
              v-if="card.badge"
              :src="card.badge.url"
              :alt="card.badge.alt || 'Qualiopi'"
              class="v-block-formations__card-badge"
            >
          </NuxtLink>
          <div class="v-block-formations__card-content u-flex u-flex--column u-flex--justify-between u-gap-xl">
            <div class="v-block-formations__card-text u-flex u-flex--column u-gap-m">
              <span class="v-block-formations__card-tag">{{ card.tag }}</span>
              <div class="v-block-formations__card-title">{{ card.title }}</div>
              <div class="v-block-formations__card-description" v-html="card.description" />
            </div>
            <UiButton :to="card.href" class="v-block-formations__card-cta">Découvrir</UiButton>
          </div>
        </article>
      </div>

      <NuxtLink to="/a-propos" class="v-block-formations__banner u-flex u-flex--align-center u-gap-xl">
        <span class="v-block-formations__banner-icon u-flex u-flex--align-center u-flex--justify-center" aria-hidden="true">🤝</span>
        <div class="v-block-formations__banner-text u-flex u-flex--column">
          <span class="v-block-formations__banner-title">JAV</span>
          <span class="v-block-formations__banner-subtitle">Un espace pour tous·tes</span>
        </div>
        <span class="v-block-formations__banner-arrow" aria-hidden="true">↗</span>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { KqlBlock, KqlFormationCard } from '~~/shared/types/kql'

const props = defineProps<{
  block: KqlBlock
}>()

// "formations" is a fixed anchor that always highlights the "Formation
// Professionnelle" and "Pratique Amateur" pages (see
// server/api/formations.get.ts) — only the cover image comes from those
// pages themselves (there's no other sensible source for it). Everything
// else shown on each card (tag, title, description) is fully editable here
// instead, as its own object field per space — see
// jav.cms/site/blueprints/blocks/formations.yml.
const CARD_FIELDS: Record<string, string> = {
  'formation-professionnelle': 'formation_professionnelle',
  'pratique-amateur': 'pratique_amateur'
}

// The big program heading (h1), fixed per program — not editable in the
// CMS, unlike card.title below (an editable tagline-style field).
const CARD_HEADINGS: Record<string, string> = {
  'formation-professionnelle': 'Formation<br>Professionnelle',
  'pratique-amateur': 'Pratique<br>Amateur'
}

const { data: formationPages } = await useFetch<KqlFormationCard[]>('/api/formations')

const cards = computed(() =>
  (formationPages.value ?? []).map((page) => {
    const fields = props.block.content[CARD_FIELDS[page.uri]] ?? {}
    return {
      uri: page.uri,
      heading: CARD_HEADINGS[page.uri] ?? '',
      tag: fields.tag ?? '',
      title: fields.title ?? '',
      description: fields.description ?? '',
      image: page.previewImage?.url ?? '',
      imageAlt: page.previewImage?.alt ?? '',
      imagePosition: objectPosition(page.previewImage),
      // Only the Formation Professionnelle card gets the Qualiopi badge
      // (see server/api/formations.get.ts) — Pratique Amateur has no
      // certification to show, even though the API resolves the same file
      // for both (harmless, just unused there).
      badge: page.uri === 'formation-professionnelle' ? page.qualiopiBadge : null,
      href: `/${page.uri}`
    }
  })
)
</script>

<style lang="scss" scoped>
.v-block-formations {
  background: var(--color-page-accent);
  color: var(--color-brand-00);
  padding-block: var(--block-spacing);
}

// Real <h1> — no local font override needed, typo.scss's bare tag rule
// covers it entirely, same as every other block's "Titre de la section".
// Now a plain block sitting at the top of its own card (see template) —
// no longer a flex-row item shared with the other program's heading, so it
// no longer needs its own min-width/flex-basis juggling to behave on
// mobile; the card's own grid/flex-column stacking handles that.
.v-block-formations__title {
  margin: 0;
}

.v-block-formations__cards {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-xl);

  @media (max-width: $breakpoint-mobile) {
    grid-template-columns: 1fr;
  }
}

.v-block-formations__card {
  overflow: hidden;
}

// Now a NuxtLink (an <a>, block-level here since it's sized like any other
// container) — the image itself is clickable, leading to that program's own
// page, same destination as the "Découvrir" button below it.
.v-block-formations__card-image {
  position: relative;
  display: block;
  aspect-ratio: 628 / 387;
  overflow: hidden;
  cursor: pointer;
  // Fixed — this is the backdrop the image insets reveal on hover below, so
  // it never transitions/moves itself, only the image on top of it does.
  border-radius: var(--radius-m);
  background: var(--color-brand-00);
  padding: 0;
  transition: padding 0.4s ease;

  // Excludes the Qualiopi badge below — that one's pinned to a corner and
  // sized on its own, not stretched to fill/cover this box.
  > img:not(.v-block-formations__card-badge) {
    width: 100%;
    height: 100%;
    object-fit: cover;
    // Its own radius, independent of the (fixed) container above — this is
    // what actually rounds out further on hover.
    border-radius: var(--radius-m);
    transition: border-radius 0.4s ease;
  }

  // Hover is scoped to the image itself now (not the whole card) — insets
  // inward and rounds out into a full stadium/pill shape, revealing the
  // container's own fixed cream backdrop in the gap around it
  // (border-radius auto-clamps to half the image's own shorter side, so one
  // large value works at any card size).
  &:hover {
    padding: var(--spacing-l);

    > img:not(.v-block-formations__card-badge) {
      border-radius: 999px;
    }
  }
}

// Qualiopi badge overlaid on the Formation Professionnelle card's own image
// (see server/api/formations.get.ts) — a fixed white card in the top-left
// corner, same certificate artwork as the Qualiopi block further down the
// page. Specificity (two classes) beats ".card-image > img" above, which
// would otherwise force it to the cover photo's own full-bleed sizing.
.v-block-formations__card-image .v-block-formations__card-badge {
  position: absolute;
  top: var(--spacing-m);
  left: var(--spacing-m);
  width: 128px;
  height: auto;
  border-radius: var(--radius-s);
  background: #fff;
  padding: var(--spacing-xs);
  // Stays put while the photo behind it insets/rounds out on hover (see
  // .card:hover above) — no transition of its own needed.
}

.v-block-formations__card-content {
  padding-top: var(--spacing-s);
  flex: 1;

  @media (max-width: 700px) {
    flex-direction: column;
    align-items: flex-start;
  }
}

.v-block-formations__card-tag {
  @include type-label;
}

// A <div>, not a <h3> — the design intentionally uses the body font here
// (type-stat) instead of h3's canonical GT Maru heading-3.
.v-block-formations__card-title {
  @include type-stat;
}

.v-block-formations__card-description {
  @include type-body-large-bold;

  :deep(p) {
    margin: 0;
  }
}

.v-block-formations__card-cta {
  flex-shrink: 0;
  align-self: flex-end;
  // Text in the page's own accent (green on the homepage) instead of
  // UiButton's site-wide default indigo — background stays the default
  // cream (see main.scss's --button-color).
  --button-text: var(--color-page-accent);
}

.v-block-formations__banner {
  background: var(--color-brand-05);
  color: var(--color-page-accent);
  border-radius: var(--radius-s);
  padding: var(--spacing-m);
  text-decoration: none;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 0.85;
  }
}

.v-block-formations__banner-icon {
  aspect-ratio: 1;
  height: 86px;
  background: var(--color-page-accent);
  color: var(--color-brand-05);
  border-radius: var(--radius-s);
  font-size: 64px;
  flex-shrink: 0;
}

.v-block-formations__banner-text {
  flex: 1;
}

.v-block-formations__banner-title {
  font-family: var(--font-heading);
  font-weight: 900;
  font-size: 32px; // smaller than the default heading-3 (40px), fits the banner
  line-height: 1;
}

.v-block-formations__banner-subtitle {
  @include type-accent-italic;
}

.v-block-formations__banner-arrow {
  font-size: 32px;
}
</style>
