import Calculator from './components/Calculator'
import History from './components/History'
import { useHistory } from './hooks/useHistory'

function App() {
  const { history, addEntry, clearHistory } = useHistory()

  return (
    <div className="min-h-screen p-8 pb-16 sm:p-10">
      <h1 className="mb-6 text-xl font-medium text-[#cfc9dc]">Calculator</h1>
      <div className="flex flex-wrap justify-center gap-6 rounded-4xl bg-linear-to-br from-[#c6b6ef] via-[#9682d6] to-[#8a76d1] p-8 shadow-2xl sm:p-12">
        <Calculator onResult={addEntry} />
        <History entries={history} onClear={clearHistory} />
      </div>
    </div>
  )
}

export default App
