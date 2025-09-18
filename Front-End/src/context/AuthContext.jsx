// En context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import authService from '../Service/authService.Jsx'; // Importar nuestro servicio

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const getUserTypeFromToken = (token) => {
    try {
      if (!token) return null;
      const decoded = jwtDecode(token);
      
      if (decoded.roles && Array.isArray(decoded.roles)) {
        const role = decoded.roles[0];
        if (role === 'ROLE_OWNER') return 'owner';
        if (role === 'ROLE_SITTER') return 'sitter';
      }
      return null;
    } catch (error) {
      console.error('Error decodificando token:', error);
      return null;
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const userType = getUserTypeFromToken(token);
        
        setUser({
          name: decoded.name,
          email: decoded.sub,
          role: userType,
          roles: decoded.roles
        });
      } catch (error) {
        console.error('Error inicializando usuario:', error);
        localStorage.removeItem('authToken');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (credentials) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await authService.login(credentials);
      
      if (result.success && result.data.token) {
        const token = result.data.token;
        localStorage.setItem('authToken', token);
        
        const decoded = jwtDecode(token);
        const userType = getUserTypeFromToken(token);
        
        setUser({
          name: decoded.name,
          email: decoded.sub,
          role: userType,
          roles: decoded.roles
        });
        
        setIsLoading(false);
        return result;
      } else {
        setError(result.message);
        setIsLoading(false);
        return result;
      }
    } catch (error) {
      const errorMessage = 'Error inesperado al iniciar sesión';
      setError(errorMessage);
      setIsLoading(false);
      return { success: false, message: errorMessage };
    }
  };

  // Función para registro de Owner
  const registerOwner = async (userData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await authService.registerOwner(userData);
      setIsLoading(false);
      
      if (!result.success) {
        setError(result.message);
      }
      
      return result;
    } catch (error) {
      const errorMessage = 'Error inesperado al registrar Owner';
      setError(errorMessage);
      setIsLoading(false);
      return { success: false, message: errorMessage };
    }
  };

  // Función para registro de Sitter
  const registerSitter = async (userData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await authService.registerSitter(userData);
      setIsLoading(false);
      
      if (!result.success) {
        setError(result.message);
      }
      
      return result;
    } catch (error) {
      const errorMessage = 'Error inesperado al registrar Sitter';
      setError(errorMessage);
      setIsLoading(false);
      return { success: false, message: errorMessage };
    }
  };

  // Función para registro de User
  const registerUser = async (userData) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const result = await authService.registerUser(userData);
      setIsLoading(false);
      
      if (!result.success) {
        setError(result.message);
      }
      
      return result;
    } catch (error) {
      const errorMessage = 'Error inesperado al registrar Usuario';
      setError(errorMessage);
      setIsLoading(false);
      return { success: false, message: errorMessage };
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
    setError(null);
  };

  const clearError = () => {
    setError(null);
  };

  // Verificar si está autenticado
  const isAuthenticated = !!user;

  // Obtener el token actual
  const getToken = () => {
    return localStorage.getItem('authToken');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated,
      isLoading,
      error,
      login, 
      logout,
      registerOwner,
      registerSitter,
      registerUser,
      clearError,
      getToken
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// Exportación del hook personalizado
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
};