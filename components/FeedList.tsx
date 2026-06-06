'use client'

import { Roast } from '@/lib/types'
import { RoastCard } from './RoastCard'
import { useRouter } from 'next/navigation'

interface FeedListProps {
  roasts: Roast[]
  hasMore?: boolean
  onLoadMore?: () => void
  isLoading?: boolean
}

export function FeedList({
  roasts,
  hasMore = false,
  onLoadMore,
  isLoading = false,
}: FeedListProps) {
  const router = useRouter()

  const handleRoastClick = (id: string) => {
    router.push(`/roast/${id}`)
  }

  if (roasts.length === 0) {
    return (
      <div className="text-center py-24">
        <div
          className="text-[64px] mb-4 opacity-10"
          style={{ color: 'var(--roast)' }}
        >
          🔥
        </div>
        <p
          className="text-[14px] mb-2"
          style={{ color: 'var(--text-muted)' }}
        >
          No roasts yet.
        </p>
        <p
          className="text-[12px]"
          style={{ color: 'var(--text-ghost)' }}
        >
          Be the first to submit a link.
        </p>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-baseline justify-between mb-6">
        <h2
          className="text-[18px] font-bold tracking-tight"
          style={{ color: 'var(--text-primary)' }}
        >
          What&apos;s been roasted lately 🔥
        </h2>
        <span
          className="font-mono text-[11px]"
          style={{ color: 'var(--text-muted)' }}
        >
          {roasts.length} total
        </span>
      </div>

      {/* Sort Filters */}
      <div className="flex gap-2 mb-5">
        {['All', 'Today', 'This week'].map((filter, i) => (
          <button
            key={filter}
            className={`text-[11px] px-3 py-1 rounded-full font-medium transition-colors border`}
            style={
              i === 0
                ? {
                    backgroundColor: 'var(--roast-dim)',
                    borderColor: 'var(--roast-border)',
                    color: 'var(--roast)',
                  }
                : {
                    borderColor: 'var(--border)',
                    color: 'var(--text-muted)',
                    cursor: 'pointer',
                  }
            }
            onMouseEnter={(e) => {
              if (i !== 0) {
                e.currentTarget.style.borderColor = 'var(--border-hover)'
                e.currentTarget.style.color = 'var(--text-secondary)'
              }
            }}
            onMouseLeave={(e) => {
              if (i !== 0) {
                e.currentTarget.style.borderColor = 'var(--border)'
                e.currentTarget.style.color = 'var(--text-muted)'
              }
            }}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Feed Items */}
      <div className="flex flex-col gap-2.5">
        {roasts.map((roast) => (
          <RoastCard
            key={roast.id}
            {...roast}
            compact
            onRoastClick={handleRoastClick}
          />
        ))}
      </div>

      {/* Load More */}
      {hasMore && (
        <button
          onClick={onLoadMore}
          disabled={isLoading}
          className="w-full mt-4 text-[12px] font-mono py-3 rounded-[var(--radius)] border transition-all"
          style={{
            borderColor: 'var(--border)',
            color: 'var(--text-muted)',
            backgroundColor: 'transparent',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            opacity: isLoading ? 0.5 : 1,
          }}
          onMouseEnter={(e) => {
            if (!isLoading) {
              e.currentTarget.style.borderColor = 'var(--border-hover)'
              e.currentTarget.style.color = 'var(--text-secondary)'
            }
          }}
          onMouseLeave={(e) => {
            if (!isLoading) {
              e.currentTarget.style.borderColor = 'var(--border)'
              e.currentTarget.style.color = 'var(--text-muted)'
            }
          }}
        >
          ↓ Load {roasts.length > 6 ? 'more' : 'more'} roasts
        </button>
      )}
    </div>
  )
}
