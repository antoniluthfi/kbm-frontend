import { Kelas } from './kelas'
import { Murid } from './murid'

export type JenisKas = 'pemasukan' | 'pengeluaran'

export interface KasKategori {
  id: number
  nama: string
  jenis: JenisKas
  is_aktif: boolean
  created_at: string
  updated_at: string
}

export interface KasTransaksi {
  id: number
  kelas_id: number
  kategori_id: number
  murid_id: number | null
  dicatat_oleh: number | null
  jumlah: string
  keterangan: string | null
  tanggal: string
  bukti: string | null
  created_at: string
  updated_at: string
  kategori?: KasKategori
  murid?: Murid
  kelas?: Kelas
}

export interface BreakdownKas {
  kategori: string
  jumlah: number
}

export interface SaldoKas {
  total_pemasukan: number
  total_pengeluaran: number
  saldo: number
  breakdown_pemasukan: BreakdownKas[]
  breakdown_pengeluaran: BreakdownKas[]
}

export interface KasDashboardItem extends SaldoKas {
  kelas: Pick<Kelas, 'id' | 'nama'>
}

export interface KasFilters {
  kelas_id?: number
  kategori_id?: number
  jenis?: JenisKas
  bulan?: number
  tahun?: number
}
