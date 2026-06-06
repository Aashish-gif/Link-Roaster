'use client'

import { RoastCard } from '@/components/RoastCard'
import { mockRoasts } from '@/lib/mock-data'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { notFound } from 'next/navigation'

export default function RoastPage() {
  const params = useParams()
  const id = params.id as string

  const roast = mockRoasts.find((r) => r.id === id)

  if (!roast) {
    return (
      <main
        className="min-h-screen flex flex-col items-center justify-center px-6"
        style={{ backgroundColor: 'var(--bg-base)' }}
      >
        <div
          className="text-[48px] mb-4"
          style={{ color: 'var(--text-ghost)', opacity: 0.5 }}
        >
          💀
        </div>
        <h1
          className="text-[18px] font-bold mb-2"
          style={{ color: 'var(--text-primary)' }}
        >
          Roast not found
        </h1>
        <p
          className="text-[13px] mb-6"
          style={{ color: 'var(--text-muted)' }}
        >
          This link may have escaped the flames.
        </p>
        <Link
          href="/"
          className="text-[13px] transition-colors"
          style={{ color: 'var(--roast)' }}
        >
          ← Back to feed
        </Link>
      </main>
    )
  }

  return (
    <main
      className="min-h-screen"
      style={{ backgroundColor: 'var(--bg-base)' }}
    >
      {/* Navbar */}
      <nav
        className="sticky top-0 z-50 h-14 border-b flex items-center px-6 md:px-10 backdrop-blur-sm"
        style={{
          backgroundColor: 'rgba(8, 8, 8, 0.9)',
          borderColor: 'var(--border)',
        }}
      >
        <div className="flex items-center gap-2.5">
          <div
            className="w-7 h-7 rounded-[4px] flex items-center justify-center text-sm font-bold"
            style={{ backgroundColor: 'var(--roast)', color: 'white' }}
          >
            🔥
          </div>
          <span
            className="font-bold text-sm tracking-tight"
            style={{ color: 'var(--text-primary)' }}
          >
            Link Roaster
          </span>
        </div>

        <div className="ml-auto">
          <Link
            href="/"
            className="text-sm transition-colors"
            style={{
              color: 'var(--text-muted)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'var(--text-secondary)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'var(--text-muted)'
            }}
          >
            ← Back to feed
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <div
        className="px-6 md:px-10 py-12 max-w-[760px] mx-auto"
      >
        {/* Breadcrumb */}
        <div
          className="flex items-center gap-2 mb-6 text-[12px] font-mono"
          style={{ color: 'var(--text-muted)' }}
        >
          <span>Link Roaster</span>
          <span style={{ color: 'var(--text-ghost)' }}>/</span>
          <span
            style={{
              color: 'var(--text-muted)',
              maxWidth: '300px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {roast.url}
          </span>
        </div>

        {/* Roast Card */}
        <RoastCard
          id={roast.id}
          url={roast.url}
          favicon={roast.favicon}
          summary={roast.summary}
          roast={roast.roast}
          verdict={roast.verdict}
          createdAt={roast.createdAt}
          compact={false}
        />
      </div>

      {/* Footer */}
      <footer
        className="border-t px-6 md:px-10 py-8 mt-16"
        style={{
          borderColor: 'var(--border)',
        }}
      >
        <div className="max-w-[760px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <span
            className="text-[12px] font-mono"
            style={{ color: 'var(--text-muted)' }}
          >
            Built with 🔥 and zero mercy
          </span>
          <span
            className="text-[10px] font-mono opacity-30"
            style={{ color: 'var(--roast)' }}
          >
            ( ( ) ) ( )
          </span>
          <div className="flex gap-4">
            {['GitHub', 'About', 'API'].map((link) => (
              <a
                key={link}
                href="#"
                className="text-[12px] transition-colors"
                style={{
                  color: 'var(--text-muted)',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
              >
                {link}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </main>
  )
}
