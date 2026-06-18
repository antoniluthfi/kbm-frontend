'use client'

import dynamic from 'next/dynamic'
import { useDashboard } from '@/hooks/useDashboard'
import { useJadwalMingguIni } from '@/hooks/useJadwal'
import { useAuthStore } from '@/stores/useAuthStore'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { HARI_LABEL, HARI_ORDER, HariEnum } from '@/types/jadwal'
import {
  Users,
  BookOpen,
  Layers,
  Wallet,
  TrendingUp,
  CalendarDays,
} from 'lucide-react'

const ChartAbsensi = dynamic(() => import('@/components/dashboard/ChartAbsensi'), { ssr: false })
const ChartKas = dynamic(() => import('@/components/dashboard/ChartKas'), { ssr: false })
const ChartMateri = dynamic(() => import('@/components/dashboard/ChartMateri'), { ssr: false })

function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  iconClass,
}: {
  label: string
  value: string | number
  sub?: string
  icon: React.ElementType
  iconClass: string
}) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
          <div className={`rounded-lg p-2 ${iconClass}`}>
            <Icon className="h-4 w-4" />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold text-foreground">{value}</p>
        {sub && <p className="mt-1 text-xs text-muted-foreground">{sub}</p>}
      </CardContent>
    </Card>
  )
}

function StatCardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="h-4 w-24 animate-pulse rounded bg-muted" />
          <div className="h-8 w-8 animate-pulse rounded-lg bg-muted" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-7 w-20 animate-pulse rounded bg-muted" />
        <div className="mt-2 h-3 w-32 animate-pulse rounded bg-muted" />
      </CardContent>
    </Card>
  )
}

const NAMA_BULAN = [
  '', 'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
]

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user)
  const { data: stats, isLoading: loadingStats } = useDashboard()
  const { data: jadwal, isLoading: loadingJadwal } = useJadwalMingguIni()

  const hariIni = new Date().toLocaleDateString('id-ID', { weekday: 'long' }).toLowerCase() as HariEnum

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-heading text-2xl font-bold text-foreground">Dashboard</h1>
        {user && (
          <p className="mt-1 text-sm text-muted-foreground">
            Selamat datang kembali,{' '}
            <span className="font-medium text-foreground">{user.name}</span>
          </p>
        )}
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-5">
        {loadingStats ? (
          Array.from({ length: 5 }).map((_, i) => <StatCardSkeleton key={i} />)
        ) : stats ? (
          <>
            <StatCard
              label="Total Murid"
              value={stats.total_murid}
              sub={`${stats.murid_aktif} murid aktif`}
              icon={Users}
              iconClass="bg-blue-100 text-blue-600"
            />
            <StatCard
              label="Kelas Aktif"
              value={stats.kelas_aktif}
              sub="kelas berjalan"
              icon={BookOpen}
              iconClass="bg-green-100 text-green-600"
            />
            <StatCard
              label="Program Aktif"
              value={stats.program_aktif}
              sub="program berjalan"
              icon={Layers}
              iconClass="bg-purple-100 text-purple-600"
            />
            <StatCard
              label="Saldo Kas"
              value={formatRupiah(stats.saldo_total)}
              sub={`Pemasukan ${formatRupiah(stats.total_pemasukan)}`}
              icon={Wallet}
              iconClass="bg-orange-100 text-orange-600"
            />
            <StatCard
              label="Kehadiran"
              value={`${stats.kehadiran_persen}%`}
              sub={`Bulan ${NAMA_BULAN[stats.bulan]} ${stats.tahun}`}
              icon={TrendingUp}
              iconClass={
                stats.kehadiran_persen >= 75
                  ? 'bg-teal-100 text-teal-600'
                  : 'bg-red-100 text-red-600'
              }
            />
          </>
        ) : null}
      </div>

      {/* Chart Materi */}
      <div>
        <h2 className="mb-3 text-sm font-semibold text-muted-foreground uppercase tracking-wide">
          Pencapaian Materi
        </h2>
        <ChartMateri />
      </div>

      {/* Chart Absensi */}
      <div>
        <h2 className="mb-3 text-sm font-semibold text-muted-foreground uppercase tracking-wide">
          Analitik Kehadiran
        </h2>
        <ChartAbsensi />
      </div>

      {/* Chart Kas */}
      <div>
        <h2 className="mb-3 text-sm font-semibold text-muted-foreground uppercase tracking-wide">
          Analitik Keuangan
        </h2>
        <ChartKas />
      </div>

      {/* Jadwal Minggu Ini */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-muted-foreground" />
            Jadwal Minggu Ini
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loadingJadwal ? (
            <div className="space-y-2">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-12 animate-pulse rounded-lg bg-muted" />
              ))}
            </div>
          ) : jadwal ? (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {HARI_ORDER.map((hari) => {
                const sesi = jadwal[hari] ?? []
                const isHariIni = hari === hariIni
                return (
                  <div
                    key={hari}
                    className={`rounded-lg border p-3 ${
                      isHariIni
                        ? 'border-primary/30 bg-primary/5'
                        : 'border-border bg-card'
                    }`}
                  >
                    <p
                      className={`mb-2 text-xs font-semibold uppercase tracking-wide ${
                        isHariIni ? 'text-primary' : 'text-muted-foreground'
                      }`}
                    >
                      {HARI_LABEL[hari]}
                      {isHariIni && (
                        <span className="ml-2 rounded-full bg-primary px-1.5 py-0.5 text-[10px] text-primary-foreground">
                          Hari ini
                        </span>
                      )}
                    </p>
                    {sesi.length === 0 ? (
                      <p className="text-xs text-muted-foreground">Tidak ada jadwal</p>
                    ) : (
                      <ul className="space-y-1.5">
                        {sesi.map((j) => (
                          <li key={j.id} className="text-xs">
                            <span className="font-medium text-foreground">{j.jam_mulai.slice(0, 5)}</span>
                            <span className="mx-1 text-muted-foreground">·</span>
                            <span className="text-foreground">{j.program?.nama ?? '-'}</span>
                            {j.kelas && (
                              <span className="ml-1 text-muted-foreground">({j.kelas.nama})</span>
                            )}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )
              })}
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  )
}
