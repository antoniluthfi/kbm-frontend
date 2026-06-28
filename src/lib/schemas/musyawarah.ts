import { z } from 'zod'

export const storeMusyawarahSchema = z.object({
  tanggal: z.string().min(1, 'Tanggal wajib diisi'),
  bulan: z.number({ error: 'Bulan wajib diisi' }).int().min(1).max(12),
  tahun: z.number({ error: 'Tahun wajib diisi' }).int().min(2020),
})

export const updateMusyawarahSchema = z.object({
  tanggal: z.string().optional(),
  catatan_umum: z.string().max(5000).optional().nullable(),
})

export const updateLaporanSchema = z.object({
  kendala_pengajar: z.string().max(5000).optional().nullable(),
  planning: z.string().max(5000).optional().nullable(),
  tindak_lanjut: z.string().max(5000).optional().nullable(),
})

export const notulensiSchema = z.object({
  kategori: z.enum(['usulan', 'keputusan', 'problem', 'lainnya']),
  isi: z.string().min(1, 'Isi wajib diisi').max(5000),
  penanggung_jawab: z.string().max(100).optional().nullable(),
  status_tindak_lanjut: z.enum(['open', 'selesai', 'ditunda']).optional(),
})

export type StoreMusyawarahData = z.infer<typeof storeMusyawarahSchema>
export type UpdateMusyawarahData = z.infer<typeof updateMusyawarahSchema>
export type UpdateLaporanData = z.infer<typeof updateLaporanSchema>
export type NotulensiData = z.infer<typeof notulensiSchema>
