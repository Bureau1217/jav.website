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
