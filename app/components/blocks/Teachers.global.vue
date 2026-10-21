<template>
  <div class="v-block-teachers-wrap u-flex u-flex--column u-gap-xl u-gutter-x">
    <UiSectionHeader
      v-if="block.content.title"
      :title="block.content.title"
    />

    <div class="v-block-teachers__filters u-flex u-gap-m u-flex--wrap">
      <button
        v-for="filter in FILTERS"
        :key="filter.value"
        type="button"
        class="v-block-teachers__filter"
        :class="{ 'is-active': activeFilter === filter.value }"
        @click="activeFilter = filter.value"
      >
        {{ filter.label }}
      </button>
    </div>

    <div class="v-block-teachers">
      <UiCard
        v-for="teacher in filteredTeachers"
        :key="teacher.id"
        bordered
        background="var(--color-brand-00)"
        color="var(--color-page-accent)"
        class="v-block-teachers__item u-flex"
      >
        <div class="v-block-teachers__media">
          <img
            v-if="teacher.photo"
            :src="teacher.photo.url"
            :alt="teacher.photo.alt ?? teacher.title"
            :style="{ objectPosition: objectPosition(teacher.photo) }"
          >
        </div>
        <div class="v-block-teachers__text u-flex u-flex--column u-flex--justify-center u-gap-s">
          <div class="u-flex u-flex--column u-gap-xs">
            <UiTag v-if="teacher.fonction" class="v-block-teachers__fonction">{{ teacher.fonction }}</UiTag>
            <h3 class="v-block-teachers__name">{{ teacher.title }}</h3>
          </div>
          <div v-if="teacher.bio" class="v-block-teachers__bio " v-html="teacher.bio"/>

          <div
                  v-if="teacher.teachers_website"
                  class="u-flex u-flex--align-center u-gap-s"
          >
            <img src="/img/icon-link.svg"
                 role="button"
                 alt="Site icon"
            />
            <UiButton
                    :to="teacher.teachers_website"
                    external
                    variant="secondary"
                    class="v-block-teachers__site"
            >
              site
            </UiButton>
          </div>
          <div
                  class="u-flex u-flex--align-center u-gap-s"
                  v-if="teacher.teachers_email"
          >
            <img src="/img/icon-mail.svg"
                 role="button"
                 alt="Mail icon"
            />
            <UiButton
                    :to="teacher.teachers_email"
                    external
                    variant="secondary"
                    class="v-block-teachers__site"
            >
              {{teacher.teachers_email}}
            </UiButton>
          </div>
        </div>
      </UiCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { KqlBlock } from '~~/shared/types/kql'

const props = defineProps<{
  block: KqlBlock
}>()

// Two fixed categories (not CMS-driven) — matches Kirby's own "Fonction"
// tag options (enseignant·e / permanent·e, see teacher.yml); a teacher's raw
// fonction field can hold several comma-separated tags, so this matches on
// substring rather than requiring an exact single value. "responsable" is
// also accepted for the permanent team — some profiles still carry that
// older tag value instead of the current "permanent·e" option.
const FILTERS = [
  { value: 'enseignant', label: 'Équipe Enseignante', keywords: ['enseignant'] },
  { value: 'permanent', label: 'Équipe Permanente', keywords: ['permanent', 'responsable'] }
] as const

const activeFilter = ref<typeof FILTERS[number]['value']>('enseignant')

const filteredTeachers = computed(() => {
  const keywords = FILTERS.find(filter => filter.value === activeFilter.value)?.keywords ?? []
  return (props.block.teacherPages ?? []).filter((teacher: { fonction?: string }) => {
    const fonction = teacher.fonction?.toLowerCase() ?? ''
    return keywords.some(keyword => fonction.includes(keyword))
  })
})
</script>

<style lang="scss" scoped>

.v-block-teachers-wrap {
  padding-block: var(--block-spacing);
  color: var(--color-page-accent);
}

.v-block-teachers__filter {
  @include type-label;
  background: transparent;
  color: var(--color-page-accent);
  border: 2px solid var(--color-page-accent);
  border-radius: var(--radius-pill);
  padding: var(--spacing-xs) var(--spacing-l);
  cursor: pointer;
  transition: background-color 0.2s ease, color 0.2s ease;

  &.is-active {
    background: var(--color-page-accent);
    color: var(--color-page-on-accent);
  }
}

.v-block-teachers {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
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
  // Without this, a flex item's default min-width:auto keeps the name/bio
  // text from wrapping below their own unconstrained intrinsic width — the
  // card clips it via overflow-x:hidden instead of visibly overflowing, so
  // on mobile this was silently cutting content off rather than wrapping it
  // (same root cause as Toggle.global.vue's own title fix).
  min-width: 0;
  padding: var(--spacing-xl);
}

.v-block-teachers__fonction {
  align-self: flex-start;
}

// Real <h3> — no local override needed, typo.scss covers it entirely; only
// the color comes from UiCard's `color` prop (currentColor).
.v-block-teachers__name {
  @include type-text-heading-1;
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
  // A bio can contain a raw auto-linked URL (no spaces to wrap on) — same
  // unbreakable-string overflow as the email buttons below, which was
  // forcing the card wider than its column on mobile before the 3-line
  // clamp above ever got a chance to clip it vertically.
  overflow-wrap: anywhere;

  :deep(p) {
    margin: 0;
  }
}

:global(.v-block-teachers__bio p){
  @include type-body-large-bold;
}

.v-block-teachers__site {
  align-self: flex-start;
  // The email button shows the raw address as its own text (no spaces to
  // wrap on) — same unbreakable-string overflow as Qualiopi.global.vue's
  // own email fields, wrapped here instead of letting it force the card
  // wider than its column on mobile.
  overflow-wrap: anywhere;
}
</style>
