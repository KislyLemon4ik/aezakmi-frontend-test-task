import { Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from './components/AppLayout/AppLayout'
import { ProtectedRoute } from './components/ProtectedRoute'
import { CurrenciesPage } from './pages/CurrenciesPage/CurrenciesPage'
import { KanbanPage } from './pages/KanbanPage/KanbanPage'
import { LoginPage } from './pages/LoginPage/LoginPage'
import './App.css'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/currencies" element={<CurrenciesPage />} />
        <Route path="/kanban" element={<KanbanPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

export default App
