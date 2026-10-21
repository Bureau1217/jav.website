<template>
  <div class="v-block-cartels-wrap u-flex u-flex--column u-gap-xl u-gutter-x">
    <UiSectionHeader v-if="block.content.title" :title="block.content.title" />
    <div class="v-block-cartels">
      <UiCard
        v-for="(card, index) in block.content.cards"
        :key="index"
        background="var(--color-brand-05)"
        color="var(--color-page-accent)"
        class="v-block-cartels__card u-flex u-flex--column"
      >
        <div v-if="card.format || tagList(card).length" class="v-block-cartels__row u-flex u-flex--align-start u-flex--justify-between u-gap-m">
          <span v-if="card.format" class="v-block-cartels__format">{{ card.format }}</span>
          <div v-if="tagList(card).length" class="v-block-cartels__tags u-flex u-gap-xs u-flex--wrap">
            <UiTag v-for="tag in tagList(card)" :key="tag">{{ tag }}</UiTag>
          </div>
        </div>
        <h3 v-if="card.title" ref="titleRefs" class="v-block-cartels__title" v-html="card.title" />
        <div v-if="card.description" class="v-block-cartels__description" v-html="card.description" />
      </UiCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { KqlBlock } from '~~/shared/types/kql'

const props = defineProps<{
  block: KqlBlock
}>()

// Kirby's "tags" field stores its raw value as a single comma-separated
// string (not an array) — split it into pills, same as the Section block.
function tagList(card: { tags?: string }): string[] {
  const raw = card.tags
  if (!raw) return []
  return String(raw).split(',').map((tag) => tag.trim()).filter(Boolean)
}

// CSS hyphens:auto looked right at first (a long single word like
// "Autofinancement" needs a visible "-" break to fit the card) but it also
// hyphenates words in a multi-word title that would've fit whole on the
// next line anyway ("Prise en charge to-/tale..." instead of wrapping
// "totale" whole) — the browser's greedy line-fill hyphenates whenever a
// break point helps fill the current line, not only when a word truly can't
// fit on any line. There's no CSS knob for "only when unavoidable", so this
// measures each word itself against the title's rendered width and only
// splits (with a real "-") the rare word that's wider than the whole card on
// its own — every other word is left untouched, wrapping normally at spaces.
const titleRefs = ref<HTMLElement[]>([])
let measureCanvasCtx: CanvasRenderingContext2D | null = null

function measure(text: string, font: string): number {
  if (!measureCanvasCtx) {
    measureCanvasCtx = document.createElement('canvas').getContext('2d')
  }
  if (!measureCanvasCtx) return 0
  measureCanvasCtx.font = font
  return measureCanvasCtx.measureText(text).width
}

// Breaks a single overflowing word into "fits-on-a-line-" chunks joined by
// <br>, each chunk ending in a real hyphen (except the last) — a binary
// shrink per chunk against the available width, font-measured via canvas.
function splitOverflowingWord(word: string, font: string, maxWidth: number): string {
  const chunks: string[] = []
  let remaining = word
  while (remaining.length > 1) {
    let fitLen = remaining.length
    while (fitLen > 1 && measure(`${remaining.slice(0, fitLen)}-`, font) > maxWidth) {
      fitLen--
    }
    if (fitLen >= remaining.length) {
      chunks.push(remaining)
      remaining = ''
      break
    }
    chunks.push(`${remaining.slice(0, fitLen)}-`)
    remaining = remaining.slice(fitLen)
  }
  if (remaining) chunks.push(remaining)
  return chunks.join('<br>')
}

