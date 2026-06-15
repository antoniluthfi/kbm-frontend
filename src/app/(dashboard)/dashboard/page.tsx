'use client'

import { useAuthStore } from '@/stores/useAuthStore'

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user)

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-foreground">Dashboard</h1>
      {user && (
        <p className="mt-2 text-muted-foreground">
          Selamat datang, <span className="font-medium text-foreground">{user.name}</span>
        </p>
      )}
    </div>
  )
}
