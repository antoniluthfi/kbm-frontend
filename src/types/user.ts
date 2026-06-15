export type UserRole = 'super_admin' | 'pengajar' | 'murid' | 'wali_murid'

export interface User {
  id: number
  name: string
  email: string
  phone: string | null
  role: UserRole
  avatar: string | null
  is_active: boolean
  email_verified_at: string | null
  created_at: string
  updated_at: string
}
