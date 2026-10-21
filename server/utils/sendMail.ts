import { Resend } from 'resend'
import type { Attachment } from 'resend'

export interface SendMailOptions {
  to: string | string[]
  subject: string
  text?: string
  html?: string
  from: string
  replyTo?: string | string[]
  cc?: string | string[]
  bcc?: string | string[]
  attachments?: Attachment[]
}

/**
 * Envoie un mail via l'API Resend (clé : NUXT_RESEND_API_KEY).
 * L'adresse `from` doit appartenir à un domaine vérifié dans Resend.
 *
 * @param options Paramètres du mail (destinataire, sujet, corps texte/html, etc.)
 * @returns L'identifiant Resend du mail envoyé
 */
export async function sendMail(options: SendMailOptions) {
  const { resend: resendConfig } = useRuntimeConfig()

  if (!resendConfig.apiKey) {
    throw new Error('Clé API Resend manquante (NUXT_RESEND_API_KEY)')
  }

  const resend = new Resend(resendConfig.apiKey)

  // Le SDK Resend ne lève pas d'exception : l'erreur est renvoyée dans `error`.
  const { data, error } = await resend.emails.send({
    from: options.from,
    to: options.to,
    subject: options.subject,
    text: options.text ?? '',
    html: options.html,
    replyTo: options.replyTo,
    cc: options.cc,
    bcc: options.bcc,
    attachments: options.attachments,
  })

  if (error) {
    throw new Error(`Resend : ${error.name} - ${error.message}`)
  }

  return data
}
