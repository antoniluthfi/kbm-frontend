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
import { useChartKas } from '@/hooks/useDashboard'
import { useKelasList } from '@/hooks/useKelas'
import { ArrowDownRight, ArrowUpRight, Wallet } from 'lucide-react'

function formatRupiahShort(value: number): string {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}jt`
  if (value >= 1_000) return `${(value / 1_000).toFixed(0)}rb`
  return String(value)
}

function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

function KasTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-border bg-card px-3 py-2 shadow-sm text-xs space-y-1">
      <p className="font-medium text-foreground mb-1">{label}</p>
      {payload.map((p: any) => (
        <p key={p.dataKey} style={{ color: p.fill }}>
          {p.name}: <span className="font-semibold">{formatRupiah(p.value)}</span>
        </p>
      ))}
      {payload.length === 2 && (
        <p className="border-t border-border pt-1 text-muted-foreground">
          Saldo:{' '}
          <span
            className="font-semibold"
            style={{ color: payload[0].value - payload[1].value >= 0 ? '#10b981' : '#f87171' }}
          >
            {formatRupiah(payload[0].value - payload[1].value)}
          </span>
        </p>
      )}
    </div>
  )
}

export default function ChartKas() {
  const [kelasId, setKelasId] = useState<number | undefined>(undefined)

  const { data, isLoading } = useChartKas(kelasId)
  const { data: kelasPaginated } = useKelasList({ is_aktif: true })
  const kelasList = kelasPaginated?.data ?? []

  const hasData = data?.tren.some((t) => t.pemasukan > 0 || t.pengeluaran > 0)
  const saldoPositif = (data?.saldo_total ?? 0) >= 0

  const selectItems = [
    { value: '', label: 'Semua Kelas' },
    ...kelasList.map((k) => ({ value: String(k.id), label: k.nama })),
  ]

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <CardTitle className="flex items-center gap-2 text-sm font-medium">
            <Wallet className="h-4 w-4 text-muted-foreground" />
            Tren Kas Bulanan (6 Bulan)
          </CardTitle>
          <Select
            value={kelasId !== undefined ? String(kelasId) : ''}
            onValueChange={(v) => setKelasId(v === '' ? undefined : Number(v))}
            items={selectItems}
          >
            <SelectTrigger size="sm" className="w-44">
              <SelectValue placeholder="Semua Kelas" />
            </SelectTrigger>
            <SelectContent>
              {selectItems.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent className="space-y-5">
        {/* Ringkasan total (reaktif terhadap filter) */}
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-lg bg-green-50 p-3">
            <p className="flex items-center gap-1 text-xs text-green-700">
              <ArrowUpRight className="h-3.5 w-3.5" />
              Total Pemasukan
            </p>
            {isLoading ? (
              <div className="mt-1.5 h-5 w-24 animate-pulse rounded bg-green-100" />
            ) : (
              <p className="mt-1 text-base font-bold text-green-700">
                {formatRupiah(data?.total_pemasukan ?? 0)}
              </p>
            )}
          </div>

          <div className="rounded-lg bg-red-50 p-3">
            <p className="flex items-center gap-1 text-xs text-red-700">
              <ArrowDownRight className="h-3.5 w-3.5" />
              Total Pengeluaran
            </p>
            {isLoading ? (
              <div className="mt-1.5 h-5 w-24 animate-pulse rounded bg-red-100" />
            ) : (
              <p className="mt-1 text-base font-bold text-red-700">
                {formatRupiah(data?.total_pengeluaran ?? 0)}
              </p>
            )}
          </div>

          <div className={`rounded-lg p-3 ${saldoPositif ? 'bg-emerald-50' : 'bg-orange-50'}`}>
            <p className={`text-xs font-medium ${saldoPositif ? 'text-emerald-700' : 'text-orange-700'}`}>
              Saldo
            </p>
            {isLoading ? (
              <div className="mt-1.5 h-5 w-24 animate-pulse rounded bg-muted" />
            ) : (
              <p className={`mt-1 text-base font-bold ${saldoPositif ? 'text-emerald-700' : 'text-orange-700'}`}>
                {formatRupiah(data?.saldo_total ?? 0)}
              </p>
            )}
          </div>
        </div>

        {/* Chart */}
        {isLoading ? (
          <div className="h-52 animate-pulse rounded-lg bg-muted" />
        ) : hasData ? (
          <ResponsiveContainer width="100%" height={210}>
            <BarChart
              data={data!.tren}
              margin={{ top: 4, right: 8, left: 0, bottom: 0 }}
              barCategoryGap="30%"
              barGap={3}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis
                dataKey="bulan"
                tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                tickLine={false}
                axisLine={false}
                tickFormatter={formatRupiahShort}
                width={48}
              />
              <Tooltip content={<KasTooltip />} cursor={{ fill: 'hsl(var(--muted))', radius: 4 }} />
              <Legend
                iconType="square"
                iconSize={10}
                wrapperStyle={{ fontSize: 12, paddingTop: 8 }}
              />
              <Bar dataKey="pemasukan" name="Pemasukan" fill="#10b981" radius={[4, 4, 0, 0]} />
              <Bar dataKey="pengeluaran" name="Pengeluaran" fill="#f87171" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="py-12 text-center text-sm text-muted-foreground">
            Belum ada data transaksi kas
          </p>
        )}
      </CardContent>
    </Card>
  )
}
