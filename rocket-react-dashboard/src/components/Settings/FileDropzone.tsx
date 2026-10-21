import { UploadCloud } from 'lucide-react'

interface FileDropzoneProps {
  hint?: string
  className?: string
}

export function FileDropzone({
  hint = 'SVG, PNG, JPG or GIF (max. 800×400px)',
  className = '',
}: FileDropzoneProps) {
  return (
    <label
      className={`flex cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border border-gray-200 px-6 py-6 text-center transition-colors hover:border-violet-300 hover:bg-violet-50/40 ${className}`}
    >
      <input type="file" className="sr-only" />
      <span className="flex size-10 items-center justify-center rounded-full bg-gray-100 text-gray-500">
        <UploadCloud className="size-5" />
      </span>
      <p className="mt-2 text-sm text-gray-500">
        <span className="font-semibold text-violet-700">Click to upload</span>{' '}
        or drag and drop
      </p>
      <p className="text-xs text-gray-400">{hint}</p>
    </label>
  )
}
