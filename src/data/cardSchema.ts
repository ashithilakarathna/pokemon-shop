import { z } from 'zod'

/** Canonical runtime contract for a gallery card (see quality-agent). */
export const CardSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  imageUrl: z.string().url(),
  setName: z.string().min(1).optional(),
  rarity: z.string().min(1).optional(),
})

export type Card = z.infer<typeof CardSchema>

export function safeParseCard(data: unknown) {
  return CardSchema.safeParse(data)
}
