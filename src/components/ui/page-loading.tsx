export function PageLoading({ message = 'Memuat...' }: { message?: string }) {
  return (
    <div className="flex flex-col items-center gap-2 py-16 text-sm text-muted-foreground">
      <div className="size-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      {message}
    </div>
  )
}
