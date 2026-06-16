'use client'

import { useState, useRef, useEffect } from 'react'
import { useUsers } from '@/hooks/useUsers'
import { useDebounce } from '@/hooks/useDebounce'
import { User, UserRole } from '@/types/user'
import { AvatarInitial } from '@/components/ui/avatar-initial'
import { cn } from '@/lib/utils'
import { Check } from 'lucide-react'

interface UserAutocompleteProps {
  role?: UserRole
  onSelect: (user: User) => void
  selectedId?: number
  defaultUser?: User
  error?: string
  placeholder?: string
}

const inputClass =
  'h-8 w-full border border-input rounded-lg px-2.5 text-sm bg-background outline-none focus:border-ring focus:ring-3 focus:ring-ring/50 transition-colors placeholder:text-muted-foreground'

export function UserAutocomplete({
  role,
  onSelect,
  selectedId,
  defaultUser,
  error,
  placeholder = 'Ketik nama untuk mencari...',
}: UserAutocompleteProps) {
  const [inputValue, setInputValue] = useState(defaultUser?.name ?? '')
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const debouncedSearch = useDebounce(inputValue)

  const { data: usersData } = useUsers({ search: debouncedSearch, role })
  const userList = usersData?.data ?? []

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleSelect = (user: User) => {
    onSelect(user)
    setInputValue(user.name)
    setIsOpen(false)
  }

  return (
    <div className="relative" ref={containerRef}>
      <input
        type="text"
        value={inputValue}
        onChange={(e) => { setInputValue(e.target.value); setIsOpen(true) }}
        onFocus={() => setIsOpen(true)}
        placeholder={placeholder}
        autoComplete="off"
        className={cn(inputClass, error && 'border-destructive focus:border-destructive focus:ring-destructive/50')}
      />

      {isOpen && (
        <div className="absolute z-10 top-full left-0 right-0 mt-1 rounded-lg border border-border bg-background shadow-lg max-h-48 overflow-y-auto">
          {userList.length === 0 ? (
            <div className="px-3 py-3 text-sm text-muted-foreground text-center">
              {inputValue ? 'User tidak ditemukan' : 'Ketik nama untuk mencari'}
            </div>
          ) : (
            userList.map((u) => (
              <button
                key={u.id}
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => handleSelect(u)}
                className={cn(
                  'w-full flex items-center gap-2.5 px-3 py-2 text-sm text-left hover:bg-muted transition-colors',
                  selectedId === u.id && 'bg-primary/5'
                )}
              >
                <AvatarInitial name={u.name} size="md" />
                <div className="flex-1 min-w-0">
                  <div className="truncate">{u.name}</div>
                  <div className="text-xs text-muted-foreground truncate">{u.email}</div>
                </div>
                {selectedId === u.id && <Check className="size-3.5 text-primary shrink-0" />}
              </button>
            ))
          )}
        </div>
      )}

      {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
    </div>
  )
}
