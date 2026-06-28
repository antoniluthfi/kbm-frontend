'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Field, formSelectClass } from '@/components/ui/field'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { bulanOptions, tahunOptions } from '@/lib/date-options'
import { useStoreMusyawarah } from '@/hooks/useMusyawarah'
import { cn } from '@/lib/utils'

interface Props {
  onSuccess: () => void
  onCancel: () => void
}

export function MusyawarahForm({ onSuccess, onCancel }: Props) {
  const now = new Date()
  const [tanggal, setTanggal] = useState('')
  const [bulan, setBulan]     = useState(now.getMonth() + 1)
  const [tahun, setTahun]     = useState(now.getFullYear())

  const { mutate: store, isPending } = useStoreMusyawarah()

  const handleSubmit = () => {
    if (!tanggal) {
      toast.error('Tanggal wajib diisi')
      return
    }
    store(
      { tanggal, bulan, tahun },
      {
        onSuccess: () => {
          toast.success('Musyawarah berhasil dibuat, laporan sedang di-generate...')
          onSuccess()
        },
        onError: (err: any) => {
          const msg = err?.response?.data?.errors?.bulan?.[0] ?? 'Gagal membuat musyawarah'
          toast.error(msg)
        },
      }
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Buat Musyawarah</CardTitle>
      </CardHeader>
      <Separator />
      <CardContent className="pt-5 space-y-4 max-w-md">
        <Field label="Periode Laporan">
          <div className="flex gap-2">
            <select
              value={bulan}
              onChange={(e) => setBulan(Number(e.target.value))}
              className={cn(formSelectClass, 'flex-1')}
            >
              {bulanOptions.map((b) => (
                <option key={b.value} value={b.value}>{b.label}</option>
              ))}
            </select>
            <select
              value={tahun}
              onChange={(e) => setTahun(Number(e.target.value))}
              className={cn(formSelectClass, 'w-28')}
            >
              {tahunOptions.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Data absensi dan kurikulum bulan ini akan di-generate otomatis untuk semua kelas aktif.
          </p>
        </Field>

        <Field label="Tanggal Pelaksanaan">
          <Input
            type="date"
            value={tanggal}
            onChange={(e) => setTanggal(e.target.value)}
            className="w-48"
          />
        </Field>
      </CardContent>
      <Separator />
      <CardFooter className="justify-end gap-2">
        <Button type="button" variant="outline" size="lg" onClick={onCancel} disabled={isPending}>
          Batal
        </Button>
        <Button size="lg" onClick={handleSubmit} disabled={isPending}>
          {isPending ? 'Membuat...' : 'Buat Musyawarah'}
        </Button>
      </CardFooter>
    </Card>
  )
}
