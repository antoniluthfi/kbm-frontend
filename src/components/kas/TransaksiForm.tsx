'use client'

import { useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { transaksiSchema, TransaksiFormData } from '@/lib/schemas/kas'
import { KasKategori, KasTransaksi } from '@/types/kas'
import { Murid } from '@/types/murid'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Field, formSelectClass } from '@/components/ui/field'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { MuridAutocomplete } from '@/components/kelas/MuridAutocomplete'

interface Props {
  kelasId: number
  kategoriList: KasKategori[]
  defaultValues?: KasTransaksi
  onSubmit: (data: TransaksiFormData) => void
  onCancel: () => void
  isLoading?: boolean
}

export function TransaksiForm({
  kelasId,
  kategoriList,
  defaultValues,
  onSubmit,
  onCancel,
  isLoading,
}: Props) {
  const isEdit = !!defaultValues

  const { register, handleSubmit, watch, reset, control, formState: { errors } } =
    useForm<TransaksiFormData>({
      resolver: zodResolver(transaksiSchema),
      defaultValues: {
        kelas_id:    kelasId,
        kategori_id: undefined,
        murid_id:    null,
        jumlah:      undefined,
        keterangan:  '',
        tanggal:     new Date().toISOString().split('T')[0],
      },
    })

  useEffect(() => {
    if (defaultValues) {
      reset({
        kelas_id:    defaultValues.kelas_id,
        kategori_id: defaultValues.kategori_id,
        murid_id:    defaultValues.murid_id,
        jumlah:      parseFloat(defaultValues.jumlah),
        keterangan:  defaultValues.keterangan ?? '',
        tanggal:     defaultValues.tanggal,
      })
    } else {
      reset({
        kelas_id:    kelasId,
        kategori_id: undefined,
        murid_id:    null,
        jumlah:      undefined,
        keterangan:  '',
        tanggal:     new Date().toISOString().split('T')[0],
      })
    }
  }, [defaultValues, kelasId, reset])

  const selectedKategoriId = watch('kategori_id')
  const selectedKategori   = kategoriList.find((k) => k.id === selectedKategoriId)
  const isPemasukan        = selectedKategori?.jenis === 'pemasukan'

  const pemasukan   = kategoriList.filter((k) => k.jenis === 'pemasukan'  && k.is_aktif)
  const pengeluaran = kategoriList.filter((k) => k.jenis === 'pengeluaran' && k.is_aktif)

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input type="hidden" {...register('kelas_id', { valueAsNumber: true })} />

      <Card className="overflow-visible">
        <CardHeader>
          <CardTitle>{isEdit ? 'Edit Transaksi' : 'Catat Transaksi Baru'}</CardTitle>
        </CardHeader>
        <Separator />
        <CardContent className="pt-5">
          <div className="grid grid-cols-2 gap-x-6 gap-y-4">
            <div className="col-span-2 sm:col-span-1">
              <Field label="Kategori" error={errors.kategori_id?.message}>
                <select
                  {...register('kategori_id', { valueAsNumber: true })}
                  className={formSelectClass}
                >
                  <option value="">— Pilih kategori —</option>
                  {pemasukan.length > 0 && (
                    <optgroup label="Pemasukan">
                      {pemasukan.map((k) => (
                        <option key={k.id} value={k.id}>{k.nama}</option>
                      ))}
                    </optgroup>
                  )}
                  {pengeluaran.length > 0 && (
                    <optgroup label="Pengeluaran">
                      {pengeluaran.map((k) => (
                        <option key={k.id} value={k.id}>{k.nama}</option>
                      ))}
                    </optgroup>
                  )}
                </select>
              </Field>
            </div>

            <div className="col-span-2 sm:col-span-1">
              <Field label="Jumlah (Rp)" error={errors.jumlah?.message}>
                <Input
                  type="number"
                  min="1"
                  placeholder="0"
                  {...register('jumlah', { valueAsNumber: true })}
                />
              </Field>
            </div>

            <div className="col-span-2 sm:col-span-1">
              <Field label="Tanggal" error={errors.tanggal?.message}>
                <Input type="date" {...register('tanggal')} />
              </Field>
            </div>

            <div className="col-span-2 sm:col-span-1">
              <Field label="Keterangan" error={errors.keterangan?.message}>
                <Input
                  type="text"
                  placeholder="Opsional"
                  {...register('keterangan')}
                />
              </Field>
            </div>

            {isPemasukan && (
              <div className="col-span-2">
                <Field label="Murid Terkait (opsional)" error={errors.murid_id?.message}>
                  <Controller
                    control={control}
                    name="murid_id"
                    render={({ field }) => (
                      <MuridAutocomplete
                        selectedId={field.value ?? undefined}
                        defaultInputValue={defaultValues?.murid?.nama ?? ''}
                        onSelect={(m: Murid) => field.onChange(m.id)}
                        kelasId={kelasId}
                        placeholder="Ketik nama murid untuk mencari..."
                      />
                    )}
                  />
                </Field>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="gap-2 justify-end">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isLoading}>
            Batal
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading
              ? isEdit ? 'Menyimpan...' : 'Mencatat...'
              : isEdit ? 'Simpan Perubahan' : 'Catat Transaksi'}
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}
