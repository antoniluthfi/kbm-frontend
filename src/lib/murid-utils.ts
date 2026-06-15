import { Murid } from '@/types/murid'
import { MuridFormData } from '@/lib/schemas/murid'

export function getMuridFotoUrl(murid: Murid | undefined | null): string | null {
  if (!murid) return null
  const raw = murid.foto_url ?? (murid.foto ? `${process.env.NEXT_PUBLIC_API_URL}/storage/${murid.foto}` : null)
  if (!raw) return null
  try { return new URL(raw).pathname } catch { return raw }
}

export function toFormData(formData: MuridFormData, method?: string): FormData {
  const fd = new FormData()
  if (method) fd.append('_method', method)
  Object.entries(formData).forEach(([key, value]) => {
    if (key === 'foto' && value instanceof File) {
      fd.append('foto', value)
    } else if (key === 'wali' && Array.isArray(value)) {
      value.forEach((wali, i) => {
        Object.entries(wali).forEach(([wKey, wVal]) => {
          fd.append(`wali[${i}][${wKey}]`, typeof wVal === 'boolean' ? (wVal ? '1' : '0') : String(wVal ?? ''))
        })
      })
    } else if (value !== undefined && value !== null) {
      fd.append(key, String(value))
    }
  })
  return fd
}
