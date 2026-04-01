# Mock Interview App — Design Spec

## Context

Build a personal mock interview website for practicing software engineering interviews using MCQ-based questions. Questions are AI-generated per topic and difficulty. Users authenticate via OAuth and can track their interview history.

## Tech Stack

- **Framework:** TanStack Start (RC) + TanStack Router
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4 + shadcn/ui
- **Database:** PostgreSQL + Prisma ORM
- **Auth:** Better Auth (Google + GitHub OAuth)
- **AI:** OpenAI SDK (GPT-4o-mini) for question generation
- **Monorepo:** Turborepo + pnpm

## Monorepo Structure

```
mock-prep/
├── apps/
│   └── web/                    # TanStack Start app
│       ├── app/
│       │   ├── routes/         # File-based routes
│       │   ├── components/     # UI components
│       │   ├── lib/            # App-specific utilities
│       │   └── styles/
│       └── app.config.ts
├── packages/
│   ├── db/                     # Prisma schema + client + migrations
│   ├── ai/                     # OpenAI question generation logic
│   └── shared/                 # Shared types, constants, validation (zod)
├── turbo.json
├── package.json
└── tsconfig.json
```

## Data Model

### User
| Field     | Type   | Notes          |
|-----------|--------|----------------|
| id        | string | cuid           |
| name      | string |                |
| email     | string | unique         |
| image     | string | nullable       |
| createdAt | date   |                |

### Account (managed by Better Auth)
| Field             | Type   | Notes              |
|-------------------|--------|--------------------|
| id                | string |                    |
| userId            | string | FK → User          |
| provider          | string | google \| github   |
| providerAccountId | string |                    |
| tokens            | ...    | OAuth tokens       |

### Topic
| Field       | Type   | Notes              |
|-------------|--------|--------------------|
| id          | string | cuid               |
| name        | string | e.g. "JavaScript"  |
| slug        | string | unique             |
| description | string |                    |
| icon        | string | nullable, optional |

### Interview
| Field          | Type   | Notes                          |
|----------------|--------|--------------------------------|
| id             | string | cuid                           |
| userId         | string | FK → User                      |
| topicId        | string | FK → Topic                     |
| difficulty     | enum   | easy \| medium \| hard         |
| totalQuestions  | int    | default 10                     |
| score          | int    | nullable, filled on completion |
| status         | enum   | in_progress \| completed       |
| createdAt      | date   |                                |
| completedAt    | date   | nullable                       |

### Question
| Field        | Type   | Notes                          |
|--------------|--------|--------------------------------|
| id           | string | cuid                           |
| interviewId  | string | FK → Interview                 |
| text         | string | The question                   |
| options      | JSON   | Array of 4 choice strings      |
| correctAnswer| int    | Index 0-3                      |
| userAnswer   | int    | nullable, index 0-3            |
| order        | int    | Position in interview          |
| createdAt    | date   |                                |

## Routes

| Route                      | Purpose                                    |
|----------------------------|--------------------------------------------|
| `/`                        | Landing page — hero + CTA                  |
| `/login`                   | OAuth login (Google / GitHub)              |
| `/dashboard`               | Pick topic, see past interviews            |
| `/interview/new`           | Select topic + difficulty, start interview |
| `/interview/$id`           | Active interview — one question at a time  |
| `/interview/$id/results`   | Score + per-question breakdown             |

## User Flow

```
Landing → Login (OAuth) → Dashboard
                             │
                     Pick topic + difficulty
                             │
                    POST creates Interview
                    + OpenAI generates questions
                             │
                   Question 1 of 10 (MCQ)
                    ├── Select answer → Next
                    ├── Select answer → Next
                    └── ... Question 10 → Submit
                             │
                      Score calculated
                      Results page shown
                             │
                      Back to Dashboard
```

### UX Decisions
- One question at a time (not all at once)
- No timer for v1
- Cannot go back to previous questions
- Progress bar shows position (e.g., "4 / 10")
- Results: each question with user's pick vs correct answer (green/red)

## Server Functions

```
// Auth
getSession()              → Current user session
signIn(provider)          → Initiate OAuth flow
signOut()                 → End session

// Dashboard
getTopics()               → List all topics
getUserInterviews()       → User's past interviews with scores

// Interview lifecycle
createInterview(topicId, difficulty)
  → Creates Interview row
  → Calls OpenAI to generate 10 MCQs
  → Stores questions in DB
  → Returns interview ID

getInterview(id)
  → Interview + questions (correct answers excluded during active interview)

submitAnswer(interviewId, questionId, answer)
  → Saves userAnswer
  → Returns next question or "complete" signal

completeInterview(id)
  → Calculates score
  → Updates interview status + score
  → Returns results with correct answers
```

## AI Integration (packages/ai)

- Uses OpenAI GPT-4o-mini with `response_format: { type: "json_object" }`
- Prompt includes topic, difficulty, and question count
- Response validated with Zod schema before storing
- Correct answers never sent to client during active interview

## Key Dependencies

| Package                  | Location        | Purpose                |
|--------------------------|-----------------|------------------------|
| `@tanstack/start`        | apps/web        | Framework              |
| `@tanstack/react-router` | apps/web        | Routing                |
| `tailwindcss`            | apps/web        | Styling                |
| `shadcn/ui`              | apps/web        | UI components          |
| `better-auth`            | apps/web        | OAuth                  |
| `prisma` + `@prisma/client` | packages/db | ORM + migrations       |
| `openai`                 | packages/ai     | Question generation    |
| `zod`                    | packages/shared | Validation             |
| `turbo`                  | root            | Monorepo orchestration |

## Environment Variables

```
DATABASE_URL=postgresql://...
OPENAI_API_KEY=sk-...
BETTER_AUTH_SECRET=...
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GITHUB_CLIENT_ID=...
GITHUB_CLIENT_SECRET=...
```

## Verification Plan

1. `pnpm install` succeeds, `turbo build` compiles all packages
2. `prisma migrate dev` runs clean, seed script populates topics
3. OAuth login works with Google and GitHub
4. Creating an interview calls OpenAI and stores 10 questions
5. Answering all questions and submitting calculates correct score
6. Results page shows correct/incorrect per question
7. Dashboard shows past interviews with scores
