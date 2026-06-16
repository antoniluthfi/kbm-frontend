'use client'

import { Jadwal, JadwalMingguIni, HARI_LABEL, HARI_ORDER } from '@/types/jadwal'
import { JENIS_COLOR } from '@/types/program'
import { cn } from '@/lib/utils'
import { Pencil, Trash2 } from 'lucide-react'

interface JadwalKalenderMingguProps {
  data: JadwalMingguIni
  onDelete?: (jadwal: Jadwal) => void
  onEdit?: (jadwal: Jadwal) => void
  isSuperAdmin?: boolean
}

export function JadwalKalenderMinggu({ data, onDelete, onEdit, isSuperAdmin }: JadwalKalenderMingguProps) {
  return (
    <div className="grid grid-cols-7 gap-2 min-w-225">
      {HARI_ORDER.map((hari) => {
        const jadwals = data[hari] ?? []
        return (
          <div key={hari} className="flex flex-col gap-2">
            <div className={cn(
              'text-center text-xs font-semibold py-2 rounded-lg',
              jadwals.length > 0 ? 'bg-primary/10 text-primary' : 'bg-muted/60 text-muted-foreground'
            )}>
              {HARI_LABEL[hari]}
            </div>

            <div className="flex flex-col gap-1.5 min-h-24">
              {jadwals.length === 0 ? (
                <div className="flex-1 rounded-lg border border-dashed border-border flex items-center justify-center">
                  <span className="text-[10px] text-muted-foreground">–</span>
                </div>
              ) : (
                jadwals.map((j) => (
                  <div
                    key={j.id}
                    className="group relative rounded-lg border border-border bg-card p-2 text-xs space-y-0.5 hover:shadow-sm transition-shadow"
                  >
                    <p className="font-semibold leading-tight truncate pr-4">{j.program?.nama ?? '-'}</p>
                    <p className="text-muted-foreground">{j.jam_mulai.slice(0, 5)} – {j.jam_selesai.slice(0, 5)}</p>
                    {j.kelas && (
                      <span className="inline-block bg-muted text-muted-foreground px-1.5 py-0.5 rounded text-[10px] truncate max-w-full">
                        {j.kelas.nama}
                      </span>
                    )}
                    {j.program && (
                      <div className={cn(
                        'absolute top-1.5 right-1.5 size-1.5 rounded-full',
                        JENIS_COLOR[j.program.jenis]?.split(' ')[0] ?? 'bg-muted'
                      )} />
                    )}
                    {isSuperAdmin && (
                      <div className="absolute top-0.5 right-0.5 hidden group-hover:flex items-center gap-0.5 bg-card/90 rounded p-0.5">
                        {onEdit && (
                          <button
                            onClick={() => onEdit(j)}
                            className="p-1 rounded text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                            title="Ganti jadwal"
                          >
                            <Pencil className="size-2.5" />
                          </button>
                        )}
                        {onDelete && (
                          <button
                            onClick={() => onDelete(j)}
                            className="p-1 rounded text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                            title="Hapus jadwal"
                          >
                            <Trash2 className="size-2.5" />
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
