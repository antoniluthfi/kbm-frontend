import { z } from 'zod'

export const transaksiSchema = z.object({
  kelas_id:    z.number({ error: 'Kelas wajib dipilih' }).int().positive(),
  kategori_id: z.number({ error: 'Kategori wajib dipilih' }).int().positive(),
  murid_id:    z.number().int().positive().nullable().optional(),
  jumlah:      z.number({ error: 'Jumlah wajib diisi' }).positive('Jumlah harus lebih dari 0'),
  keterangan:  z.string().max(500).nullable().optional(),
  tanggal:     z.string().min(1, 'Tanggal wajib diisi'),
})

export const kasKategoriSchema = z.object({
  nama:  z.string().min(1, 'Nama wajib diisi').max(100),
  jenis: z.enum(['pemasukan', 'pengeluaran'], { error: 'Jenis wajib dipilih' }),
})

export type TransaksiFormData    = z.infer<typeof transaksiSchema>
export type KasKategoriFormData  = z.infer<typeof kasKategoriSchema>
