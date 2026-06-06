'use client'

import { URLInputFormProps } from '@/lib/types'
import { useRef, useState } from 'react'
import { LoadingSpinner } from './LoadingSpinner'
import { Link2, AlertCircle } from 'lucide-react'

interface URLInputFormPropsWithRef extends URLInputFormProps {
  inputRef?: React.RefObject<HTMLInputElement>
}

export function URLInputForm({
  onSubmit,
  isLoading = false,
  error = null,
  inputRef: externalRef,
}: URLInputFormPropsWithRef) {
  const [url, setUrl] = useState('')
  const [localError, setLocalError] = useState<string | null>(error)
  const internalRef = useRef<HTMLInputElement>(null)
  const inputRef = externalRef || internalRef
  const [isTyping, setIsTyping] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLocalError(null)

    if (!url.trim()) {
      setLocalError('Please paste a URL, you absolute nonce.')
      return
    }

    try {
      new URL(url)
    } catch {
      setLocalError('That\'s not a valid URL, chief. Try again.')
      return
    }

    await onSubmit(url)
    setUrl('')
    setIsTyping(false)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value)
    setLocalError(null)
    setIsTyping(e.target.value.length > 0)
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      {/* Main Input Container */}
      <div
        className="rounded-[var(--radius)] overflow-hidden border transition-all duration-200"
        style={{
          backgroundColor: 'var(--bg-elevated)',
          borderColor: isTyping || (inputRef?.current?.focused) ? 'var(--roast)' : 'var(--border)',
          boxShadow: isTyping || (inputRef?.current?.focused) ? '0 0 0 3px rgba(255, 69, 0, 0.08)' : 'none',
        }}
      >
        {/* Input Row */}
        <div className="flex items-center">
          <div className="px-4 pt-4 pb-4 flex-1">
            <div className="flex items-center gap-2.5 pb-4 border-b" style={{ borderColor: 'var(--border)' }}>
              <Link2
                size={16}
                style={{
                  color: isTyping ? 'var(--text-secondary)' : 'var(--text-ghost)',
                  transition: 'color 200ms',
                }}
              />
              <input
                ref={inputRef}
                type="text"
                placeholder="https://something-that-deserves-a-roasting.com"
                value={url}
                onChange={handleInputChange}
                onFocus={() => setIsTyping(true)}
                onBlur={() => setIsTyping(url.length > 0)}
                disabled={isLoading}
                className="flex-1 bg-transparent border-none outline-none text-sm"
                style={{
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--text-primary)',
                }}
                aria-label="Enter URL to roast"
                aria-describedby="input-hint"
              />
              <button
                type="submit"
                disabled={isLoading || !url.trim()}
                className="ml-auto font-bold text-xs px-6 py-4 rounded-[var(--radius-sm)] transition-colors"
                style={{
                  backgroundColor: isLoading || !url.trim() ? 'rgba(255, 69, 0, 0.4)' : 'var(--roast)',
                  color: 'white',
                  cursor: isLoading || !url.trim() ? 'not-allowed' : 'pointer',
                }}
                onMouseEnter={(e) => {
                  if (!isLoading && url.trim()) {
                    e.currentTarget.style.backgroundColor = '#e03d00'
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isLoading && url.trim()) {
                    e.currentTarget.style.backgroundColor = 'var(--roast)'
                  }
                }}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <LoadingSpinner />
                  </span>
                ) : (
                  'Roast It 🔥'
                )}
              </button>
            </div>

            {/* Bottom Bar */}
            {!localError && !error ? (
              <div
                className="px-0 py-2 flex items-center justify-between text-[10px] font-mono"
                id="input-hint"
                style={{ color: 'var(--text-ghost)' }}
              >
                <span>any public URL · AI-powered · results in ~5s</span>
                <span>↵ Enter to roast</span>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {/* Error State */}
      {(localError || error) && (
        <div
          className="mt-3 rounded-[var(--radius-sm)] px-4 py-3 border flex items-start gap-2"
          style={{
            backgroundColor: 'rgba(200, 50, 50, 0.1)',
            borderColor: 'rgba(200, 50, 50, 0.3)',
          }}
        >
          <AlertCircle size={13} style={{ color: '#e85252', marginTop: '2px', flexShrink: 0 }} />
          <p
            className="text-xs font-mono"
            style={{ color: '#e85252' }}
          >
            {localError || error}
          </p>
        </div>
      )}
    </form>
  )
}
