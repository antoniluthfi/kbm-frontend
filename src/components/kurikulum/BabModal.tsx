'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Modal } from '@/components/ui/modal'
import { Field } from '@/components/ui/field'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { babKurikulumSchema, BabKurikulumFormData } from '@/lib/schemas/kurikulum'
import { BabKurikulum } from '@/types/kurikulum'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  defaultValues?: BabKurikulum
  onSubmit: (data: BabKurikulumFormData) => void
  isLoading?: boolean
}

export function BabModal({ open, onOpenChange, defaultValues, onSubmit, isLoading }: Props) {
  const isEdit = !!defaultValues

  const { register, handleSubmit, reset, formState: { errors } } = useForm<BabKurikulumFormData>({
    resolver: zodResolver(babKurikulumSchema),
    defaultValues: { kode: defaultValues?.kode ?? '', nama: defaultValues?.nama ?? '' },
  })

  useEffect(() => {
    if (open) reset({ kode: defaultValues?.kode ?? '', nama: defaultValues?.nama ?? '' })
  }, [open, defaultValues])

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={isEdit ? 'Edit Bab' : 'Tambah Bab'}
      maxWidth="sm"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Field label="Kode" error={errors.kode?.message} hint="Contoh: I, II, III, IV">
          <Input {...register('kode')} placeholder="I" className="w-24" />
        </Field>
        <Field label="Nama Bab" error={errors.nama?.message}>
          <Input {...register('nama')} placeholder="Contoh: Ahlaqul Karimah" />
        </Field>
        <div className="flex justify-end gap-2 pt-1">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Batal</Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Menyimpan...' : isEdit ? 'Simpan' : 'Tambah'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
