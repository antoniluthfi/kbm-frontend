import { StatusAbsensiMurid, StatusAbsensiPengajar } from '@/types/absensi'
import { HariEnum } from '@/types/jadwal'

export const STATUS_MURID: { key: StatusAbsensiMurid; label: string; idle: string; active: string }[] = [
  { key: 'hadir',     label: 'H', idle: 'border-border text-muted-foreground hover:border-green-400 hover:text-green-600',        active: 'border-green-500 bg-green-50 text-green-700 font-semibold' },
  { key: 'terlambat', label: 'T', idle: 'border-border text-muted-foreground hover:border-amber-400 hover:text-amber-600',        active: 'border-amber-500 bg-amber-50 text-amber-700 font-semibold' },
  { key: 'izin',      label: 'I', idle: 'border-border text-muted-foreground hover:border-blue-400 hover:text-blue-600',          active: 'border-blue-500 bg-blue-50 text-blue-700 font-semibold' },
  { key: 'sakit',     label: 'S', idle: 'border-border text-muted-foreground hover:border-purple-400 hover:text-purple-600',      active: 'border-purple-500 bg-purple-50 text-purple-700 font-semibold' },
  { key: 'alpha',     label: 'A', idle: 'border-border text-muted-foreground hover:border-destructive/60 hover:text-destructive', active: 'border-destructive bg-destructive/10 text-destructive font-semibold' },
]

export const STATUS_PENGAJAR: { key: StatusAbsensiPengajar; label: string }[] = [
  { key: 'hadir',       label: 'Hadir' },
  { key: 'berhalangan', label: 'Berhalangan' },
  { key: 'digantikan',  label: 'Digantikan' },
]

export const STATUS_COLOR: Record<StatusAbsensiMurid, string> = {
  hadir:     'text-green-700 bg-green-50',
  terlambat: 'text-amber-700 bg-amber-50',
  izin:      'text-blue-700 bg-blue-50',
  sakit:     'text-purple-700 bg-purple-50',
  alpha:     'text-destructive bg-destructive/10',
}

export const STATUS_LABEL: Record<StatusAbsensiMurid, string> = {
  hadir: 'Hadir', terlambat: 'Terlambat', izin: 'Izin', sakit: 'Sakit', alpha: 'Alpha',
}

export const JS_DAY_TO_HARI: HariEnum[] = ['minggu', 'senin', 'selasa', 'rabu', 'kamis', 'jumat', 'sabtu']
