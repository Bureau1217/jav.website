import { createHash } from 'node:crypto'

export interface MailchimpSubscribeOptions {
  email: string
  firstName?: string
  lastName?: string
  tags?: string[]
  /** 'subscribed' = ajout direct, 'pending' = double opt-in (mail de confirmation) */
  status?: 'subscribed' | 'pending'
}

/**
 * Adds (or updates) an email address in the Mailchimp audience.
 * Uses PUT on the member's MD5 hash, so calling it twice with the same
 * address is safe (no "already a list member" error).
 */
export async function addToMailchimpList(options: MailchimpSubscribeOptions) {
  const { apiKey, listId } = useRuntimeConfig().mailchimp

  // La clé se termine par le datacenter, ex. "...-us8".
  const dc = apiKey.split('-')[1]
  if (!apiKey || !listId || !dc) {
    throw new Error('Mailchimp is not configured (NUXT_MAILCHIMP_API_KEY / NUXT_MAILCHIMP_LIST_ID)')
  }

  const email = options.email.trim().toLowerCase()
  const subscriberHash = createHash('md5').update(email).digest('hex')

  return await $fetch(`https://${dc}.api.mailchimp.com/3.0/lists/${listId}/members/${subscriberHash}`, {
    method: 'PUT',
    headers: {
      Authorization: `Basic ${Buffer.from(`anystring:${apiKey}`).toString('base64')}`
    },
    timeout: 8000,
    retry: 0,
    body: {
      email_address: email,
      status_if_new: options.status ?? 'subscribed',
      merge_fields: {
        ...(options.firstName && { FNAME: options.firstName }),
        ...(options.lastName && { LNAME: options.lastName })
      },
      ...(options.tags && { tags: options.tags })
    }
  })
}
