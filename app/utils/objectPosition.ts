import type { KqlFile } from '~~/shared/types/kql'

// The Panel's built-in focal-point picker (file details view — no
// blueprint field needed) stores its value on the file itself (see
// FILE_SELECT's "focus" in server/utils/kqlPageQuery.ts) as "x% y%", or ""
// when an editor never set one. Used as the `object-position` for any
// <img> that has `object-fit: cover`, so a cropped image keeps its actual
// subject in frame instead of always centering. Falls back to "center"
// (CSS's own default) when unset.
export function objectPosition(file: Pick<KqlFile, 'focus'> | null | undefined): string {
  return file?.focus || 'center'
}
