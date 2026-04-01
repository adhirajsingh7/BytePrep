import type { ReactNode } from 'react'
import {
  Outlet,
  createRootRoute,
  HeadContent,
  Scripts,
} from '@tanstack/react-router'

const siteTitle = 'BytePrep — AI-Powered Tech Interview Practice'
const siteDescription =
  'Practice software engineering interviews with AI-generated MCQ questions. 12+ topics including JavaScript, React, Python, System Design, and more. Get instant scores and detailed feedback.'
const siteUrl = 'https://byteprep.dev'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: siteTitle },
      { name: 'description', content: siteDescription },

      // SEO
      { name: 'robots', content: 'index, follow' },
      { name: 'author', content: 'BytePrep' },
      {
        name: 'keywords',
        content:
          'tech interview prep, software engineering quiz, coding interview practice, MCQ questions, JavaScript quiz, React interview, Python quiz, system design, AI interview questions',
      },

      // Open Graph
      { property: 'og:type', content: 'website' },
      { property: 'og:title', content: siteTitle },
      { property: 'og:description', content: siteDescription },
      { property: 'og:url', content: siteUrl },
      { property: 'og:site_name', content: 'BytePrep' },
      { property: 'og:locale', content: 'en_US' },

      // Twitter Card
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: siteTitle },
      { name: 'twitter:description', content: siteDescription },

      // Theme color
      { name: 'theme-color', content: '#6366f1' },
      { name: 'color-scheme', content: 'light dark' },

      // Mobile
      { name: 'apple-mobile-web-app-capable', content: 'yes' },
      { name: 'apple-mobile-web-app-title', content: 'BytePrep' },
      { name: 'application-name', content: 'BytePrep' },
    ],
    links: [
      { rel: 'canonical', href: siteUrl },
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      {
        rel: 'preconnect',
        href: 'https://fonts.gstatic.com',
        crossOrigin: 'anonymous',
      },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap',
      },
      {
        rel: 'stylesheet',
        href: '/src/styles/app.css',
      },
    ],
    scripts: [
      {
        children: `(function(){try{var t=localStorage.getItem('theme');if(t==='dark'||(t==null&&window.matchMedia('(prefers-color-scheme:dark)').matches)){document.documentElement.classList.add('dark')}}catch(e){}})()`,
      },
    ],
  }),
  component: RootComponent,
})

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  )
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body className="min-h-screen antialiased">
        {children}
        <Scripts />
      </body>
    </html>
  )
}
