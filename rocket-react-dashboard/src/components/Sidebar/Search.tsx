import { Search as SearchIcon } from 'lucide-react'

export function Search() {
  return (
    <div className="relative px-2">
      <SearchIcon className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-gray-400" />
      <input
        type="text"
        placeholder="Search"
        className="w-full rounded-lg border border-gray-200 bg-white py-2 pr-3 pl-9 text-sm text-gray-900 placeholder:text-gray-400 focus:border-violet-300 focus:ring-2 focus:ring-violet-100 focus:outline-none"
      />
    </div>
  )
}
