'use client'

import { useToggleUserActive } from '@/hooks/useUsers'
import { User } from '@/types/user'

export default function UserStatusToggle({ user }: { user: User }) {
  const { mutate, isPending } = useToggleUserActive()

  return (
    <button
      onClick={() => mutate(user.id)}
      disabled={isPending}
      className={`text-xs font-medium px-2 py-0.5 rounded-full transition-colors ${
        user.is_active
          ? 'bg-green-100 text-green-700 hover:bg-green-200'
          : 'bg-red-100 text-red-700 hover:bg-red-200'
      }`}
    >
      {user.is_active ? 'Aktif' : 'Nonaktif'}
    </button>
  )
}
