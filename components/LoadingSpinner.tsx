'use client'

export function LoadingSpinner() {
  return (
    <div
      style={{
        width: '16px',
        height: '16px',
        border: '2px solid rgba(255, 69, 0, 0.3)',
        borderTop: '2px solid var(--roast)',
        borderRadius: '50%',
        animation: 'spin 0.55s linear infinite',
      }}
    />
  )
}
