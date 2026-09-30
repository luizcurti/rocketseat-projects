import type { ReactNode } from 'react'
import { ChevronDown } from 'lucide-react'

interface IconSelectOption {
  value: string
  label: ReactNode
}

interface IconSelectProps {
  icon: ReactNode
  value: string
  onChange: (value: string) => void
  options: IconSelectOption[]
}

export function IconSelect({ icon, value, onChange, options }: IconSelectProps) {
  const selected = options.find((option) => option.value === value)

  return (
    <div className="relative flex items-center rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 focus-within:border-violet-400 focus-within:ring-1 focus-within:ring-violet-400">
      <span className="mr-2 flex shrink-0 items-center text-gray-500">
        {icon}
      </span>
      <span className="flex-1 truncate">{selected?.label}</span>
      <ChevronDown className="ml-2 size-4 shrink-0 text-gray-400" />
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="absolute inset-0 h-full w-full cursor-pointer appearance-none opacity-0"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {typeof option.label === 'string' ? option.label : option.value}
          </option>
        ))}
      </select>
    </div>
  )
}
