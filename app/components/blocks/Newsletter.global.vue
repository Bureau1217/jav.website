<template>
  <div class="v-block-newsletter-wrap u-flex u-flex--column u-gap-xl u-gutter-x">
    <UiSectionHeader v-if="block.content.title" :title="block.content.title" />

    <UiCard background="var(--color-page-accent)" color="var(--color-page-on-accent)" class="v-block-newsletter">
      <form class="v-block-newsletter__inner u-flex u-flex--column u-gap-xl" @submit.prevent="onSubmit">
        <label class="v-block-newsletter__field">
          <span>E-mail *</span>
          <input v-model="email" type="email" name="email" placeholder="marie.dupont@gmail.com" required>
        </label>

        <div class="u-flex u-flex--align-center u-flex--justify-end u-gap-xl u-flex--wrap">
          <p class="v-block-newsletter__status" aria-live="polite">{{ statusMessage }}</p>
          <UiButton type="submit" class="v-block-newsletter__submit" :disabled="status === 'sending'">
            S'inscrire
          </UiButton>
        </div>
      </form>
    </UiCard>
  </div>
</template>

<script setup lang="ts">
import type { KqlBlock } from '~~/shared/types/kql'

defineProps<{
  block: KqlBlock
}>()

const email = ref('')
const status = ref<'idle' | 'sending' | 'success' | 'unvalidated' | 'error'>('idle')
const statusMessage = ref('')

async function onSubmit() {
  status.value = 'sending'
  statusMessage.value = 'Envoi en cours…'

  try {
    const response: { status: string, message?: { message: string }[] } = await $fetch('/api/form/newsletter', {
      method: 'POST',
      body: { email: email.value }
    })

    if (response.status === 'error') {
      status.value = 'unvalidated'
      statusMessage.value = response.message?.map(issue => issue.message).join(', ') || "L'adresse n'a pas pu être validée."
      return
    }

    email.value = ''
    status.value = 'success'
    statusMessage.value = 'Merci, vous êtes bien inscrit(e) à la newsletter.'
  } catch {
    status.value = 'error'
    statusMessage.value = 'Une erreur est survenue, essayez à nouveau ou contactez-nous.'
  }
}
</script>

<style lang="scss" scoped>
.v-block-newsletter-wrap {
  padding-block: var(--block-spacing);
  color: var(--color-page-accent);
}

.v-block-newsletter {
  padding: var(--spacing-4xl);
  border-radius: var(--radius-l);

  @media (max-width: $breakpoint-mobile) {
    padding: var(--spacing-xl);
  }
}

// Same underlined-input look as the Form block.
.v-block-newsletter__field {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);

  span {
    @include type-body-large-bold;
  }

  input {
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

.v-block-newsletter__submit {
  --button-color: var(--color-page-on-accent);
  --button-text: var(--color-page-accent);

  &:disabled {
    opacity: 0.6;
    pointer-events: none;
  }
}
</style>
