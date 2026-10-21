import * as zod from "@zod/zod";
import {addToMailchimpList} from "#server/utils/addToMailchimpList.ts";

// Messages d'erreur Zod par défaut en français.
zod.config(zod.locales.fr())

const newsletterSchema = zod.object({
    email: zod.string().trim().toLowerCase().pipe(zod.email("L'adresse e-mail n'est pas valide")),
})


export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const validatedBody = newsletterSchema.safeParse(body)

  if (validatedBody.error) {
    return {
      status: 'error',
      message: validatedBody.error.issues,
    }
  }

  try {
    await addToMailchimpList({
        email: validatedBody.data.email,
    })
  } catch (error) {
      console.error("Erreur lors de l'inscription à la newsletter :", error)
      throw createError({
          statusCode: 500,
          statusMessage: "Une erreur est survenue lors de l'inscription à la newsletter.",
      })
  }

  return {
    status: 'success',
  }
})
