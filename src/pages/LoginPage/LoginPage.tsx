import { useState, type FormEvent } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import './LoginPage.css'

type LoginErrors = {
  login?: string
  password?: string
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validate(login: string, password: string): LoginErrors {
  const errors: LoginErrors = {}

  if (!login.trim()) {
    errors.login = 'Please enter a valid email address'
  } else if (!EMAIL_PATTERN.test(login.trim())) {
    errors.login = 'Please enter a valid email address'
  }

  if (!password) {
    errors.password = 'Password must be at least 6 characters'
  } else if (password.length < 6) {
    errors.password = 'Password must be at least 6 characters'
  }

  return errors
}

export function LoginPage() {
  const { isAuthenticated, login } = useAuth()
  const navigate = useNavigate()

  const [loginValue, setLoginValue] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<LoginErrors>({})

  if (isAuthenticated) {
    return <Navigate to="/currencies" replace />
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const nextErrors = validate(loginValue, password)
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      return
    }

    // Mock-авторизация: бэкенда нет, любой валидный email/пароль пропускаем
    login(loginValue.trim())
    navigate('/currencies')
  }

  return (
    <div className="login-page">
      <form className="login-card" onSubmit={handleSubmit} noValidate>
        <h1 className="login-title">Log in</h1>
        <p className="login-subtitle">Welcome back</p>

        <div className="login-field">
          <div
            className={
              errors.login ? 'login-input-wrap login-input-wrap--error' : 'login-input-wrap'
            }
          >
            <span className="login-icon" aria-hidden="true">
              ✉
            </span>
            <input
              className="login-input"
              type="email"
              name="login"
              autoComplete="email"
              value={loginValue}
              onChange={(event) => setLoginValue(event.target.value)}
              placeholder="Email Address"
            />
          </div>
          {errors.login ? <span className="login-error">{errors.login}</span> : null}
        </div>

        <div className="login-field">
          <div
            className={
              errors.password
                ? 'login-input-wrap login-input-wrap--error'
                : 'login-input-wrap'
            }
          >
            <span className="login-icon" aria-hidden="true">
              🔒
            </span>
            <input
              className="login-input"
              type="password"
              name="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Password"
            />
          </div>
          {errors.password ? (
            <span className="login-error">{errors.password}</span>
          ) : null}
        </div>

        <button className="login-button" type="submit">
          Login
        </button>
      </form>
    </div>
  )
}
