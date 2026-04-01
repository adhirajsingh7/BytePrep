import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const topics = [
  { name: 'JavaScript', slug: 'javascript', description: 'Core JavaScript concepts, ES6+, async patterns, and the event loop' },
  { name: 'TypeScript', slug: 'typescript', description: 'Type system, generics, utility types, and advanced TypeScript patterns' },
  { name: 'React', slug: 'react', description: 'Components, hooks, state management, and React ecosystem' },
  { name: 'Node.js', slug: 'nodejs', description: 'Server-side JavaScript, streams, modules, and the Node.js runtime' },
  { name: 'Python', slug: 'python', description: 'Python fundamentals, data structures, and Pythonic patterns' },
  { name: 'SQL', slug: 'sql', description: 'Database queries, joins, indexing, and query optimization' },
  { name: 'System Design', slug: 'system-design', description: 'Distributed systems, scalability, caching, and architecture patterns' },
  { name: 'CSS', slug: 'css', description: 'Layout, flexbox, grid, responsive design, and CSS architecture' },
  { name: 'HTML', slug: 'html', description: 'Semantic HTML, accessibility, forms, and web APIs' },
  { name: 'Docker', slug: 'docker', description: 'Containerization, Dockerfiles, compose, and container orchestration' },
  { name: 'Git', slug: 'git', description: 'Version control, branching strategies, and Git internals' },
  { name: 'REST APIs', slug: 'rest-apis', description: 'API design, HTTP methods, status codes, and best practices' },
]

async function main() {
  console.log('Seeding topics...')

  for (const topic of topics) {
    await prisma.topic.upsert({
      where: { slug: topic.slug },
      update: topic,
      create: topic,
    })
  }

  console.log(`Seeded ${topics.length} topics.`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
