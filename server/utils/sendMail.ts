import nodemailer from 'nodemailer'
import type { SendMailOptions as NodemailerOptions } from 'nodemailer'

export interface SmtpConfig {
  host?: string
  port?: number
  secure?: boolean
  auth?: {
    user: string
    pass: string
  }
  from?: string
}

export interface SendMailOptions {
  to: string | string[]
  subject: string
  text?: string
  html?: string
  from: string
  replyTo?: string
  cc?: string | string[]
  bcc?: string | string[]
  attachments?: NodemailerOptions['attachments']
}

export function createMailTransporter() {
  let runtimeSmtp: Partial<SmtpConfig> = {}

  try {
    const runtimeConfig = useRuntimeConfig()
    if (runtimeConfig?.smtp) {
      runtimeSmtp = runtimeConfig.smtp as Partial<SmtpConfig>
    }
  } catch {
    // Si appelé hors contexte Nuxt / Nitro
  }

  const host = runtimeSmtp.host
  const port        = Number(runtimeSmtp.port || process.env.SMTP_PORT || 465)
  const secure      = runtimeSmtp.secure
  const user          = runtimeSmtp.auth?.user
  const pass          = runtimeSmtp.auth?.pass

  return nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user,
      pass,
    },
  })
}

/**
 * @param options Paramètres du mail (destinataire, sujet, corps texte/html, etc.)
 * @returns Le résultat de l'envoi Nodemailer
 */
export async function sendMail(options: SendMailOptions) {
  const transporter = createMailTransporter()

  return await transporter.sendMail({
    from: options.from,
    to: options.to,
    subject: options.subject,
    text: options.text,
    html: options.html,
    replyTo: options.replyTo,
    cc: options.cc,
    bcc: options.bcc,
    attachments: options.attachments,
  })
}
