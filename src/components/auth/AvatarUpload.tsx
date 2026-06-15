'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { useUploadAvatar } from '@/hooks/useAuth'
import { User } from '@/types/user'

export default function AvatarUpload({ user }: { user: User }) {
  const { mutate, isPending } = useUploadAvatar()
  const inputRef = useRef<HTMLInputElement>(null)

  const avatarUrl = user.avatar
    ? `${process.env.NEXT_PUBLIC_API_URL}/storage/${user.avatar}`
    : null

  return (
    <div className="flex items-center gap-4">
      <div className="relative w-20 h-20 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
        {avatarUrl ? (
          <Image src={avatarUrl} alt={user.name} fill className="object-cover" />
        ) : (
          <span className="text-2xl font-bold text-gray-400">
            {user.name.charAt(0).toUpperCase()}
          </span>
        )}
      </div>
      <div>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) mutate(file)
          }}
        />
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={isPending}
          className="text-sm font-medium text-primary hover:underline disabled:opacity-50"
        >
          {isPending ? 'Mengunggah...' : 'Ganti foto'}
        </button>
        <p className="text-xs text-gray-500 mt-0.5">JPG, PNG. Maks 2MB.</p>
      </div>
    </div>
  )
}
