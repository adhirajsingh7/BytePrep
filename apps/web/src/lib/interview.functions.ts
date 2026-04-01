import { createServerFn } from '@tanstack/react-start'
import { getRequestHeaders } from '@tanstack/react-start/server'
import { auth } from './auth'
import { db } from '@mock-prep/db'
import { generateQuestions } from '@mock-prep/ai'

export const getTopics = createServerFn({ method: 'GET' }).handler(
  async () => {
    const topics = await db.topic.findMany({
      orderBy: { name: 'asc' },
    })
    return topics
  },
)

export const getUserInterviews = createServerFn({ method: 'GET' }).handler(
  async () => {
    const headers = getRequestHeaders()
    const session = await auth.api.getSession({ headers })
    if (!session) return []

    const interviews = await db.interview.findMany({
      where: { userId: session.user.id },
      include: { topic: true },
      orderBy: { createdAt: 'desc' },
    })
    return interviews
  },
)

export const createInterview = createServerFn({ method: 'POST' })
  .inputValidator(
    (data: { topicId: string; difficulty: 'easy' | 'medium' | 'hard' }) =>
      data,
  )
  .handler(async ({ data }) => {
    const headers = getRequestHeaders()
    const session = await auth.api.getSession({ headers })
    if (!session) throw new Error('Unauthorized')

    const topic = await db.topic.findUniqueOrThrow({
      where: { id: data.topicId },
    })

    const interview = await db.interview.create({
      data: {
        userId: session.user.id,
        topicId: data.topicId,
        difficulty: data.difficulty,
        totalQuestions: 10,
      },
    })

    const questions = await generateQuestions(topic.name, data.difficulty, 10)

    await db.question.createMany({
      data: questions.map((q, i) => ({
        interviewId: interview.id,
        text: q.text,
        options: q.options,
        correctAnswer: q.correctAnswer,
        order: i + 1,
      })),
    })

    return interview.id
  })

export const getInterview = createServerFn({ method: 'GET' })
  .inputValidator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    const headers = getRequestHeaders()
    const session = await auth.api.getSession({ headers })
    if (!session) throw new Error('Unauthorized')

    const interview = await db.interview.findUniqueOrThrow({
      where: { id: data.id, userId: session.user.id },
      include: {
        topic: true,
        questions: { orderBy: { order: 'asc' } },
      },
    })

    // Find the first unanswered question
    const currentQuestion = interview.questions.find(
      (q) => q.userAnswer === null,
    )
    const answeredCount = interview.questions.filter(
      (q) => q.userAnswer !== null,
    ).length

    // Strip correct answers from questions during active interview
    const safeQuestions =
      interview.status === 'in_progress'
        ? interview.questions.map((q) => ({
            id: q.id,
            text: q.text,
            options: q.options as string[],
            order: q.order,
            userAnswer: q.userAnswer,
          }))
        : interview.questions.map((q) => ({
            id: q.id,
            text: q.text,
            options: q.options as string[],
            order: q.order,
            userAnswer: q.userAnswer,
            correctAnswer: q.correctAnswer,
          }))

    return {
      id: interview.id,
      topicName: interview.topic.name,
      difficulty: interview.difficulty,
      totalQuestions: interview.totalQuestions,
      score: interview.score,
      status: interview.status,
      answeredCount,
      currentQuestionId: currentQuestion?.id ?? null,
      questions: safeQuestions,
    }
  })

export const submitAnswer = createServerFn({ method: 'POST' })
  .inputValidator(
    (data: { interviewId: string; questionId: string; answer: number }) => data,
  )
  .handler(async ({ data }) => {
    const headers = getRequestHeaders()
    const session = await auth.api.getSession({ headers })
    if (!session) throw new Error('Unauthorized')

    // Verify ownership
    const interview = await db.interview.findUniqueOrThrow({
      where: { id: data.interviewId, userId: session.user.id },
    })

    if (interview.status !== 'in_progress') {
      throw new Error('Interview already completed')
    }

    await db.question.update({
      where: { id: data.questionId, interviewId: data.interviewId },
      data: { userAnswer: data.answer },
    })

    // Check if all questions are answered
    const unanswered = await db.question.count({
      where: { interviewId: data.interviewId, userAnswer: null },
    })

    if (unanswered === 0) {
      // Calculate score
      const questions = await db.question.findMany({
        where: { interviewId: data.interviewId },
      })
      const score = questions.filter(
        (q) => q.userAnswer === q.correctAnswer,
      ).length

      await db.interview.update({
        where: { id: data.interviewId },
        data: {
          status: 'completed',
          score,
          completedAt: new Date(),
        },
      })

      return { completed: true, score }
    }

    return { completed: false, score: null }
  })
