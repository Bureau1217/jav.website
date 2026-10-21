// Strips HTML tags from a rich-text field (Kirby's Writer/description
// fields come through as HTML, e.g. "<p>...</p>") and truncates the plain
// text to a fixed character budget, appending a single "…" when cut short.
// Used to keep card-style previews (event cards, "Autres évènements") from
// overflowing when the editor writes a long description. Never cuts a word
// in half — trims back to the last full word within the budget instead.
export function truncateText(html: string | null | undefined, maxLength = 90): string {
  if (!html) return ''
  const text = html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
  if (text.length <= maxLength) return text
  const slice = text.slice(0, maxLength)
  const lastSpace = slice.lastIndexOf(' ')
  const wholeWords = lastSpace > 0 ? slice.slice(0, lastSpace) : slice
  return `${wholeWords.trimEnd()}…`
}
