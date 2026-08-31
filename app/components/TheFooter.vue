<template>
  <footer class="v-footer u-flex u-flex--column u-gutter-x">
    <div class="v-footer__brand u-flex u-flex--column u-gap-xl">
      <UiDivider />
      <div class="v-footer__brand-row u-flex u-flex--align-center u-flex--justify-between u-gap-xl u-flex--wrap">
        <span class="v-footer__logo-mark" aria-hidden="true" />
        <p class="v-footer__wordmark">JAV - L’École des Musiques</p>
      </div>
    </div>

    <div class="v-footer__content u-flex u-flex--column u-gap-xl">
      <nav class="v-footer__links u-flex u-flex--column u-gap-s" aria-label="Navigation du pied de page">
        <NuxtLink v-for="page in footerPages" :key="page.uri" :to="`/${page.uri}`">
          {{ page.title }}
        </NuxtLink>
      </nav>

      <div class="v-footer__columns u-flex u-flex--align-end u-flex--justify-between u-gap-xl u-flex--wrap">
        <div v-if="address" class="v-footer__col u-flex u-flex--column u-gap-0">
          <p v-if="address.name">{{ address.name }}</p>
          <p v-if="addressLine1">{{ addressLine1 }}</p>
          <p v-if="addressLine2">{{ addressLine2 }}</p>
        </div>
        <div class="v-footer__col u-flex u-flex--column u-gap-0">
          <p v-if="siteInfo?.phone">Téléphone : {{ siteInfo.phone }}</p>
          <p v-if="siteInfo?.fax">Fax : {{ siteInfo.fax }}</p>
          <p v-if="siteInfo?.email">E-mail : <a :href="`mailto:${siteInfo.email}`">{{ siteInfo.email }}</a></p>
        </div>
        <div class="v-footer__col u-flex u-flex--column u-gap-0">
          <NuxtLink to="/accessibilite">Accessibilité</NuxtLink>
          <NuxtLink to="/tarifs-financement">Tarifs et Financement</NuxtLink>
        </div>
        <div class="v-footer__col u-flex u-flex--column u-gap-0">
          <NuxtLink to="/mentions-legales">Mentions légales</NuxtLink>
          <NuxtLink to="/politique-de-confidentialite">Politique de confidentialité</NuxtLink>
        </div>
      </div>

      <div class="v-footer__dividers u-flex u-flex--column u-gap-s">
        <UiDivider v-for="n in 4" :key="n" />
      </div>

      <div class="v-footer__bottom u-flex u-flex--align-center u-flex--justify-between u-gap-xl u-flex--wrap">
        <ul class="v-footer__social u-flex u-gap-l">
          <li><a href="https://instagram.com" target="_blank" rel="noopener">Instagram</a></li>
          <li><a href="https://facebook.com" target="_blank" rel="noopener">Facebook</a></li>
          <li><a href="https://x.com" target="_blank" rel="noopener">X</a></li>
        </ul>
        <p class="v-footer__rights">Tous droits réservés {{ new Date().getFullYear() }}.</p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
// Adresse, contact et bandeau : "Informations globales" dans le Panel
// (site_infos). Le footer a sa propre sélection de pages (champ "Pages" du
// même écran) — c'est un choix éditorial différent du menu du header, qui
// lui liste automatiquement toutes les pages (voir useSiteNav()).
const { data: siteInfo } = await useSiteInfo()

// Tant que personne n'a encore rempli le champ "Pages" dans le Panel, on
// retombe sur la même liste auto-générée que le header plutôt que
// d'afficher un footer sans navigation.
const { data: navPages } = await useSiteNav()
const footerPages = computed(() => {
  const picked = siteInfo.value?.footerPages ?? []
  return picked.length ? picked : (navPages.value ?? [])
})

const address = computed(() => siteInfo.value?.address ?? null)
const addressLine1 = computed(() => {
  const a = address.value
  if (!a) return ''
  return [a.number, a.street].filter(Boolean).join(' ')
})
const addressLine2 = computed(() => {
  const a = address.value
  if (!a) return ''
  return [a.postalCode, a.city].filter(Boolean).join(' ')
})
</script>

<style lang="scss" scoped>
.v-footer {
  background: var(--color-brand-04);
  color: var(--color-brand-01);
  padding-block: var(--spacing-7xl) var(--spacing-5xl);
  gap: var(--spacing-7xl);

  @media (max-width: $breakpoint-mobile) {
    padding-block: var(--spacing-4xl) var(--spacing-3xl);
    gap: var(--spacing-4xl);
  }
}

// Same mask trick as the header — bakes the exported logo mark into a
// solid shape colored via `color` (currentColor), instead of a hardcoded
// SVG fill that wouldn't follow the footer's brand-01 text color.
.v-footer__logo-mark {
  display: block;
  width: 280px;
  height: 221px;
  background-color: currentColor;
  -webkit-mask: url('/img/LOGO-JAV_FOOTER.svg') center / contain no-repeat;
  mask: url('/img/LOGO-JAV_FOOTER.svg') center / contain no-repeat;
  flex-shrink: 0;

  @media (max-width: $breakpoint-mobile) {
    width: 160px;
    height: 126px;
  }
}

.v-footer__wordmark {
  font-family: var(--font-heading);
  font-weight: 900;
  font-size: var(--spacing-7xl); // 96px
  line-height: 0.95;
  text-align: right;
  max-width: 820px;

  @media (max-width: $breakpoint-mobile) {
    font-size: var(--spacing-3xl);
    text-align: left;
    max-width: none;
  }
}

.v-footer__links {
  a {
    font-family: var(--font-body);
    font-weight: 700;
    font-size: 24px;
    line-height: 1;
    text-decoration: none;
    color: var(--color-brand-01);
    width: fit-content;

    &:hover {
      text-decoration: underline;
    }
  }
}

.v-footer__col {
  // p picks up family/weight/size/line-height straight from the global `p`
  // rule in typo.scss — no local override, so changing that rule updates
  // this text too. Only color is footer-specific.
  p {
    color: var(--color-brand-01);
  }

  a {
    font-family: var(--font-body);
    font-weight: 500;
    font-size: 16px;
    line-height: 1;
    color: var(--color-brand-01);
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
}

.v-footer__bottom {
  font-family: var(--font-body);
  font-weight: 800;
  font-size: var(--spacing-m); // 16px
  line-height: 1;
}

.v-footer__social {
  a {
    color: var(--color-brand-01);
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
}
</style>