function hyphenateOverflowingWords(el: HTMLElement) {
  const original = el.dataset.originalHtml ?? el.innerHTML
  el.dataset.originalHtml = original
  el.innerHTML = original

  const containerWidth = el.clientWidth
  if (!containerWidth) return
  const cs = getComputedStyle(el)
  const font = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`

  function processNode(node: ChildNode) {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent ?? ''
      if (!text.trim()) return
      let changed = false
      const html = text.split(/(\s+)/).map((part) => {
        if (!part.trim()) return part
        if (measure(part, font) <= containerWidth) return part
        changed = true
        return splitOverflowingWord(part, font, containerWidth)
      }).join('')
      if (changed) {
        const span = document.createElement('span')
        span.innerHTML = html
        node.replaceWith(...Array.from(span.childNodes))
      }
    } else {
      Array.from(node.childNodes).forEach(processNode)
    }
  }
  Array.from(el.childNodes).forEach(processNode)
}

function reprocessAllTitles() {
  titleRefs.value.forEach((el) => {
    delete el.dataset.originalHtml
    hyphenateOverflowingWords(el)
  })
}

// ResizeObserver fires on ANY border-box size change, including height —
// and splitting an overflowing word inserts a <br>, which changes this
// element's height. Without the width check below, that height change
// re-triggers the same observer on the next frame, which re-measures,
// re-splits to the exact same result, changes the height again... a
// self-feeding (if self-correcting) loop that burns CPU on every card
// title whenever the layout shifts. Re-running the split only when the
// observed width actually changed breaks that cycle at the source.
const lastWidths = new WeakMap<HTMLElement, number>()
let resizeObserver: ResizeObserver | null = null
onMounted(async () => {
  await nextTick()
  reprocessAllTitles()
  titleRefs.value.forEach((el) => lastWidths.set(el, el.clientWidth))
  resizeObserver = new ResizeObserver((entries) => {
    let changed = false
    for (const entry of entries) {
      const el = entry.target as HTMLElement
      const width = el.clientWidth
      if (lastWidths.get(el) !== width) {
        lastWidths.set(el, width)
        changed = true
      }
    }
    if (changed) reprocessAllTitles()
  })
  titleRefs.value.forEach((el) => resizeObserver!.observe(el))

  // The very first pass above can run before the custom "GT Maru" font has
  // finished loading — canvas measureText() silently falls back to the same
  // fallback font the browser is painting with at that moment, so the split
  // itself looks consistent at first. But once GT Maru finishes loading
  // shortly after, the browser reflows the already-split text in the real
  // (wider) font — a chunk sized for the fallback font can then overflow its
  // line on its own, and CSS overflow-wrap:break-word silently chops it
  // again with no visible "-", stacking on top of our one intentional split
  // (e.g. "Adminis-/tration" becoming "Administr-/at-/i-/on"). Re-running
  // once document.fonts confirms every font is actually loaded clears that
  // up — this is a no-op if fonts were already loaded before mount.
  if (document.fonts?.ready) {
    document.fonts.ready.then(() => reprocessAllTitles())
  }
})

onBeforeUnmount(() => {
  resizeObserver?.disconnect()
})

watch(() => props.block.content.cards, async () => {
  await nextTick()
  reprocessAllTitles()
})
</script>

<style lang="scss" scoped>
.v-block-cartels-wrap {
  padding-block: var(--block-spacing);
  color: var(--color-page-accent);
}

.v-block-cartels {
  display: grid;
  // auto-fit (not auto-fill) so a row with fewer cards than the column cap
  // still stretches to fill the full width — a plain `repeat(4, 1fr)` left
  // an empty 4th track (and matching dead space) whenever there were only
  // 2 or 3 cards. The minmax lower bound is set to whichever is bigger,
  // 280px or 1/N of the row, so auto-fit can never pack in more than N
  // columns even on a very wide screen, while still collapsing any empty
  // trailing tracks so real cards grow to fill the row.
  // The lower bound accounts for the gap explicitly (100% minus the gaps a
  // full row would have, divided by the column count) — a plain percentage
  // like 25% looks right but, once gaps are subtracted from the actual
  // available space, is just barely too wide for N columns to fit, so
  // auto-fit silently drops to N-1 well before the cap is reached.
  grid-template-columns: repeat(auto-fit, minmax(max(280px, calc((100% - 3 * var(--spacing-xl)) / 4)), 1fr));
  gap: var(--spacing-xl);

  @media (max-width: 1400px) {
    grid-template-columns: repeat(auto-fit, minmax(max(260px, calc((100% - 2 * var(--spacing-xl)) / 3)), 1fr));
  }

  @media (max-width: 1100px) {
    grid-template-columns: repeat(auto-fit, minmax(max(240px, calc((100% - var(--spacing-xl)) / 2)), 1fr));
  }

  @media (max-width: $breakpoint-mobile) {
    grid-template-columns: 1fr;
  }
}

// Filled pink by default; hovering swaps it to the bordered-cream look
// instead of alternating by card index. `!important` is needed because
// UiCard sets --ui-card-bg via an inline style (from its `background`
// prop), which otherwise always outranks a plain stylesheet rule.
.v-block-cartels__card {
  padding: var(--spacing-xl);
  min-height: 560px; // taller/more elongated, per updated design
  // A flex column's own default min-width:auto lets its content's intrinsic
  // width (here, the title) push the card wider than its grid cell instead
  // of wrapping — same root cause as every other min-width fix this session.
  min-width: 0;
  border: 2px solid transparent;
  transition: background-color 0.2s ease, border-color 0.2s ease;

  &:hover {
    --ui-card-bg: var(--color-brand-00) !important;
    border-color: var(--color-page-accent);
  }
}

.v-block-cartels__format {
  @include type-label;
}

.v-block-cartels__title {
  margin-top: var(--spacing-l);
  // hyphens:auto looks right for a single long word on its own line (see
  // Default.vue's header title), but on a multi-word title like this one
  // the browser's greedy line-fill hyphenates words that would've fit fine
  // on the next line anyway ("Prise en charge to-/tale..." instead of just
  // wrapping "totale" whole) — not what was wanted here. hyphens:manual (the
  // default — no effect without an explicit soft hyphen in the content)
  // keeps wrapping at spaces only; overflow-wrap:break-word is still the
  // fallback for the rare single word wider than the card on its own.
  hyphens: manual;
  overflow-wrap: break-word;
}

.v-block-cartels__description {
  @include type-body-large;
  margin-top: auto;
  padding-top: var(--spacing-xl);

  :deep(p) {
    margin: 0 0 var(--spacing-m);
  }

  :deep(p:last-child) {
    margin-bottom: 0;
  }

  :deep(strong) {
    font-weight: 800;
  }

  :deep(em) {
    font-style: italic;
  }

  // Global reset (typo.scss) strips every list's own marker/indent — restore
  // both here, same treatment as Text.global.vue, so the writer field's
  // bullet/numbered lists (and their nested, Tab-indented sub-lists)
  // actually render as such.
  :deep(ul),
  :deep(ol) {
    margin: 0 0 var(--spacing-m);
    padding-left: var(--spacing-xl);
  }

  :deep(ul) {
    list-style: disc;
  }

  :deep(ol) {
    list-style: decimal;
  }

  :deep(li) {
    margin-bottom: var(--spacing-xs);

    ul,
    ol {
      margin-top: var(--spacing-xs);
      margin-bottom: 0;
    }
  }

  :deep(li:last-child) {
    margin-bottom: 0;
  }
}
</style>
