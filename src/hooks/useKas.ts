import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/axios'
import {
  KasDashboardItem,
  KasFilters,
  KasKategori,
  KasTransaksi,
  SaldoKas,
} from '@/types/kas'
import { KasKategoriFormData, TransaksiFormData } from '@/lib/schemas/kas'

// ─── Kategori ────────────────────────────────────────────────────────────────

export const useKasKategori = () =>
  useQuery({
    queryKey: ['kas-kategori'],
    queryFn: async () => {
      const { data } = await api.get<{ data: KasKategori[] }>('/api/kas/kategori')
      return data.data
    },
  })

export const useCreateKasKategori = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: KasKategoriFormData) =>
      api.post('/api/kas/kategori', payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['kas-kategori'] }),
  })
}

export const useUpdateKasKategori = (id: number) => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: Partial<KasKategoriFormData> & { is_aktif?: boolean }) =>
      api.put(`/api/kas/kategori/${id}`, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['kas-kategori'] }),
  })
}

export const useDeleteKasKategori = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => api.delete(`/api/kas/kategori/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['kas-kategori'] }),
  })
}

// ─── Transaksi ───────────────────────────────────────────────────────────────

export const useKasTransaksi = (filters: KasFilters, options?: { enabled?: boolean }) =>
  useQuery({
    queryKey: ['kas-transaksi', filters],
    queryFn: async () => {
      const { data } = await api.get<{ data: KasTransaksi[] }>('/api/kas/transaksi', {
        params: filters,
      })
      return data.data
    },
    enabled: (options?.enabled ?? true) && !!filters.kelas_id,
  })

export const useCatatTransaksi = () => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: TransaksiFormData) =>
      api.post<{ transaksi: KasTransaksi }>('/api/kas/transaksi', payload),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ['kas-transaksi'] })
      qc.invalidateQueries({ queryKey: ['kas-rekap', vars.kelas_id] })
      qc.invalidateQueries({ queryKey: ['kas-dashboard'] })
    },
  })
}

export const useUpdateTransaksi = (kelasId: number) => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: Partial<TransaksiFormData> }) =>
      api.put<{ transaksi: KasTransaksi }>(`/api/kas/transaksi/${id}`, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['kas-transaksi'] })
      qc.invalidateQueries({ queryKey: ['kas-rekap', kelasId] })
      qc.invalidateQueries({ queryKey: ['kas-dashboard'] })
    },
  })
}

export const useDeleteTransaksi = (kelasId: number) => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => api.delete(`/api/kas/transaksi/${id}`),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['kas-transaksi'] })
      qc.invalidateQueries({ queryKey: ['kas-rekap', kelasId] })
      qc.invalidateQueries({ queryKey: ['kas-dashboard'] })
    },
  })
}

// ─── Rekap ────────────────────────────────────────────────────────────────────

export const useKasDashboard = (bulan?: number, tahun?: number) =>
  useQuery({
    queryKey: ['kas-dashboard', bulan, tahun],
    queryFn: async () => {
      const { data } = await api.get<{ data: KasDashboardItem[] }>('/api/kas/rekap', {
        params: { bulan, tahun },
      })
      return data.data
    },
  })

export const useKasRekap = (kelasId: number, bulan?: number, tahun?: number) =>
  useQuery({
    queryKey: ['kas-rekap', kelasId, bulan, tahun],
    queryFn: async () => {
      const { data } = await api.get<SaldoKas & { kelas: { id: number; nama: string } }>(
        `/api/kas/rekap/${kelasId}`,
        { params: { bulan, tahun } }
      )
      return data
    },
    enabled: kelasId > 0,
  })
