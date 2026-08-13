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
