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
          background="var(--color-brand-00)"
          color="var(--color-page-accent)"
          class="v-block-partners__logo u-flex u-flex--align-center u-flex--justify-center"
        >
          <img v-if="logoUrl(partner, index, partnerIndex)" :src="logoUrl(partner, index, partnerIndex)!" :alt="partner.name ?? ''">
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

// block.partnerLogos (see server/utils/kqlPageQuery.ts) resolves each
// partner's "logo" from anywhere on the site, not just images uploaded to
// this page — the primary source. Falling back to resolveKqlFile against
// the page's own images covers the (rare) case a logo was actually
// uploaded straight to this page.
function logoUrl(partner: { logo?: string[] }, cardIndex: number, partnerIndex: number): string | null {
  const resolved = props.block.partnerLogos?.[cardIndex]?.partners?.[partnerIndex]?.logo
  return resolved?.url ?? resolveKqlFile(partner.logo, props.images)?.url ?? null
}
</script>

<style lang="scss" scoped>
.v-block-partners {
  padding-block: var(--block-spacing);
  padding-inline: var(--gutter);
  color: var(--color-page-accent);
}

.v-block-partners__description {
  @include type-text-heading-2;
  max-width: 755px;

  :deep(p) {
    margin: 0;
  }
}

.v-block-partners__grid {
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
    font-size: 24px; // smaller than the default heading-3 (40px), fits inside the logo card
    line-height: 1;
    text-align: center;
    max-width: 278px;
  }
}
</style>
