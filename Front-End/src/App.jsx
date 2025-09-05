import PetOwnerRegistration from './pages/Register.jsx' // ajusta la ruta
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import NewNavbar from './components/NewNavbar.jsx'
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import BookService from './pages/owner/BookService.jsx'
import OwnerBookings from './pages/owner/OwnerBookings.jsx'
import OwnerDashboard from './pages/owner/OwnerDashboard.jsx'
import SitterDashboard from './pages/sitter/SitterDashboard.jsx'
import AdminDashboard from './pages/admin/AdminDashboard.jsx'
import { AuthProvider, useAuth } from './context/AuthContext.jsx'

function ProtectedRoute({ children, roles }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />
  return children
}

function AppContent() {
  const location = useLocation()
  
  // No mostrar NewNavbar en las vistas específicas de owner y sitter
  const hideMainNavbar = location.pathname.includes('/owner-dashboard') || 
                         location.pathname.includes('/sitter-dashboard')

  return (
    <div className="min-h-screen bg-white">
      {!hideMainNavbar && <NewNavbar />}
      <div className="w-full">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register/owner" element={<PetOwnerRegistration />} />
          <Route path="/sitter-dashboard" element={<SitterDashboard />} />
          <Route path="/owner-dashboard" element={<OwnerDashboard />} />

          <Route path="/owner/book" element={
            <ProtectedRoute roles={['owner']}>
              <BookService />
            </ProtectedRoute>
          } />
          <Route path="/owner/bookings" element={
            <ProtectedRoute roles={['owner']}>
              <OwnerBookings />
            </ProtectedRoute>
          } />

          <Route path="/sitter" element={
            <ProtectedRoute roles={['sitter']}>
              <SitterDashboard />
            </ProtectedRoute>
          } />

          <Route path="/admin" element={
            <ProtectedRoute roles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}
