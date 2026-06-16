'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { jadwalSchema, JadwalFormData } from '@/lib/schemas/jadwal'
import { HARI_LABEL, HARI_ORDER } from '@/types/jadwal'
import { useProgramList } from '@/hooks/useProgram'
import { useKelasList } from '@/hooks/useKelas'
import { usePengajarList } from '@/hooks/usePengajar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Field, formSelectClass } from '@/components/ui/field'

interface JadwalFormProps {
  defaultValues?: Partial<JadwalFormData>
  onSubmit: (data: JadwalFormData) => void
  onCancel?: () => void
  isLoading?: boolean
  title?: string
}

export default function JadwalForm({
  defaultValues,
  onSubmit,
  onCancel,
  isLoading,
  title = 'Data Jadwal',
}: JadwalFormProps) {
  const today = new Date().toISOString().slice(0, 10)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<JadwalFormData>({
    resolver: zodResolver(jadwalSchema),
    defaultValues: {
      mulai_berlaku: new Date().toISOString().slice(0, 10),
      ...defaultValues,
    },
  })

  const mulaiValue = watch('mulai_berlaku')

  const { data: programData } = useProgramList({ is_aktif: true })
  const { data: kelasData } = useKelasList({ is_aktif: true })
  const { data: pengajarData } = usePengajarList({ is_aktif: true })

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <Separator />
        <CardContent className="pt-5">
          <div className="grid grid-cols-2 gap-x-6 gap-y-4">
            <div className="col-span-2">
              <Field label="Program" error={errors.program_id?.message}>
                <select
                  className={formSelectClass}
                  {...register('program_id', { valueAsNumber: true })}
                >
                  <option value="">-- Pilih program --</option>
                  {programData?.data.map((p) => (
                    <option key={p.id} value={p.id}>{p.nama}</option>
                  ))}
                </select>
              </Field>
            </div>

            <Field label="Kelas" error={errors.kelas_id?.message}>
              <select
                className={formSelectClass}
                {...register('kelas_id', { setValueAs: (v) => v === '' ? null : Number(v) })}
              >
                <option value="">Semua kelas</option>
                {kelasData?.data.map((k) => (
                  <option key={k.id} value={k.id}>{k.nama}</option>
                ))}
              </select>
            </Field>

            <Field label="Pengajar" error={errors.pengajar_id?.message}>
              <select
                className={formSelectClass}
                {...register('pengajar_id', { setValueAs: (v) => v === '' ? null : Number(v) })}
              >
                <option value="">Tidak ditentukan</option>
                {pengajarData?.data.map((p) => (
                  <option key={p.id} value={p.id}>{p.user?.name}</option>
                ))}
              </select>
            </Field>

            <Field label="Hari" error={errors.hari?.message}>
              <select className={formSelectClass} {...register('hari')}>
                <option value="">-- Pilih hari --</option>
                {HARI_ORDER.map((h) => (
                  <option key={h} value={h}>{HARI_LABEL[h]}</option>
                ))}
              </select>
            </Field>

            <div />

            <Field label="Jam Mulai" error={errors.jam_mulai?.message}>
              <Input type="time" {...register('jam_mulai')} />
            </Field>

            <Field label="Jam Selesai" error={errors.jam_selesai?.message}>
              <Input type="time" {...register('jam_selesai')} />
            </Field>

            <Field label="Mulai Berlaku" error={errors.mulai_berlaku?.message}>
              <Input type="date" min={today} {...register('mulai_berlaku')} />
            </Field>

            <Field label="Selesai Berlaku" error={errors.selesai_berlaku?.message} hint="Kosongkan jika masih berlaku">
              <Input
                type="date"
                min={mulaiValue || today}
                {...register('selesai_berlaku', { setValueAs: (v) => v === '' ? null : v })}
              />
            </Field>
          </div>
        </CardContent>
        <Separator />
        <CardFooter className="justify-end gap-2">
          {onCancel && (
            <Button type="button" variant="outline" size="lg" onClick={onCancel}>
              Batal
            </Button>
          )}
          <Button type="submit" size="lg" disabled={isLoading}>
            {isLoading ? 'Menyimpan...' : 'Simpan Jadwal'}
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}
