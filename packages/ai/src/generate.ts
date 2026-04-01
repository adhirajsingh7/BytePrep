import OpenAI from 'openai'
import { questionsResponseSchema, type Question } from '@mock-prep/shared'

const groq = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: 'https://api.groq.com/openai/v1',
})

export async function generateQuestions(
  topic: string,
  difficulty: string,
  count: number,
): Promise<Question[]> {
  const response = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    response_format: { type: 'json_object' },
    messages: [
      {
        role: 'system',
        content: `You are a software engineering interview question generator. Generate multiple choice questions in JSON format. Each question must have exactly 4 options and one correct answer.

Return JSON in this exact format:
{
  "questions": [
    {
      "text": "The question text",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": 0
    }
  ]
}

The correctAnswer field is the 0-based index of the correct option.`,
      },
      {
        role: 'user',
        content: `Generate ${count} multiple choice questions about ${topic} at ${difficulty} difficulty level for a software engineering interview.

Requirements:
- Questions should test real understanding, not trivia
- All 4 options should be plausible
- Vary question types: conceptual, code output, best practices, debugging
- ${difficulty === 'easy' ? 'Focus on fundamentals and common patterns' : difficulty === 'medium' ? 'Include intermediate concepts and edge cases' : 'Include advanced topics, performance, and architectural decisions'}`,
      },
    ],
    temperature: 0.8,
  })

  const content = response.choices[0]?.message?.content
  if (!content) {
    throw new Error('No response from Groq')
  }

  const parsed = JSON.parse(content)
  const validated = questionsResponseSchema.parse(parsed)

  return validated.questions.slice(0, count)
}
