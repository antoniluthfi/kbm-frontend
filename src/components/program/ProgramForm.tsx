'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { programSchema, ProgramFormData } from '@/lib/schemas/program'
import { JENIS_LABEL } from '@/types/program'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Field, formSelectClass } from '@/components/ui/field'

interface ProgramFormProps {
  defaultValues?: Partial<ProgramFormData>
  onSubmit: (data: ProgramFormData) => void
  onCancel?: () => void
  isLoading?: boolean
}

export default function ProgramForm({ defaultValues, onSubmit, onCancel, isLoading }: ProgramFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProgramFormData>({
    resolver: zodResolver(programSchema),
    defaultValues: { is_aktif: true, ...defaultValues },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card>
        <CardHeader>
          <CardTitle>Data Program</CardTitle>
        </CardHeader>
        <Separator />
        <CardContent className="pt-5">
          <div className="grid grid-cols-2 gap-x-6 gap-y-4">
            <div className="col-span-2">
              <Field label="Nama Program" error={errors.nama?.message}>
                <Input placeholder="Contoh: Pengajian Rutin, Persinas ASAD" {...register('nama')} />
              </Field>
            </div>

            <Field label="Jenis Program" error={errors.jenis?.message}>
              <select className={formSelectClass} {...register('jenis')}>
                <option value="">-- Pilih jenis --</option>
                {(Object.entries(JENIS_LABEL) as [string, string][]).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </Field>

            <Field label="Lokasi" error={errors.lokasi?.message}>
              <Input placeholder="Contoh: Aula Masjid, Halaman" {...register('lokasi')} />
            </Field>

            <Field label="Status">
              <div className="flex items-center gap-2.5 h-8">
                <input
                  type="checkbox"
                  id="is_aktif"
                  {...register('is_aktif')}
                  className="size-4 rounded border-input accent-primary"
                />
                <Label htmlFor="is_aktif" className="cursor-pointer font-normal">Program aktif</Label>
              </div>
            </Field>

            <div className="col-span-2">
              <Field label="Deskripsi" error={errors.deskripsi?.message}>
                <Textarea
                  placeholder="Deskripsi singkat program (opsional)"
                  {...register('deskripsi')}
                />
              </Field>
            </div>
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
            {isLoading ? 'Menyimpan...' : 'Simpan Program'}
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}
