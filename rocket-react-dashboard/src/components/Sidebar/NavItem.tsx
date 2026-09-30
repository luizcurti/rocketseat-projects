import type { LucideIcon } from 'lucide-react'
import { ChevronDown } from 'lucide-react'

interface NavItemProps {
  icon: LucideIcon
  label: string
  active?: boolean
  showChevron?: boolean
}

export function NavItem({
  icon: Icon,
  label,
  active = false,
  showChevron = false,
}: NavItemProps) {
  return (
    <a
      href="#"
      className={`group flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
        active
          ? 'bg-violet-50 text-violet-700'
          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
      }`}
    >
      <Icon
        className={`size-5 shrink-0 ${
          active ? 'text-violet-700' : 'text-gray-400 group-hover:text-gray-500'
        }`}
      />
      <span className="flex-1 text-left">{label}</span>
      {showChevron && (
        <ChevronDown
          className={`size-4 shrink-0 ${
            active ? 'text-violet-700' : 'text-gray-400'
          }`}
        />
      )}
    </a>
  )
}
