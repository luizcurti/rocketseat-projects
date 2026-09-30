import { useState } from 'react'
import { SettingsTabs } from './SettingsTabs'
import { PersonalInfoSection } from './PersonalInfoSection'

export function SettingsPage() {
  const [tab, setTab] = useState('my-details')

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="text-3xl font-semibold text-gray-900">Settings</h1>

      <div className="mt-6">
        <SettingsTabs value={tab} onValueChange={setTab} />
      </div>

      {tab === 'my-details' ? (
        <PersonalInfoSection />
      ) : (
        <p className="mt-8 text-sm text-gray-500">
          Conteúdo em construção nas próximas aulas.
        </p>
      )}
    </div>
  )
}
