import { useQuery } from '@tanstack/react-query'
import api from '@/lib/axios'
import { ChartAbsensiData, ChartKasData, ChartMateriData, DashboardStats } from '@/types/dashboard'

export const useDashboard = () =>
  useQuery({
    queryKey: ['dashboard'],
    queryFn: async () => {
      const { data } = await api.get<DashboardStats>('/api/dashboard')
      return data
    },
  })

export const useChartAbsensi = (kelasId?: number) =>
  useQuery({
    queryKey: ['dashboard', 'chart-absensi', kelasId],
    queryFn: async () => {
      const { data } = await api.get<ChartAbsensiData>('/api/dashboard/chart-absensi', {
        params: kelasId ? { kelas_id: kelasId } : undefined,
      })
      return data
    },
  })

export const useChartKas = (kelasId?: number) =>
  useQuery({
    queryKey: ['dashboard', 'chart-kas', kelasId],
    queryFn: async () => {
      const { data } = await api.get<ChartKasData>('/api/dashboard/chart-kas', {
        params: kelasId ? { kelas_id: kelasId } : undefined,
      })
      return data
    },
  })

export const useChartMateri = (kelasId?: number) =>
  useQuery({
    queryKey: ['dashboard', 'chart-materi', kelasId],
    queryFn: async () => {
      const { data } = await api.get<ChartMateriData | null>('/api/dashboard/chart-materi', {
        params: { kelas_id: kelasId },
      })
      return data
    },
    enabled: !!kelasId,
  })
