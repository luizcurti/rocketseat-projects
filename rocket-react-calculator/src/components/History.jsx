function History({ entries, onClear }) {
  return (
    <section className="flex w-80 flex-col gap-4 rounded-3xl bg-[#262330] p-6 shadow-2xl">
      <header className="flex items-baseline justify-between gap-3">
        <h2 className="m-0 whitespace-nowrap text-base font-medium text-[#f3f1f8]">Operation History</h2>
        {entries.length > 0 && (
          <button
            type="button"
            className="cursor-pointer rounded-lg border-0 bg-transparent px-2 py-1 text-sm text-[#9a92ac] hover:bg-white/5 hover:text-white"
            onClick={onClear}
          >
            Clear
          </button>
        )}
      </header>

      {entries.length === 0 ? (
        <p className="text-sm text-[#7e778c]">No operations yet.</p>
      ) : (
        <ul className="m-0 flex max-h-85 list-none flex-col gap-2.5 overflow-y-auto p-0">
          {entries.map((entry, index) => (
            <li key={index} className="text-[15px] text-[#cfc9dc]">
              {entry}
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}

export default History
