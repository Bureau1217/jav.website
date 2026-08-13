<template>
  <form class="v-block-form" :data-form-type="block.content.form_type" @submit.prevent>
    <template v-if="block.content.form_type === 'inscription'">
      <div class="v-block-form__row">
        <label class="v-block-form__field">
          <span>Prénom</span>
          <input type="text" name="firstname" required>
        </label>
        <label class="v-block-form__field">
          <span>Nom</span>
          <input type="text" name="lastname" required>
        </label>
      </div>
      <div class="v-block-form__row">
        <label class="v-block-form__field">
          <span>Email</span>
          <input type="email" name="email" required>
        </label>
        <label class="v-block-form__field">
          <span>Téléphone</span>
          <input type="tel" name="phone">
        </label>
      </div>
      <label class="v-block-form__field">
        <span>Formation souhaitée</span>
        <select name="formation">
          <option value="pro">Formation Professionnelle</option>
          <option value="amateur">Pratique Amateur</option>
        </select>
      </label>
      <label class="v-block-form__field">
        <span>Message</span>
        <textarea name="message" rows="4" />
      </label>
    </template>

    <template v-else>
      <div class="v-block-form__row">
        <label class="v-block-form__field">
          <span>Nom</span>
          <input type="text" name="name" required>
        </label>
        <label class="v-block-form__field">
          <span>Email</span>
          <input type="email" name="email" required>
        </label>
      </div>
      <label class="v-block-form__field">
        <span>Message</span>
        <textarea name="message" rows="6" required />
      </label>
    </template>

    <UiButton type="submit" class="v-block-form__submit">Envoyer</UiButton>
  </form>
</template>

<script setup lang="ts">
import type { KqlBlock } from '~~/shared/types/kql'

defineProps<{
  block: KqlBlock
}>()

// The "form" Kirby block only stores which form variant to render — the
// actual field markup lives here until a real submit endpoint is wired up.
</script>

<style lang="scss" scoped>
.v-block-form {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xl);
  padding: var(--spacing-6xl);
  color: var(--color-brand-04);

  @media (max-width: 900px) {
    padding: var(--spacing-xl);
  }
}

.v-block-form__row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-xl);

  @media (max-width: 700px) {
    grid-template-columns: 1fr;
  }
}

.v-block-form__field {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);

  span {
    @include text-label;
  }

  input,
  select,
  textarea {
    font-family: var(--font-body);
    font-size: 16px;
    border: 2px solid var(--color-brand-04);
    border-radius: var(--radius-s);
    padding: var(--spacing-s) var(--spacing-m);
    background: var(--color-brand-00);
    color: var(--color-brand-04);

    &:focus {
      outline: 2px solid var(--color-brand-04);
      outline-offset: 2px;
    }
  }
}

.v-block-form__submit {
  --button-color: var(--color-brand-04);
  --button-text: var(--color-brand-00);
  align-self: flex-start;
}
</style>
