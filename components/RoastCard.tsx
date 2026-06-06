'use client'

import { RoastCardProps } from '@/lib/types'
import Link from 'next/link'
import { useState } from 'react'
import { Toast } from './Toast'
import { ExternalLink, Copy, ChevronRight } from 'lucide-react'

interface RoastCardPropsExtended extends RoastCardProps {
  showRoastAnother?: boolean
  onRoastAnother?: () => void
  onCopy?: () => void
}

export function RoastCard({
  id,
  url,
  favicon,
  summary,
  roast,
  verdict,
  createdAt,
  compact = false,
  onRoastClick,
  showRoastAnother = false,
  onRoastAnother,
  onCopy,
}: RoastCardPropsExtended) {
  const [showToast, setShowToast] = useState(false)

  const truncatedRoast = roast.slice(0, 150) + '...'
  const timeAgo = formatTimeAgo(createdAt)
  const domain = new URL(url).hostname.replace('www.', '')

  const handleCopy = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const text = `"${roast}"\n\nVerdict: ${verdict}\n\nFrom Link Roaster: ${window.location.origin}/roast/${id}`

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).catch(() => {
        fallbackCopy(text)
      })
    } else {
      fallbackCopy(text)
    }

    setShowToast(true)
    onCopy?.()
    setTimeout(() => setShowToast(false), 2000)
  }

  const fallbackCopy = (text: string) => {
    const textarea = document.createElement('textarea')
    textarea.value = text
    textarea.style.position = 'fixed'
    textarea.style.opacity = '0'
    document.body.appendChild(textarea)
    textarea.select()
    try {
      document.execCommand('copy')
    } catch (err) {
      // Silently fail if copy fails
    }
    document.body.removeChild(textarea)
  }

  const handleClick = () => {
    if (onRoastClick) {
      onRoastClick(id)
    }
  }

  if (compact) {
    return (
      <>
        <Link
          href={`/roast/${id}`}
          onClick={handleClick}
          className="group block border transition-all duration-150 rounded-[var(--radius)] p-5 cursor-pointer overflow-hidden relative"
          style={{
            backgroundColor: 'var(--bg-surface)',
            borderColor: 'var(--border)',
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget
            el.style.borderColor = 'var(--border-hover)'
            el.style.backgroundColor = 'var(--bg-elevated)'
            el.querySelector('[data-accent]')?.style.setProperty('opacity', '1')
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget
            el.style.borderColor = 'var(--border)'
            el.style.backgroundColor = 'var(--bg-surface)'
            el.querySelector('[data-accent]')?.style.setProperty('opacity', '0')
          }}
        >
          {/* Left Accent */}
          <div
            data-accent
            className="absolute left-0 top-0 bottom-0 w-[3px] transition-opacity duration-150"
            style={{
              backgroundColor: 'var(--roast)',
              opacity: 0,
            }}
          />

          <div className="pl-2">
            {/* Top Row */}
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-2">
                {favicon && (
                  <img
                    src={favicon}
                    alt="favicon"
                    className="w-3.5 h-3.5 rounded"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                    }}
                  />
                )}
                <span
                  className="text-[11px] font-mono truncate"
                  style={{ color: 'var(--text-muted)' }}
                >
                  {domain}
                </span>
              </div>
              <span
                className="text-[10px] font-mono"
                style={{ color: 'var(--text-ghost)' }}
              >
                {timeAgo}
              </span>
            </div>

            {/* Roast Snippet */}
            <p
              className="text-[13px] leading-[1.55] line-clamp-2 mb-3"
              style={{ color: '#999' }}
            >
              {truncatedRoast}
            </p>

            {/* Bottom Row */}
            <div className="flex items-center justify-between">
              <p
                className="text-[12px] italic font-medium truncate max-w-[72%]"
                style={{ color: 'var(--roast)' }}
              >
                {verdict}
              </p>
              <span
                className="text-[11px] font-mono transition-colors"
                style={{
                  color: 'var(--text-muted)',
                }}
              >
                Read <ChevronRight size={10} className="inline" />
              </span>
            </div>
          </div>
        </Link>
        {showToast && <Toast message="Roast copied to clipboard!" />}
      </>
    )
  }

  return (
    <>
      <div
        className="border rounded-[var(--radius)] overflow-hidden"
        style={{
          backgroundColor: 'var(--bg-surface)',
          borderColor: 'var(--border)',
          animation: 'slideUp 0.5s cubic-bezier(0.16,1,0.3,1) forwards',
        }}
        role="article"
      >
        {/* Header Strip */}
        <div
          className="px-5 py-3 flex items-center justify-between border-b"
          style={{
            backgroundColor: 'var(--bg-elevated)',
            borderColor: 'var(--border)',
          }}
        >
          <div className="flex items-center gap-2.5">
            {favicon && (
              <img
                src={favicon}
                alt="favicon"
                className="w-4 h-4 rounded"
                onError={(e) => {
                  e.currentTarget.style.display = 'none'
                }}
              />
            )}
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono text-[11px] transition-colors hover:opacity-70"
              style={{
                color: 'var(--text-secondary)',
                maxWidth: '400px',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {domain}
            </a>
            <ExternalLink
              size={11}
              style={{ color: 'var(--text-muted)', cursor: 'pointer' }}
              onClick={(e) => {
                e.preventDefault()
                window.open(url, '_blank')
              }}
            />
          </div>

          <div
            className="px-2.5 py-0.5 rounded-full border text-[9px] font-bold tracking-widest uppercase"
            style={{
              backgroundColor: 'var(--roast-dim)',
              borderColor: 'var(--roast-border)',
              color: 'var(--roast)',
            }}
          >
            Roasted
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-6 flex flex-col gap-6">
          {/* Summary */}
          <section>
            <div className="flex items-center gap-2 mb-2">
              <span
                className="text-[9px] font-bold tracking-[0.15em] uppercase"
                style={{ color: 'var(--text-muted)' }}
              >
                Summary
              </span>
              <div
                className="flex-1 h-px"
                style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}
              />
            </div>
            <p
              className="text-[14px] leading-[1.7]"
              style={{ color: 'var(--text-secondary)' }}
            >
              {summary}
            </p>
          </section>

          {/* Roast */}
          <section className="relative">
            <div
              className="absolute left-0 top-0 bottom-0 w-[3px] rounded-full"
              style={{ backgroundColor: 'var(--roast)' }}
            />
            <div className="pl-5">
              <div className="flex items-center gap-2 mb-3">
                <span
                  className="text-[9px] font-bold tracking-[0.15em] uppercase"
                  style={{ color: 'var(--roast)' }}
                >
                  The Roast
                </span>
                <div
                  className="flex-1 h-px"
                  style={{ backgroundColor: 'rgba(255, 69, 0, 0.15)' }}
                />
              </div>
              <p
                className="text-[15px] leading-[1.8] font-medium"
                style={{ color: 'var(--text-primary)' }}
              >
                {roast}
              </p>
            </div>
          </section>

          {/* Verdict */}
          <section
            className="rounded-[var(--radius-sm)] px-5 py-4 border-l-[3px]"
            style={{
              backgroundColor: 'var(--bg-elevated)',
              borderColor: 'var(--roast)',
            }}
          >
            <div
              className="text-[9px] tracking-[0.15em] uppercase mb-1"
              style={{ color: 'var(--text-muted)' }}
            >
              Verdict
            </div>
            <div
              className="text-[24px] font-black italic leading-tight tracking-tight"
              style={{ color: 'var(--roast)' }}
            >
              {verdict}
            </div>
          </section>
        </div>

        {/* Footer Strip */}
        <div
          className="border-t px-5 py-3.5 flex items-center justify-between"
          style={{
            borderColor: 'var(--border)',
          }}
        >
          <span
            className="font-mono text-[11px]"
            style={{ color: 'var(--text-muted)' }}
          >
            {timeAgo}
          </span>

          <div className="flex items-center gap-2">
            {showRoastAnother && (
              <button
                onClick={(e) => {
                  e.preventDefault()
                  onRoastAnother?.()
                }}
                className="text-[12px] px-3 py-1.5 rounded-[var(--radius-sm)] border transition-colors"
                style={{
                  borderColor: 'var(--border)',
                  color: 'var(--text-muted)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-hover)'
                  e.currentTarget.style.color = 'var(--text-primary)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border)'
                  e.currentTarget.style.color = 'var(--text-muted)'
                }}
              >
                ← Roast another
              </button>
            )}

            <button
              onClick={handleCopy}
              className="text-[12px] font-bold px-4 py-1.5 rounded-[var(--radius-sm)] flex items-center gap-1.5 transition-colors"
              style={{
                backgroundColor: 'var(--roast)',
                color: 'white',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#e03d00'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'var(--roast)'
              }}
            >
              <Copy size={12} />
              Copy roast
            </button>
          </div>
        </div>
      </div>
      {showToast && <Toast message="Roast copied to clipboard!" />}
    </>
  )
}

function formatTimeAgo(date: Date): string {
  const now = new Date()
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (seconds < 60) return 'just now'
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d ago`
  return date.toLocaleDateString()
}
