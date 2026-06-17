'use client'

import { useState } from 'react'
import { useKasRekap } from '@/hooks/useKas'
import { Field, formSelectClass } from '@/components/ui/field'
import { PageLoading } from '@/components/ui/page-loading'
import { bulanOptions, tahunOptions } from '@/lib/date-options'
import { cn } from '@/lib/utils'

const rupiah = (n: number) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n)

interface Props {
  kelasId: number
}

export function RekapTab({ kelasId }: Props) {
  const [bulan, setBulan] = useState(new Date().getMonth() + 1)
  const [tahun, setTahun] = useState(new Date().getFullYear())

  const { data: rekap, isLoading } = useKasRekap(kelasId, bulan, tahun)

  const maxPemasukan   = Math.max(...(rekap?.breakdown_pemasukan.map((b) => b.jumlah) ?? [1]), 1)
  const maxPengeluaran = Math.max(...(rekap?.breakdown_pengeluaran.map((b) => b.jumlah) ?? [1]), 1)

  return (
    <div className="space-y-6">
      {/* Filter */}
      <div className="flex items-center gap-3">
        <select
          value={bulan}
          onChange={(e) => setBulan(Number(e.target.value))}
          className={cn(formSelectClass, 'w-36')}
        >
          {bulanOptions.map((b) => (
            <option key={b.value} value={b.value}>{b.label}</option>
          ))}
        </select>
        <select
          value={tahun}
          onChange={(e) => setTahun(Number(e.target.value))}
          className={cn(formSelectClass, 'w-24')}
        >
          {tahunOptions.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>

      {isLoading ? (
        <PageLoading />
      ) : !rekap ? null : (
        <>
          {/* Ringkasan Saldo */}
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-xl border border-green-200 bg-green-50 p-4">
              <p className="text-xs text-green-600 font-medium mb-1">Total Pemasukan</p>
              <p className="text-lg font-semibold text-green-700">{rupiah(rekap.total_pemasukan)}</p>
            </div>
            <div className="rounded-xl border border-red-200 bg-red-50 p-4">
              <p className="text-xs text-red-600 font-medium mb-1">Total Pengeluaran</p>
              <p className="text-lg font-semibold text-red-700">{rupiah(rekap.total_pengeluaran)}</p>
            </div>
            <div className={cn(
              'rounded-xl border p-4',
              rekap.saldo >= 0
                ? 'border-primary/20 bg-primary/5'
                : 'border-destructive/20 bg-destructive/5'
            )}>
              <p className="text-xs font-medium mb-1 text-muted-foreground">Saldo</p>
              <p className={cn(
                'text-lg font-semibold',
                rekap.saldo >= 0 ? 'text-primary' : 'text-destructive'
              )}>
                {rupiah(rekap.saldo)}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            {/* Breakdown Pemasukan */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-green-700">Rincian Pemasukan</h3>
              {rekap.breakdown_pemasukan.length === 0 ? (
                <p className="text-sm text-muted-foreground">Tidak ada pemasukan.</p>
              ) : (
                <div className="space-y-2">
                  {rekap.breakdown_pemasukan.map((b) => (
                    <div key={b.kategori}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-foreground">{b.kategori}</span>
                        <span className="font-medium text-green-700">{rupiah(b.jumlah)}</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-green-100">
                        <div
                          className="h-full rounded-full bg-green-500 transition-all"
                          style={{ width: `${(b.jumlah / maxPemasukan) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Breakdown Pengeluaran */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-red-700">Rincian Pengeluaran</h3>
              {rekap.breakdown_pengeluaran.length === 0 ? (
                <p className="text-sm text-muted-foreground">Tidak ada pengeluaran.</p>
              ) : (
                <div className="space-y-2">
                  {rekap.breakdown_pengeluaran.map((b) => (
                    <div key={b.kategori}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-foreground">{b.kategori}</span>
                        <span className="font-medium text-red-600">{rupiah(b.jumlah)}</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-red-100">
                        <div
                          className="h-full rounded-full bg-red-500 transition-all"
                          style={{ width: `${(b.jumlah / maxPengeluaran) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
