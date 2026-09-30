import { Bold, ChevronDown, Italic, Link2, List, ListOrdered } from 'lucide-react'

const toolbarButtons = [Bold, Italic, Link2, List, ListOrdered]

interface BioEditorProps {
  value: string
  onChange: (value: string) => void
  maxLength: number
}

export function BioEditor({ value, onChange, maxLength }: BioEditorProps) {
  const remaining = maxLength - value.length

  return (
    <div className="rounded-lg border border-gray-200 focus-within:border-violet-400 focus-within:ring-1 focus-within:ring-violet-400">
      <div className="flex items-center gap-3 border-b border-gray-200 px-3 py-2">
        <button
          type="button"
          className="flex items-center gap-1 rounded-md px-2 py-1 text-sm text-gray-700 hover:bg-gray-50"
        >
          Normal text
          <ChevronDown className="size-4 text-gray-400" />
        </button>
        <div className="h-4 w-px bg-gray-200" />
        <div className="flex items-center gap-1">
          {toolbarButtons.map((Icon, index) => (
            <button
              key={index}
              type="button"
              className="rounded-md p-1.5 text-gray-400 hover:bg-gray-50 hover:text-gray-600"
            >
              <Icon className="size-4" />
            </button>
          ))}
        </div>
      </div>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value.slice(0, maxLength))}
        rows={4}
        className="w-full resize-none rounded-b-lg px-3 py-2 text-sm text-gray-900 outline-none placeholder:text-gray-400"
      />
      <p className="px-3 pb-2 text-xs text-gray-400">
        {remaining} characters left
      </p>
    </div>
  )
}
