import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import './Sidebar.css'

type SidebarProps = {
  expanded: boolean
  onExpandChange: (expanded: boolean) => void
  mobileOpen: boolean
  onMobileClose: () => void
}

function canExpandByHover() {
  return window.matchMedia('(min-width: 769px)').matches
}

export function Sidebar({
  expanded,
  onExpandChange,
  mobileOpen,
  onMobileClose,
}: SidebarProps) {
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    onMobileClose()
    navigate('/login')
  }

  const handleNavClick = () => {
    onMobileClose()
  }

  const className = [
    'sidebar',
    expanded ? 'sidebar--expanded' : '',
    mobileOpen ? 'sidebar--mobile-open' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <aside
      id="app-sidebar"
      className={className}
      onMouseEnter={() => {
        if (canExpandByHover()) onExpandChange(true)
      }}
      onMouseLeave={() => {
        if (canExpandByHover()) onExpandChange(false)
      }}
    >
      <div className="sidebar__top">
        <div className="sidebar__brand">
          <span className="sidebar__brand-icon" aria-hidden="true">
            💰
          </span>
          <span className="sidebar__brand-text">Dashboard</span>
        </div>

        <div className="sidebar__divider" />

        <p className="sidebar__menu-label">MENU</p>

        <nav className="sidebar__nav">
          <NavLink
            to="/currencies"
            className={({ isActive }) =>
              isActive ? 'sidebar__item sidebar__item--active' : 'sidebar__item'
            }
            onClick={handleNavClick}
          >
            <span className="sidebar__item-icon" aria-hidden="true">
              💱
            </span>
            <span className="sidebar__item-text sidebar__item-text--short">Rates</span>
            <span className="sidebar__item-text sidebar__item-text--full">
              Exchange Rates
            </span>
          </NavLink>

          <NavLink
            to="/kanban"
            className={({ isActive }) =>
              isActive ? 'sidebar__item sidebar__item--active' : 'sidebar__item'
            }
            onClick={handleNavClick}
          >
            <span className="sidebar__item-icon" aria-hidden="true">
              📋
            </span>
            <span className="sidebar__item-text sidebar__item-text--short">Cards</span>
            <span className="sidebar__item-text sidebar__item-text--full">
              Kanban Cards
            </span>
          </NavLink>
        </nav>
      </div>

      <div className="sidebar__bottom">
        <div className="sidebar__divider" />

        <button className="sidebar__logout" type="button" onClick={handleLogout}>
          <span className="sidebar__logout-icon" aria-hidden="true">
            🚪
          </span>
          <span className="sidebar__logout-text">Logout</span>
        </button>
      </div>
    </aside>
  )
}
