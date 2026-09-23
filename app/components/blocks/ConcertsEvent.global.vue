<template>
  <div class="v-block-concerts-event u-flex u-flex--column u-gap-xl u-gutter-x">
    <UiSectionHeader
      :title="block.content.title || 'Concerts &amp; Évènements'"
      link-to="/agenda"
      link-text="Voir tout l'agenda"
      class="v-block-concerts-event__header"
    />

    <div v-if="displayedEvents.length" class="v-block-concerts-event__grid">
      <UiCard
        v-for="{ event, index } in displayedEvents"
        :key="event.id"
        :background="palette(index).bg"
        :color="palette(index).accent"
        class="v-block-concerts-event__card u-flex"
        :class="{ 'v-block-concerts-event__card--featured': index === 0 }"
      >
        <div class="v-block-concerts-event__card-content u-flex u-flex--column u-flex--justify-between u-gap-xl">
          <div class="v-block-concerts-event__card-header u-flex u-flex--column u-gap-s">
            <div class="u-flex u-flex--align-start u-flex--justify-between u-gap-s">
              <span class="v-block-concerts-event__card-date">{{ formatEventDate(event.date) }}</span>
              <!-- Non-featured cards show their tag inline, next to the
                   date — the featured card's tag lives over its photo
                   instead (see .card-media below). -->
              <UiTag v-if="event.type && index !== 0" class="v-block-concerts-event__card-tag">
                {{ eventTypeLabel(event.type) }}
              </UiTag>
            </div>
            <h3 class="v-block-concerts-event__card-title">{{ event.title }}</h3>
          </div>
          <div class="v-block-concerts-event__card-footer u-flex u-flex--column u-gap-s">
            <UiDivider />
            <div class="v-block-concerts-event__card-description">{{ truncateText(event.description) }}</div>
            <UiDivider />
          </div>
          <!-- Non-featured cards keep the CTA in the same pane, at the
               bottom — the featured card's CTA sits on its photo instead. -->
          <UiButton
            v-if="index !== 0"
            :to="event.ticketLink || `/${event.id}`"
            class="v-block-concerts-event__card-cta"
            :style="{ '--button-color': palette(index).accent, '--button-text': palette(index).bg }"
          >
            En savoir plus
          </UiButton>
        </div>

        <!-- Featured (first) card only: a photo half with the tag and CTA
             overlaid on it, instead of stacked in the text pane. -->
        <div
          v-if="index === 0"
          class="v-block-concerts-event__card-media u-flex u-flex--column u-flex--align-end u-flex--justify-between"
        >
          <img v-if="event.cover" :src="event.cover.url" :alt="event.cover.alt ?? ''">
          <UiTag v-if="event.type" :color="palette(index).bg" class="v-block-concerts-event__card-filter">
            {{ eventTypeLabel(event.type) }}
          </UiTag>
          <UiButton
            :to="event.ticketLink || `/${event.id}`"
            class="v-block-concerts-event__card-cta"
            :style="{ '--button-color': palette(index).bg, '--button-text': palette(index).accent }"
          >
            En savoir plus
          </UiButton>
        </div>
      </UiCard>
    </div>
    <p v-else class="v-block-concerts-event__empty">Aucun évènement à venir pour le moment.</p>
  </div>
</template>

<script setup lang="ts">
import type { KqlBlock, KqlEvent } from '~~/shared/types/kql'

defineProps<{
  block: KqlBlock
}>()

// The "concerts-event" Kirby block has no editable fields — it's an anchor.
// Real events live in the site-wide "évènements" collection and are fetched
// from /api/events (see server/api/events.get.ts).
const { data: events } = await useFetch<KqlEvent[]>('/api/events')

// This same block renders both on the homepage and on /agenda (it's a
// generic Kirby block, not two separate components) — the homepage teaser
// is capped at 5 events; /agenda shows the full list. Indices are kept
// relative to the FULL list (not the sliced one) so each card's color still
// matches its real position — same lookup used by the event's own detail
// page and the "Autres évènements" section (see app/utils/eventPalette.ts).
const route = useRoute()
const isHome = computed(() => {
  const slug = route.params.slug
  return !slug || (Array.isArray(slug) && slug.length === 0)
})

const displayedEvents = computed(() => {
  const withIndex = (events.value ?? []).map((event, index) => ({ event, index }))
  return isHome.value ? withIndex.slice(0, 5) : withIndex
})

const TYPE_LABELS: Record<string, string> = {
  concert: 'Concert',
  'table-ronde': 'Table ronde'
}

function eventTypeLabel(type: string) {
  return TYPE_LABELS[type] ?? type
}

function formatEventDate(date: string | null) {
  if (!date) return ''
  return new Date(date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
}

// Each card cycles through one of these (background, accent) pairs — the
// accent drives the title/date/divider/description color (via UiCard's
// `color`, inherited as currentColor) and the tag border. Buttons on
// non-featured cards invert the pair (accent background, base text) so
// they stand out against the card's own flat background; the featured
// card's button sits on its photo instead, so it just reuses the pair
// as-is (no inversion needed for contrast there). Shared with the event's
// own detail page (see app/utils/eventPalette.ts) so its color matches
// this card exactly.
const palette = eventPalette
</script>

<style lang="scss" scoped>
.v-block-concerts-event {
  // Only the section title (+ "Voir tout l'agenda" link, empty-state text)
  // follows the page's theme (see usePageTheme.ts) — the cards themselves
  // keep their own fixed 5-color cycling palette (see PALETTE above),
  // untouched, since each card sets its own color explicitly via UiCard.
  color: var(--color-page-accent);
  padding-block: var(--block-spacing);
}

.v-block-concerts-event__grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--spacing-xl);

  @media (max-width: 1100px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 700px) {
    grid-template-columns: 1fr;
  }

  .v-block-concerts-event__card:first-child {
    grid-column: span 2;

    @media (max-width: 700px) {
      grid-column: span 1;
    }
  }
}

// Every card's text (date, title, divider, description) is set via UiCard's
// `color` prop (the palette's "accent"), inherited here as currentColor —
// no per-card color rule needed anywhere below.
.v-block-concerts-event__card {
  min-height: 440px;

  @media (max-width: 700px) {
    flex-direction: column;
    min-height: 0;
  }
}

.v-block-concerts-event__card--featured {
  min-height: 505px;
}

.v-block-concerts-event__card-content {
  flex: 1;
  padding: var(--spacing-xl);
}

// A <span>, not a <p> — this uses type-tag-date (uppercase), unlike a <p>'s
// canonical style.
.v-block-concerts-event__card-date {
  @include type-tag-date;
}

// .card-title itself has no rule: it's a real <h3> (the section title above
// is an h1, via UiSectionHeader) so it inherits family/weight/size/
// line-height straight from typo.scss, and color from UiCard (see note
// above) — nothing left to set here.

.v-block-concerts-event__card-description {
  @include type-body-large-bold;

  :deep(p) {
    margin: 0;
  }
}

.v-block-concerts-event__card-media {
  position: relative;
  flex: 1;
  min-width: 200px;
  padding: var(--spacing-xl);

  img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.v-block-concerts-event__card-filter {
  position: relative;
}

// Colors come from the inline --button-color/--button-text set per card in
// the template (see `palette()`) — position: relative only matters for the
// featured card's CTA, which sits over an absolutely-positioned photo.
.v-block-concerts-event__card-cta {
  position: relative;
}

// Real <p> — font comes from typo.scss's bare tag rule (Inter body-large).
.v-block-concerts-event__empty {
  opacity: 0.7;
}
</style>
