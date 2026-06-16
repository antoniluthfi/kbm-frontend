import { Program } from './program'
import { Kelas } from './kelas'
import { Pengajar } from './pengajar'

export type HariEnum =
  | 'senin'
  | 'selasa'
  | 'rabu'
  | 'kamis'
  | 'jumat'
  | 'sabtu'
  | 'minggu'

export const HARI_LABEL: Record<HariEnum, string> = {
  senin: 'Senin',
  selasa: 'Selasa',
  rabu: 'Rabu',
  kamis: 'Kamis',
  jumat: 'Jumat',
  sabtu: 'Sabtu',
  minggu: 'Minggu',
}

export const HARI_ORDER: HariEnum[] = [
  'senin',
  'selasa',
  'rabu',
  'kamis',
  'jumat',
  'sabtu',
  'minggu',
]

export interface Jadwal {
  id: number
  program_id: number
  kelas_id: number | null
  pengajar_id: number | null
  hari: HariEnum
  jam_mulai: string
  jam_selesai: string
  mulai_berlaku: string
  selesai_berlaku: string | null
  created_at: string
  updated_at: string
  program?: Program
  kelas?: Kelas
  pengajar?: Pengajar
}

export interface JadwalFilters {
  program_id?: number
  kelas_id?: number
  hari?: HariEnum
  hanya_aktif?: boolean
}

export type JadwalMingguIni = Record<HariEnum, Jadwal[]>
