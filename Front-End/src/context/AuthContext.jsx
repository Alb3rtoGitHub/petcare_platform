// En context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

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
  }, []);

  const login = (token) => {
    localStorage.setItem('authToken', token);
    const decoded = jwtDecode(token);
    const userType = getUserTypeFromToken(token);
    
    setUser({
      name: decoded.name,
      email: decoded.sub,
      role: userType,
      roles: decoded.roles
    });
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// ESTA EXPORTACIÓN ES LA QUE FALTA:
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
};