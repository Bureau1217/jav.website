<template>
  <div class="v-block-formations u-flex u-flex--column u-gap-xl u-gutter-x">
    <UiSectionHeader v-if="block.content.title" :title="block.content.title" />
    <div class="v-block-formations__body u-flex u-flex--column u-gap-2xl">
      <div class="v-block-formations__titles u-flex u-flex--align-end u-gap-xl u-flex--wrap">
        <h1 class="v-block-formations__title">Formation<br>Professionnelle</h1>
        <h1 class="v-block-formations__title">Pratique<br>Amateur</h1>
      </div>

      <div class="v-block-formations__cards">
        <article v-for="card in cards" :key="card.uri" class="v-block-formations__card u-flex u-flex--column">
          <div class="v-block-formations__card-image">
            <img v-if="card.image" :src="card.image" :alt="card.imageAlt" :style="{ objectPosition: card.imagePosition }">
          </div>
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

const { data: formationPages } = await useFetch<KqlFormationCard[]>('/api/formations')

const cards = computed(() =>
  (formationPages.value ?? []).map((page) => {
    const fields = props.block.content[CARD_FIELDS[page.uri]] ?? {}
    return {
      uri: page.uri,
      tag: fields.tag ?? '',
      title: fields.title ?? '',
      description: fields.description ?? '',
      image: page.previewImage?.url ?? '',
      imageAlt: page.previewImage?.alt ?? '',
      imagePosition: objectPosition(page.previewImage),
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
.v-block-formations__title {
  flex: 1;
  min-width: 260px;
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

.v-block-formations__card-image {
  aspect-ratio: 628 / 387;
  overflow: hidden;
  border-radius: var(--radius-m);
  background: var(--color-brand-00);

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
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
