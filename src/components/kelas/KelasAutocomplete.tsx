'use client'

import { useState, useRef } from 'react'
import { useKelasList } from '@/hooks/useKelas'
import { useDebounce } from '@/hooks/useDebounce'
import { Kelas } from '@/types/kelas'
import { AutocompleteInput } from '@/components/ui/autocomplete-input'

interface KelasAutocompleteProps {
  onSelect: (kelas: Kelas) => void
  onClear?: () => void
  selectedId?: number
  error?: string
  placeholder?: string
}

export function KelasAutocomplete({
  onSelect,
  onClear,
  selectedId,
  error,
  placeholder = 'Cari kelas...',
}: KelasAutocompleteProps) {
  const [inputValue, setInputValue] = useState('')
  const debouncedSearch = useDebounce(inputValue)

  const { data: kelasData, isFetching } = useKelasList({
    search: debouncedSearch || undefined,
    is_aktif: true,
  })

  const lastListRef = useRef<Kelas[]>([])
  if (kelasData?.data) lastListRef.current = kelasData.data
  const kelasList = kelasData?.data ?? lastListRef.current

  return (
    <AutocompleteInput
      items={kelasList}
      isFetching={isFetching}
      inputValue={inputValue}
      onInputChange={setInputValue}
      onSelect={onSelect}
      getLabel={(k) => k.nama}
      getId={(k) => k.id}
      selectedId={selectedId}
      onClear={onClear}
      error={error}
      placeholder={placeholder}
      inputClassName="h-9"
      emptyText="Ketik nama untuk mencari"
      notFoundText="Kelas tidak ditemukan"
    />
  )
}
