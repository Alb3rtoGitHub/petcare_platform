import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode'; // npm install jwt-decode
import { User, UserCheck, AlertCircle, Loader } from 'lucide-react';
import PetOwnerRegistration from './Register';

// Importa tu componente de registro existente

const TokenRouterRegister = () => {
  const [userType, setUserType] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tokenInfo, setTokenInfo] = useState(null);

  // Función para decodificar el token y extraer el rol
  const getUserTypeFromToken = (token) => {
    try {
      if (!token) {
        setError('No se encontró token de autenticación');
        return null;
      }

      const decoded = jwtDecode(token);
      console.log('Token decodificado:', decoded);

      // Validar que el token no haya expirado
      const currentTime = Date.now() / 1000;
      if (decoded.exp && decoded.exp < currentTime) {
        setError('El token ha expirado');
        return null;
      }

      // Extraer información del usuario
      setTokenInfo({
        name: decoded.name,
        email: decoded.sub,
        issuer: decoded.iss,
        roles: decoded.roles,
        expiresAt: new Date(decoded.exp * 1000)
      });

      // Determinar el tipo de usuario basado en los roles
      if (decoded.roles && Array.isArray(decoded.roles)) {
        const role = decoded.roles[0]; // Toma el primer rol
        
        if (role === 'ROLE_OWNER') {
          return 'ROLE_OWNER';
        } else if (role === 'ROLE_SITTER') {
          return 'ROLE_SITTER';
        } else {
          setError(`Rol no reconocido: ${role}`);
          return null;
        }
      } else {
        setError('No se encontraron roles en el token');
        return null;
      }
    } catch (error) {
      console.error('Error decodificando token:', error);
      setError('Token inválido o malformado');
      return null;
    }
  };

  // Función para limpiar el token y redirigir al login
  const handleTokenError = () => {
    localStorage.removeItem('authToken');
    // Redirigir al login o mostrar mensaje de error
    window.location.href = '/login'; // Ajusta según tu routing
  };

  // Verificar token al montar el componente
  useEffect(() => {
    const checkToken = async () => {
      setLoading(true);
      
      // Obtener token desde localStorage, URL params, o donde lo tengas
      const token = localStorage.getItem('authToken') || 
                   new URLSearchParams(window.location.search).get('token');

      if (!token) {
        setError('No se proporcionó token de autenticación');
        setLoading(false);
        return;
      }

      // Si el token viene por URL, guardarlo en localStorage
      if (new URLSearchParams(window.location.search).get('token')) {
        localStorage.setItem('authToken', token);
        // Limpiar URL
        window.history.replaceState({}, document.title, window.location.pathname);
      }

      const type = getUserTypeFromToken(token);
      setUserType(type);
      setLoading(false);
    };

    checkToken();
  }, []);

  // Componente de loading
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Verificando autenticación...
          </h2>
          <p className="text-gray-600">
            Estamos procesando tu token de acceso
          </p>
        </div>
      </div>
    );
  }

  // Componente de error
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Error de Autenticación
          </h2>
          <p className="text-gray-600 mb-6">
            {error}
          </p>
          <div className="space-y-3">
            <button
              onClick={() => window.location.reload()}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Reintentar
            </button>
            <button
              onClick={handleTokenError}
              className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
            >
              Volver al Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Componente de confirmación antes de mostrar el registro
  if (userType && !loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Header de información del usuario */}
        <div className="bg-white shadow-sm border-b">
          <div className="max-w-4xl mx-auto p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {userType === 'ROLE_OWNER' ? (
                  <User className="w-8 h-8 text-blue-600" />
                ) : (
                  <UserCheck className="w-8 h-8 text-green-600" />
                )}
                <div>
                  <h1 className="text-xl font-semibold text-gray-800">
                    {userType === 'ROLE_OWNER' ? 'Registro de Propietario' : 'Registro de Cuidador'}
                  </h1>
                  {tokenInfo && (
                    <p className="text-sm text-gray-600">
                      Bienvenido, {tokenInfo.name} ({tokenInfo.email})
                    </p>
                  )}
                </div>
              </div>
              <button
                onClick={handleTokenError}
                className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                Cambiar cuenta
              </button>
            </div>
          </div>
        </div>

        {/* Información del token (opcional, para debug) */}
        {process.env.NODE_ENV === 'development' && tokenInfo && (
          <div className="max-w-4xl mx-auto p-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <h3 className="text-sm font-medium text-blue-800 mb-2">Debug - Información del Token:</h3>
              <div className="text-xs text-blue-700 space-y-1">
                <p>Nombre: {tokenInfo.name}</p>
                <p>Email: {tokenInfo.email}</p>
                <p>Roles: {tokenInfo.roles?.join(', ')}</p>
                <p>Emisor: {tokenInfo.issuer}</p>
                <p>Expira: {tokenInfo.expiresAt?.toLocaleString()}</p>
                <p>Tipo determinado: {userType}</p>
              </div>
            </div>
          </div>
        )}

        {/* Renderizar el componente de registro correspondiente */}
        <PetOwnerRegistrationWrapper userType={userType} tokenInfo={tokenInfo} />
      </div>
    );
  }

  return null;
};

// Wrapper para tu componente de registro existente
const PetOwnerRegistrationWrapper = ({ userType, tokenInfo }) => {
  // Aquí renderizarías tu componente PetOwnerRegistration existente
  // pasándole el userType y otra información necesaria
  
  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* 
        Aquí iría tu componente PetOwnerRegistration
        <PetOwnerRegistration 
          startStep={1}
          initialUserType={userType}
          tokenInfo={tokenInfo}
        />
      */}
      
      {/* Placeholder temporal */}
      <div className="bg-white rounded-lg shadow-lg p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Formulario de Registro
        </h2>
        <p className="text-gray-600 mb-6">
          {userType === 'ROLE_OWNER' 
            ? 'Aquí se mostraría el formulario para registrar un propietario de mascotas'
            : 'Aquí se mostraría el formulario para registrar un cuidador'
          }
        </p>
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-sm text-gray-600">
            Tipo de usuario detectado: <span className="font-semibold">{userType}</span>
          </p>
          {tokenInfo && (
            <p className="text-sm text-gray-600 mt-1">
              Usuario: {tokenInfo.name} ({tokenInfo.email})
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TokenRouterRegister;