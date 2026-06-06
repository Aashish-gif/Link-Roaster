'use client'

import { useEffect, useState } from 'react'
import { Check } from 'lucide-react'

interface ToastProps {
  message: string
  duration?: number
}

export function Toast({ message, duration = 3000 }: ToastProps) {
  const [isVisible, setIsVisible] = useState(true)
  const [isLeaving, setIsLeaving] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLeaving(true)
      setTimeout(() => setIsVisible(false), 300)
    }, duration)

    return () => clearTimeout(timer)
  }, [duration])

  if (!isVisible) return null

  return (
    <div
      role="alert"
      aria-live="polite"
      className="fixed bottom-6 left-1/2"
      style={{
        transform: 'translateX(-50%)',
        animation: 'toastIn 0.3s cubic-bezier(0.16,1,0.3,1) forwards',
        zIndex: 9999,
      }}
    >
      <div
        className="px-4 py-3 rounded-[var(--radius)] border flex items-center gap-3 min-w-[220px]"
        style={{
          backgroundColor: '#111',
          borderColor: 'var(--border-hover)',
        }}
      >
        <div
          className="w-6 h-6 rounded-[4px] flex items-center justify-center"
          style={{
            backgroundColor: 'var(--roast-dim)',
            borderColor: 'var(--roast-border)',
          }}
        >
          <Check size={13} style={{ color: 'var(--roast)' }} />
        </div>
        <span
          className="font-mono text-[12px]"
          style={{ color: 'var(--text-primary)' }}
        >
          {message}
        </span>
        {/* Progress bar */}
        <div
          className="absolute bottom-0 left-0 right-0 h-[2px] rounded-b-[var(--radius)]"
          style={{
            backgroundColor: 'var(--roast)',
            animation: 'shrink 3s linear forwards',
          }}
        />
      </div>
    </div>
  )
}
