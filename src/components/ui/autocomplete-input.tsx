'use client'

import { useState, useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'
import { Check, X } from 'lucide-react'

interface AutocompleteInputProps<T> {
  items: T[]
  isFetching: boolean
  inputValue: string
  onInputChange: (value: string) => void
  onSelect: (item: T) => void
  getLabel: (item: T) => string
  getId: (item: T) => number
  selectedId?: number
  onClear?: () => void
  error?: string
  placeholder?: string
  inputClassName?: string
  renderItem?: (item: T) => React.ReactNode
  emptyText?: string
  notFoundText?: string
}

export function AutocompleteInput<T>({
  items,
  isFetching,
  inputValue,
  onInputChange,
  onSelect,
  getLabel,
  getId,
  selectedId,
  onClear,
  error,
  placeholder,
  inputClassName,
  renderItem,
  emptyText = 'Ketik untuk mencari',
  notFoundText = 'Tidak ditemukan',
}: AutocompleteInputProps<T>) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleSelect = (item: T) => {
    onInputChange(getLabel(item))
    onSelect(item)
    setIsOpen(false)
  }

  const handleClear = () => {
    onInputChange('')
    onClear?.()
    setIsOpen(false)
  }

  const hasClear = !!onClear && !!(inputValue || selectedId)
  const base = 'w-full border border-input rounded-lg text-sm bg-background outline-none focus:border-ring focus:ring-3 focus:ring-ring/50 transition-colors placeholder:text-muted-foreground'

  return (
    <div className="relative" ref={containerRef}>
      <input
        type="text"
        value={inputValue}
        onChange={(e) => { onInputChange(e.target.value); setIsOpen(true) }}
        onFocus={() => setIsOpen(true)}
        placeholder={placeholder}
        autoComplete="off"
        className={cn(
          base,
          hasClear ? 'pr-8 pl-3' : 'px-3',
          inputClassName,
          error && 'border-destructive focus:border-destructive focus:ring-destructive/50',
        )}
      />

      {hasClear && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
          tabIndex={-1}
        >
          <X className="size-3.5" />
        </button>
      )}

      {isOpen && (
        <div className="absolute z-10 top-full left-0 right-0 mt-1 rounded-lg border border-border bg-background shadow-lg max-h-48 overflow-y-auto">
          {isFetching && (
            <div className="flex items-center gap-2 px-3 py-2 border-b border-border/50 text-xs text-muted-foreground">
              <div className="size-3 border border-current border-t-transparent rounded-full animate-spin" />
              Mencari...
            </div>
          )}
          {items.length === 0 && !isFetching ? (
            <div className="px-3 py-3 text-sm text-muted-foreground text-center">
              {inputValue ? notFoundText : emptyText}
            </div>
          ) : (
            items.map((item) => (
              <button
                key={getId(item)}
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => handleSelect(item)}
                className={cn(
                  'w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-left hover:bg-muted transition-colors',
                  selectedId === getId(item) && 'bg-primary/5',
                )}
              >
                {renderItem
                  ? renderItem(item)
                  : <span className="flex-1 font-medium">{getLabel(item)}</span>}
                {selectedId === getId(item) && <Check className="size-3.5 text-primary shrink-0" />}
              </button>
            ))
          )}
        </div>
      )}

      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  )
}
