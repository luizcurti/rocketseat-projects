import * as Tabs from '@radix-ui/react-tabs'

interface SettingsTab {
  value: string
  label: string
  count?: number
}

const tabs: SettingsTab[] = [
  { value: 'my-details', label: 'My details' },
  { value: 'profile', label: 'Profile' },
  { value: 'password', label: 'Password' },
  { value: 'team', label: 'Team', count: 4 },
  { value: 'plan', label: 'Plan' },
  { value: 'billing', label: 'Billing', count: 2 },
  { value: 'email', label: 'Email' },
  { value: 'notifications', label: 'Notifications' },
  { value: 'integrations', label: 'Integrations' },
  { value: 'api', label: 'API' },
]

interface SettingsTabsProps {
  value: string
  onValueChange: (value: string) => void
}

export function SettingsTabs({ value, onValueChange }: SettingsTabsProps) {
  return (
    <Tabs.Root value={value} onValueChange={onValueChange}>
      <Tabs.List className="flex gap-6 overflow-x-auto border-b border-gray-200">
        {tabs.map((tab) => (
          <Tabs.Trigger
            key={tab.value}
            value={tab.value}
            className="group flex shrink-0 items-center gap-2 border-b-2 border-transparent py-3 text-sm font-medium text-gray-500 transition-colors hover:text-gray-700 data-[state=active]:border-violet-600 data-[state=active]:text-violet-700"
          >
            {tab.label}
            {tab.count !== undefined && (
              <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600 group-data-[state=active]:bg-violet-50 group-data-[state=active]:text-violet-700">
                {tab.count}
              </span>
            )}
          </Tabs.Trigger>
        ))}
      </Tabs.List>
    </Tabs.Root>
  )
}
