'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { useKasKategori, useCreateKasKategori, useUpdateKasKategori, useDeleteKasKategori } from '@/hooks/useKas'
import { KasKategori } from '@/types/kas'
import { KasKategoriFormData } from '@/lib/schemas/kas'
import { KategoriModal } from '@/components/kas/KategoriModal'
import { DeleteDialog } from '@/components/ui/delete-dialog'
import { Button } from '@/components/ui/button'
import { PageLoading } from '@/components/ui/page-loading'
import { cn } from '@/lib/utils'
import { Tags, Plus, Pencil, Trash2 } from 'lucide-react'

export default function KasKategoriPage() {
  const [modalTambah, setModalTambah] = useState(false)
  const [editTarget, setEditTarget]   = useState<KasKategori | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<KasKategori | null>(null)

  const { data: kategori = [], isLoading } = useKasKategori()
  const { mutate: create, isPending: isCreating } = useCreateKasKategori()
  const { mutate: hapus,  isPending: isHapus }    = useDeleteKasKategori()

  const handleCreate = (data: KasKategoriFormData) => {
    create(data, {
      onSuccess: () => { toast.success('Kategori berhasil ditambah'); setModalTambah(false) },
      onError: () => toast.error('Gagal menambah kategori'),
    })
  }

  const handleHapus = () => {
    if (!deleteTarget) return
    hapus(deleteTarget.id, {
      onSuccess: () => { toast.success('Kategori berhasil dihapus'); setDeleteTarget(null) },
      onError: (e: any) => {
        toast.error(e?.response?.data?.message ?? 'Gagal menghapus kategori')
        setDeleteTarget(null)
      },
    })
  }

  const pemasukan   = kategori.filter((k) => k.jenis === 'pemasukan')
  const pengeluaran = kategori.filter((k) => k.jenis === 'pengeluaran')

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Tags className="size-5 text-primary" />
          <h1 className="text-xl font-semibold">Kategori Kas</h1>
        </div>
        <Button size="sm" onClick={() => setModalTambah(true)}>
          <Plus className="size-3.5 mr-1" />
          Tambah Kategori
        </Button>
      </div>

      {isLoading ? (
        <PageLoading />
      ) : (
        <div className="grid grid-cols-2 gap-6">
          {/* Pemasukan */}
          <KategoriSection
            title="Pemasukan"
            items={pemasukan}
            onEdit={setEditTarget}
            onDelete={setDeleteTarget}
          />
          {/* Pengeluaran */}
          <KategoriSection
            title="Pengeluaran"
            items={pengeluaran}
            onEdit={setEditTarget}
            onDelete={setDeleteTarget}
          />
        </div>
      )}

      {/* Modal Tambah */}
      <KategoriModal
        open={modalTambah}
        onOpenChange={setModalTambah}
        onSubmit={handleCreate}
        isLoading={isCreating}
      />

      {/* Modal Edit */}
      {editTarget && (
        <EditKategoriModal
          kategori={editTarget}
          onClose={() => setEditTarget(null)}
        />
      )}

      {/* Delete Dialog */}
      <DeleteDialog
        open={!!deleteTarget}
        onOpenChange={(v) => { if (!v) setDeleteTarget(null) }}
        title={`Hapus kategori "${deleteTarget?.nama}"?`}
        description="Kategori yang sudah digunakan dalam transaksi tidak bisa dihapus."
        onConfirm={handleHapus}
        isLoading={isHapus}
      />
    </div>
  )
}

function KategoriSection({
  title,
  items,
  onEdit,
  onDelete,
}: {
  title: string
  items: KasKategori[]
  onEdit: (k: KasKategori) => void
  onDelete: (k: KasKategori) => void
}) {
  const isGreen = title === 'Pemasukan'
  return (
    <div className="space-y-3">
      <h2 className={cn(
        'text-sm font-semibold',
        isGreen ? 'text-green-700' : 'text-red-700'
      )}>
        {title}
      </h2>
      <div className="rounded-xl border border-border overflow-hidden">
        {items.length === 0 ? (
          <p className="px-4 py-6 text-sm text-center text-muted-foreground">Belum ada kategori.</p>
        ) : (
          items.map((k, i) => (
            <div
              key={k.id}
              className={cn(
                'flex items-center justify-between px-4 py-3 text-sm',
                i > 0 && 'border-t border-border',
                !k.is_aktif && 'opacity-50'
              )}
            >
              <span className={cn(!k.is_aktif && 'line-through text-muted-foreground')}>
                {k.nama}
              </span>
              <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon-sm" onClick={() => onEdit(k)}>
                  <Pencil className="size-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="text-destructive hover:bg-destructive/10"
                  onClick={() => onDelete(k)}
                >
                  <Trash2 className="size-3.5" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

function EditKategoriModal({ kategori, onClose }: { kategori: KasKategori; onClose: () => void }) {
  const { mutate: update, isPending } = useUpdateKasKategori(kategori.id)

  const handleSubmit = (data: KasKategoriFormData) => {
    update(data, {
      onSuccess: () => { toast.success('Kategori berhasil diperbarui'); onClose() },
      onError: () => toast.error('Gagal memperbarui kategori'),
    })
  }

  return (
    <KategoriModal
      open
      onOpenChange={(v) => { if (!v) onClose() }}
      defaultValues={kategori}
      onSubmit={handleSubmit}
      isLoading={isPending}
    />
  )
}
