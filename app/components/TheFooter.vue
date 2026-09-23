<template>
  <footer class="v-footer u-flex u-flex--column u-gutter-x">
    <div class="v-footer__brand u-flex u-flex--column u-gap-xl">
      <UiDivider />
      <div class="v-footer__brand-row u-flex u-flex--align-center u-flex--justify-between u-gap-xl u-flex--wrap">
        <span class="v-footer__logo-mark" aria-hidden="true" />
        <div class="v-footer__wordmark">JAV - L’École des Musiques</div>
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
        <span class="v-footer__rights">Tous droits réservés {{ new Date().getFullYear() }}.</span>
      </div>

      <div class="v-footer__accessibility u-flex u-flex--column u-gap-0">
        <p><strong>ACCESSIBILITÉ AUX PERSONNES EN SITUATION DE HANDICAP :</strong></p>
        <p>Notre établissement est accessible aux personnes à mobilité réduite.</p>
        <p>
          Selon les spécificités de votre handicap, nous étudierons les possibilités d’adaptation de la
          formation en concertation avec l’équipe pédagogique et avec l’aide de la référente Ressource
          handicap formation de l’AGEFIPH Auvergne-Rhône-Alpes.
        </p>
        <p>Une proposition vous sera apportée sous 10 jours.</p>
        <p>Contact : <a href="mailto:coordination@jazzactionvalence.com">coordination@jazzactionvalence.com</a></p>
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
  // Follows the page you're on (see usePageTheme.ts) — green by default,
  // e.g. maroon on Formation Pro. Text stays mint always (not
  // --color-page-on-accent — that one's for blocks specifically, the
  // footer is an explicit exception along with the page's own hero).
  background: var(--color-page-accent);
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

// A <div>, not a <p> — the wordmark uses the display style (GT Maru 96px),
// nothing like a <p>'s canonical style, so it isn't tagged as one.
.v-footer__wordmark {
  @include type-display;
  text-align: right;
  max-width: 820px;

  @media (max-width: $breakpoint-mobile) {
    font-size: 40px;
    text-align: left;
    max-width: none;
  }
}

.v-footer__links {
  a {
    @include type-body-large-bold;
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

  // Same size as the p's right next to them (address, phone...) — both
  // read as regular footer body text, just one is a link.
  a {
    @include type-body-large;
    color: var(--color-brand-01);
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
}

// Doesn't map to a named type style — "Tous droits réservés" shouldn't be
// force-uppercased the way type-label would. Set here on the row and
// inherited by both the nav links and .v-footer__rights below — safe now
// that neither is a <p> (a real <p> would have overridden this via
// typo.scss's own bare-tag rule instead of inheriting it).
.v-footer__bottom {
  font-family: var(--font-body);
  font-weight: 800;
  font-size: 16px;
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

// Legal-style small print, well below the "Tous droits réservés" row —
// deliberately not using type-body-large like the rest of the footer.
.v-footer__accessibility {
  font-family: var(--font-body);
  line-height: 1.5;
  opacity: 0.7;
  text-align: center;
  align-items: center;

  p {
    color: var(--color-brand-01);
    margin: 0;
    // type-body-large (global p rule in typo.scss) sets its own explicit
    // font-size directly on <p>, so this has to override it here rather
    // than relying on inheriting the wrap's font-size.
    font-size: 12px;
  }

  a {
    color: var(--color-brand-01);

    &:hover {
      text-decoration: underline;
    }
  }
}
</style>
