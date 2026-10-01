import * as zod from "@zod/zod";
import type { InscriptionForm_deliveryMethod, InscriptionForm_registrationType } from "#shared/types/form.ts";

const inscriptionSchema = zod.object({
    registrationType: zod.literal<readonly InscriptionForm_registrationType[]>(['first', 'renewal']),
    deliveryMethod: zod.literal<readonly InscriptionForm_deliveryMethod[]>(['email', 'courrier']),
    firstname:  zod.string().min(1),
    lastname:   zod.string().min(1),
    age:        zod.number().min(1),
    email:      zod.string().trim().toLowerCase().pipe(zod.email()),
    phone:      zod.string().min(1),
})


export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const validatedBody = inscriptionSchema.safeParse(body)

  if (validatedBody.error) {
    return {
      status: 'error',
      message: validatedBody.error.issues,
    }
  }

  const data = validatedBody.data
  const registrationTypeLabel = data.registrationType === 'first' ? 'Première inscription' : 'Réinscription'
  const deliveryMethodLabel = data.deliveryMethod === 'email' ? 'Par email' : 'Par courrier'

  try {
    await sendMail({
        from: '"JAV Musique" <info@jav-musique.com>',
        to: 'info@jav-musique.com',
        replyTo: `${data.firstname} ${data.lastname} <${data.email}>`,
        subject: `Nouvelle demande d'inscription - ${data.firstname} ${data.lastname}`,
        text: `Nouvelle demande d'inscription reçue :

- Prénom : ${data.firstname}
- Nom : ${data.lastname}
- Âge : ${data.age}
- Email : ${data.email}
- Téléphone : ${data.phone}
- Type d'inscription : ${registrationTypeLabel}
- Mode d'envoi du dossier : ${deliveryMethodLabel}
`,
        html: `
        <h2>Nouvelle demande d'inscription</h2>
        <p>Une nouvelle demande d'inscription a été soumise sur le site :</p>
        <table style="border-collapse: collapse; width: 100%; max-width: 600px; text-align: left; font-family: sans-serif;">
          <tbody>
            <tr>
              <th style="padding: 8px; border-bottom: 1px solid #ddd; background: #f9f9f9; width: 40%;">Prénom</th>
              <td style="padding: 8px; border-bottom: 1px solid #ddd;">${data.firstname}</td>
            </tr>
            <tr>
              <th style="padding: 8px; border-bottom: 1px solid #ddd; background: #f9f9f9;">Nom</th>
              <td style="padding: 8px; border-bottom: 1px solid #ddd;">${data.lastname}</td>
            </tr>
            <tr>
              <th style="padding: 8px; border-bottom: 1px solid #ddd; background: #f9f9f9;">Âge</th>
              <td style="padding: 8px; border-bottom: 1px solid #ddd;">${data.age} ans</td>
            </tr>
            <tr>
              <th style="padding: 8px; border-bottom: 1px solid #ddd; background: #f9f9f9;">Email</th>
              <td style="padding: 8px; border-bottom: 1px solid #ddd;"><a href="mailto:${data.email}">${data.email}</a></td>
            </tr>
            <tr>
              <th style="padding: 8px; border-bottom: 1px solid #ddd; background: #f9f9f9;">Téléphone</th>
              <td style="padding: 8px; border-bottom: 1px solid #ddd;"><a href="tel:${data.phone}">${data.phone}</a></td>
            </tr>
            <tr>
              <th style="padding: 8px; border-bottom: 1px solid #ddd; background: #f9f9f9;">Type d'inscription</th>
              <td style="padding: 8px; border-bottom: 1px solid #ddd;">${registrationTypeLabel}</td>
            </tr>
            <tr>
              <th style="padding: 8px; border-bottom: 1px solid #ddd; background: #f9f9f9;">Mode d'envoi du dossier</th>
              <td style="padding: 8px; border-bottom: 1px solid #ddd;">${deliveryMethodLabel}</td>
            </tr>
          </tbody>
        </table>
      `,
    })
  } catch (error) {
      console.error("Erreur lors de l'envoi de l'email d'inscription :", error)
      throw createError({
          statusCode: 500,
          statusMessage: "Une erreur est survenue lors de l'envoi de l'email.",
      })
  }

  return {
    status: 'success',
  }
})
