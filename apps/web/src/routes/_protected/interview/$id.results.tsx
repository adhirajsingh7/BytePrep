import { createFileRoute, Link } from '@tanstack/react-router'
import { getInterview } from '~/lib/interview.functions'

export const Route = createFileRoute('/_protected/interview/$id/results')({
  loader: async ({ params }) => {
    const interview = await getInterview({ data: { id: params.id } })
    return { interview }
  },
  component: Results,
})

function ScoreRing({ score, total }: { score: number; total: number }) {
  const radius = 54
  const circumference = 2 * Math.PI * radius
  const percentage = score / total
  const offset = circumference * (1 - percentage)

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg className="score-ring h-36 w-36" viewBox="0 0 120 120">
        <circle className="score-ring-bg" cx="60" cy="60" r={radius} />
        <circle className="score-ring-fill" cx="60" cy="60" r={radius} strokeDasharray={circumference} strokeDashoffset={offset} />
      </svg>
      <div className="absolute text-center animate-score">
        <div className="font-mono text-3xl font-bold text-[var(--color-text-primary)]">{score}</div>
        <div className="text-xs text-[var(--color-text-muted)]">out of {total}</div>
      </div>
    </div>
  )
}

function Results() {
  const { interview } = Route.useLoaderData()
  const score = interview.score ?? 0
  const percentage = Math.round((score / interview.totalQuestions) * 100)

  const getMessage = () => {
    if (percentage >= 90) return 'Excellent work!'
    if (percentage >= 70) return 'Great job!'
    if (percentage >= 50) return 'Good effort!'
    return 'Keep practicing!'
  }

  return (
    <div className="min-h-screen bg-[var(--color-surface-alt)]">
      <header className="border-b border-[var(--color-border)] bg-[var(--color-surface)]">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
          <h1 className="text-sm font-semibold text-[var(--color-text-primary)]">Results</h1>
          <Link
            to="/dashboard"
            className="rounded-lg px-3 py-1.5 text-xs font-medium text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text-secondary)]"
          >
            Dashboard
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-10">
        <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-10 text-center shadow-sm animate-fade-in">
          <ScoreRing score={score} total={interview.totalQuestions} />
          <div className="mt-4">
            <div className="text-lg font-semibold text-[var(--color-text-primary)]">{getMessage()}</div>
            <div className="mt-1 text-sm text-[var(--color-text-muted)]">
              {interview.topicName} · <span className="capitalize">{interview.difficulty}</span> · {percentage}%
            </div>
          </div>
        </div>

        <div className="mt-10 space-y-3 stagger-children">
          {interview.questions.map((question, idx) => {
            const isCorrect = question.userAnswer === question.correctAnswer
            return (
              <div
                key={question.id}
                className={`rounded-xl border p-5 ${
                  isCorrect ? 'border-emerald-500/20 bg-emerald-500/5' : 'border-red-500/20 bg-red-500/5'
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-xs font-bold text-white ${
                    isCorrect ? 'bg-emerald-500' : 'bg-red-500'
                  }`}>
                    {idx + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[var(--color-text-primary)]">{question.text}</p>
                    <div className="mt-3 space-y-1.5">
                      {(question.options as string[]).map((option, i) => {
                        const isUserAnswer = question.userAnswer === i
                        const isCorrectAnswer = question.correctAnswer === i
                        let className = 'rounded-lg px-3 py-2 text-sm '
                        if (isCorrectAnswer) {
                          className += 'bg-emerald-500/10 font-medium text-emerald-600 dark:text-emerald-400'
                        } else if (isUserAnswer && !isCorrect) {
                          className += 'bg-red-500/10 text-red-600 dark:text-red-400 line-through'
                        } else {
                          className += 'text-[var(--color-text-muted)]'
                        }
                        return (
                          <div key={i} className={className}>
                            <span className="mr-2 font-mono text-xs font-semibold opacity-50">{String.fromCharCode(65 + i)}</span>
                            {option}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-10 flex items-center justify-center gap-3 animate-fade-in">
          <Link
            to="/interview/new"
            className="rounded-xl bg-[var(--color-text-primary)] px-8 py-3 text-sm font-semibold text-[var(--color-surface)] shadow-lg transition-all hover:opacity-90 hover:shadow-xl active:scale-[0.98]"
          >
            Practice Again
          </Link>
          <Link
            to="/dashboard"
            className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-8 py-3 text-sm font-semibold text-[var(--color-text-secondary)] transition-all hover:border-[var(--color-border-hover)] hover:shadow-sm"
          >
            Dashboard
          </Link>
        </div>
      </main>
    </div>
  )
}
