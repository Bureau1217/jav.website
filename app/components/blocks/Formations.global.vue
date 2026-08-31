<template>
  <div class="v-block-formations u-flex u-flex--column u-gap-2xl u-gutter-x">
    <UiSectionHeader v-if="block.content.title" :title="block.content.title" />
    <div class="v-block-formations__titles u-flex u-flex--align-end u-gap-xl u-flex--wrap">
      <h2>Formation<br>Professionnelle</h2>
      <h2>Pratique<br>Amateur</h2>
    </div>

    <div class="v-block-formations__cards">
      <article v-for="card in cards" :key="card.uri" class="v-block-formations__card u-flex u-flex--column">
        <div class="v-block-formations__card-image">
          <img v-if="card.image" :src="card.image" :alt="card.imageAlt">
        </div>
        <div class="v-block-formations__card-content u-flex u-flex--align-end u-flex--justify-between u-gap-m">
          <div class="v-block-formations__card-text u-flex u-flex--column u-gap-xs">
            <p class="v-block-formations__card-tag">{{ card.tag }}</p>
            <h3 class="v-block-formations__card-title">{{ card.title }}</h3>
            <p class="v-block-formations__card-description">{{ card.description }}</p>
          </div>
          <UiButton :to="card.href" class="v-block-formations__card-cta">Découvrir</UiButton>
        </div>
      </article>
    </div>

    <div class="v-block-formations__banner u-flex u-flex--align-center u-gap-xl">
      <span class="v-block-formations__banner-icon u-flex u-flex--align-center u-flex--justify-center" aria-hidden="true">🤝</span>
      <div class="v-block-formations__banner-text u-flex u-flex--column">
        <p class="v-block-formations__banner-title">JAV</p>
        <p class="v-block-formations__banner-subtitle">Un espace pour tous·tes</p>
      </div>
      <span class="v-block-formations__banner-arrow" aria-hidden="true">↗</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { KqlBlock, KqlFormationCard } from '~~/shared/types/kql'

defineProps<{
  block: KqlBlock
}>()

// The "formations" Kirby block has no editable fields — it's a fixed
// anchor that always highlights the "Formation Professionnelle" and
// "Pratique Amateur" pages (see server/api/formations.get.ts). Tag, title
// and image come from those pages' own header fields; the description is
// still hardcoded here until a matching CMS field exists for it.
const DESCRIPTIONS: Record<string, string> = {
  'formation-professionnelle': 'Centre reconnu par le Ministère de la Culture, certifié Qualiopi, qui forme depuis 30 ans aux métiers du jazz et des musiques actuelles.',
  'pratique-amateur': 'Cours individuels par instrument et ateliers de pratique collective (jazz, pop/rock, funk, voix...), pour tous âges et tous niveaux.'
}

const { data: formationPages } = await useFetch<KqlFormationCard[]>('/api/formations')

const cards = computed(() =>
  (formationPages.value ?? []).map(page => ({
    uri: page.uri,
    tag: page.headerTitle ?? '',
    title: page.headerSubtitle ?? '',
    description: DESCRIPTIONS[page.uri] ?? '',
    image: page.previewImage?.url ?? '',
    imageAlt: page.previewImage?.alt ?? '',
    href: `/${page.uri}`
  }))
)
</script>

<style lang="scss" scoped>
.v-block-formations {
  background: var(--color-brand-04);
  color: var(--color-brand-00);
  padding-block: var(--spacing-7xl);

  @media (max-width: $breakpoint-mobile) {
    padding-block: var(--spacing-4xl);
  }
}

.v-block-formations__titles {
  h2 {
    font-family: var(--font-heading);
    font-weight: 700;
    font-size: var(--spacing-4xl); // 48px
    line-height: 1;
    flex: 1;
    min-width: 260px;
  }
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
  font-family: var(--font-body);
  font-weight: 800;
  font-size: var(--spacing-m); // 16px
  line-height: 1;
  text-transform: uppercase;
}

// Now a real <h3> (card title, subordinate to the h2s above) — kept as an
// explicit override since the design intentionally uses the body font here
// instead of the default heading font/weight.
.v-block-formations__card-title {
  font-family: var(--font-body);
  font-weight: 800;
  font-size: var(--spacing-3xl); // 40px
  line-height: 1;
}

.v-block-formations__card-description {
  font-family: var(--font-body);
  font-weight: 700;
  font-size: 24px;
  line-height: 1;
}

.v-block-formations__card-cta {
  flex-shrink: 0;
}

.v-block-formations__banner {
  background: var(--color-brand-05);
  color: var(--color-brand-04);
  border-radius: var(--radius-s);
  padding: var(--spacing-m);
}

.v-block-formations__banner-icon {
  aspect-ratio: 1;
  height: 86px;
  background: var(--color-brand-04);
  color: var(--color-brand-05);
  border-radius: var(--radius-s);
  font-size: var(--spacing-5xl);
  flex-shrink: 0;
}

.v-block-formations__banner-text {
  flex: 1;
}

.v-block-formations__banner-title {
  font-family: var(--font-heading);
  font-weight: 900;
  font-size: var(--spacing-2xl); // 32px — smaller than the default heading-3 (40px), fits the banner
  line-height: 1;
}

.v-block-formations__banner-subtitle {
  font-family: var(--font-accent);
  font-style: italic;
  font-weight: 500;
  font-size: var(--spacing-3xl); // 40px
  line-height: 47px;
}

.v-block-formations__banner-arrow {
  font-size: var(--spacing-2xl);
}
</style>
