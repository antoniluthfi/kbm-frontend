'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Plus, Pencil, Trash2, CheckCircle, Clock, PauseCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DeleteDialog } from '@/components/ui/delete-dialog'
import { NotulensiMusyawarah, KategoriNotulensi, StatusTindakLanjut } from '@/types/musyawarah'
import { NotulensiForm } from './NotulensiForm'
import { useDeleteNotulensi, useUpdateNotulensi } from '@/hooks/useMusyawarah'
import { cn } from '@/lib/utils'

const KATEGORI_LABEL: Record<KategoriNotulensi, string> = {
  usulan:    'Usulan',
  keputusan: 'Keputusan',
  problem:   'Problem',
  lainnya:   'Lainnya',
}

const KATEGORI_COLOR: Record<KategoriNotulensi, string> = {
  usulan:    'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300',
  keputusan: 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300',
  problem:   'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300',
  lainnya:   'bg-muted text-muted-foreground',
}

const STATUS_CONFIG: Record<StatusTindakLanjut, { label: string; icon: typeof CheckCircle; class: string }> = {
  open:    { label: 'Open',    icon: Clock,        class: 'text-amber-600' },
  selesai: { label: 'Selesai', icon: CheckCircle,  class: 'text-green-600' },
  ditunda: { label: 'Ditunda', icon: PauseCircle,  class: 'text-muted-foreground' },
}

const STATUS_CYCLE: StatusTindakLanjut[] = ['open', 'selesai', 'ditunda']

interface Props {
  musyawarahId: number
  notulensi: NotulensiMusyawarah[]
  isSelesai: boolean
}

export function NotulensiList({ musyawarahId, notulensi, isSelesai }: Props) {
  const [formOpen, setFormOpen]     = useState(false)
  const [editing, setEditing]       = useState<NotulensiMusyawarah | null>(null)
  const [deleting, setDeleting]     = useState<NotulensiMusyawarah | null>(null)

  const { mutate: deleteNotulensi, isPending: isDeleting } = useDeleteNotulensi(musyawarahId)
  const { mutate: updateNotulensi }                        = useUpdateNotulensi(musyawarahId)

  const handleDelete = () => {
    if (!deleting) return
    deleteNotulensi(deleting.id, {
      onSuccess: () => { toast.success('Notulensi dihapus'); setDeleting(null) },
      onError:   () => toast.error('Gagal menghapus notulensi'),
    })
  }

  const cycleStatus = (n: NotulensiMusyawarah) => {
    const next = STATUS_CYCLE[(STATUS_CYCLE.indexOf(n.status_tindak_lanjut) + 1) % STATUS_CYCLE.length]
    updateNotulensi(
      { notulensiId: n.id, kategori: n.kategori, isi: n.isi, penanggung_jawab: n.penanggung_jawab, status_tindak_lanjut: next },
      { onError: () => toast.error('Gagal memperbarui status') }
    )
  }

  return (
    <div className="space-y-3">
      {!isSelesai && (
        <div className="flex justify-end">
          <Button size="sm" onClick={() => { setEditing(null); setFormOpen(true) }}>
            <Plus className="size-3.5" />
            Tambah Notulensi
          </Button>
        </div>
      )}

      {notulensi.length === 0 ? (
        <div className="py-16 text-center text-sm text-muted-foreground">
          Belum ada notulensi. Tambahkan poin diskusi, keputusan, atau usulan dari rapat.
        </div>
      ) : (
        <div className="space-y-2">
          {notulensi.map((n) => {
            const StatusIcon = STATUS_CONFIG[n.status_tindak_lanjut].icon
            return (
              <div key={n.id} className="rounded-xl border border-border bg-card px-4 py-3 flex items-start gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className={cn('text-[11px] font-semibold px-2 py-0.5 rounded-full', KATEGORI_COLOR[n.kategori])}>
                      {KATEGORI_LABEL[n.kategori]}
                    </span>
                    {n.penanggung_jawab && (
                      <span className="text-xs text-muted-foreground">PJ: {n.penanggung_jawab}</span>
                    )}
                  </div>
                  <p className="text-sm whitespace-pre-wrap leading-relaxed">{n.isi}</p>
                </div>

                <div className="flex items-center gap-1 shrink-0 mt-0.5">
                  <button
                    onClick={() => cycleStatus(n)}
                    title={`Status: ${STATUS_CONFIG[n.status_tindak_lanjut].label} — klik untuk ubah`}
                    className={cn('flex items-center gap-1 text-[11px] font-medium px-2 py-1 rounded-lg hover:bg-muted transition-colors', STATUS_CONFIG[n.status_tindak_lanjut].class)}
                  >
                    <StatusIcon className="size-3.5" />
                    {STATUS_CONFIG[n.status_tindak_lanjut].label}
                  </button>

                  {!isSelesai && (
                    <>
                      <button
                        onClick={() => { setEditing(n); setFormOpen(true) }}
                        className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                      >
                        <Pencil className="size-3.5" />
                      </button>
                      <button
                        onClick={() => setDeleting(n)}
                        className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-muted transition-colors"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      <NotulensiForm
        musyawarahId={musyawarahId}
        open={formOpen}
        onClose={() => { setFormOpen(false); setEditing(null) }}
        editing={editing}
      />

      <DeleteDialog
        open={!!deleting}
        onOpenChange={(o) => !o && setDeleting(null)}
        onConfirm={handleDelete}
        isLoading={isDeleting}
        title="Hapus notulensi ini?"
        description={`"${deleting?.isi.slice(0, 80)}${(deleting?.isi.length ?? 0) > 80 ? '...' : ''}"`}
      />
    </div>
  )
}
