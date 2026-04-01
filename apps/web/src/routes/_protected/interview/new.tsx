import { createFileRoute, useNavigate, Link } from '@tanstack/react-router'
import { useState } from 'react'
import { getTopics, createInterview } from '~/lib/interview.functions'

export const Route = createFileRoute('/_protected/interview/new')({
  validateSearch: (search: Record<string, unknown>) => ({
    topicId: (search.topicId as string) || '',
  }),
  loader: async () => {
    const topics = await getTopics()
    return { topics }
  },
  component: NewInterview,
})

function NewInterview() {
  const { topicId } = Route.useSearch()
  const { topics } = Route.useLoaderData()
  const navigate = useNavigate()

  const [selectedTopic, setSelectedTopic] = useState(topicId)
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const selectedTopicData = topics.find((t) => t.id === selectedTopic)

  const handleStart = async () => {
    if (!selectedTopic) return
    setLoading(true)
    setError(null)
    try {
      const interviewId = await createInterview({ data: { topicId: selectedTopic, difficulty } })
      navigate({ to: '/interview/$id', params: { id: interviewId } })
    } catch (e) {
      console.error('Failed to create interview:', e)
      setError(e instanceof Error ? e.message : 'Failed to create interview')
      setLoading(false)
    }
  }

  const difficultyConfig = {
    easy: { label: 'Easy', desc: 'Fundamentals & basics', color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20' },
    medium: { label: 'Medium', desc: 'Intermediate concepts', color: 'text-amber-500 bg-amber-500/10 border-amber-500/20' },
    hard: { label: 'Hard', desc: 'Advanced & architectural', color: 'text-red-500 bg-red-500/10 border-red-500/20' },
  }

  return (
    <div className="min-h-screen bg-[var(--color-surface-alt)]">
      <header className="sticky top-0 z-20 border-b border-[var(--color-border)] glass">
        <div className="mx-auto flex max-w-3xl items-center gap-4 px-6 py-4">
          <Link
            to="/dashboard"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text-secondary)]"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
            </svg>
          </Link>
          <h1 className="text-sm font-semibold text-[var(--color-text-primary)]">New Interview</h1>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-10 animate-fade-in">
        <section>
          <label className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">Topic</label>
          <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4 stagger-children">
            {topics.map((topic) => (
              <button
                key={topic.id}
                onClick={() => setSelectedTopic(topic.id)}
                className={`rounded-xl border px-3.5 py-2.5 text-left text-sm font-medium transition-all active:scale-[0.97] ${
                  selectedTopic === topic.id
                    ? 'border-accent bg-accent text-white shadow-lg shadow-accent/20'
                    : 'border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-secondary)] hover:border-[var(--color-border-hover)] hover:shadow-sm'
                }`}
              >
                {topic.name}
              </button>
            ))}
          </div>
          {selectedTopicData && (
            <p className="mt-3 text-xs text-[var(--color-text-muted)] animate-fade-in">{selectedTopicData.description}</p>
          )}
        </section>

        <section className="mt-10">
          <label className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">Difficulty</label>
          <div className="mt-3 grid grid-cols-3 gap-3">
            {(['easy', 'medium', 'hard'] as const).map((d) => {
              const config = difficultyConfig[d]
              return (
                <button
                  key={d}
                  onClick={() => setDifficulty(d)}
                  className={`rounded-xl border px-4 py-3.5 text-left transition-all active:scale-[0.97] ${
                    difficulty === d
                      ? `${config.color} shadow-sm`
                      : 'border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[var(--color-border-hover)]'
                  }`}
                >
                  <div className={`text-sm font-semibold ${difficulty === d ? '' : 'text-[var(--color-text-primary)]'}`}>{config.label}</div>
                  <div className={`mt-0.5 text-xs ${difficulty === d ? 'opacity-70' : 'text-[var(--color-text-muted)]'}`}>{config.desc}</div>
                </button>
              )
            })}
          </div>
        </section>

        <div className="mt-12">
          <button
            onClick={handleStart}
            disabled={!selectedTopic || loading}
            className="w-full rounded-xl bg-[var(--color-text-primary)] py-4 text-sm font-semibold text-[var(--color-surface)] shadow-lg transition-all hover:opacity-90 hover:shadow-xl disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none active:scale-[0.99]"
          >
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <svg className="h-4 w-4 animate-spin-slow" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Generating questions...
              </span>
            ) : (
              'Start Interview — 10 Questions'
            )}
          </button>
          {error && <p className="mt-3 text-center text-sm text-red-500 animate-fade-in">{error}</p>}
        </div>
      </main>
    </div>
  )
}
