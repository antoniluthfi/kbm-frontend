'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Field, formSelectClass } from '@/components/ui/field'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { kurikulumSchema, KurikulumFormData } from '@/lib/schemas/kurikulum'
import { getCurrentTahunAjaran, getTahunAjaranOptions } from '@/lib/utils'
import { Kelas } from '@/types/kelas'
import { Kurikulum } from '@/types/kurikulum'

interface Props {
  kelasList: Kelas[]
  defaultValues?: Kurikulum
  onSubmit: (data: KurikulumFormData) => void
  isLoading?: boolean
  onCancel: () => void
}

export function KurikulumForm({ kelasList, defaultValues, onSubmit, isLoading, onCancel }: Props) {
  const isEdit = !!defaultValues
  const tahunOptions = getTahunAjaranOptions(6)

  const { register, handleSubmit, reset, formState: { errors } } = useForm<KurikulumFormData>({
    resolver: zodResolver(kurikulumSchema),
    defaultValues: {
      kelas_id: defaultValues?.kelas_id ?? 0,
      nama: defaultValues?.nama ?? '',
      tahun_ajaran: defaultValues?.tahun_ajaran ?? getCurrentTahunAjaran(),
      deskripsi: defaultValues?.deskripsi ?? '',
    },
  })

  useEffect(() => {
    reset({
      kelas_id: defaultValues?.kelas_id ?? 0,
      nama: defaultValues?.nama ?? '',
      tahun_ajaran: defaultValues?.tahun_ajaran ?? getCurrentTahunAjaran(),
      deskripsi: defaultValues?.deskripsi ?? '',
    })
  }, [defaultValues])

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card>
        <CardHeader>
          <CardTitle>{isEdit ? 'Edit Kurikulum' : 'Tambah Kurikulum'}</CardTitle>
        </CardHeader>
        <Separator />
        <CardContent className="pt-5">
          <div className="grid grid-cols-2 gap-x-6 gap-y-4">
            <div className="col-span-2">
              <Field label="Kelas" error={errors.kelas_id?.message}>
                <select
                  {...register('kelas_id', { valueAsNumber: true })}
                  className={formSelectClass}
                >
                  <option value={0}>Pilih kelas...</option>
                  {kelasList.map((k) => (
                    <option key={k.id} value={k.id}>{k.nama}</option>
                  ))}
                </select>
              </Field>
            </div>

            <div className="col-span-2">
              <Field label="Nama Kurikulum" error={errors.nama?.message}>
                <Input {...register('nama')} placeholder="Contoh: Kurikulum Pengajian Rutin" />
              </Field>
            </div>

            <Field label="Tahun Ajaran" error={errors.tahun_ajaran?.message}>
              <select {...register('tahun_ajaran')} className={formSelectClass}>
                {tahunOptions.map((ta) => (
                  <option key={ta} value={ta}>{ta}</option>
                ))}
              </select>
            </Field>

            <div className="col-span-2">
              <Field label="Deskripsi" error={errors.deskripsi?.message}>
                <Textarea {...register('deskripsi')} placeholder="Deskripsi kurikulum (opsional)" />
              </Field>
            </div>
          </div>
        </CardContent>
        <Separator />
        <CardFooter className="justify-end gap-2">
          <Button type="button" variant="outline" size="lg" onClick={onCancel}>
            Batal
          </Button>
          <Button type="submit" size="lg" disabled={isLoading}>
            {isLoading ? 'Menyimpan...' : isEdit ? 'Simpan Perubahan' : 'Tambah Kurikulum'}
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}
