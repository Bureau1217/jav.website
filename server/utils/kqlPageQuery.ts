export const FILE_SELECT = {
  filename: true,
  url: true,
  alt: 'file.alt',
  width: true,
  height: true,
  extension: true
}

const TEACHER_SELECT = {
  id: true,
  title: true,
  fonction: 'page.teachers_fonction',
  website: 'page.teachers_website',
  bio: 'page.teachers_bio',
  photo: {
    query: 'page.teachers_photo.toFile',
    select: { url: true, alt: 'file.alt' }
  }
}

/**
 * Select shape shared by every page template. Block content is
 * fetched raw (uniform across all block types); the only per-type
 * exception is `teacherPages`, which resolves the "teachers" block's
 * page references into usable data. Resolving it for every block is
 * harmless: `toPages` on an absent/empty field just returns [].
 */
export const pageSelect = {
  id: true,
  title: true,
  template: 'page.intendedTemplate',
  headerTitle: 'page.header_title',
  headerSubtitle: 'page.header_subtitle',
  headerImage: {
    query: 'page.header_image.toFile',
    select: FILE_SELECT
  },
  previewImage: {
    query: 'page.page_image_preview.toFile',
    select: FILE_SELECT
  },
  images: {
    query: 'page.images',
    select: FILE_SELECT
  },
  files: {
    query: 'page.files',
    select: FILE_SELECT
  },
  blocks: {
    query: 'page.content.content.toBlocks',
    select: {
      id: true,
      type: true,
      isHidden: true,
      content: true,
      teacherPages: {
        query: 'block.content.teacher_pages.toPages',
        select: TEACHER_SELECT
      },
      // Resolves the "image" field of each row in a block's "items"
      // structure (Gallery, List...) into a real file object, in the same
      // order as content.items. Needed because those images are picked
      // from anywhere on the site (stored as a file:// UUID), not just
      // files uploaded to the current page — page.images (used by
      // resolveKqlFile.ts) only covers the latter. Harmless no-op on
      // blocks without an "items" field.
      itemImages: {
        query: 'block.content.items.toStructure',
        select: {
          image: {
            query: 'structureItem.image.toFile',
            select: FILE_SELECT
          }
        }
      }
    }
  }
}

/**
 * `id` is expected to already be validated by sanitizePageId.
 * An empty id targets the site's home page.
 */
export function buildPageQuery(id: string): string {
  return id === '' ? 'site.homePage' : `page("${id}")`
}
