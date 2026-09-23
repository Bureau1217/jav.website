<template>
  <article class="v-page-event" :style="bodyColorStyle">
    <!-- Photo banner when the event has a cover image (the usual case) —
         plain full-bleed image, no text overlaid on it (title/date sit
         below, on the cream background). Falls back to the same flat
         color panel as PagesDefault's "plain" header variant when there's
         no cover, so the page still has a proper header either way. -->
    <header
      class="v-page-event__header"
      :class="page.eventCover ? 'v-page-event__header--photo' : 'v-page-event__header--plain'"
    >
      <img
        v-if="page.eventCover"
        :src="page.eventCover.url"
        :alt="page.eventCover.alt ?? ''"
        class="v-page-event__header-image"
      >
    </header>

    <div class="v-page-event__body u-flex u-flex--column u-gap-xl u-gutter">
      <div class="v-page-event__intro u-flex u-flex--column u-gap-m">
        <div class="u-flex u-flex--align-center u-gap-m u-flex--wrap">
          <UiTag v-if="typeLabel">{{ typeLabel }}</UiTag>
          <span v-if="dateLabel" class="v-page-event__date">{{ dateLabel }}</span>
        </div>
        <h1>{{ page.headerTitle || page.title }}</h1>
        <div v-if="page.eventDescription" class="v-page-event__description" v-html="page.eventDescription" />
      </div>

      <div class="u-flex u-flex--align-center u-gap-m u-flex--wrap">
        <span v-if="page.eventLocation" class="v-page-event__location">{{ page.eventLocation }}</span>
        <UiButton v-if="page.eventTicketLink" :to="page.eventTicketLink" external>
          Réserver ma place
        </UiButton>
      </div>

      <template v-if="galleryImages.length">
        <UiDivider variant="thin" />
        <div class="v-page-event__gallery-section u-flex u-flex--column u-gap-m">
          <h3>Galerie</h3>
          <div class="v-page-event__gallery">
            <div
              v-for="(image, index) in galleryImages.slice(0, 3)"
              :key="image.filename"
              class="v-page-event__gallery-tile"
            >
              <img :src="image.url" :alt="image.alt ?? ''">
              <div v-if="index === 2 && extraGalleryCount > 0" class="v-page-event__gallery-more">
                +{{ extraGalleryCount }}
              </div>
            </div>
          </div>
        </div>
      </template>
    </div>

    <div v-if="otherEvents.length" class="v-page-event__others u-gutter-x">
      <UiSectionHeader
        title="Autres évènements"
        link-to="/agenda"
        link-text="Voir tous les évènements"
      />
      <div class="v-page-event__others-grid">
        <UiCard
          v-for="event in otherEvents"
          :key="event.id"
          :to="`/${event.id}`"
          :background="palette(event.index).bg"
          :color="palette(event.index).accent"
          class="v-page-event__other-card u-flex u-flex--column u-gap-s"
        >
          <span v-if="event.type" class="v-page-event__other-tag">{{ typeLabelFor(event.type) }}</span>
          <h3 class="v-page-event__other-title">{{ event.title }}</h3>
          <div v-if="event.description" class="v-page-event__other-description" v-html="event.description" />
          <UiDivider />
          <span class="v-page-event__other-link">En savoir plus</span>
        </UiCard>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import type { KqlEvent, KqlPage } from '~~/shared/types/kql'

const props = defineProps<{
  page: KqlPage
}>()

// This page's whole color theme (header/footer/floating-promo/menu
// background+foreground, see usePageTheme.ts + app.vue) must match exactly
// the (bg, accent) pair this event's own card cycles to in the "Concerts &
// Évènements" block — not a fixed per-page override, since it depends on
// this event's position in the site-wide events list. [...slug].vue
// deliberately skips setting a theme for "event_item" pages so this
// component can own it instead.
const { data: events } = await useFetch<KqlEvent[]>('/api/events', { key: 'events-for-theme' })

const ownIndex = computed(() => (events.value ?? []).findIndex(event => event.id === props.page.id))

const paletteEntry = computed(() => {
  const index = ownIndex.value
  return index === -1 ? null : eventPalette(index)
})

const pageTheme = usePageTheme()
watchEffect(() => {
  const entry = paletteEntry.value
  pageTheme.value = entry
    ? { accent: entry.bg, onAccent: entry.accent, onAccentRgb: rgbForBrandVar(entry.accent) }
    : null
})

