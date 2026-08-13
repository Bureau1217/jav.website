<template>
  <div class="v-block-formations">
    <div class="v-block-formations__titles">
      <h2>Formation<br>Professionnelle</h2>
      <h2>Pratique<br>Amateur</h2>
    </div>

    <div class="v-block-formations__cards">
      <article v-for="card in cards" :key="card.title" class="v-block-formations__card">
        <div class="v-block-formations__card-image">
          <img :src="card.image" :alt="card.imageAlt">
        </div>
        <div class="v-block-formations__card-content">
          <div class="v-block-formations__card-text">
            <p class="v-block-formations__card-tag">{{ card.tag }}</p>
            <p class="v-block-formations__card-title">{{ card.title }}</p>
            <p class="v-block-formations__card-description">{{ card.description }}</p>
          </div>
          <UiButton :to="card.href" class="v-block-formations__card-cta">Découvrir</UiButton>
        </div>
      </article>
    </div>

    <div class="v-block-formations__banner">
      <span class="v-block-formations__banner-icon" aria-hidden="true">🤝</span>
      <div class="v-block-formations__banner-text">
        <p class="v-block-formations__banner-title">JAV</p>
        <p class="v-block-formations__banner-subtitle">Un espace pour tous·tes</p>
      </div>
      <span class="v-block-formations__banner-arrow" aria-hidden="true">↗</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { KqlBlock } from '~~/shared/types/kql'

defineProps<{
  block: KqlBlock
}>()

// The "formations" Kirby block has no editable fields — it's an anchor for
// this front-end component. Content mirrors the Figma design until a real
// data source (CMS fields or an API) is wired up.
const cards = [
  {
    tag: 'Cours collectifs',
    title: 'Devenir musicien·ne professionnel·le',
    description: 'Centre reconnu par le Ministère de la Culture, certifié Qualiopi, qui forme depuis 30 ans aux métiers du jazz et des musiques actuelles.',
    image: '/images/formation-professionnelle.jpg',
    imageAlt: '',
    href: '/formation-professionnelle'
  },
  {
    tag: 'Cours individuels',
    title: 'Pratiquer en amateur·ice',
    description: 'Cours individuels par instrument et ateliers de pratique collective (jazz, pop/rock, funk, voix...), pour tous âges et tous niveaux.',
    image: '/images/pratique-amateur.jpg',
    imageAlt: '',
    href: '/pratique-amateur'
  }
]
</script>

<style lang="scss" scoped>
.v-block-formations {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2xl);
  background: var(--color-brand-04);
  color: var(--color-brand-00);
  padding: var(--spacing-7xl) var(--spacing-6xl);

  @media (max-width: 900px) {
    padding: var(--spacing-4xl) var(--spacing-xl);
  }
}

.v-block-formations__titles {
  display: flex;
  align-items: flex-end;
  gap: var(--spacing-xl);
  flex-wrap: wrap;

  h2 {
    @include heading-2;
    flex: 1;
    min-width: 260px;
  }
}

.v-block-formations__cards {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-xl);

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
}

.v-block-formations__card {
  display: flex;
  flex-direction: column;
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
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: var(--spacing-m);
  padding-top: var(--spacing-s);
  flex: 1;

  @media (max-width: 700px) {
    flex-direction: column;
    align-items: flex-start;
  }
}

.v-block-formations__card-text {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.v-block-formations__card-tag {
  @include text-label;
}

.v-block-formations__card-title {
  @include text-stat;
}

.v-block-formations__card-description {
  @include text-body-large-bold;
}

.v-block-formations__card-cta {
  flex-shrink: 0;
}

.v-block-formations__banner {
  display: flex;
  align-items: center;
  gap: var(--spacing-xl);
  background: var(--color-brand-05);
  color: var(--color-brand-04);
  border-radius: var(--radius-s);
  padding: var(--spacing-m);
}

.v-block-formations__banner-icon {
  display: flex;
  align-items: center;
  justify-content: center;
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
  display: flex;
  flex-direction: column;
}

.v-block-formations__banner-title {
  @include heading-3;
  font-size: var(--spacing-2xl);
}

.v-block-formations__banner-subtitle {
  @include accent-italic;
}

.v-block-formations__banner-arrow {
  font-size: var(--spacing-2xl);
}
</style>
