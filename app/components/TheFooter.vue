<template>
  <footer class="v-footer">
    <div class="v-footer__brand">
      <UiDivider />
      <div class="v-footer__brand-row">
        <span class="v-footer__logo-mark" aria-hidden="true">JAV</span>
        <p class="v-footer__wordmark">JAV - L’École des Musiques</p>
      </div>
    </div>

    <div class="v-footer__content">
      <nav class="v-footer__links" aria-label="Navigation du pied de page">
        <NuxtLink to="/">Accueil</NuxtLink>
        <NuxtLink to="/formation-professionnelle">Centre de Formation</NuxtLink>
        <NuxtLink to="/pratique-amateur">Pratique Amateur</NuxtLink>
        <NuxtLink to="/agenda">Agenda</NuxtLink>
        <NuxtLink to="/a-propos">A propos</NuxtLink>
        <NuxtLink to="/ressources">Ressources</NuxtLink>
      </nav>

      <div class="v-footer__columns">
        <div class="v-footer__col">
          <p>Jazz Action Valence</p>
          <p>32 av. Georges Clemenceau</p>
          <p>26000 Valence</p>
        </div>
        <div class="v-footer__col">
          <p>Téléphone : 04.75.41.89.60</p>
          <p>Fax : 04.75.41.38.73</p>
          <p>E-mail : <a href="mailto:info@jazzactionvalence.com">info@jazzactionvalence.com</a></p>
        </div>
        <div class="v-footer__col">
          <NuxtLink to="/accessibilite">Accessibilité</NuxtLink>
          <NuxtLink to="/tarifs-financement">Tarifs et Financement</NuxtLink>
        </div>
        <div class="v-footer__col">
          <NuxtLink to="/mentions-legales">Mentions légales</NuxtLink>
          <NuxtLink to="/politique-de-confidentialite">Politique de confidentialité</NuxtLink>
        </div>
      </div>

      <div class="v-footer__dividers">
        <UiDivider v-for="n in 4" :key="n" />
      </div>

      <div class="v-footer__bottom">
        <ul class="v-footer__social">
          <li><a href="https://instagram.com" target="_blank" rel="noopener">Instagram</a></li>
          <li><a href="https://facebook.com" target="_blank" rel="noopener">Facebook</a></li>
          <li><a href="https://x.com" target="_blank" rel="noopener">X</a></li>
        </ul>
        <p class="v-footer__rights">Tous droits réservés {{ new Date().getFullYear() }}.</p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped>
.v-footer {
  background: var(--color-brand-04);
  color: var(--color-brand-01);
  padding: var(--spacing-7xl) var(--spacing-6xl) var(--spacing-5xl);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-7xl);

  @media (max-width: 900px) {
    padding: var(--spacing-4xl) var(--spacing-xl) var(--spacing-3xl);
    gap: var(--spacing-4xl);
  }
}

.v-footer__brand {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xl);
}

.v-footer__brand-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-xl);
  flex-wrap: wrap;
}

.v-footer__logo-mark {
  @include heading-display;
  font-size: var(--spacing-5xl);
}

.v-footer__wordmark {
  @include heading-display;
  text-align: right;
  flex: 1;

  @media (max-width: 900px) {
    font-size: var(--spacing-3xl);
    text-align: left;
  }
}

.v-footer__content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xl);
}

.v-footer__links {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-s);

  a {
    @include text-body-large-bold;
    text-decoration: none;
    color: var(--color-brand-01);
    width: fit-content;

    &:hover {
      text-decoration: underline;
    }
  }
}

.v-footer__columns {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: var(--spacing-xl);
  flex-wrap: wrap;
}

.v-footer__col {
  display: flex;
  flex-direction: column;
  gap: 0;

  p,
  a {
    @include text-body;
    color: var(--color-brand-01);
  }

  a {
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
}

.v-footer__dividers {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-s);
}

.v-footer__bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-xl);
  flex-wrap: wrap;
  @include text-label;
  text-transform: none;
}

.v-footer__social {
  display: flex;
  gap: var(--spacing-l);

  a {
    color: var(--color-brand-01);
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
}
</style>
