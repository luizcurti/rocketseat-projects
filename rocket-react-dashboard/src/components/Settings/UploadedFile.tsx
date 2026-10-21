import type { LucideIcon } from 'lucide-react'
import { Check, Trash2 } from 'lucide-react'

interface UploadedFileProps {
  icon: LucideIcon
  name: string
  size: string
  progress: number
  complete?: boolean
  onRemove?: () => void
}

export function UploadedFile({
  icon: Icon,
  name,
  size,
  progress,
  complete = false,
  onRemove,
}: UploadedFileProps) {
  return (
    <div
      className={`relative rounded-lg border p-4 ${
        complete ? 'border-violet-300 ring-1 ring-violet-200' : 'border-gray-200'
      }`}
    >
      <div className="flex items-start gap-3">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-violet-100 text-violet-700">
          <Icon className="size-4" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-gray-900">{name}</p>
          <p className="text-xs text-gray-500">{size}</p>
          <div className="mt-2 flex items-center gap-3">
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-gray-100">
              <div
                className="h-full rounded-full bg-violet-600 transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="w-9 shrink-0 text-right text-xs text-gray-500">
              {progress}%
            </span>
          </div>
        </div>
        {complete ? (
          <span className="absolute -right-1.5 -top-1.5 flex size-5 items-center justify-center rounded-full bg-violet-600 text-white">
            <Check className="size-3" strokeWidth={3} />
          </span>
        ) : (
          <button
            type="button"
            aria-label={`Remove ${name}`}
            onClick={onRemove}
            className="shrink-0 text-gray-400 hover:text-gray-600"
          >
            <Trash2 className="size-4" />
          </button>
        )}
      </div>
    </div>
  )
}
