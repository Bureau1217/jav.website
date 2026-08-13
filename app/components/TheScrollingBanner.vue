<template>
  <div v-if="message" class="v-scrolling-banner" role="marquee">
    <div class="v-scrolling-banner__track">
      <NuxtLink
        v-for="n in 8"
        :key="n"
        :to="link || '#'"
        class="v-scrolling-banner__item"
        :class="{ 'is-static': !link }"
      >
        <span>{{ message }}</span>
        <span aria-hidden="true">💥</span>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { KqlInfoBand } from '~~/shared/types/kql'

// Managed from the Panel: "Informations globales" > "Bandeau infos"
// (site.yml -> site_infos template). See server/api/site-infos.get.ts.
const { data: bands } = await useFetch<KqlInfoBand[]>('/api/site-infos')

const band = computed(() => bands.value?.[0] ?? null)
const message = computed(() => band.value?.text ?? '')
const link = computed(() => band.value?.link ?? '')
</script>

<style lang="scss" scoped>
.v-scrolling-banner {
  background: var(--color-brand-01);
  color: var(--color-brand-04);
  overflow: hidden;
  padding: var(--spacing-xs) 0;
}

.v-scrolling-banner__track {
  display: flex;
  gap: var(--spacing-m);
  width: max-content;
  animation: v-scrolling-banner-scroll 30s linear infinite;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
}

.v-scrolling-banner__item {
  display: flex;
  align-items: center;
  gap: var(--spacing-m);
  @include nav-menu;
  white-space: nowrap;
  padding-right: var(--spacing-m);
  color: inherit;
  text-decoration: none;

  &.is-static {
    pointer-events: none;
  }
}

@keyframes v-scrolling-banner-scroll {
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-50%);
  }
}
</style>
