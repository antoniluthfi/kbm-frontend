'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useChangePassword } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'

const schema = z.object({
  current_password: z.string().min(1, 'Wajib diisi'),
  password: z.string().min(8, 'Password baru minimal 8 karakter'),
  password_confirmation: z.string().min(1, 'Wajib diisi'),
}).refine((v) => v.password === v.password_confirmation, {
  message: 'Konfirmasi password tidak cocok',
  path: ['password_confirmation'],
})

type FormValues = z.infer<typeof schema>

export default function ChangePasswordForm() {
  const { mutate, isPending, isSuccess, error } = useChangePassword()

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  })

  const apiErrors = (error as any)?.response?.data?.errors as Record<string, string[]> | undefined

  const onSubmit = (values: FormValues) => {
    mutate(values, { onSuccess: () => reset() })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Password Saat Ini</label>
        <input
          {...register('current_password')}
          type="password"
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
        {errors.current_password && <p className="mt-1 text-xs text-red-500">{errors.current_password.message}</p>}
        {apiErrors?.current_password?.map((msg) => (
          <p key={msg} className="mt-1 text-xs text-red-500">{msg}</p>
        ))}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Password Baru</label>
        <input
          {...register('password')}
          type="password"
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
        {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Konfirmasi Password Baru</label>
        <input
          {...register('password_confirmation')}
          type="password"
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
        {errors.password_confirmation && (
          <p className="mt-1 text-xs text-red-500">{errors.password_confirmation.message}</p>
        )}
      </div>

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={isPending}>
          {isPending ? 'Menyimpan...' : 'Ganti Password'}
        </Button>
        {isSuccess && <span className="text-sm text-green-600">Password berhasil diubah</span>}
      </div>
    </form>
  )
}
