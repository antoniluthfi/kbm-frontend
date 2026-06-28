'use client'

import { useRef, useState } from 'react'
import { Upload, Download, X, FileSpreadsheet, CheckCircle, AlertCircle, Loader2 } from 'lucide-react'
import api from '@/lib/axios'

interface ImportError {
  row: number
  attribute: string
  errors: string[]
}

interface ImportResult {
  message: string
  total_rows: number
  success: number
  skipped: number
  errors: ImportError[]
}

interface ImportButtonProps {
  templateUrl: string
  uploadUrl: string
  label?: string
  onSuccess?: () => void
}

export function ImportButton({ templateUrl, uploadUrl, label = 'Import Excel', onSuccess }: ImportButtonProps) {
  const [open, setOpen]           = useState(false)
  const [file, setFile]           = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [result, setResult]       = useState<ImportResult | null>(null)
  const [error, setError]         = useState<string | null>(null)
  const fileInputRef              = useRef<HTMLInputElement>(null)

  const reset = () => {
    setFile(null)
    setResult(null)
    setError(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const close = () => {
    setOpen(false)
    reset()
  }

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const picked = e.target.files?.[0] ?? null
    if (picked && !picked.name.match(/\.(xlsx|xls)$/i)) {
      setError('Hanya file Excel (.xlsx / .xls) yang diterima.')
      return
    }
    setFile(picked)
    setError(null)
    setResult(null)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const dropped = e.dataTransfer.files[0]
    if (dropped && !dropped.name.match(/\.(xlsx|xls)$/i)) {
      setError('Hanya file Excel (.xlsx / .xls) yang diterima.')
      return
    }
    setFile(dropped ?? null)
    setError(null)
    setResult(null)
  }

  const downloadTemplate = async () => {
    try {
      const response = await api.get(templateUrl, { responseType: 'blob' })
      const blob = response.data as Blob
      const disposition = (response.headers['content-disposition'] as string) ?? ''
      const match = disposition.match(/filename="?([^";\n]+)"?/)
      const filename = match?.[1] ?? 'template.xlsx'

      const link = document.createElement('a')
      link.href     = URL.createObjectURL(blob)
      link.download = filename
      link.click()
      URL.revokeObjectURL(link.href)
    } catch {
      // silent
    }
  }

  const handleUpload = async () => {
    if (!file) return
    setUploading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await api.post<ImportResult>(uploadUrl, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      setResult(response.data)
      if (response.data.success > 0) onSuccess?.()
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })
        ?.response?.data?.message
      setError(msg ?? 'Terjadi kesalahan saat import. Coba lagi.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1.5 h-9 px-3 text-sm border border-border rounded-lg bg-background hover:bg-muted/50 transition-colors"
      >
        <Upload className="size-4 text-muted-foreground" />
        {label}
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={close} />

          <div className="relative bg-card border border-border rounded-xl shadow-xl w-full max-w-lg">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <div>
                <h2 className="font-semibold text-sm">{label}</h2>
                <p className="text-xs text-muted-foreground mt-0.5">Upload file Excel sesuai format template</p>
              </div>
              <button onClick={close} className="text-muted-foreground hover:text-foreground transition-colors">
                <X className="size-4" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              {/* Download template */}
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/40 border border-border">
                <div className="flex items-center gap-2.5">
                  <FileSpreadsheet className="size-5 text-green-600 shrink-0" />
                  <div>
                    <p className="text-sm font-medium">Download Template</p>
                    <p className="text-xs text-muted-foreground">Isi data sesuai kolom yang tersedia</p>
                  </div>
                </div>
                <button
                  onClick={downloadTemplate}
                  className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <Download className="size-3.5" />
                  Unduh
                </button>
              </div>

              {/* Drop zone */}
              {!result && (
                <div
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer hover:border-primary/50 hover:bg-muted/20 transition-colors"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".xlsx,.xls"
                    className="hidden"
                    onChange={handleFile}
                  />
                  {file ? (
                    <div className="flex items-center justify-center gap-2 text-sm">
                      <FileSpreadsheet className="size-5 text-green-600 shrink-0" />
                      <span className="font-medium truncate max-w-65">{file.name}</span>
                      <button
                        onClick={(e) => { e.stopPropagation(); reset() }}
                        className="text-muted-foreground hover:text-foreground transition-colors ml-1"
                      >
                        <X className="size-3.5" />
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <Upload className="size-8 text-muted-foreground mx-auto" />
                      <p className="text-sm font-medium">Klik atau drag & drop file Excel di sini</p>
                      <p className="text-xs text-muted-foreground">.xlsx atau .xls, maks 5 MB</p>
                    </div>
                  )}
                </div>
              )}

              {/* Error message */}
              {error && (
                <div className="flex items-start gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-sm text-destructive">
                  <AlertCircle className="size-4 shrink-0 mt-0.5" />
                  {error}
                </div>
              )}

              {/* Result */}
              {result && (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-green-50 border border-green-200 text-sm text-green-800">
                    <CheckCircle className="size-4 shrink-0" />
                    <span>
                      Import selesai — <strong>{result.success}</strong> berhasil
                      {result.skipped > 0 && <>, <strong>{result.skipped}</strong> dilewati</>}
                      &nbsp;dari <strong>{result.total_rows}</strong> baris
                    </span>
                  </div>

                  {result.errors.length > 0 && (
                    <div className="rounded-lg border border-border overflow-hidden">
                      <div className="px-3 py-2 bg-muted/40 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                        Detail error
                      </div>
                      <div className="divide-y divide-border max-h-48 overflow-y-auto">
                        {result.errors.map((e, i) => (
                          <div key={i} className="px-3 py-2 text-xs">
                            <span className="font-medium text-muted-foreground">Baris {e.row} · {e.attribute}:</span>{' '}
                            <span className="text-destructive">{e.errors.join(', ')}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <button onClick={reset} className="text-xs text-primary hover:underline">
                    Import file lain
                  </button>
                </div>
              )}
            </div>

            {/* Footer */}
            {!result && (
              <div className="flex justify-end gap-2 px-5 py-4 border-t border-border">
                <button
                  onClick={close}
                  className="h-9 px-4 text-sm border border-border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  Batal
                </button>
                <button
                  onClick={handleUpload}
                  disabled={!file || uploading}
                  className="h-9 px-4 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-1.5"
                >
                  {uploading && <Loader2 className="size-3.5 animate-spin" />}
                  {uploading ? 'Mengimport...' : 'Upload & Import'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