// The header photo/panel isn't affected by this, but everything below it
// (title, date, description, location, gallery caption) sits on the page's
// plain cream background, where `bg` itself is sometimes the pastel/light
// half of the pair (pink, light blue) — unreadable there. `legibleOnCream`
// picks whichever of the pair is actually dark enough for that, which isn't
// always the same one across entries (see app/utils/eventPalette.ts).
const bodyColorStyle = computed(() => {
  const entry = paletteEntry.value
  if (!entry) return undefined
  const color = entry.legibleOnCream === 'bg' ? entry.bg : entry.accent
  return { '--event-body-color': color }
})

const TYPE_LABELS: Record<string, string> = {
  concert: 'Concert',
  'table-ronde': 'Table ronde'
}

function typeLabelFor(type: string | null) {
  return type ? (TYPE_LABELS[type] ?? type) : ''
}

const typeLabel = computed(() => typeLabelFor(props.page.eventType))

const dateLabel = computed(() => {
  const date = props.page.eventDate
  if (!date) return ''
  const formatted = new Date(date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
  const time = props.page.eventTime?.slice(0, 5) // "14:00:00" -> "14:00"
  return time ? `${formatted} · ${time}` : formatted
})

const galleryImages = computed(() => props.page.eventGallery ?? [])
// The 3rd tile shows its own photo (dimmed) plus how many MORE aren't shown
// at all beyond these first 3 — not a count of the 3rd tile itself.
const extraGalleryCount = computed(() => Math.max(galleryImages.value.length - 3, 0))

// "Autres évènements" — every other event, each colored by its own real
// position in the site-wide list (see app/utils/eventPalette.ts), same as
// its card in the "Concerts & Évènements" block and its own detail page.
const otherEvents = computed(() =>
  (events.value ?? [])
    .map((event, index) => ({ ...event, index }))
    .filter(event => event.id !== props.page.id)
    .slice(0, 3)
)

function palette(index: number) {
  return eventPalette(index)
}
</script>

<style lang="scss" scoped>
// Same "rises up underneath the always-transparent TheHeader" trick as
// PagesDefault's own header — see that component for the full rationale.
// Set once, at the root, so every section below the header inherits it —
// not just .v-page-event__body — including "Autres évènements" further
// down, which is a sibling, not a descendant, of that div.
.v-page-event {
  color: var(--event-body-color, var(--color-page-accent));
}

.v-page-event__header {
  position: relative;
  z-index: 1;
  margin-top: -88px;
  overflow: hidden;
}

.v-page-event__header--photo {
  height: 420px;

  @media (max-width: $breakpoint-mobile) {
    height: 280px;
  }
}

.v-page-event__header-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

// Fallback when there's no cover image — flat color panel, same idea as
// PagesDefault's "plain" header variant.
.v-page-event__header--plain {
  min-height: 360px;
  background: var(--color-page-accent);

  @media (max-width: $breakpoint-mobile) {
    min-height: 240px;
  }
}

.v-page-event__body {
  padding-block: var(--block-spacing);
}

.v-page-event__intro {
  max-width: 860px;
}

.v-page-event__date {
  @include type-tag-date;
}

// Real <h1> — no local font override needed, typo.scss's bare tag rule
// covers it entirely; color comes from the wrap's own color above.
.v-page-event__description {
  @include type-body-large;

  :deep(p) {
    margin: 0 0 var(--spacing-m);
  }
}

.v-page-event__location {
  @include type-body-large-bold;
}

.v-page-event__gallery-section h3 {
  @include type-text-heading-1;
}

.v-page-event__gallery {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--spacing-m);

  @media (max-width: $breakpoint-mobile) {
    grid-template-columns: 1fr 1fr;
  }
}

.v-page-event__gallery-tile {
  position: relative;
  aspect-ratio: 4 / 3;
  border-radius: var(--radius-m);
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}

.v-page-event__gallery-more {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.45);
  color: var(--color-brand-00);
  font-family: var(--font-heading);
  font-weight: 900;
  font-size: 32px;
}

.v-page-event__others {
  padding-block: var(--block-spacing);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xl);
}

.v-page-event__others-grid {
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

.v-page-event__other-card {
  padding: var(--spacing-xl);
  min-height: 260px;
  text-decoration: none;
}

.v-page-event__other-tag {
  @include type-tag-date;
}

// A real <h3> — no local font override needed, color comes from UiCard's
// `color` prop (currentColor), same as ConcertsEvent's own cards.
.v-page-event__other-description {
  @include type-body-large-bold;
  flex: 1;

  :deep(p) {
    margin: 0;
  }
}

.v-page-event__other-link {
  @include type-body-large-bold;
}
</style>
