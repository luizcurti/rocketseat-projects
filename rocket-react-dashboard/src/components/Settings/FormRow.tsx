import type { ReactNode } from 'react'

interface FormRowProps {
  label: string
  description?: string
  children: ReactNode
}

export function FormRow({ label, description, children }: FormRowProps) {
  return (
    <div className="grid grid-cols-1 gap-2 border-b border-gray-200 py-6 last:border-b-0 sm:grid-cols-3 sm:gap-6">
      <div>
        <p className="text-sm font-medium text-gray-700">{label}</p>
        {description && (
          <p className="mt-1 text-sm text-gray-500">{description}</p>
        )}
      </div>
      <div className="sm:col-span-2">{children}</div>
    </div>
  )
}
