'use client'

import { useState } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useChartMateri } from '@/hooks/useDashboard'
import { useKelasList } from '@/hooks/useKelas'
import { BookOpen, AlertTriangle, Users, TrendingUp } from 'lucide-react'

const BULAN_LABEL: Record<string, string> = {
  januari: 'Januari', februari: 'Februari', maret: 'Maret', april: 'April',
  mei: 'Mei', juni: 'Juni', juli: 'Juli', agustus: 'Agustus',
  september: 'September', oktober: 'Oktober', november: 'November', desember: 'Desember',
}

function TrenTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-border bg-card px-3 py-2 shadow-sm text-xs space-y-1">
      <p className="font-medium text-foreground mb-1">{label}</p>
      {payload.map((p: any) => (
        <p key={p.dataKey} style={{ color: p.fill }}>
          {p.name}: <span className="font-semibold">{p.value}</span> materi
        </p>
      ))}
    </div>
  )
}

function ProgressBar({
  value,
  max,
  color = '#10b981',
}: {
  value: number
  max: number
  color?: string
}) {
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
      <div
        className="h-full rounded-full transition-all duration-300"
        style={{ width: `${pct}%`, backgroundColor: color }}
      />
    </div>
  )
}

function ChartSkeleton({ height = 200 }: { height?: number }) {
  return <div className="animate-pulse rounded-lg bg-muted" style={{ height }} />
}

function ListSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="space-y-1.5">
          <div className="flex justify-between">
            <div className="h-3.5 w-36 animate-pulse rounded bg-muted" />
            <div className="h-3.5 w-10 animate-pulse rounded bg-muted" />
          </div>
          <div className="h-2 w-full animate-pulse rounded-full bg-muted" />
        </div>
      ))}
    </div>
  )
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
        active
          ? 'bg-primary text-primary-foreground'
          : 'text-muted-foreground hover:text-foreground'
      }`}
    >
      {children}
    </button>
  )
}

export default function ChartMateri() {
  const [kelasId, setKelasId] = useState<number | undefined>(undefined)
  const [tab, setTab] = useState<'umum' | 'individu'>('umum')

  const { data, isLoading } = useChartMateri(kelasId)
  const { data: kelasPaginated } = useKelasList({ is_aktif: true })
  const kelasList = kelasPaginated?.data ?? []

  const selectItems = kelasList.map((k) => ({ value: String(k.id), label: k.nama }))
  const hasTren = data?.umum?.tren?.some((t) => t.target > 0)

  return (
    <div className="space-y-4">
      {/* Filter + Tabs */}
      <div className="flex flex-wrap items-center gap-3">
        <Select
          value={kelasId !== undefined ? String(kelasId) : ''}
          onValueChange={(v) => setKelasId(v === '' ? undefined : Number(v))}
          items={selectItems}
        >
          <SelectTrigger size="sm" className="w-44">
            <SelectValue placeholder="Pilih Kelas" />
          </SelectTrigger>
          <SelectContent>
            {selectItems.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex gap-0.5 rounded-lg border border-border p-0.5">
          <TabButton active={tab === 'umum'} onClick={() => setTab('umum')}>
            Umum
          </TabButton>
          <TabButton active={tab === 'individu'} onClick={() => setTab('individu')}>
            Individu
          </TabButton>
        </div>
      </div>

      {/* No kelas selected */}
      {!kelasId && (
        <Card>
          <CardContent className="py-12 text-center text-sm text-muted-foreground">
            Pilih kelas untuk melihat pencapaian materi
          </CardContent>
        </Card>
      )}

      {/* Umum tab */}
      {kelasId && tab === 'umum' && (
        <div className="space-y-4">
          <div className="grid gap-4 lg:grid-cols-2">
            {/* Tren 6 bulan */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm font-medium">
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                  Tren Materi Umum (6 Bulan)
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <ChartSkeleton />
                ) : !data ? (
                  <p className="py-12 text-center text-sm text-muted-foreground">
                    Tidak ada kurikulum aktif
                  </p>
                ) : !hasTren ? (
                  <p className="py-12 text-center text-sm text-muted-foreground">
                    Belum ada target materi dalam 6 bulan terakhir
                  </p>
                ) : (
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart
                      data={data?.umum?.tren}
                      margin={{ top: 4, right: 8, left: -16, bottom: 0 }}
                      barCategoryGap="30%"
                      barGap={3}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="hsl(var(--border))"
                        vertical={false}
                      />
                      <XAxis
                        dataKey="bulan"
                        tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis
                        allowDecimals={false}
                        tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                        tickLine={false}
                        axisLine={false}
                      />
                      <Tooltip
                        content={<TrenTooltip />}
                        cursor={{ fill: 'hsl(var(--muted))', radius: 4 }}
                      />
                      <Legend
                        iconType="square"
                        iconSize={10}
                        wrapperStyle={{ fontSize: 12, paddingTop: 8 }}
                      />
                      <Bar dataKey="target" name="Target" fill="#60a5fa" radius={[4, 4, 0, 0]} />
                      <Bar dataKey="selesai" name="Selesai" fill="#10b981" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>

            {/* Target bulan ini */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm font-medium">
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                  Target Bulan Ini —{' '}
                  {data ? BULAN_LABEL[data.bulan_ini] : '...'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <ListSkeleton />
                ) : !data ? (
                  <p className="py-8 text-center text-sm text-muted-foreground">
                    Tidak ada kurikulum aktif untuk kelas ini
                  </p>
                ) : data?.umum?.per_bab?.length === 0 ? (
                  <p className="py-8 text-center text-sm text-muted-foreground">
                    Tidak ada target materi umum bulan ini
                  </p>
                ) : (
                  <>
                    <div className="mb-4 flex items-baseline gap-1.5">
                      <span className="text-2xl font-bold text-foreground">
                        {data?.umum?.selesai}/{data?.umum?.total}
                      </span>
                      <span className="text-sm text-muted-foreground">materi selesai</span>
                    </div>
                    <div className="space-y-3">
                      {data?.umum?.per_bab?.map((b) => (
                        <div key={b.bab_kode} className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-medium text-foreground">
                              {b.bab_kode} — {b.bab_nama}
                            </span>
                            <span className="text-muted-foreground">
                              {b.selesai}/{b.total}
                            </span>
                          </div>
                          <ProgressBar
                            value={b.selesai}
                            max={b.total}
                            color={b.selesai >= b.total ? '#10b981' : '#60a5fa'}
                          />
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Backlog */}
          {!isLoading && !!data?.umum?.backlog?.length && (
            <Card className="border-amber-200 dark:border-amber-800">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm font-medium text-amber-700 dark:text-amber-400">
                  <AlertTriangle className="h-4 w-4" />
                  Belum Tersampaikan dari Bulan Sebelumnya
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {data?.umum?.backlog.map((b, i) => (
                    <div key={i} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-medium text-foreground">
                          <span className="text-amber-600 dark:text-amber-400">
                            {BULAN_LABEL[b.bulan_target]}
                          </span>
                          {' · '}
                          {b.bab_kode} — {b.bab_nama}
                        </span>
                        <span className="font-medium text-amber-700 dark:text-amber-400">
                          {b.selesai}/{b.total}
                        </span>
                      </div>
                      <ProgressBar value={b.selesai} max={b.total} color="#f59e0b" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Individu tab */}
      {kelasId && tab === 'individu' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm font-medium">
              <Users className="h-4 w-4 text-muted-foreground" />
              Pencapaian Individu —{' '}
              {data ? BULAN_LABEL[data.bulan_ini] : '...'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <ListSkeleton />
            ) : !data ? (
              <p className="py-8 text-center text-sm text-muted-foreground">
                Tidak ada kurikulum aktif untuk kelas ini
              </p>
            ) : data?.individu?.total_materi === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">
                Tidak ada target materi individu bulan ini
              </p>
            ) : (
              <div className="space-y-3">
                {data?.individu?.murid?.map((m) => {
                  const pct =
                    data?.individu?.total_materi > 0
                      ? Math.round((m.selesai / data?.individu?.total_materi) * 100)
                      : 0
                  const color =
                    pct >= 100 ? '#10b981' : pct >= 50 ? '#60a5fa' : '#f87171'
                  return (
                    <div key={m.id} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="max-w-[55%] truncate font-medium text-foreground">
                          {m.nama}
                        </span>
                        <span className="text-muted-foreground">
                          {m.selesai}/{data?.individu?.total_materi}
                          <span className="ml-1 text-[10px]">({pct}%)</span>
                        </span>
                      </div>
                      <ProgressBar
                        value={m.selesai}
                        max={data?.individu?.total_materi}
                        color={color}
                      />
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
