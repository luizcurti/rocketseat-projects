export function UsedSpaceWidget() {
  return (
    <div className="mx-2 rounded-xl bg-violet-50 p-4">
      <p className="text-sm font-semibold text-gray-900">Used space</p>
      <p className="mt-1 text-sm text-gray-600">
        Your team has used 80% of your available space. Need more?
      </p>
      <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-violet-200">
        <div className="h-full w-4/5 rounded-full bg-violet-600" />
      </div>
      <div className="mt-3 flex items-center gap-4 text-sm font-medium">
        <button type="button" className="text-gray-600 hover:text-gray-900">
          Dismiss
        </button>
        <button type="button" className="text-violet-700 hover:text-violet-800">
          Upgrade plan
        </button>
      </div>
    </div>
  )
}
