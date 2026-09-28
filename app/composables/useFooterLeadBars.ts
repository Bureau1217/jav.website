// Whether the footer should show two extra "signature" bars right at its
// very top — the same treatment as Qualiopi.global.vue's own bars — used
// only when the current page's last visible block is a Qualiopi block, so
// the footer visually continues that block's bars instead of the two
// abutting with no transition. Shared state (not a local computed):
// TheFooter lives outside the page's own component tree (sibling of <main>
// in app.vue, same reason as usePageTheme), so [...slug].vue updates this
// centrally whenever the loaded page changes.
export function useFooterLeadBars() {
  return useState<boolean>('footer-lead-bars', () => false)
}
