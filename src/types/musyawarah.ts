import { Kelas } from './kelas'
import { User } from './user'

export type StatusMusyawarah = 'draft' | 'selesai'
export type KategoriNotulensi = 'usulan' | 'keputusan' | 'problem' | 'lainnya'
export type StatusTindakLanjut = 'open' | 'selesai' | 'ditunda'

export interface Musyawarah {
  id: number
  tanggal: string
  bulan: number
  tahun: number
  status: StatusMusyawarah
  catatan_umum: string | null
  created_by: number
  created_at: string
  updated_at: string
  created_by_user?: User
  laporan?: LaporanMusyawarah[]
  notulensi?: NotulensiMusyawarah[]
  laporan_count?: number
  notulensi_count?: number
}

export interface LaporanMusyawarah {
  id: number
  musyawarah_id: number
  kelas_id: number
  snapshot_jumlah_murid: number
  snapshot_kehadiran_persen: number | null
  snapshot_progress_persen: number | null
  snapshot_progress_umum_persen: number | null
  snapshot_progress_individu_persen: number | null
  kendala_murid_auto: string | null
  kendala_pengajar: string | null
  planning: string | null
  tindak_lanjut: string | null
  created_at: string
  updated_at: string
  kelas?: Kelas
}

export interface NotulensiMusyawarah {
  id: number
  musyawarah_id: number
  kategori: KategoriNotulensi
  isi: string
  penanggung_jawab: string | null
  status_tindak_lanjut: StatusTindakLanjut
  created_at: string
  updated_at: string
}

export interface EvaluasiPerKelas {
  kelas_id: number
  kelas_nama: string | null
  planning_lalu: string | null
  tindak_lanjut: string | null
  delta_kehadiran: number | null
  delta_progress: number | null
}

export interface EvaluasiMusyawarah {
  per_kelas: EvaluasiPerKelas[]
  notulensi_open: NotulensiMusyawarah[]
}
