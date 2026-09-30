import { LogOut } from 'lucide-react'

interface ProfileProps {
  name: string
  email: string
}

export function Profile({ name, email }: ProfileProps) {
  const initials = name
    .split(' ')
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <div className="flex min-w-0 items-center gap-3 px-2">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-violet-100 text-sm font-semibold text-violet-700">
        {initials}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-gray-900">{name}</p>
        <p className="truncate text-sm text-gray-500">{email}</p>
      </div>
      <button
        type="button"
        aria-label="Log out"
        className="shrink-0 text-gray-400 hover:text-gray-600"
      >
        <LogOut className="size-5" />
      </button>
    </div>
  )
}
