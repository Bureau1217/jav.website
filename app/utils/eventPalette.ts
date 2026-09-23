export interface EventPaletteEntry {
  /** Card background — reused as --color-page-accent (panel/header/footer
   * background) on the event's own detail page. */
  bg: string
  /** Card text/accent color — reused as --color-page-on-accent on the
   * event's own detail page. */
  accent: string
  /**
   * Which of `bg`/`accent` is dark enough to read as running text on the
   * page's plain cream background — the event page's own body text (see
   * PagesEventItem.vue) uses this one instead of always `accent`, since for
   * some pairs the light color is the one stored in `accent` (e.g. mint) or
   * `bg` is itself the light/pastel one (e.g. pink, light blue).
   */
  legibleOnCream: 'bg' | 'accent'
}

// Each card in the "Concerts & Événements" block (see ConcertsEvent.global.vue)
// cycles through one of these (background, accent) pairs — the exact 6
// combinations from the reference color board. Shared here — not
// duplicated — so an event's own detail page (see pages/EventItem.vue) can
// look up the exact same pair by index and match its card exactly.
export const EVENT_PALETTE: EventPaletteEntry[] = [
  { bg: 'var(--color-brand-02)', accent: 'var(--color-brand-05)', legibleOnCream: 'bg' }, // dark green / pink
  { bg: 'var(--color-brand-07)', accent: 'var(--color-brand-04)', legibleOnCream: 'bg' }, // orange / indigo
  { bg: 'var(--color-brand-05)', accent: 'var(--color-brand-02)', legibleOnCream: 'accent' }, // pink / dark green
  { bg: 'var(--color-brand-03)', accent: 'var(--color-brand-02)', legibleOnCream: 'accent' }, // light blue / dark green
  { bg: 'var(--color-brand-08)', accent: 'var(--color-brand-04)', legibleOnCream: 'accent' }, // yellow / indigo
  { bg: 'var(--color-brand-04)', accent: 'var(--color-brand-01)', legibleOnCream: 'bg' } // indigo / mint
]

export function eventPalette(index: number): EventPaletteEntry {
  return EVENT_PALETTE[index % EVENT_PALETTE.length]
}

// Same brand colors as main.scss's :root, as raw "r, g, b" — needed
// wherever a theme color has to feed a translucent rgba() (e.g. Form's
// field borders/placeholders via --color-page-on-accent-rgb).
const BRAND_RGB: Record<string, string> = {
  'var(--color-brand-00)': '249, 245, 234',
  'var(--color-brand-01)': '141, 255, 192',
  'var(--color-brand-02)': '0, 87, 69',
  'var(--color-brand-03)': '108, 172, 228',
  'var(--color-brand-04)': '41, 15, 161',
  'var(--color-brand-05)': '241, 183, 226',
  'var(--color-brand-06)': '140, 17, 38',
  'var(--color-brand-07)': '251, 141, 4',
  'var(--color-brand-08)': '255, 212, 0'
}

export function rgbForBrandVar(value: string): string | undefined {
  return BRAND_RGB[value]
}
