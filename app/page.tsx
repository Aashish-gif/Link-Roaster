'use client'

import { useRef, useState } from 'react'
import { URLInputForm } from '@/components/URLInputForm'
import { RoastCard } from '@/components/RoastCard'
import { FeedList } from '@/components/FeedList'
import { generateMockRoast, mockRoasts } from '@/lib/mock-data'
import { Roast } from '@/lib/types'

export default function HomePage() {
  const [currentRoast, setCurrentRoast] = useState<Roast | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [displayedFeed, setDisplayedFeed] = useState(mockRoasts.slice(0, 6))
  const resultRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleRoastSubmit = async (url: string) => {
    setIsLoading(true)
    setError(null)
    setCurrentRoast(null)

    try {
      const roast = await generateMockRoast(url)
      setCurrentRoast(roast)

      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
      }, 100)
    } catch (err) {
      setError('Something went wrong. Try again with a different URL.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleRoastAnother = () => {
    setCurrentRoast(null)
    setError(null)
    inputRef.current?.focus()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleLoadMore = () => {
    setDisplayedFeed((prev) => [
      ...prev,
      ...mockRoasts
        .filter((r) => !prev.some((p) => p.id === r.id))
        .slice(0, 3),
    ])
  }

  const scrollToInput = () => {
    inputRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
    inputRef.current?.focus()
  }

  return (
    <main className="min-h-screen" style={{ backgroundColor: 'var(--bg-base)' }}>
      {/* Navbar */}
      <nav
        className="sticky top-0 z-50 h-14 border-b flex items-center px-6 md:px-10 backdrop-blur-sm"
        style={{
          backgroundColor: 'rgba(8, 8, 8, 0.9)',
          borderColor: 'var(--border)',
        }}
      >
        {/* Left: Logo */}
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

        {/* Center: Nav Links (hidden on mobile) */}
        <div className="hidden md:flex items-center gap-6 flex-1 justify-center">
          {['Feed', 'Top Roasts', 'About'].map((link) => (
            <a
              key={link}
              href="#"
              className="text-xs transition-colors"
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

        {/* Right: Counter & Button */}
        <div className="ml-auto flex items-center gap-3">
          <div
            className="px-3 py-1 rounded-full border text-[11px] font-mono flex items-center gap-2"
            style={{
              backgroundColor: 'var(--roast-dim)',
              borderColor: 'var(--roast-border)',
              color: 'var(--roast)',
            }}
          >
            <span
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: 'var(--roast)',
                animation: 'flicker 1.4s ease-in-out infinite',
              }}
            />
            🔥 {mockRoasts.length} roasted
          </div>
          <button
            onClick={scrollToInput}
            className="text-xs font-bold px-4 py-1.5 rounded-[var(--radius-sm)] transition-colors"
            style={{
              backgroundColor: 'var(--roast)',
              color: 'white',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#e03d00')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--roast)')}
          >
            Submit URL
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section
        className="px-6 md:px-10 pt-20 pb-16 max-w-[760px] mx-auto text-left"
      >
        {/* Ticker Badge */}
        <div
          className="inline-flex items-center gap-2 border rounded-full px-4 py-1.5 mb-6"
          style={{
            borderColor: 'var(--border-hover)',
          }}
        >
          <span
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: 'var(--roast)',
              animation: 'flicker 1.4s ease-in-out infinite',
            }}
          />
          <span
            className="text-[11px] font-mono"
            style={{ color: 'var(--text-secondary)' }}
          >
            AI roasting engine • online
          </span>
        </div>

        {/* Headline */}
        <h1 className="mb-4" style={{ color: 'var(--text-primary)' }}>
          <span className="block text-[52px] md:text-[72px] font-extrabold tracking-[-3px] leading-none">
            Every link
          </span>
          <span
            className="block text-[52px] md:text-[72px] font-extrabold tracking-[-3px] leading-none"
            style={{ color: 'var(--roast)' }}
          >
            deserves a roast.
          </span>
        </h1>

        {/* Subheading */}
        <p
          className="max-w-[480px] text-[15px] leading-relaxed mb-10"
          style={{ color: 'var(--text-secondary)' }}
        >
          Paste any URL — startup, article, portfolio, or cringe — and our AI delivers a savage summary, brutal roast, and a one-line verdict. Built for the internet, by the internet.
        </p>

        {/* Input Zone */}
        <div className="mb-8">
          <URLInputForm
            inputRef={inputRef}
            onSubmit={handleRoastSubmit}
            isLoading={isLoading}
            error={error}
          />
        </div>

        {/* Proof Strip */}
        <div className="flex items-center gap-6 flex-wrap">
          {[
            { value: mockRoasts.length, label: 'links roasted' },
            { value: '~5s', label: 'to burn' },
            { value: '0', label: 'links spared' },
          ].map((stat, i) => (
            <span
              key={i}
              className="text-[12px] font-mono flex items-center gap-2"
              style={{ color: 'var(--text-muted)' }}
            >
              {i > 0 && <span className="w-px h-3" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }} />}
              <span style={{ color: 'var(--roast)', fontWeight: '700' }}>
                {stat.value}
              </span>{' '}
              {stat.label}
            </span>
          ))}
        </div>
      </section>

      {/* Result Card */}
      {currentRoast && (
        <section
          ref={resultRef}
          className="px-6 md:px-10 py-8 max-w-[760px] mx-auto"
          style={{ animation: 'slideUp 0.5s cubic-bezier(0.16,1,0.3,1) forwards' }}
        >
          <RoastCard
            {...currentRoast}
            showRoastAnother
            onRoastAnother={handleRoastAnother}
            onCopy={() => {
              // Toast handled by component
            }}
          />
        </section>
      )}

      {/* Feed Section */}
      <section
        className="border-t px-6 md:px-10 py-12 max-w-[760px] mx-auto"
        style={{
          backgroundColor: 'var(--bg-surface)',
          borderColor: 'var(--border)',
        }}
      >
        <FeedList
          roasts={displayedFeed}
          hasMore={displayedFeed.length < mockRoasts.length}
          onLoadMore={handleLoadMore}
        />
      </section>

      {/* Footer */}
      <footer
        className="border-t px-6 md:px-10 py-8"
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
