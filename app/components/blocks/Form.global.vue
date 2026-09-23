<template>
  <div class="v-block-form-wrap u-flex u-flex--column u-gap-xl u-gutter-x">
    <UiSectionHeader v-if="block.content.title" :title="block.content.title" />
    <p v-if="introText" class="v-block-form__intro">{{ introText }}</p>
    <UiDivider variant="thin" />

    <UiCard background="var(--color-page-accent)" color="var(--color-page-on-accent)" class="v-block-form">
      <form
        class="v-block-form__inner u-flex u-flex--column u-gap-2xl"
        :data-form-type="block.content.form_type"
        @submit.prevent
      >
        <div class="v-block-form__head u-flex u-flex--align-center u-flex--justify-between u-gap-xl u-flex--wrap">
          <h1 class="v-block-form__card-title">Votre demande</h1>
          <!-- Tag only — both tabs submit the exact same fields below, this
               just marks the request as a first-time or renewal enrolment. -->
          <div v-if="isInscription" class="v-block-form__tabs">
            <button
              type="button"
              class="v-block-form__tab"
              :class="{ 'is-active': registrationType === 'first' }"
              @click="registrationType = 'first'"
            >
              Première Inscription
            </button>
            <button
              type="button"
              class="v-block-form__tab"
              :class="{ 'is-active': registrationType === 'renewal' }"
              @click="registrationType = 'renewal'"
            >
              Réinscription
            </button>
          </div>
        </div>

        <div class="v-block-form__section u-flex u-flex--column u-gap-m">
          <span class="v-block-form__section-label">Vos informations</span>

          <template v-if="isInscription">
            <div class="v-block-form__row">
              <label class="v-block-form__field">
                <span>Nom *</span>
                <input type="text" name="lastname" placeholder="Dupont" required>
              </label>
              <label class="v-block-form__field">
                <span>Prénom *</span>
                <input type="text" name="firstname" placeholder="Marie" required>
              </label>
            </div>
            <label class="v-block-form__field">
              <span>Âge *</span>
              <input type="number" name="age" placeholder="30" min="0" required>
            </label>
            <label class="v-block-form__field">
              <span>Téléphone *</span>
              <input type="tel" name="phone" placeholder="+33 0 00 00 00 00" required>
            </label>
            <label class="v-block-form__field">
              <span>E-mail *</span>
              <input type="email" name="email" placeholder="marie.dupont@gmail.com" required>
            </label>
          </template>

          <template v-else>
            <div class="v-block-form__row">
              <label class="v-block-form__field">
                <span>Nom *</span>
                <input type="text" name="name" placeholder="Dupont" required>
              </label>
              <label class="v-block-form__field">
                <span>E-mail *</span>
                <input type="email" name="email" placeholder="marie.dupont@gmail.com" required>
              </label>
            </div>
            <label class="v-block-form__field">
              <span>Message *</span>
              <textarea name="message" rows="4" required />
            </label>
          </template>
        </div>

        <div v-if="isInscription" class="v-block-form__section u-flex u-flex--column u-gap-m">
          <span class="v-block-form__section-label">Recevoir le dossier par *</span>
          <div class="v-block-form__delivery-row">
            <label class="v-block-form__delivery" :class="{ 'is-selected': deliveryMethod === 'email' }">
              <input v-model="deliveryMethod" type="radio" name="delivery" value="email">
              <span class="v-block-form__delivery-dot" aria-hidden="true" />
              <span class="v-block-form__delivery-text">
                <strong>E-mail</strong>
                <span>PDF en pièce jointe, sous 48h</span>
              </span>
            </label>
            <label class="v-block-form__delivery" :class="{ 'is-selected': deliveryMethod === 'courrier' }">
              <input v-model="deliveryMethod" type="radio" name="delivery" value="courrier">
              <span class="v-block-form__delivery-dot" aria-hidden="true" />
              <span class="v-block-form__delivery-text">
                <strong>Courrier Postal</strong>
                <span>Dossier imprimé, sous 5 jours</span>
              </span>
            </label>
          </div>
        </div>

        <UiButton type="submit" class="v-block-form__submit">
          {{ isInscription ? 'Recevoir mon dossier' : 'Envoyer' }}
        </UiButton>
      </form>
    </UiCard>
  </div>
</template>

<script setup lang="ts">
import type { KqlBlock } from '~~/shared/types/kql'

const props = defineProps<{
  block: KqlBlock
}>()

// The "form" Kirby block only stores a title + which form variant to render
// (see site/blueprints/blocks/form.yml) — the actual field markup, intro
// copy, and micro-interactions below live here until a real submit
// endpoint is wired up.
const isInscription = computed(() => props.block.content.form_type === 'inscription')

