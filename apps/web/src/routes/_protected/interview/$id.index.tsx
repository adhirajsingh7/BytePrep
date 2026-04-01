import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { getInterview, submitAnswer } from '~/lib/interview.functions'

export const Route = createFileRoute('/_protected/interview/$id/')({
  loader: async ({ params }) => {
    const interview = await getInterview({ data: { id: params.id } })
    return { interview }
  },
  component: ActiveInterview,
})

function ActiveInterview() {
  const { interview } = Route.useLoaderData()
  const { id } = Route.useParams()
  const navigate = useNavigate()

  const [currentIndex, setCurrentIndex] = useState(interview.answeredCount)
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [submitting, setSubmitting] = useState(false)

  if (interview.status === 'completed') {
    navigate({ to: '/interview/$id/results', params: { id } })
    return null
  }

  const question = interview.questions[currentIndex]
  if (!question) return null

  const handleSubmit = async () => {
    if (selectedOption === null) return
    setSubmitting(true)

    const result = await submitAnswer({
      data: { interviewId: id, questionId: question.id, answer: selectedOption },
    })

    if (result.completed) {
      window.location.href = `/interview/${id}/results`
      return
    } else {
      setCurrentIndex((i) => i + 1)
      setSelectedOption(null)
      setSubmitting(false)
    }
  }

  const progress = (currentIndex / interview.totalQuestions) * 100

  return (
    <div className="min-h-screen bg-[var(--color-surface)]">
      <header className="border-b border-[var(--color-border)]">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-sm font-semibold text-[var(--color-text-primary)]">{interview.topicName}</h1>
            <span className="text-xs capitalize text-[var(--color-text-muted)]">{interview.difficulty}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-medium text-[var(--color-text-muted)]">{currentIndex + 1}</span>
            <span className="text-xs text-[var(--color-text-muted)]">/</span>
            <span className="font-mono text-xs text-[var(--color-text-muted)]">{interview.totalQuestions}</span>
          </div>
        </div>
        <div className="h-0.5 bg-[var(--color-border)]">
          <div className="h-0.5 bg-accent transition-all duration-500 ease-out" style={{ width: `${progress}%` }} />
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-6 py-12">
        <div className="animate-fade-in" key={currentIndex}>
          <span className="text-xs font-semibold uppercase tracking-wider text-accent">Question {currentIndex + 1}</span>
          <h2 className="mt-3 text-xl font-semibold leading-relaxed text-[var(--color-text-primary)]">{question.text}</h2>

          <div className="mt-8 space-y-3">
            {(question.options as string[]).map((option, i) => (
              <button
                key={i}
                onClick={() => setSelectedOption(i)}
                disabled={submitting}
                className={`group flex w-full items-start gap-4 rounded-xl border px-5 py-4 text-left transition-all active:scale-[0.99] ${
                  selectedOption === i
                    ? 'border-accent bg-accent/5 shadow-sm shadow-accent/10'
                    : 'border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[var(--color-border-hover)] hover:bg-[var(--color-surface-hover)]'
                } disabled:opacity-60`}
              >
                <span className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-xs font-bold transition-all ${
                  selectedOption === i
                    ? 'bg-accent text-white'
                    : 'bg-[var(--color-surface-hover)] text-[var(--color-text-muted)] group-hover:bg-[var(--color-border)]'
                }`}>
                  {String.fromCharCode(65 + i)}
                </span>
                <span className={`text-sm leading-relaxed ${
                  selectedOption === i ? 'font-medium text-[var(--color-text-primary)]' : 'text-[var(--color-text-secondary)]'
                }`}>
                  {option}
                </span>
              </button>
            ))}
          </div>

          <div className="mt-10 flex justify-end">
            <button
              onClick={handleSubmit}
              disabled={selectedOption === null || submitting}
              className="rounded-xl bg-[var(--color-text-primary)] px-8 py-3 text-sm font-semibold text-[var(--color-surface)] shadow-lg transition-all hover:opacity-90 hover:shadow-xl disabled:opacity-30 disabled:shadow-none disabled:cursor-not-allowed active:scale-[0.98]"
            >
              {submitting ? (
                <span className="inline-flex items-center gap-2">
                  <svg className="h-3.5 w-3.5 animate-spin-slow" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Submitting
                </span>
              ) : currentIndex === interview.totalQuestions - 1 ? 'Finish Interview' : 'Next Question'}
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}
