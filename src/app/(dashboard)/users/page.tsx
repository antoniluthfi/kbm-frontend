'use client'

import { useState } from 'react'
import { useUsers, useDeleteUser } from '@/hooks/useUsers'
import { useAuthStore } from '@/stores/useAuthStore'
import { User, UserRole } from '@/types/user'
import UserForm from '@/components/users/UserForm'
import UserStatusToggle from '@/components/users/UserStatusToggle'
import { Button } from '@/components/ui/button'
import { Pencil, Trash2, Plus } from 'lucide-react'

const ROLE_LABELS: Record<UserRole, string> = {
  super_admin: 'Super Admin',
  pengajar: 'Pengajar',
  murid: 'Murid',
  wali_murid: 'Wali Murid',
}

export default function UsersPage() {
  const currentUser = useAuthStore((s) => s.user)
  const [roleFilter, setRoleFilter] = useState<UserRole | ''>('')
  const [page, setPage] = useState(1)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [showForm, setShowForm] = useState(false)

  const { data, isLoading } = useUsers({
    role: roleFilter || undefined,
    page,
  })

  const { mutate: deleteUser } = useDeleteUser()

  if (currentUser?.role !== 'super_admin') {
    return <p className="text-sm text-gray-500">Akses ditolak.</p>
  }

  const openCreate = () => { setSelectedUser(null); setShowForm(true) }
  const openEdit = (user: User) => { setSelectedUser(user); setShowForm(true) }
  const closeForm = () => setShowForm(false)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Pengguna</h1>
        <Button onClick={openCreate}>
          <Plus size={16} className="mr-1" /> Tambah
        </Button>
      </div>

      {/* Filter */}
      <div className="flex gap-3">
        <select
          value={roleFilter}
          onChange={(e) => { setRoleFilter(e.target.value as UserRole | ''); setPage(1) }}
          className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        >
          <option value="">Semua Role</option>
          {Object.entries(ROLE_LABELS).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </div>

      {/* Form drawer */}
      {showForm && (
        <div className="bg-white rounded-xl border border-gray-100 p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-4">
            {selectedUser ? 'Edit Pengguna' : 'Tambah Pengguna'}
          </h2>
          <UserForm user={selectedUser ?? undefined} onSuccess={closeForm} />
          <button onClick={closeForm} className="mt-3 text-sm text-gray-500 hover:underline">
            Batal
          </button>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        {isLoading ? (
          <div className="p-6 text-sm text-gray-500">Memuat...</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="border-b border-gray-100 bg-gray-50">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Nama</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Email</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Role</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {data?.data.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 font-medium text-gray-900">{user.name}</td>
                  <td className="px-4 py-3 text-gray-600">{user.email}</td>
                  <td className="px-4 py-3 text-gray-600">{ROLE_LABELS[user.role]}</td>
                  <td className="px-4 py-3">
                    <UserStatusToggle user={user} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEdit(user)}
                        className="p-1.5 rounded hover:bg-gray-100 text-gray-500 hover:text-gray-700"
                      >
                        <Pencil size={14} />
                      </button>
                      {user.id !== currentUser.id && (
                        <button
                          onClick={() => {
                            if (confirm(`Hapus ${user.name}?`)) deleteUser(user.id)
                          }}
                          className="p-1.5 rounded hover:bg-red-50 text-gray-500 hover:text-red-600"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Pagination */}
        {data && data.last_page > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
            <span className="text-xs text-gray-500">
              Total {data.total} pengguna
            </span>
            <div className="flex gap-1">
              {Array.from({ length: data.last_page }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`px-2.5 py-1 rounded text-xs font-medium ${
                    p === page
                      ? 'bg-primary text-primary-foreground'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
