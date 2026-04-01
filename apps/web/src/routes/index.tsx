import { createFileRoute, Link } from '@tanstack/react-router'
import { ThemeToggle } from '~/components/theme-toggle'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[var(--color-surface-alt)]">
      {/* Grid background */}
      <div className="absolute inset-0 bg-grid opacity-40" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[var(--color-surface-alt)]/80 to-[var(--color-surface-alt)]" />

      {/* Nav */}
      <nav className="relative z-10 mx-auto flex max-w-5xl items-center justify-between px-6 py-6">
        <span className="text-lg font-bold tracking-tight text-[var(--color-text-primary)]">
          Byte<span className="text-accent">Prep</span>
        </span>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link
            to="/login"
            className="rounded-full bg-[var(--color-text-primary)] px-5 py-2 text-sm font-medium text-[var(--color-surface)] transition-all hover:opacity-90 hover:shadow-lg"
          >
            Sign In
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <main className="relative z-10 mx-auto max-w-3xl px-6 pt-24 pb-20 text-center">
        <div className="animate-fade-in">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-1.5 text-xs font-medium text-[var(--color-text-secondary)] shadow-sm">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent animate-pulse-soft" />
            AI-powered interview practice
          </div>
        </div>

        <h1 className="animate-fade-in-up text-5xl font-extrabold leading-tight tracking-tight text-[var(--color-text-primary)] sm:text-6xl lg:text-7xl">
          Ace your next
          <br />
          <span className="text-gradient">tech interview</span>
        </h1>

        <p className="mx-auto mt-6 max-w-lg text-lg leading-relaxed text-[var(--color-text-muted)] animate-fade-in-up" style={{ animationDelay: '100ms' }}>
          Practice with AI-generated MCQ questions across 12+ topics.
          Get instant feedback and track your progress.
        </p>

        <div className="mt-10 flex items-center justify-center gap-4 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
          <Link
            to="/login"
            className="rounded-full bg-[var(--color-text-primary)] px-8 py-3.5 text-sm font-semibold text-[var(--color-surface)] shadow-lg transition-all hover:opacity-90 hover:shadow-xl hover:-translate-y-0.5"
          >
            Start Practicing
          </Link>
          <a
            href="#features"
            className="rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-8 py-3.5 text-sm font-semibold text-[var(--color-text-secondary)] transition-all hover:border-[var(--color-border-hover)] hover:shadow-md"
          >
            Learn More
          </a>
        </div>
      </main>

      {/* Features */}
      <section id="features" className="relative z-10 mx-auto max-w-4xl px-6 py-20">
        <div className="grid gap-6 sm:grid-cols-3 stagger-children">
          <FeatureCard
            icon={
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 0 1 0 3.75H5.625a1.875 1.875 0 0 1 0-3.75Z" />
              </svg>
            }
            title="12+ Topics"
            description="JavaScript, React, Python, System Design, SQL, Docker, and more"
          />
          <FeatureCard
            icon={
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z" />
              </svg>
            }
            title="AI-Generated"
            description="Fresh questions every time, tailored to your chosen difficulty"
          />
          <FeatureCard
            icon={
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
              </svg>
            }
            title="Instant Results"
            description="Detailed score breakdown with correct answers after each session"
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-[var(--color-border)] py-8 text-center text-xs text-[var(--color-text-muted)]">
        BytePrep — Practice smarter, interview better.
      </footer>
    </div>
  )
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className="group rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 transition-all hover:border-[var(--color-border-hover)] hover:shadow-lg hover:-translate-y-1">
      <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-surface-hover)] text-[var(--color-text-secondary)] transition-colors group-hover:bg-accent/10 group-hover:text-accent">
        {icon}
      </div>
      <h3 className="font-semibold text-[var(--color-text-primary)]">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-muted)]">
        {description}
      </p>
    </div>
  )
}
