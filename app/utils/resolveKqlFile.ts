import type { KqlFile } from '~~/shared/types/kql'

/**
 * A block's own raw "files" field value is always one of Kirby's own
 * `file://<uuid>` references, never a bare filename — but a block NESTED
 * inside a Section/Array-layout's own JSON-encoded content (see
 * parseKqlBlocks.ts) never goes through this file's server-side KQL
 * resolution (itemImages/resourceFiles/partnerLogos in kqlPageQuery.ts), so
 * the front-end has to resolve that reference itself against the page's
 * own images/files collection — by uuid, since that's what's actually
 * stored (a bare-filename match is kept as a defensive fallback only).
 */
export function resolveKqlFile(
  refs: string[] | undefined,
  files: KqlFile[] | undefined
): KqlFile | null {
  if (!refs?.length || !files?.length) {
    return null
  }

  // Both sides already carry the "file://" prefix as-is (that's what
  // Kirby's own file.uuid() returns via KQL, see kqlPageQuery.ts) — no
  // stripping needed, just compare them directly.
  const ref = refs[0]

  return files.find(file => file.uuid === ref || file.filename === ref) ?? null
}
