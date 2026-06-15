import LoginForm from '@/components/auth/LoginForm'

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900">KBM</h1>
          <p className="mt-1 text-sm text-gray-500">
            Kegiatan Belajar Mengajar Masjid
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
