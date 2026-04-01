import { createFileRoute, Link, useRouter } from '@tanstack/react-router'
import { getTopics, getUserInterviews } from '~/lib/interview.functions'
import { authClient } from '~/lib/auth-client'
import { ThemeToggle } from '~/components/theme-toggle'

export const Route = createFileRoute('/_protected/dashboard')({
  loader: async () => {
    const [topics, interviews] = await Promise.all([
      getTopics(),
      getUserInterviews(),
    ])
    return { topics, interviews }
  },
  component: Dashboard,
})

function Dashboard() {
  const { user } = Route.useRouteContext()
  const { topics, interviews } = Route.useLoaderData()
  const router = useRouter()

  const handleSignOut = async () => {
    await authClient.signOut()
    router.navigate({ to: '/' })
  }

  return (
    <div className="min-h-screen bg-[var(--color-surface-alt)]">
      <header className="sticky top-0 z-20 border-b border-[var(--color-border)] glass">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link to="/" className="text-lg font-bold tracking-tight text-[var(--color-text-primary)]">
            Byte<span className="text-accent">Prep</span>
          </Link>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/10 text-xs font-bold text-accent">
                {user.name?.charAt(0)?.toUpperCase() || '?'}
              </div>
              <span className="text-sm font-medium text-[var(--color-text-secondary)]">{user.name}</span>
            </div>
            <button
              onClick={handleSignOut}
              className="rounded-lg px-3 py-1.5 text-xs font-medium text-[var(--color-text-muted)] transition-colors hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text-secondary)]"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-10">
        <div className="animate-fade-in">
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">
            Good {getGreeting()}, {user.name?.split(' ')[0]}
          </h1>
          <p className="mt-1 text-[var(--color-text-muted)]">Pick a topic to start a mock interview.</p>
        </div>

        <section className="mt-8">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 stagger-children">
            {topics.map((topic) => (
              <Link
                key={topic.id}
                to="/interview/new"
                search={{ topicId: topic.id }}
                className="group relative overflow-hidden rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 transition-all hover:border-accent/30 hover:shadow-lg hover:shadow-accent/5 hover:-translate-y-0.5"
              >
                <div className="font-semibold text-[var(--color-text-primary)] group-hover:text-accent transition-colors">
                  {topic.name}
                </div>
                <div className="mt-1.5 text-xs leading-relaxed text-[var(--color-text-muted)] line-clamp-2">
                  {topic.description}
                </div>
                <div className="absolute -right-3 -bottom-3 h-12 w-12 rounded-full bg-accent/5 transition-transform group-hover:scale-150" />
              </Link>
            ))}
          </div>
        </section>

        {interviews.length > 0 && (
          <section className="mt-14 animate-fade-in">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">Recent Interviews</h2>
              <span className="text-xs text-[var(--color-text-muted)]">{interviews.length} total</span>
            </div>
            <div className="mt-4 space-y-2">
              {interviews.map((interview) => (
                <Link
                  key={interview.id}
                  to={interview.status === 'completed' ? '/interview/$id/results' : '/interview/$id'}
                  params={{ id: interview.id }}
                  className="group flex items-center justify-between rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] px-5 py-4 transition-all hover:border-[var(--color-border-hover)] hover:shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <div className={`h-2 w-2 rounded-full ${interview.status === 'completed' ? 'bg-success' : 'bg-amber-400 animate-pulse-soft'}`} />
                    <div>
                      <span className="font-medium text-[var(--color-text-primary)]">{interview.topic.name}</span>
                      <span className="ml-2 rounded-full bg-[var(--color-surface-hover)] px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-[var(--color-text-muted)]">
                        {interview.difficulty}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    {interview.status === 'completed' ? (
                      <span className="font-mono text-sm font-semibold text-[var(--color-text-primary)]">
                        {interview.score}/{interview.totalQuestions}
                      </span>
                    ) : (
                      <span className="text-xs font-medium text-amber-500">In Progress</span>
                    )}
                    <span className="text-xs text-[var(--color-text-muted)]">
                      {new Date(interview.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                    <svg className="h-4 w-4 text-[var(--color-text-muted)] transition-colors group-hover:text-[var(--color-text-secondary)]" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                    </svg>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  )
}

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'morning'
  if (hour < 17) return 'afternoon'
  return 'evening'
}
