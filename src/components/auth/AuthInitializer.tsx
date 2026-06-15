'use client'

import { useMe } from '@/hooks/useAuth'

export default function AuthInitializer() {
  useMe()
  return null
}
