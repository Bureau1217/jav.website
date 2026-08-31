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
  photo: KqlFile | null
}

export interface KqlBlock {
  id: string
  type: string
  isHidden: boolean
  content: Record<string, any>
  teacherPages: KqlTeacher[]
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
