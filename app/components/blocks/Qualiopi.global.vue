<template>
  <div class="v-block-qualiopi u-flex u-flex--column u-flex--align-center u-gap-2xl u-gutter-x">
    <div class="v-block-qualiopi__bars u-flex u-flex--column u-gap-xs">
      <UiDivider variant="thick" />
      <UiDivider variant="thick" />
    </div>

    <div v-if="logo" class="v-block-qualiopi__logo">
      <img :src="logo.url" :alt="logo.alt ?? 'Qualiopi'">
    </div>

    <div class="v-block-qualiopi__text u-flex u-flex--column u-flex--align-center u-gap-m">
      <div v-if="block.content.title" class="v-block-qualiopi__title" v-html="block.content.title" />
      <div v-if="block.content.subtitle" class="v-block-qualiopi__subtitle" v-html="block.content.subtitle" />
    </div>

    <a
      v-if="pdf"
      :href="pdf.url"
      :download="block.content.title || true"
      class="v-block-qualiopi__cta"
    >
      {{ block.content.button_text || 'Consultable ici' }}
    </a>

    <div v-if="block.content.description" class="v-block-qualiopi__description" v-html="block.content.description" />

    <div v-if="hasContact" class="v-block-qualiopi__contact u-flex u-flex--column">
      <span v-if="block.content.contact_label">{{ block.content.contact_label }}</span>
      <span v-if="block.content.contact_name">{{ block.content.contact_name }}</span>
      <component
        :is="block.content.contact_email_link ? 'a' : 'span'"
        v-if="block.content.contact_email_text"
        :href="block.content.contact_email_link || undefined"
      >
        {{ block.content.contact_email_text }}
      </component>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { KqlBlock } from '~~/shared/types/kql'

const props = defineProps<{
  block: KqlBlock
}>()

const logo = computed(() => props.block.qualiopiLogo ?? null)
// Not through UiButton: this is a real file download (needs the `download`
// attribute, which NuxtLink/UiButton don't pass through), not a navigation
// link — see Resources.global.vue for the same reasoning.
const pdf = computed(() => props.block.qualiopiPdf ?? null)

const hasContact = computed(() =>
  Boolean(props.block.content.contact_label || props.block.content.contact_name || props.block.content.contact_email_text)
)
</script>

<style lang="scss" scoped>
// Same page-theme system as every other themed block (Formations,
// TheFloatingPromo...) — background/text follow whichever page this block
// sits on (green on home, maroon on Formation Pro...) instead of a color
// fixed to this block alone.
.v-block-qualiopi {
  background: var(--color-page-accent);
  color: var(--color-page-on-accent);
  padding-block: var(--block-spacing);
  text-align: center;
}

.v-block-qualiopi__bars {
  width: 100%;
}

// Logo sits on real white, not the design system's cream (--color-brand-00)
// — matches the Qualiopi mark's own official artwork, which is white-backed.
.v-block-qualiopi__logo {
  background: #fff;
  border-radius: var(--radius-m);
  padding: var(--spacing-m);
  width: 260px;

  img {
    display: block;
    width: 100%;
    height: auto;
  }
}

// Wider than a typical centered text column (was 720px) — the text should
// spread further across the block's own width, closer to the full
// available width, not stay narrow.
.v-block-qualiopi__text,
.v-block-qualiopi__description {
  max-width: 1100px;
  width: 100%;
}

// A <div>, not a real heading — this block's own bold accent style
// (matching the mockup), not the site's canonical h1/h2/h3 scale.
.v-block-qualiopi__title {
  font-family: var(--font-body);
  font-weight: 800;
  font-size: 32px;
  line-height: 1.2;

  :deep(p) {
    margin: 0;
  }
}

.v-block-qualiopi__subtitle {
  @include type-body-large;

  :deep(p) {
    margin: 0;
  }

  :deep(strong) {
    font-weight: 800;
  }
}

.v-block-qualiopi__cta {
  @include type-body-large;
  font-weight: 800;
  display: inline-block;
  background: var(--color-page-on-accent);
  color: var(--color-page-accent);
  border: 2px solid transparent;
  border-radius: var(--radius-pill);
  padding: var(--spacing-xs) var(--spacing-xl);
  text-decoration: none;
  cursor: pointer;
  transition: background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease;

  &:hover {
    background: transparent;
    color: var(--color-page-on-accent);
    border-color: var(--color-page-on-accent);
  }
}

.v-block-qualiopi__description {
  @include type-body-large;
  // An email address (as typed straight into this free-text field, no
  // spaces to wrap on) wider than the column was overflowing the whole
  // block horizontally on mobile instead of wrapping.
  overflow-wrap: anywhere;

  :deep(p) {
    margin: 0;
  }

  :deep(strong) {
    font-weight: 800;
  }
}

.v-block-qualiopi__contact {
  @include type-body-large;
  // Same reasoning as .v-block-qualiopi__description above — the contact
  // email here is just as likely to be a single unbreakable string.
  overflow-wrap: anywhere;

  a {
    color: inherit;
    text-decoration: underline;
  }
}
</style>
