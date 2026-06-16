import { format } from 'date-fns'
import { id as localeId } from 'date-fns/locale'

export const bulanOptions = Array.from({ length: 12 }, (_, i) => ({
  value: i + 1,
  label: format(new Date(2024, i, 1), 'MMMM', { locale: localeId }),
}))

export const tahunOptions = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i)
