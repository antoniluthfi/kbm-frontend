'use client'

import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { Modal } from '@/components/ui/modal'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Field, formSelectClass } from '@/components/ui/field'
import { NotulensiMusyawarah, KategoriNotulensi } from '@/types/musyawarah'
import { useStoreNotulensi, useUpdateNotulensi } from '@/hooks/useMusyawarah'
import { cn } from '@/lib/utils'

const KATEGORI_LABEL: Record<KategoriNotulensi, string> = {
  usulan:    'Usulan',
  keputusan: 'Keputusan',
  problem:   'Problem',
  lainnya:   'Lainnya',
}

interface Props {
  musyawarahId: number
  open: boolean
  onClose: () => void
  editing?: NotulensiMusyawarah | null
}

const emptyForm = () => ({ kategori: 'usulan' as KategoriNotulensi, isi: '', penanggung_jawab: '' })

export function NotulensiForm({ musyawarahId, open, onClose, editing }: Props) {
  const [form, setForm] = useState(emptyForm())

  useEffect(() => {
    setForm(editing
      ? { kategori: editing.kategori, isi: editing.isi, penanggung_jawab: editing.penanggung_jawab ?? '' }
      : emptyForm()
    )
  }, [editing, open])

  const { mutate: storeNotulensi, isPending: isStoring }   = useStoreNotulensi(musyawarahId)
  const { mutate: updateNotulensi, isPending: isUpdating } = useUpdateNotulensi(musyawarahId)
  const isPending = isStoring || isUpdating

  const handleSubmit = () => {
    if (!form.isi.trim()) {
      toast.error('Isi notulensi wajib diisi')
      return
    }

    const payload = {
      ...form,
      penanggung_jawab: form.penanggung_jawab.trim() || null,
    }

    if (editing) {
      updateNotulensi(
        { notulensiId: editing.id, ...payload },
        {
          onSuccess: () => { toast.success('Notulensi diperbarui'); onClose() },
          onError:   () => toast.error('Gagal memperbarui notulensi'),
        }
      )
    } else {
      storeNotulensi(payload, {
        onSuccess: () => { toast.success('Notulensi ditambahkan'); setForm(emptyForm()); onClose() },
        onError:   () => toast.error('Gagal menambah notulensi'),
      })
    }
  }

  return (
    <Modal
      open={open}
      onOpenChange={(o) => !o && onClose()}
      title={editing ? 'Edit Notulensi' : 'Tambah Notulensi'}
    >
      <div className="space-y-4">
        <Field label="Kategori">
          <select
            value={form.kategori}
            onChange={(e) => setForm({ ...form, kategori: e.target.value as KategoriNotulensi })}
            className={cn(formSelectClass, 'w-full')}
          >
            {(Object.keys(KATEGORI_LABEL) as KategoriNotulensi[]).map((k) => (
              <option key={k} value={k}>{KATEGORI_LABEL[k]}</option>
            ))}
          </select>
        </Field>

        <Field label="Isi">
          <Textarea
            value={form.isi}
            onChange={(e) => setForm({ ...form, isi: e.target.value })}
            placeholder="Tuliskan poin notulensi..."
            className="min-h-24 resize-none"
          />
        </Field>

        <Field label="Penanggung Jawab" hint="Opsional">
          <Input
            value={form.penanggung_jawab}
            onChange={(e) => setForm({ ...form, penanggung_jawab: e.target.value })}
            placeholder="Nama atau jabatan (opsional)"
          />
        </Field>

        <div className="flex justify-end gap-2 pt-1">
          <Button variant="ghost" onClick={onClose} disabled={isPending}>Batal</Button>
          <Button onClick={handleSubmit} disabled={isPending}>
            {isPending ? 'Menyimpan...' : editing ? 'Simpan Perubahan' : 'Tambah'}
          </Button>
        </div>
      </div>
    </Modal>
  )
}
