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

  return {
    status: 'success',
  }
})
