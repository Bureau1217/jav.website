<template>
  <header class="v-header" :class="{ 'is-open': isOpen }">
    <div class="v-header__bar u-flex u-flex--align-center u-flex--justify-between u-gutter-x">
      <NuxtLink to="/" class="v-header__logo" aria-label="Jazz Action Valence — accueil" @click="isOpen = false">
        <span class="v-header__logo-mark" aria-hidden="true" />
      </NuxtLink>
      <button
        type="button"
        class="v-header__burger u-flex u-flex--align-center u-flex--justify-center"
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
      <nav
        v-if="isOpen"
        id="v-header-nav"
        class="v-header__nav u-flex u-flex--column u-flex--justify-center u-gutter-x"
      >
        <ul class="v-header__nav-list u-flex u-flex--column u-gap-m">
          <li v-for="item in navItems" :key="item.href" class="v-header__nav-item u-flex u-flex--column u-gap-m">
            <NuxtLink :to="item.href" class="v-header__nav-link u-flex u-flex--align-center u-flex--justify-between" @click="isOpen = false">
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

// Menu généré depuis les pages Kirby réelles (template "default"), dans
// l'ordre de l'arbre du Panel — plus de liste en dur à maintenir à la main.
// L'accueil est exclu ici : le logo pointe déjà vers "/".
const { data: navPages } = await useSiteNav()
const navItems = computed(() =>
  (navPages.value ?? [])
    .filter(page => page.uri !== '')
    .map(page => ({ label: page.title, href: `/${page.uri}` }))
)

watch(isOpen, (open) => {
  if (import.meta.client) {
    document.documentElement.style.overflow = open ? 'hidden' : ''
  }
})
</script>

<style lang="scss" scoped>
// Always sticky at the top of the page — .is-open switches it to a
// full-screen fixed panel instead. The bar (logo + burger) is never
// duplicated: it's the same element in both states, only its background
// color changes, so nothing shifts or jumps when the menu opens. The nav
// list simply becomes the second half of this same flex column, filling
// whatever height is left below the bar.
.v-header {
  position: sticky;
  top: 0;
  z-index: 1000;
  isolation: isolate;

  &.is-open {
    position: fixed;
    inset: 0;
    display: flex;
    flex-direction: column;
  }
}

// Always transparent — every page's own top section (Hero photo or flat
// color panel, see PagesDefault.vue) rises up underneath the header instead
// of sitting below a plain cream bar. Only the full-screen mobile nav
// (.is-open) gets an opaque background, since it's no longer overlaying
// anything.
.v-header__bar {
  padding-block: var(--spacing-m);
  background: transparent;
  transition: background-color 0.2s ease;
}

// Follows the page you're on (see usePageTheme.ts), same as every themed
// block — only while open, since the closed bar is transparent and floats
// over the page's own hero, which always stays mint regardless of theme.
.v-header.is-open .v-header__bar {
  background: var(--color-page-accent);
}

// Real exported logo mark, applied as a mask so it can be recolored via
// `color` — same trick the Figma source file uses — instead of shipping
// two separate colored SVGs for the bar vs. the open-nav state. Mint while
// closed (floating over the page's hero, which always stays mint), but
// switches to the page's "on accent" color once the menu opens onto its
// own accent-colored background.
.v-header__logo-mark {
  display: block;
  width: 60px;
  height: 47px;
  color: var(--color-brand-01);
  background-color: currentColor;
  -webkit-mask: url('/img/LOGO-JAV_HEADER.svg') center / contain no-repeat;
  mask: url('/img/LOGO-JAV_HEADER.svg') center / contain no-repeat;
  transition: color 0.2s ease;
}

.v-header.is-open .v-header__logo-mark {
  color: var(--color-page-on-accent);
}

.v-header__burger {
  width: 56px;
  height: 56px;
  padding: var(--spacing-xs);
  background: transparent;
  border: none;
  cursor: pointer;
}

// Hamburger ↔ cross morph: three absolutely-positioned bars so the top and
// bottom ones can rotate in place around the same center as the middle one,
// which just fades out.
.v-header__burger-icon {
  position: relative;
  display: block;
  width: 100%;
  height: 16px;

  span {
    position: absolute;
    left: 0;
    width: 100%;
    height: 4px;
    border-radius: var(--radius-pill);
    background: var(--color-brand-01);
    transition: transform 0.25s ease, opacity 0.2s ease, background-color 0.2s ease;
  }

  span:nth-child(1) { top: 0; }
  span:nth-child(2) { top: 6px; }
  span:nth-child(3) { top: 12px; }

  &.is-open {
    span {
      background: var(--color-page-on-accent);
    }

    span:nth-child(1) {
      top: 6px;
      transform: rotate(45deg);
    }

    span:nth-child(2) {
      opacity: 0;
    }

    span:nth-child(3) {
      top: 6px;
      transform: rotate(-45deg);
    }
  }
}

.v-header__nav {
  flex: 1;
  background: var(--color-page-accent);
  color: var(--color-page-on-accent);
  padding-block: var(--spacing-4xl);
  overflow-y: auto;

  @media (max-width: $breakpoint-mobile) {
    padding-block: var(--spacing-xl);
  }
}

.v-header__nav-link {
  @include type-nav-menu;
  text-decoration: none;
  color: var(--color-page-on-accent);

  @media (max-width: $breakpoint-mobile) {
    font-size: 24px;
  }
}

.v-header__nav-arrow {
  font-size: 32px;
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
