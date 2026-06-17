'use client'

import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { kasKategoriSchema, KasKategoriFormData } from '@/lib/schemas/kas'
import { KasKategori } from '@/types/kas'
import { Modal } from '@/components/ui/modal'
import { Field, formSelectClass } from '@/components/ui/field'
import { Button } from '@/components/ui/button'
import { inputClass } from '@/lib/utils'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  defaultValues?: KasKategori
  onSubmit: (data: KasKategoriFormData) => void
  isLoading?: boolean
}

export function KategoriModal({ open, onOpenChange, defaultValues, onSubmit, isLoading }: Props) {
  const isEdit = !!defaultValues

  const { register, handleSubmit, reset, formState: { errors } } = useForm<KasKategoriFormData>({
    resolver: zodResolver(kasKategoriSchema),
    defaultValues: { nama: '', jenis: 'pemasukan' },
  })

  useEffect(() => {
    if (open) {
      reset(defaultValues ? { nama: defaultValues.nama, jenis: defaultValues.jenis } : { nama: '', jenis: 'pemasukan' })
    }
  }, [open, defaultValues, reset])

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={isEdit ? 'Edit Kategori' : 'Tambah Kategori'}
      maxWidth="sm"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Field label="Nama Kategori" error={errors.nama?.message}>
          <input
            type="text"
            placeholder="mis. Kas Mingguan"
            {...register('nama')}
            className={inputClass}
          />
        </Field>

        <Field label="Jenis" error={errors.jenis?.message}>
          <select {...register('jenis')} className={formSelectClass}>
            <option value="pemasukan">Pemasukan</option>
            <option value="pengeluaran">Pengeluaran</option>
          </select>
        </Field>

        <div className="flex justify-end gap-2 pt-1">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Batal
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Menyimpan...' : isEdit ? 'Simpan' : 'Tambah'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
