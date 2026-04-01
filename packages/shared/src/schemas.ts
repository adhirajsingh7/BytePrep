import { z } from 'zod'

export const questionSchema = z.object({
  text: z.string(),
  options: z.array(z.string()).length(4),
  correctAnswer: z.number().min(0).max(3),
})

export const questionsResponseSchema = z.object({
  questions: z.array(questionSchema),
})

export type Question = z.infer<typeof questionSchema>
export type QuestionsResponse = z.infer<typeof questionsResponseSchema>
