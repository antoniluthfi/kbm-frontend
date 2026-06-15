'use client'

import { useAuthStore } from '@/stores/useAuthStore'

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user)

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
      {user && (
        <p className="mt-2 text-gray-600">
          Selamat datang, <span className="font-medium">{user.name}</span>
        </p>
      )}
    </div>
  )
}
