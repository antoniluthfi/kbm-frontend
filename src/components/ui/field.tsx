import { Label } from '@/components/ui/label'

interface FieldProps {
  label: string
  error?: string
  hint?: string
  children: React.ReactNode
}

export function Field({ label, error, hint, children }: FieldProps) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      {children}
      {hint && !error && <p className="text-muted-foreground text-xs">{hint}</p>}
      {error && <p className="text-destructive text-xs">{error}</p>}
    </div>
  )
}

export const formSelectClass =
  'w-full h-8 border border-input rounded-lg px-2.5 text-sm bg-background outline-none focus:border-ring focus:ring-3 focus:ring-ring/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
