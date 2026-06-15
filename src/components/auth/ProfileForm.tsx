'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useEffect } from 'react'
import { User } from '@/types/user'
import { useUpdateProfile } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'

const schema = z.object({
  name: z.string().min(1, 'Nama wajib diisi'),
  phone: z.string().optional(),
})

type FormValues = z.infer<typeof schema>

export default function ProfileForm({ user }: { user: User }) {
  const { mutate, isPending, isSuccess, error } = useUpdateProfile()

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: user.name, phone: user.phone ?? '' },
  })

  useEffect(() => {
    reset({ name: user.name, phone: user.phone ?? '' })
  }, [user, reset])

  const apiErrors = (error as any)?.response?.data?.errors as Record<string, string[]> | undefined

  return (
    <form onSubmit={handleSubmit((v) => mutate(v))} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Nama</label>
        <input
          {...register('name')}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
        {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Nomor HP</label>
        <input
          {...register('phone')}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
        {apiErrors?.phone?.map((msg) => (
          <p key={msg} className="mt-1 text-xs text-red-500">{msg}</p>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={isPending}>
          {isPending ? 'Menyimpan...' : 'Simpan'}
        </Button>
        {isSuccess && <span className="text-sm text-green-600">Tersimpan</span>}
      </div>
    </form>
  )
}