const registrationType = ref<'first' | 'renewal'>('first')
const deliveryMethod = ref<'email' | 'courrier'>('email')

const INTROS: Record<string, string> = {
  inscription: 'Remplissez ce court formulaire. Nous vous envoyons le dossier complet, par e-mail ou par courrier, pour que vous puissiez le compléter à votre rythme.',
  contact: 'Une question, une envie de nous rencontrer ? Écrivez-nous, nous vous répondons sous 48h.'
}

const introText = computed(() => INTROS[props.block.content.form_type as string] ?? '')
</script>

<style lang="scss" scoped>
.v-block-form-wrap {
  padding-block: var(--block-spacing);
  color: var(--color-page-accent);
}

// Real <p> — no local font override needed, typo.scss's bare tag rule
// covers it entirely (Inter body-large)... except this one IS bolder than
// canonical p on purpose (matches the intro copy's weight in the design),
// hence the explicit override below instead of leaving it bare.
.v-block-form__intro {
  @include type-body-large-bold;
}

.v-block-form {
  padding: var(--spacing-4xl);
  border-radius: var(--radius-l);

  @media (max-width: $breakpoint-mobile) {
    padding: var(--spacing-xl);
  }
}

.v-block-form__card-title {
  // Real <h1> — no local font override needed, typo.scss's bare tag rule
  // covers it entirely; color comes from UiCard's `color` prop (currentColor).
}

.v-block-form__tabs {
  display: flex;
  gap: var(--spacing-xs);
  flex-wrap: wrap;
}

.v-block-form__tab {
  font-family: var(--font-body);
  font-weight: 700;
  font-size: 16px;
  padding: var(--spacing-s) var(--spacing-l);
  border-radius: var(--radius-pill);
  border: none;
  cursor: pointer;
  background: rgba(var(--color-page-on-accent-rgb), 0.15);
  color: rgba(var(--color-page-on-accent-rgb), 0.6);
  transition: background-color 0.2s ease, color 0.2s ease;
}

.v-block-form__tab.is-active {
  background: var(--color-page-on-accent);
  color: var(--color-page-accent);
}

.v-block-form__section-label {
  @include type-body-large-bold;
}

.v-block-form__row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-xl);

  @media (max-width: 700px) {
    grid-template-columns: 1fr;
  }
}

// Underlined, not boxed — inputs sit directly on the card's own dark green
// background instead of their own field box, per the updated design.
.v-block-form__field {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);

  span {
    @include type-body-large-bold;
  }

  input,
  textarea {
    font-family: var(--font-body);
    font-weight: 500;
    font-size: 20px;
    color: var(--color-page-on-accent);
    background: transparent;
    border: none;
    border-bottom: 1px solid rgba(var(--color-page-on-accent-rgb), 0.4);
    border-radius: 0;
    padding: var(--spacing-xs) 0;

    &::placeholder {
      color: rgba(var(--color-page-on-accent-rgb), 0.6);
    }

    &:focus {
      outline: none;
      border-bottom-color: var(--color-page-on-accent);
    }
  }
}

.v-block-form__delivery-row {
  display: flex;
  gap: var(--spacing-xl);
  flex-wrap: wrap;
}

.v-block-form__delivery {
  position: relative;
  flex: 1;
  min-width: 220px;
  display: flex;
  align-items: center;
  gap: var(--spacing-m);
  padding: var(--spacing-l) var(--spacing-xl);
  border: 1px solid rgba(var(--color-page-on-accent-rgb), 0.25);
  border-radius: var(--radius-m);
  cursor: pointer;
  opacity: 0.6;
  transition: border-color 0.2s ease, background-color 0.2s ease, opacity 0.2s ease;

  input {
    position: absolute;
    opacity: 0;
    pointer-events: none;
  }

  &.is-selected {
    border-color: var(--color-page-on-accent);
    background: rgba(var(--color-page-on-accent-rgb), 0.08);
    opacity: 1;
  }
}

.v-block-form__delivery-dot {
  position: relative;
  flex-shrink: 0;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 1px solid rgba(var(--color-page-on-accent-rgb), 0.5);

  .v-block-form__delivery.is-selected & {
    border-color: var(--color-page-on-accent);

    &::after {
      content: '';
      position: absolute;
      inset: 4px;
      border-radius: 50%;
      background: var(--color-page-on-accent);
    }
  }
}

.v-block-form__delivery-text {
  display: flex;
  flex-direction: column;
  gap: 2px;

  strong {
    font-family: var(--font-body);
    font-weight: 700;
    font-size: 20px;
  }

  span {
    font-family: var(--font-body);
    font-weight: 500;
    font-size: 16px;
  }
}

.v-block-form__submit {
  --button-color: var(--color-page-on-accent);
  --button-text: var(--color-page-accent);
  align-self: flex-end;
}
</style>
