import { z } from 'zod'

export const programSchema = z.object({
  nama: z.string().min(2, 'Nama minimal 2 karakter').max(150),
  jenis: z.enum(
    ['pengajian_rutin', 'persinas_asad', 'keakraban', 'kemandirian', 'tahfidz', 'amal_sholih'],
    { error: 'Jenis program wajib dipilih' },
  ),
  deskripsi: z.string().optional(),
  lokasi: z.string().optional(),
  is_aktif: z.boolean(),
})

export type ProgramFormData = z.infer<typeof programSchema>
