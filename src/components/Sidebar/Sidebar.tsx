import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import './Sidebar.css'

type SidebarProps = {
  expanded: boolean
  onExpandChange: (expanded: boolean) => void
}

function canExpandByHover() {
  return window.matchMedia('(min-width: 769px)').matches
}

export function Sidebar({ expanded, onExpandChange }: SidebarProps) {
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <aside
      className={expanded ? 'sidebar sidebar--expanded' : 'sidebar'}
      onMouseEnter={() => {
        if (canExpandByHover()) onExpandChange(true)
      }}
      onMouseLeave={() => onExpandChange(false)}
    >
      <div className="sidebar__top">
        <div className="sidebar__brand">
          <span className="sidebar__brand-icon" aria-hidden="true">
            💰
          </span>
          {expanded ? <span className="sidebar__brand-text">Dashboard</span> : null}
        </div>

        {expanded ? <div className="sidebar__divider" /> : null}

        {expanded ? <p className="sidebar__menu-label">MENU</p> : null}

        <nav className="sidebar__nav">
          <NavLink
            to="/currencies"
            className={({ isActive }) =>
              isActive ? 'sidebar__item sidebar__item--active' : 'sidebar__item'
            }
          >
            <span className="sidebar__item-icon" aria-hidden="true">
              💱
            </span>
            <span className="sidebar__item-text">
              {expanded ? 'Exchange Rates' : 'Rates'}
            </span>
          </NavLink>

          <NavLink
            to="/kanban"
            className={({ isActive }) =>
              isActive ? 'sidebar__item sidebar__item--active' : 'sidebar__item'
            }
          >
            <span className="sidebar__item-icon" aria-hidden="true">
              📋
            </span>
            <span className="sidebar__item-text">
              {expanded ? 'Kanban Cards' : 'Cards'}
            </span>
          </NavLink>
        </nav>
      </div>

      <div className="sidebar__bottom">
        {expanded ? <div className="sidebar__divider" /> : null}

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
