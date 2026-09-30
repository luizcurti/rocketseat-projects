import { Sidebar } from './components/Sidebar'
import { SettingsPage } from './components/Settings'

function App() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-10">
        <SettingsPage />
      </main>
    </div>
  )
}

export default App
