<template>
  <header class="v-header">
    <div class="v-header__bar">
      <NuxtLink to="/" class="v-header__logo" aria-label="Jazz Action Valence — accueil">
        <span class="v-header__logo-mark" aria-hidden="true">JAV</span>
      </NuxtLink>
      <button
        type="button"
        class="v-header__burger"
        :aria-expanded="isOpen"
        aria-controls="v-header-nav"
        :aria-label="isOpen ? 'Fermer le menu' : 'Ouvrir le menu'"
        @click="isOpen = !isOpen"
      >
        <span class="v-header__burger-icon" :class="{ 'is-open': isOpen }">
          <span /><span /><span />
        </span>
      </button>
    </div>

    <transition name="v-header-nav">
      <nav v-if="isOpen" id="v-header-nav" class="v-header__nav">
        <div class="v-header__nav-bar">
          <NuxtLink to="/" class="v-header__logo v-header__logo--nav" aria-label="Jazz Action Valence — accueil" @click="isOpen = false">
            <span class="v-header__logo-mark" aria-hidden="true">JAV</span>
          </NuxtLink>
          <button
            type="button"
            class="v-header__burger"
            aria-label="Fermer le menu"
            @click="isOpen = false"
          >
            <span class="v-header__burger-icon is-open"><span /><span /><span /></span>
          </button>
        </div>

        <ul class="v-header__nav-list">
          <li v-for="item in navItems" :key="item.href" class="v-header__nav-item">
            <NuxtLink :to="item.href" class="v-header__nav-link" @click="isOpen = false">
              {{ item.label }}
              <span class="v-header__nav-arrow" aria-hidden="true">↗</span>
            </NuxtLink>
            <UiDivider />
          </li>
        </ul>
      </nav>
    </transition>
  </header>
</template>

<script setup lang="ts">
const isOpen = ref(false)

const navItems = [
  { label: 'Formation professionnelle', href: '/formation-professionnelle' },
  { label: 'Pratique Amateur', href: '/pratique-amateur' },
  { label: 'Agenda', href: '/agenda' },
  { label: 'A propos', href: '/a-propos' },
  { label: 'Ressources', href: '/ressources' }
]

watch(isOpen, (open) => {
  if (import.meta.client) {
    document.documentElement.style.overflow = open ? 'hidden' : ''
  }
})
</script>

<style lang="scss" scoped>
.v-header {
  position: sticky;
  top: 0;
  z-index: 100;
}

.v-header__bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-m) var(--spacing-6xl);

  @media (max-width: 900px) {
    padding: var(--spacing-m) var(--spacing-xl);
  }
}

// TODO: replace with the exported Figma logo mark (public/logo-jav.svg) once
// the asset is available — the Figma MCP asset CDN isn't reachable from this
// sandbox's network, so a text mark stands in for now.
.v-header__logo-mark {
  @include nav-menu;
  color: var(--color-brand-04);
  letter-spacing: 0.02em;
}

.v-header__nav .v-header__logo-mark {
  color: var(--color-brand-01);
}

.v-header__burger {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  padding: var(--spacing-xs);
  background: transparent;
  border: none;
  cursor: pointer;
}

.v-header__burger-icon {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;

  span {
    display: block;
    height: 4px;
    border-radius: var(--radius-pill);
    background: var(--color-brand-04);
    transition: transform 0.2s ease, opacity 0.2s ease;
  }

  &.is-open span {
    background: var(--color-brand-01);
  }
}

.v-header__nav {
  position: fixed;
  inset: 0;
  background: var(--color-brand-04);
  color: var(--color-brand-01);
  padding: var(--spacing-4xl) var(--spacing-6xl);
  display: flex;
  flex-direction: column;
  gap: 152px;
  overflow-y: auto;

  @media (max-width: 900px) {
    padding: var(--spacing-xl);
    gap: var(--spacing-4xl);
  }
}

.v-header__nav-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;

  .v-header__burger-icon span {
    background: var(--color-brand-01);
  }
}

.v-header__nav-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-m);
}

.v-header__nav-item {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-m);
}

.v-header__nav-link {
  display: flex;
  align-items: center;
  justify-content: space-between;
  text-decoration: none;
  color: var(--color-brand-01);
  @include nav-menu;

  @media (max-width: 900px) {
    font-size: var(--spacing-xl);
  }
}

.v-header__nav-arrow {
  font-size: var(--spacing-2xl);
}


.v-header-nav-enter-active,
.v-header-nav-leave-active {
  transition: opacity 0.2s ease;
}

.v-header-nav-enter-from,
.v-header-nav-leave-to {
  opacity: 0;
}
</style>
