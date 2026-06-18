export interface DashboardStats {
  total_murid: number
  murid_aktif: number
  kelas_aktif: number
  program_aktif: number
  total_pemasukan: number
  total_pengeluaran: number
  saldo_total: number
  kehadiran_persen: number
  bulan: number
  tahun: number
}

export interface TrenKehadiranItem {
  bulan: string
  persen: number
  total: number
  hadir: number
}

export interface DistribusiAbsensiItem {
  status: 'hadir' | 'terlambat' | 'izin' | 'sakit' | 'alpha'
  jumlah: number
}

export interface ChartAbsensiData {
  tren: TrenKehadiranItem[]
  distribusi: DistribusiAbsensiItem[]
}

export interface TrenMateriItem {
  bulan: string
  target: number
  selesai: number
}

export interface UmumPerBabItem {
  bab_kode: string
  bab_nama: string
  total: number
  selesai: number
}

export interface UmumBacklogItem {
  bab_kode: string
  bab_nama: string
  bulan_target: string
  total: number
  selesai: number
}

export interface IndividuMuridItem {
  id: number
  nama: string
  total: number
  selesai: number
}

export interface ChartMateriData {
  bulan_ini: string
  umum: {
    tren: TrenMateriItem[]
    per_bab: UmumPerBabItem[]
    total: number
    selesai: number
    backlog: UmumBacklogItem[]
  }
  individu: {
    total_materi: number
    murid: IndividuMuridItem[]
  }
}

export interface TrenKasItem {
  bulan: string
  pemasukan: number
  pengeluaran: number
  saldo: number
}

export interface ChartKasData {
  total_pemasukan: number
  total_pengeluaran: number
  saldo_total: number
  tren: TrenKasItem[]
}
