import { useEffect, useState } from 'react'

const STORAGE_KEY = 'rocket-react-calculator:history'

function readStoredHistory() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function useHistory() {
  const [history, setHistory] = useState(readStoredHistory)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(history))
    } catch {
      // localStorage unavailable (private mode, quota exceeded, etc.)
    }
  }, [history])

  const addEntry = (entry) => setHistory((prev) => [...prev, entry])
  const clearHistory = () => setHistory([])

  return { history, addEntry, clearHistory }
}
