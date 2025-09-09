import React, { useEffect } from 'react'
import PetOwnerRegistration from './pages/Register.jsx'
import { Routes, Route, Navigate, useSearchParams, useNavigate } from 'react-router-dom'
import NewNavbar from './components/NewNavbar.jsx'
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import BookService from './pages/owner/BookService.jsx'
import OwnerBookings from './pages/owner/OwnerBookings.jsx'
import SitterDashboard from './pages/sitter/SitterDashboard.jsx'
import AdminDashboard from './pages/admin/AdminDashboard.jsx'
import { AuthProvider, useAuth } from './context/AuthContext.jsx'
import { jwtDecode } from 'jwt-decode'

function ProtectedRoute({ children, roles }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />
  return children
}

// ESTA FUNCIÓN FALTABA - SimpleRegisterRouter
function SimpleRegisterRouter({ startStep = 1 }) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  // Capturar token de URL y guardarlo
  useEffect(() => {
    const urlToken = searchParams.get('jwtToken');
    if (urlToken) {
      console.log('Token encontrado en URL, guardando en localStorage');
      localStorage.setItem('authToken', urlToken);
      // Limpiar URL
      const cleanUrl = window.location.pathname;
      navigate(cleanUrl, { replace: true });
    }
  }, [searchParams, navigate]);

  // Decodificar token y determinar tipo
  let userType = 'caregiver';
  let tokenInfo = null;
  
  const token = searchParams.get('jwtToken') || localStorage.getItem('authToken');
  
  if (token) {
    try {
      const decoded = jwtDecode(token);
      console.log('Token decodificado:', decoded);
      console.log('Roles encontrados:', decoded.roles);
      
      // MAPEO DIRECTO Y SIMPLE
      if (decoded.roles && decoded.roles[0] === 'ROLE_OWNER') {
        userType = 'pet-owner';
        console.log('✅ DETECTADO: pet-owner');
      } else if (decoded.roles && decoded.roles[0] === 'ROLE_SITTER') {
        userType = 'caregiver';
        console.log('✅ DETECTADO: caregiver');
      }
      
      tokenInfo = {
        name: decoded.name,
        email: decoded.sub,
        userId: searchParams.get('userId')
      };
      
      console.log('TokenInfo creado:', tokenInfo);
    } catch (error) {
      console.error('Error decodificando token:', error);
    }
  }

  console.log('🎯 ENVIANDO A REGISTER:', { 
    startStep, 
    userType, 
    tokenInfo 
  });

  return (
    <PetOwnerRegistration 
      startStep={startStep}
      initialUserType={userType}
      tokenInfo={tokenInfo}
    />
  );
}

export default function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-white">
        <NewNavbar />
        <div className="w-full">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            
            {/* Rutas de registro con detección automática */}
            <Route path="/Register" element={<SimpleRegisterRouter startStep={1} />} />
            <Route path="/Register/pets" element={<SimpleRegisterRouter startStep={2} />} />
            
            {/* Rutas específicas para casos donde quieras forzar el tipo */}
            <Route path="/Register/owner" element={
              <PetOwnerRegistration startStep={1} initialUserType="pet-owner" />
            } />
            <Route path="/Register/sitter" element={
              <PetOwnerRegistration startStep={1} initialUserType="caregiver" />
            } />

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
    </AuthProvider>
  )
}