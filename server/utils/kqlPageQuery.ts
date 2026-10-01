export const FILE_SELECT = {
  filename: true,
  url: true,
  alt: 'file.alt',
  width: true,
  height: true,
  extension: true,
  modified: 'file.modified("Y-m-d")',
  // Needed to resolve files nested inside a Section/Array-layout block's
  // own JSON-encoded content (see resolveKqlFile.ts) — those blocks never
  // go through this file's own itemImages/resourceFiles/partnerLogos
  // KQL resolution, so the front-end has to match a raw "file://<uuid>"
  // reference against the page's files itself, by uuid, not by filename.
  uuid: 'file.uuid',
  // The Panel's built-in focal-point picker (file details view, no
  // blueprint field needed) — returns e.g. "76% 30%", or "" when never
  // set. Applied as CSS object-position wherever an image uses
  // object-fit: cover, so a cropped image keeps its subject in frame
  // instead of always centering — see app/utils/objectPosition.ts.
  focus: 'file.focus'
}

const TEACHER_SELECT = {
  id: true,
  title: true,
  fonction: 'page.teachers_fonction',
  website: 'page.teachers_website',
  teachers_email: 'page.teachers_email',
  teachers_website: 'page.teachers_website',
  bio: 'page.teachers_bio',
  photo: {
    query: 'page.teachers_photo.toFile',
    select: { url: true, alt: 'file.alt', focus: 'file.focus' }
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
  // Page content's last-saved date — see KqlPage.pageModified.
  pageModified: 'page.modified("Y-m-d")',
  // "event_item" template fields (site/blueprints/pages/event_item.yml) —
  // harmless no-op (empty/null) on every other template, same pattern as
  // itemImages/resourceFiles below. See PagesEventItem.vue.
  eventDate: 'page.event_date.toDate("Y-m-d")',
  eventTime: 'page.event_time',
  eventType: 'page.event_type',
  eventLocation: 'page.event_location',
  eventTicketLink: 'page.event_ticket_link',
  eventDescription: 'page.event_description',
  eventCover: {
    query: 'page.event_cover.toFile',
    select: FILE_SELECT
  },
  eventGallery: {
    query: 'page.event_gallery.toFiles',
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
      },
      // Same idea as itemImages above, but for the Resources block's
      // "resource_file" field — resolved from anywhere on the site (not
      // just this page's own files) so a PDF's real modified date always
      // comes through, wherever it's stored. Harmless no-op on blocks
      // without a "resource_items" field.
      resourceFiles: {
        query: 'block.content.resource_items.toStructure',
        select: {
          file: {
            query: 'structureItem.resource_file.toFile',
            select: FILE_SELECT
          }
        }
      },
      // Same idea again for the Partners block's nested "cards.partners"
      // structure — each partner's "logo" resolved from anywhere on the
      // site, not just this page's own images. Harmless no-op on blocks
      // without a "cards" field.
      // Qualiopi block's own "logo" and "pdf" fields — each a single file
      // picked from anywhere on the site (not just this page's own
      // files/images), same idea as itemImages/resourceFiles/partnerLogos
      // above, but resolved directly (no nested "items"/"resource_items"/
      // "cards" structure to iterate). Harmless no-op on every other block.
      qualiopiLogo: {
        query: 'block.content.logo.toFile',
        select: FILE_SELECT
      },
      qualiopiPdf: {
        query: 'block.content.pdf.toFile',
        select: FILE_SELECT
      },
      // Inclusif block's own "image" field — same idea as qualiopiLogo/
      // qualiopiPdf above, a single file resolved from anywhere on the
      // site. Harmless no-op on every other block.
      inclusifImage: {
        query: 'block.content.image.toFile',
        select: FILE_SELECT
      },
      partnerLogos: {
        query: 'block.content.cards.toStructure',
        select: {
          partners: {
            query: 'structureItem.partners.toStructure',
            select: {
              logo: {
                query: 'structureItem.logo.toFile',
                select: FILE_SELECT
              }
            }
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
