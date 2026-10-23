import { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar } from '../Sidebar/Sidebar'
import './AppLayout.css'

const MOBILE_MQ = '(max-width: 768px)'

export function AppLayout() {
  const [sidebarExpanded, setSidebarExpanded] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const media = window.matchMedia(MOBILE_MQ)

    const sync = () => {
      if (!media.matches) {
        setMobileMenuOpen(false)
      }
    }

    sync()
    media.addEventListener('change', sync)
    return () => media.removeEventListener('change', sync)
  }, [])

  useEffect(() => {
    if (!mobileMenuOpen) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMobileMenuOpen(false)
    }

    document.addEventListener('keydown', onKeyDown)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = ''
    }
  }, [mobileMenuOpen])

  return (
    <div
      className={[
        'app-layout',
        sidebarExpanded ? 'app-layout--sidebar-open' : '',
        mobileMenuOpen ? 'app-layout--mobile-menu-open' : '',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <header className="app-layout__mobile-bar">
        <button
          type="button"
          className="app-layout__menu-btn"
          aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileMenuOpen}
          aria-controls="app-sidebar"
          onClick={() => setMobileMenuOpen((open) => !open)}
        >
          <span className="app-layout__menu-icon" aria-hidden="true">
            {mobileMenuOpen ? '✕' : '☰'}
          </span>
        </button>
        <span className="app-layout__mobile-title">Dashboard</span>
      </header>

      {mobileMenuOpen ? (
        <button
          type="button"
          className="app-layout__backdrop"
          aria-label="Close menu"
          onClick={() => setMobileMenuOpen(false)}
        />
      ) : null}

      <Sidebar
        expanded={sidebarExpanded}
        onExpandChange={setSidebarExpanded}
        mobileOpen={mobileMenuOpen}
        onMobileClose={() => setMobileMenuOpen(false)}
      />

      <main className="app-layout__content">
        <Outlet />
      </main>
    </div>
  )
}
