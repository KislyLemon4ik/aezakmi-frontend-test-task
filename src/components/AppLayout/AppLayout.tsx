import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar } from '../Sidebar/Sidebar'
import './AppLayout.css'

export function AppLayout() {
  const [sidebarExpanded, setSidebarExpanded] = useState(false)

  return (
    <div className={sidebarExpanded ? 'app-layout app-layout--sidebar-open' : 'app-layout'}>
      <Sidebar expanded={sidebarExpanded} onExpandChange={setSidebarExpanded} />
      <main className="app-layout__content">
        <Outlet />
      </main>
    </div>
  )
}
