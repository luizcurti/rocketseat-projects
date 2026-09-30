import {
  BarChart2,
  CheckSquare,
  Flag,
  Home,
  Layers,
  LifeBuoy,
  Settings,
  Users,
} from 'lucide-react'
import { Logo } from './Logo'
import { NavItem } from './NavItem'
import { Profile } from './Profile'
import { Search } from './Search'
import { UsedSpaceWidget } from './UsedSpaceWidget'

const mainNavItems = [
  { icon: Home, label: 'Home', active: true },
  { icon: BarChart2, label: 'Dashboard' },
  { icon: Layers, label: 'Projects' },
  { icon: CheckSquare, label: 'Tasks' },
  { icon: Flag, label: 'Reporting' },
  { icon: Users, label: 'Users' },
]

export function Sidebar() {
  return (
    <aside className="flex h-screen w-72 shrink-0 flex-col justify-between border-r border-gray-200 bg-white py-6">
      <div className="flex flex-col gap-6">
        <Logo />
        <Search />
        <nav className="flex flex-col gap-1 px-2">
          {mainNavItems.map((item) => (
            <NavItem key={item.label} {...item} showChevron />
          ))}
        </nav>
      </div>

      <div className="flex flex-col gap-4">
        <nav className="flex flex-col gap-1 px-2">
          <NavItem icon={LifeBuoy} label="Support" />
          <NavItem icon={Settings} label="Settings" active />
        </nav>
        <UsedSpaceWidget />
        <div className="mx-2 h-px bg-gray-200" />
        <Profile name="Olivia Rhye" email="olivia@untitledui.com" />
      </div>
    </aside>
  )
}
