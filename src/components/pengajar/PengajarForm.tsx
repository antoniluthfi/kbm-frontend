'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { pengajarSchema, PengajarFormData } from '@/lib/schemas/pengajar'
import { User } from '@/types/user'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Field, formSelectClass } from '@/components/ui/field'
import { UserAutocomplete } from '@/components/users/UserAutocomplete'
import { TODAY } from '@/lib/utils'

interface PengajarFormProps {
  defaultValues?: Partial<PengajarFormData>
  defaultUser?: User
  onSubmit: (data: PengajarFormData) => void
  onCancel?: () => void
  isLoading?: boolean
}

export default function PengajarForm({ defaultValues, defaultUser, onSubmit, onCancel, isLoading }: PengajarFormProps) {
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<PengajarFormData>({
    resolver: zodResolver(pengajarSchema),
    defaultValues: { is_aktif: true, jenis_kelamin: 'L' as const, ...defaultValues },
  })

  const selectedUserId = watch('user_id')

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Card>
        <CardHeader>
          <CardTitle>Data Pengajar</CardTitle>
        </CardHeader>
        <Separator />
        <CardContent className="pt-5">
          <div className="grid grid-cols-2 gap-x-6 gap-y-4">
            <div className="col-span-2">
              <Field
                label="Akun User"
                error={errors.user_id?.message}
                hint="Hanya menampilkan user dengan role 'Pengajar'"
              >
                <input type="hidden" {...register('user_id', { valueAsNumber: true })} />
                <UserAutocomplete
                  role="pengajar"
                  onSelect={(user) => setValue('user_id', user.id, { shouldValidate: true })}
                  selectedId={selectedUserId}
                  defaultUser={defaultUser}
                  error={errors.user_id?.message}
                  placeholder="Ketik nama user untuk mencari..."
                />
              </Field>
            </div>

            <Field label="Jenis Kelamin" error={errors.jenis_kelamin?.message}>
              <select {...register('jenis_kelamin')} className={formSelectClass}>
                <option value="L">Laki-laki</option>
                <option value="P">Perempuan</option>
              </select>
            </Field>

            <Field label="Status">
              <div className="flex items-center gap-2.5 h-8">
                <input
                  type="checkbox"
                  id="is_aktif"
                  {...register('is_aktif')}
                  className="size-4 rounded border-input accent-primary"
                />
                <Label htmlFor="is_aktif" className="cursor-pointer font-normal">Aktif mengajar</Label>
              </div>
            </Field>

            <Field label="Tanggal Lahir" error={errors.tanggal_lahir?.message}>
              <Input type="date" max={TODAY} {...register('tanggal_lahir')} />
            </Field>

            <Field label="Tanggal Bergabung" error={errors.tanggal_bergabung?.message}>
              <Input type="date" max={TODAY} {...register('tanggal_bergabung')} />
            </Field>

            <div className="col-span-2">
              <Field label="Pendidikan Terakhir" error={errors.pendidikan_terakhir?.message}>
                <Input
                  placeholder="Contoh: S1 Pendidikan Agama Islam"
                  {...register('pendidikan_terakhir')}
                />
              </Field>
            </div>

            <div className="col-span-2">
              <Field label="Alamat" error={errors.alamat?.message}>
                <Textarea
                  placeholder="Alamat lengkap pengajar"
                  {...register('alamat')}
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
            {isLoading ? 'Menyimpan...' : 'Simpan Pengajar'}
          </Button>
        </CardFooter>
      </Card>
    </form>
  )
}
