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

// Site-wide default --color-page-accent (see main.scss) — duplicated here
// (not read from the CSS var) so it's available synchronously, with no DOM
// access, for ThePageTransition.vue below.
const DEFAULT_ACCENT = 'var(--color-brand-02)'
const DEFAULT_ON_ACCENT = 'var(--color-brand-01)'

// Same lookup as pageThemeFor, but keyed off a route path instead of a
// fetched page's Kirby id, and always returning both colors (falling back to
// the site-wide defaults above instead of null) — used by
// ThePageTransition.vue, which needs the destination's colors the instant a
// navigation starts (router.beforeEach), before that page's own data has
// been fetched, to color both the curtain and the logo it shows on top of
// it. Works because every PAGE_THEMES key today is also a top-level route
// path; a path this map doesn't recognize (including event_item pages,
// whose accent is computed from the live events list, not known
// synchronously) just falls back to the defaults — close enough for the
// curtain, which only has to roughly match before the real page content
// appears underneath it.
export function pageThemeForPath(path: string): Required<Pick<PageTheme, 'accent' | 'onAccent'>> {
  const id = path.replace(/^\/+|\/+$/g, '')
  const theme = PAGE_THEMES[id]
  return {
    accent: theme?.accent ?? DEFAULT_ACCENT,
    onAccent: theme?.onAccent ?? DEFAULT_ON_ACCENT
  }
}

// Shared across app.vue (applies the CSS variables to the whole app, so
// they reach both the current page's blocks and the sibling TheFooter) and
// [...slug].vue (updates it whenever the loaded page changes).
export function usePageTheme() {
  return useState<PageTheme | null>('page-theme', () => null)
}
