import React, { useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'
import { useAuth } from './context/AuthContext.jsx'
import PetOwnerRegistration from './pages/Register.jsx'

// Componente wrapper para las rutas de registro con decodificación de token
const getUserTypeFromToken = (token) => {
  try {
    if (!token) {
      console.log('❌ No hay token')
      return 'ROLE_SITTER'
    }
    
    const decoded = jwtDecode(token)
    console.log('🔍 Token decodificado completo:', decoded)
    console.log('🔍 Roles encontrados:', decoded.roles)
    
    // Validar expiración
    const currentTime = Date.now() / 1000
    if (decoded.exp && decoded.exp < currentTime) {
      console.log('⏰ Token expirado')
      localStorage.removeItem('authToken')
      return 'ROLE_SITTER'
    }

    if (decoded.roles && Array.isArray(decoded.roles)) {
      const role = decoded.roles[0]
      console.log('🎭 Rol extraído:', role)
      
      // Mapeo de roles del token a userType del componente
      if (role === 'ROLE_OWNER') {
        console.log('✅ Mapeado a: ROLE_OWNER')
        return 'ROLE_OWNER'
      }
      if (role === 'ROLE_SITTER') {
        console.log('✅ Mapeado a: ROLE_SITTER')
        return 'ROLE_SITTER'
      }
      
      console.log('❌ Rol no reconocido:', role)
    } else {
      console.log('❌ No se encontraron roles válidos')
    }
    
    console.log('📄 Retornando valor por defecto: ROLE_SITTER')
    return 'ROLE_SITTER'
  } catch (error) {
    console.error('💥 Error decodificando token:', error)
    return 'ROLE_SITTER'
  }

  // Obtener información del token
  const getTokenInfo = (token) => {
    if (!token) return null

    try {
      const decoded = jwtDecode(token)
      return {
        name: decoded.name,
        email: decoded.sub,
        roles: decoded.roles,
        issuer: decoded.iss,
        userId: searchParams.get('userId') // Capturar userId de la URL también
      }
    } catch (error) {
      console.error('Error extrayendo info del token:', error)
      return null
    }
  }

  // Capturar y procesar token de la URL al montar el componente
  useEffect(() => {
    const urlToken = searchParams.get('jwtToken')
    
    if (urlToken) {
      console.log('Token encontrado en URL:', urlToken)
      
      try {
        // Validar que el token sea válido antes de guardarlo
        const decoded = jwtDecode(urlToken)
        
        // Verificar que no esté expirado
        const currentTime = Date.now() / 1000
        if (decoded.exp && decoded.exp < currentTime) {
          console.error('El token en la URL ha expirado')
          alert('El enlace de registro ha expirado. Por favor, solicita uno nuevo.')
          return
        }

        // Guardar token en localStorage
        localStorage.setItem('authToken', urlToken)
        
        // Limpiar URL para que no se vea el token
        const cleanUrl = window.location.pathname
        navigate(cleanUrl, { replace: true })
        
        console.log('Token guardado y URL limpiada')
        
      } catch (error) {
        console.error('Token inválido en URL:', error)
        alert('El enlace de registro es inválido. Por favor, verifica el enlace.')
      }
    }
  }, [searchParams, navigate])

  // Determinar userType y tokenInfo
  let userType = 'ROLE_SITTER'
  let tokenInfo = null

  // Verificar primero el token de la URL
  const urlToken = searchParams.get('jwtToken')
  if (urlToken) {
    userType = getUserTypeFromToken(urlToken)
    tokenInfo = getTokenInfo(urlToken)
  } 
  // Luego verificar si hay usuario en el contexto
  else if (user) {
    if (user.role === 'owner') userType = 'ROLE_OWNER'
    if (user.role === 'sitter') userType = 'ROLE_SITTER'
    
    tokenInfo = {
      name: user.name,
      email: user.email,
      roles: [user.role]
    }
  } 
  // Finalmente verificar localStorage
  else {
    const storedToken = localStorage.getItem('authToken')
    userType = getUserTypeFromToken(storedToken)
    tokenInfo = getTokenInfo(storedToken)
  }

  // Al final de la función RegisterWithToken, antes del return:
console.log('🎯 RESULTADO FINAL:')
console.log('   - userType determinado:', userType)
console.log('   - tokenInfo:', tokenInfo)
console.log('   - startStep:', startStep)
console.log('   - URL token presente:', !!urlToken)
console.log('   - Usuario en contexto:', !!user)
console.log('   - Token en localStorage:', !!localStorage.getItem('authToken'))
  
return (
    <PetOwnerRegistration 
      startStep={startStep}
      initialUserType={userType}
      tokenInfo={tokenInfo}
    />
  )
}



export default RegisterWithToken