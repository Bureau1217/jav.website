<template>
  <div v-if="message" class="v-scrolling-banner" role="marquee">
    <div class="v-scrolling-banner__track u-flex u-gap-m">
      <NuxtLink
        v-for="n in 8"
        :key="n"
        :to="link || '#'"
        class="v-scrolling-banner__item u-flex u-flex--align-center u-gap-m"
        :class="{ 'is-static': !link }"
      >
        <span>{{ message }}</span>
        <span aria-hidden="true">💥</span>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
// Managed from the Panel: "Informations globales" > "Bandeau infos"
// (site.yml -> site_infos template). See server/api/site-infos.get.ts.
const { data: siteInfo } = await useSiteInfo()

const band = computed(() => siteInfo.value?.bands[0] ?? null)
const message = computed(() => band.value?.text ?? '')
const link = computed(() => band.value?.link ?? '')
</script>

<style lang="scss" scoped>
.v-scrolling-banner {
  position: relative;
  z-index: 2; // homepage only, rendered right after the Hero (see PagesDefault.vue)
  background: var(--color-brand-01);
  color: var(--color-brand-04);
  overflow: hidden;
  padding: var(--spacing-xs) 0;
}

.v-scrolling-banner__track {
  width: max-content;
  animation: v-scrolling-banner-scroll 30s linear infinite;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
}

.v-scrolling-banner__item {
  font-family: var(--font-heading);
  font-weight: 900;
  font-size: var(--spacing-2xl); // 32px
  line-height: 1;
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
