<template>
  <div class="v-block-partners u-flex u-flex--column u-gap-4xl">
    <div v-for="(card, index) in block.content.cards" :key="index" class="v-block-partners__card u-flex u-flex--column u-gap-xl">
      <UiSectionHeader v-if="card.title" :title="card.title" />
      <div v-if="card.description" class="v-block-partners__description" v-html="card.description" />

      <div v-if="card.partners?.length" class="v-block-partners__grid">
        <UiCard
          v-for="(partner, partnerIndex) in card.partners"
          :key="partnerIndex"
          bordered
          color="var(--color-brand-04)"
          class="v-block-partners__logo u-flex u-flex--align-center u-flex--justify-center"
        >
          <img v-if="logoUrl(partner)" :src="logoUrl(partner)!" :alt="partner.name ?? ''">
          <span v-else>{{ partner.name }}</span>
        </UiCard>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { KqlBlock, KqlFile } from '~~/shared/types/kql'

const props = defineProps<{
  block: KqlBlock
  images?: KqlFile[]
}>()

function logoUrl(partner: { logo?: string[] }): string | null {
  return resolveKqlFile(partner.logo, props.images)?.url ?? null
}
</script>

<style lang="scss" scoped>
.v-block-partners {
  padding: var(--spacing-xl) var(--gutter);
  color: var(--color-brand-04);
}

.v-block-partners__description {
  font-family: var(--font-body);
  font-weight: 600;
  font-size: var(--spacing-2xl); // 32px
  line-height: 1;
  max-width: 755px;

  :deep(p) {
    margin: 0;
  }
}

.v-block-partners__grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-xl);

  @media (max-width: 700px) {
    grid-template-columns: 1fr;
  }
}

.v-block-partners__logo {
  height: 297px;
  padding: var(--spacing-xl);

  img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
  }

  span {
    font-family: var(--font-heading);
    font-weight: 900;
    font-size: var(--spacing-xl); // 24px — smaller than the default heading-3 (40px), fits inside the logo card
    line-height: 1;
    text-align: center;
    max-width: 278px;
  }
}
</style>
