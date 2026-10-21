<template>
  <footer class="v-footer u-flex u-flex--column u-gutter-x">
    <!-- Only when the page above ends on a Qualiopi block (see
         useFooterLeadBars.ts) — continues that block's own two bars so the
         footer doesn't just abut it with no transition. -->
    <div v-if="footerLeadBars" class="v-footer__lead-bars u-flex u-flex--column u-gap-xs">
      <UiDivider variant="thick" />
      <UiDivider variant="thick" />
    </div>

    <div class="v-footer__brand u-flex u-flex--column u-gap-xl">
      <UiDivider />
      <div class="v-footer__brand-row u-flex u-flex--align-center u-flex--justify-between u-gap-xl u-flex--wrap">
        <span class="v-footer__logo-mark" aria-hidden="true" />
        <div class="v-footer__wordmark">JAV - L’École des Musiques</div>
      </div>
    </div>

    <div class="v-footer__content u-flex u-flex--column u-gap-xl">
      <nav class="v-footer__links u-flex u-flex--column u-gap-xs" aria-label="Navigation du pied de page">
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
          <p v-if="siteInfo?.email">E-mail : <a :href="`mailto:${siteInfo.email}`">{{ siteInfo.email }}</a></p>
        </div>
        <div v-if="legalLinksCol1.length" class="v-footer__col v-footer__col--legal u-flex u-flex--column u-gap-0">
          <NuxtLink v-for="link in legalLinksCol1" :key="link.label" :to="link.href">{{ link.label }}</NuxtLink>
        </div>
        <div v-if="legalLinksCol2.length" class="v-footer__col v-footer__col--legal u-flex u-flex--column u-gap-0">
          <NuxtLink v-for="link in legalLinksCol2" :key="link.label" :to="link.href">{{ link.label }}</NuxtLink>
        </div>
      </div>

      <div class="v-footer__dividers u-flex u-flex--column u-gap-s">
        <UiDivider v-for="n in 4" :key="n" />
      </div>

      <div class="v-footer__bottom u-flex u-flex--align-center u-flex--justify-between u-gap-xl u-flex--wrap">
        <ul v-if="socialLinks.length" class="v-footer__social u-flex u-gap-l">
          <li v-for="social in socialLinks" :key="social.label">
            <a :href="social.href" target="_blank" rel="noopener">{{ social.label }}</a>
          </li>
        </ul>
        <span class="v-footer__rights">Tous droits réservés {{ new Date().getFullYear() }}.</span>
      </div>

      <div v-if="siteInfo?.accessibilityText" class="v-footer__accessibility u-flex u-flex--column u-gap-0" v-html="siteInfo.accessibilityText" />
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

const footerLeadBars = useFooterLeadBars()

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

// Each only shown once an editor fills that network's URL in on
// "Informations globales" — no more fixed Instagram/Facebook/X trio with
// X dropped and the other two hardcoded to their homepages.
const socialLinks = computed(() => {
  const info = siteInfo.value
  if (!info) return []
  return [
    { label: 'Instagram', href: info.socialInstagram },
    { label: 'Facebook', href: info.socialFacebook },
    { label: 'Youtube', href: info.socialYoutube }
  ].filter((social): social is { label: string, href: string } => Boolean(social.href))
})

// The footer's 4 fixed-label legal links (see server/api/site-infos.get.ts)
// split back into the same two-column layout as before, but only the ones
// an editor has actually picked a page for — same reasoning as socialLinks
// above, a link with no target just isn't shown rather than pointing
// nowhere.
const visibleLegalLinks = computed(() =>
  (siteInfo.value?.footerLegalLinks ?? []).filter((link): link is { label: string, href: string } => Boolean(link.href))
)
const legalLinksCol1 = computed(() => visibleLegalLinks.value.slice(0, 2))
const legalLinksCol2 = computed(() => visibleLegalLinks.value.slice(2))
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

// Continues the Qualiopi block's own bars (see footerLeadBars above) — the
// gap from the block's last content down to these bars should match the
// Qualiopi block's own internal rhythm (2xl, same as its bars-to-logo gap
// at the top) instead of stacking Qualiopi's own bottom padding
// (--block-spacing) with the footer's separate top padding (also
// --block-spacing) below, which otherwise piles up into a much bigger gap
// than the one at the top. Pulls this element up by exactly that
// difference; a negative margin-top doesn't affect the (unrelated) gap to
// the next element below, since flex `gap` is measured independently of
// margins.
.v-footer__lead-bars {
  width: 100%;
  margin-top: calc(var(--spacing-2xl) - (var(--block-spacing) * 2));
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

// Every footer column (address, phone/email, the two legal-links columns)
// now shares the same small bold typography as the Instagram/Facebook row
// below (see .v-footer__bottom) instead of the larger regular footer body
// text this used to be.
.v-footer__col {
  p,
  a {
    font-family: var(--font-body);
    font-weight: 800;
    font-size: 16px;
    line-height: 1.6;
    color: var(--color-brand-01);
  }

  a {
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

  // Content is now the "Pied de page — texte accessibilité" writer field
  // (see server/api/site-infos.get.ts), rendered via v-html — :deep()
  // reaches the dynamically-inserted <p>/<strong>/<a> tags under scoped CSS.
  :deep(p) {
    color: var(--color-brand-01);
    margin: 0;
    // type-body-large (global p rule in typo.scss) sets its own explicit
    // font-size directly on <p>, so this has to override it here rather
    // than relying on inheriting the wrap's font-size.
    font-size: 12px;
  }

  :deep(a) {
    color: var(--color-brand-01);

    &:hover {
      text-decoration: underline;
    }
  }
}
</style>
