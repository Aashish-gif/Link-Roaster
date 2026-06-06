export interface Roast {
  id: string
  url: string
  favicon?: string
  summary: string
  roast: string
  verdict: string
  createdAt: Date
}

export interface RoastCardProps {
  id: string
  url: string
  favicon?: string
  summary: string
  roast: string
  verdict: string
  createdAt: Date
  compact?: boolean
  onRoastClick?: (id: string) => void
}

export interface URLInputFormProps {
  onSubmit: (url: string) => Promise<Roast | null>
  isLoading?: boolean
  error?: string | null
}
