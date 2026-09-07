export interface KqlFile {
  filename: string
  url: string
  alt: string | null
  width: number
  height: number
  extension: string
}

export interface KqlTeacher {
  id: string
  title: string
  fonction: string | null
  /** Personal/professional website — shown as an "En savoir plus"-style
   * link on the Teachers block card when set. */
  website: string | null
  /** Full bio (writer field) — the Teachers block shows it truncated as a
   * short quote; the individual teacher page (not yet built) would show it
   * in full. */
  bio: string | null
  photo: KqlFile | null
}

export interface KqlBlock {
  id: string
  type: string
  isHidden: boolean
  content: Record<string, any>
  teacherPages: KqlTeacher[]
  /** One entry per row of the block's "items" structure (Gallery, List...),
   * same order as content.items, with that row's "image" field resolved to
   * a real file — see server/utils/kqlPageQuery.ts. */
  itemImages: Array<{ image: KqlFile | null }>
}

export interface KqlEvent {
  id: string
  title: string
  date: string | null
  time: string | null
  type: string | null
  location: string | null
  ticketLink: string | null
  cover: KqlFile | null
  description: string | null
}

/**
 * One entry per page the homepage "formations" block highlights (Formation
 * Professionnelle / Pratique Amateur). Card tag + title + image come from
 * that page's own header fields, so editing the page's header updates the
 * card automatically — see server/api/formations.get.ts.
 */
export interface KqlFormationCard {
  id: string
  uri: string
  headerTitle: string | null
  headerSubtitle: string | null
  previewImage: KqlFile | null
}

export interface KqlTestimonial {
  role: string[]
  text: string
  photo: KqlFile | null
}

export interface KqlInfoBand {
  text: string
  image: KqlFile | null
  link: string | null
}

/**
 * One entry per page reference — powers the header burger nav (auto-
 * generated from every top-level "default" page, see /api/nav) and the
 * footer nav (editor-curated picker on "Informations globales", see
 * /api/site-infos). `uri` is Kirby's page.uri, which is already '' for the
 * home page, so `/${uri}` resolves correctly everywhere.
 */
export interface KqlNavItem {
  id: string
  title: string
  uri: string
}

export interface KqlAddress {
  name: string | null
  street: string | null
  number: string | null
  postalCode: string | null
  city: string | null
}

/**
 * Everything editors manage from "Informations globales" (site.yml ->
 * site_infos template): postal address, contact details, the editor-picked
 * list of pages to show in the footer nav, and the scrolling banner items.
 */
export interface KqlSiteInfo {
  address: KqlAddress | null
  phone: string | null
  fax: string | null
  email: string | null
  footerPages: KqlNavItem[]
  bands: KqlInfoBand[]
}

export interface KqlPage {
  id: string
  title: string
  template: string
  headerTitle: string | null
  headerSubtitle: string | null
  headerImage: KqlFile | null
  previewImage: KqlFile | null
  images: KqlFile[]
  files: KqlFile[]
  blocks: KqlBlock[]
}
