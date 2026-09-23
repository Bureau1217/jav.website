export interface PageTheme {
  /** --color-page-accent override, e.g. 'var(--color-brand-06)'. */
  accent: string
  /** --color-page-on-accent override, e.g. '#ffffff'. Optional — omit to
   * keep the default mint. */
  onAccent?: string
  /** Same color as onAccent, as raw "r, g, b" for rgba() uses. */
  onAccentRgb?: string
}

// Hardcoded per-page overrides — not a CMS field. Most pages run the
// site-wide green theme (--color-page-accent/--color-page-on-accent default
// to brand-02/brand-01 in main.scss); specific pages run their own instead.
// Every themed block already reads those two variables instead of a
// literal color, and TheHeader/TheFooter's own "hero"/footer text stays
// hardcoded mint regardless — so adding a page here is the only change
// needed to retheme its blocks + footer background.
const PAGE_THEMES: Record<string, PageTheme> = {
  'formation-professionnelle': {
    accent: 'var(--color-brand-06)' // maroon — onAccent stays the default mint
  },
  'pratique-amateur': {
    accent: 'var(--color-brand-07)', // orange
    onAccent: 'var(--color-brand-08)', // yellow
    onAccentRgb: '255, 212, 0'
  }
}

export function pageThemeFor(pageId: string | null | undefined): PageTheme | null {
  return pageId ? (PAGE_THEMES[pageId] ?? null) : null
}

// Shared across app.vue (applies the CSS variables to the whole app, so
// they reach both the current page's blocks and the sibling TheFooter) and
// [...slug].vue (updates it whenever the loaded page changes).
export function usePageTheme() {
  return useState<PageTheme | null>('page-theme', () => null)
}
