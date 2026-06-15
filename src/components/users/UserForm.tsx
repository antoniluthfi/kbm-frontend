'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useEffect } from 'react'
import { User, UserRole } from '@/types/user'
import { useCreateUser, useUpdateUser } from '@/hooks/useUsers'
import { Button } from '@/components/ui/button'

const ROLE_LABELS: Record<UserRole, string> = {
  super_admin: 'Super Admin',
  pengajar: 'Pengajar',
  murid: 'Murid',
  wali_murid: 'Wali Murid',
}

const createSchema = z.object({
  name: z.string().min(1, 'Wajib diisi'),
  email: z.string().email('Email tidak valid'),
  phone: z.string().optional(),
  password: z.string().min(8, 'Minimal 8 karakter'),
  role: z.enum(['super_admin', 'pengajar', 'murid', 'wali_murid']),
})

const editSchema = createSchema.omit({ password: true })

type CreateValues = z.infer<typeof createSchema>
type EditValues = z.infer<typeof editSchema>

interface Props {
  user?: User
  onSuccess: () => void
}

export default function UserForm({ user, onSuccess }: Props) {
  const isEdit = !!user
  const { mutate: create, isPending: creating, error: createError } = useCreateUser()
  const { mutate: update, isPending: updating, error: updateError } = useUpdateUser(user?.id ?? 0)

  const isPending = creating || updating
  const error = createError || updateError
  const apiErrors = (error as any)?.response?.data?.errors as Record<string, string[]> | undefined

  const { register, handleSubmit, reset, formState: { errors } } = useForm<CreateValues>({
    resolver: zodResolver(isEdit ? (editSchema as any) : createSchema),
    defaultValues: user
      ? { name: user.name, email: user.email, phone: user.phone ?? '', role: user.role }
      : { role: 'murid' },
  })

  useEffect(() => {
    if (user) reset({ name: user.name, email: user.email, phone: user.phone ?? '', role: user.role })
  }, [user, reset])

  const onSubmit = (values: CreateValues) => {
    if (isEdit) {
      update(values as EditValues, { onSuccess })
    } else {
      create(values, { onSuccess })
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Nama</label>
        <input {...register('name')} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
        {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <input {...register('email')} type="email" className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
        {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
        {apiErrors?.email?.map((msg) => <p key={msg} className="mt-1 text-xs text-red-500">{msg}</p>)}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Nomor HP</label>
        <input {...register('phone')} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
      </div>

      {!isEdit && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input {...register('password')} type="password" className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary" />
          {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
        <select {...register('role')} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary">
          {Object.entries(ROLE_LABELS).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
        {errors.role && <p className="mt-1 text-xs text-red-500">{errors.role.message}</p>}
      </div>

      <Button type="submit" disabled={isPending} className="w-full">
        {isPending ? 'Menyimpan...' : isEdit ? 'Simpan Perubahan' : 'Tambah Pengguna'}
      </Button>
    </form>
  )
}
