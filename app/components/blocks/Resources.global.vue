<template>
  <div class="v-block-resources u-flex u-flex--column u-gap-xl u-gutter-x">
    <UiSectionHeader v-if="block.content.title" :title="block.content.title" />
    <UiDivider variant="thin" />
    <template v-for="(item, index) in block.content.resource_items" :key="index">
      <a
        :href="resourceHref(item, index)"
        :download="resourceDownload(item, index)"
        :target="item.resource_type === 'file' ? undefined : '_blank'"
        rel="noopener"
        class="v-block-resources__item u-flex u-flex--align-center u-flex--justify-between u-gap-xl"
      >
        <span class="v-block-resources__text u-flex u-flex--column u-gap-xs">
          <span class="v-block-resources__meta">
            {{ typeLabel(item) }}<template v-if="updatedLabel(item, index)"> · MIS À JOUR EN {{ updatedLabel(item, index) }}</template>
          </span>
          <span class="v-block-resources__title">{{ item.resource_title }}</span>
        </span>
        <span
          class="v-block-resources__icon"
          :class="item.resource_type === 'file' ? 'v-block-resources__icon--download' : 'v-block-resources__icon--link'"
          aria-hidden="true"
        />
      </a>
      <UiDivider variant="thin" />
    </template>
  </div>
</template>

<script setup lang="ts">
import type { KqlBlock, KqlFile } from '~~/shared/types/kql'

const props = defineProps<{
  block: KqlBlock
  files?: KqlFile[]
  /** Page content's last-saved date ("Y-m-d") — used as the "MIS À JOUR
   * EN ..." for "Dossier" (link) items, which have no file of their own. */
  pageModified?: string | null
}>()

// block.resourceFiles (see server/utils/kqlPageQuery.ts) resolves each
// item's "resource_file" from anywhere on the site, not just files
// uploaded to this page — the primary source, so a PDF picked from
// elsewhere still shows its real modified date automatically. Falling back
// to resolveKqlFile against the page's own files covers the (rare) case a
// file was actually uploaded straight to this page.
function resolvedFile(item: { resource_file?: string[] }, index: number): KqlFile | null {
  return props.block.resourceFiles?.[index]?.file
    ?? resolveKqlFile(item.resource_file, props.files)
    ?? null
}

function fileUrl(item: { resource_file?: string[] }, index: number): string | null {
  return resolvedFile(item, index)?.url ?? null
}

// Falls back to "#" when a "Fichier PDF" item's file hasn't resolved (e.g.
// picked but the page not yet saved/published in the Panel) — but NEVER
// pairs that with the `download` attribute below, otherwise the browser
// downloads the current page itself as an .html file instead of doing
// nothing, which is worse than a dead link.
function resourceHref(item: { resource_type?: string; resource_file?: string[]; resource_link?: string }, index: number): string {
  if (item.resource_type !== 'file') return item.resource_link || '#'
  return fileUrl(item, index) ?? '#'
}

function resourceDownload(item: { resource_type?: string; resource_file?: string[]; resource_title?: string }, index: number): string | true | undefined {
  if (item.resource_type !== 'file') return undefined
  const url = fileUrl(item, index)
  if (!url) return undefined
  return item.resource_title || true
}

function typeLabel(item: { resource_type?: string }): string {
  return item.resource_type === 'file' ? 'PDF' : 'DOSSIER'
}

// Editors never fill a date themselves — it's read automatically from
// whichever timestamp is available: the PDF file's own modified date (kept
// current automatically whenever that file is replaced/re-uploaded in
// Kirby, no editor action needed), or (for a plain link, which has no
// file) the page content's last-saved date as the closest available
// proxy. Always shown as "mois année" only.
function updatedLabel(item: { resource_type?: string; resource_file?: string[] }, index: number): string {
  const raw = item.resource_type === 'file'
    ? resolvedFile(item, index)?.modified
    : props.pageModified

  if (!raw) return ''

  const date = new Date(raw)
  if (Number.isNaN(date.getTime())) return ''

  return new Intl.DateTimeFormat('fr-FR', { month: 'long', year: 'numeric' })
    .format(date)
    .toUpperCase()
}
</script>

<style lang="scss" scoped>
.v-block-resources {
  padding-block: var(--block-spacing);
  color: var(--color-page-accent);
}

.v-block-resources__item {
  // Spacing between rows/dividers comes purely from the container's own
  // 24px gap (see template), not from padding here — same rhythm as
  // Planning/Toggle/Tableau avec colonnes.
  text-decoration: none;
  color: inherit;
}

.v-block-resources__meta {
  @include type-label;
  font-size: 16px;
  font-weight: 500;
}

.v-block-resources__title {
  @include type-body-large-bold;
}

.v-block-resources__item:hover .v-block-resources__title {
  text-decoration: underline;
}

// Real SVG icons (public/img), recolored via CSS mask so they always match
// the block's own text color (currentColor) instead of the fixed indigo
// baked into the source files — needed since this block's color varies by
// instance (maroon here, but could be any brand color elsewhere).
.v-block-resources__icon {
  flex-shrink: 0;
  width: 40px;
  height: 40px;
  background-color: currentColor;
  mask-size: contain;
  mask-repeat: no-repeat;
  mask-position: center;
  -webkit-mask-size: contain;
  -webkit-mask-repeat: no-repeat;
  -webkit-mask-position: center;
}

.v-block-resources__icon--download {
  mask-image: url('/img/Iconstelechargement.svg');
  -webkit-mask-image: url('/img/Iconstelechargement.svg');
}

.v-block-resources__icon--link {
  mask-image: url('/img/Iconsliensvg.svg');
  -webkit-mask-image: url('/img/Iconsliensvg.svg');
}
</style>
