import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { ProgressProvider, useProgress } from './context/ProgressContext'
import Login from './components/auth/Login'
import Signup from './components/auth/Signup'
import ModuleLayout from './components/layout/ModuleLayout'
import Dashboard from './pages/Dashboard'
import Module1 from './modules/module1/Module1'
import Module2 from './modules/module2/Module2'
import Module3 from './modules/module3/Module3'
import Module4 from './modules/module4/Module4'
import Module5 from './modules/module5/Module5'
import Module6 from './modules/module6/Module6'
import BirdieChat from './components/shared/BirdieChat'

function ProtectedRoute({ children }) {
  const { user } = useAuth()
  return user ? children : <Navigate to="/login" replace />
}

function PublicRoute({ children }) {
  const { user } = useAuth()
  return user ? <Navigate to="/dashboard" replace /> : children
}

function ComingSoon({ num }) {
  return (
    <div style={{ textAlign: 'center', padding: '80px 24px' }}>
      <img src="/images/tree-full-color.png" alt="" style={{ height: 80, opacity: 0.3, marginBottom: 24 }} />
      <h2 style={{ color: 'var(--bb-charcoal)', fontWeight: 400, marginBottom: 12 }}>
        Module {num} Coming Soon
      </h2>
      <p style={{ color: 'var(--bb-mid-gray)', fontSize: 14 }}>
        This module will be available in a future update.
      </p>
    </div>
  )
}

function AppRoutes() {
  return (
    <Routes>
      {/* Root redirect */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      {/* Public */}
      <Route path="/login"  element={<PublicRoute><Login  /></PublicRoute>} />
      <Route path="/signup" element={<PublicRoute><Signup /></PublicRoute>} />

      {/* Protected — all inside ModuleLayout */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <ModuleLayout><Dashboard /></ModuleLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/module/1"
        element={
          <ProtectedRoute>
            <ModuleLayout><Module1 /></ModuleLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/module/2"
        element={
          <ProtectedRoute>
            <ModuleLayout><Module2 /></ModuleLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/module/3"
        element={
          <ProtectedRoute>
            <ModuleLayout><Module3 /></ModuleLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/module/4"
        element={
          <ProtectedRoute>
            <ModuleLayout><Module4 /></ModuleLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/module/5"
        element={
          <ProtectedRoute>
            <ModuleLayout><Module5 /></ModuleLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/module/6"
        element={
          <ProtectedRoute>
            <ModuleLayout><Module6 /></ModuleLayout>
          </ProtectedRoute>
        }
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}

// Show Birdie once any progress has been made (module 1 started)
function BirdieGate() {
  const { user } = useAuth()
  const { overallPct } = useProgress()
  if (!user || overallPct === 0) return null
  return <BirdieChat />
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ProgressProvider>
          <AppRoutes />
          <BirdieGate />
        </ProgressProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
