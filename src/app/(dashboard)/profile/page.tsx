'use client'

import { useMe } from '@/hooks/useAuth'
import ProfileForm from '@/components/auth/ProfileForm'
import ChangePasswordForm from '@/components/auth/ChangePasswordForm'
import AvatarUpload from '@/components/auth/AvatarUpload'

export default function ProfilePage() {
  const { data: user, isLoading } = useMe()

  if (isLoading) return <div className="text-sm text-gray-500">Memuat...</div>
  if (!user) return null

  return (
    <div className="max-w-2xl space-y-8">
      <h1 className="text-2xl font-bold text-gray-900">Profil Saya</h1>

      <section className="bg-white rounded-xl border border-gray-100 p-6 space-y-6">
        <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Foto Profil</h2>
        <AvatarUpload user={user} />
      </section>

      <section className="bg-white rounded-xl border border-gray-100 p-6 space-y-4">
        <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Informasi Akun</h2>
        <ProfileForm user={user} />
      </section>

      <section className="bg-white rounded-xl border border-gray-100 p-6 space-y-4">
        <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">Ganti Password</h2>
        <ChangePasswordForm />
      </section>
    </div>
  )
}
