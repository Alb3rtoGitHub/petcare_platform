import React, { createContext, useContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import AuthService from "../services/AuthService.js";
import UserService from "../services/UserService.js";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getUserTypeFromToken = (token) => {
    try {
      if (!token) return null;
      const decoded = jwtDecode(token);

      if (decoded.roles && Array.isArray(decoded.roles)) {
        const role = decoded.roles[0];
        if (role === "ROLE_OWNER") return "owner";
        if (role === "ROLE_SITTER") return "sitter";
        if (role === "ROLE_ADMIN") return "admin";
      }
      return null;
    } catch (error) {
      console.error("Error decodificando token:", error);
      return null;
    }
  };

  const initializeAuth = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("authToken");
      const userId = localStorage.getItem("userId");

      if (token && userId) {
        try {
          // Obtener información completa del usuario
          const userInfo = await UserService.getUser(userId);
          const decoded = jwtDecode(token);
          const userType = getUserTypeFromToken(token);

          const userData = {
            id: userId,
            name: decoded.name || `${userInfo.firstName} ${userInfo.lastName}`,
            email: decoded.sub || userInfo.email,
            role: userType,
            roles: decoded.roles,
            ...UserService.formatUserForDisplay(userInfo),
          };

          setUser(userData);
          localStorage.setItem("pc_user", JSON.stringify(userData));
        } catch (error) {
          console.error("Error obteniendo datos del usuario:", error);
          // Si no se puede obtener la información, usar solo el token
          const decoded = jwtDecode(token);
          const userType = getUserTypeFromToken(token);

          setUser({
            id: userId,
            name: decoded.name,
            email: decoded.sub,
            role: userType,
            roles: decoded.roles,
          });
        }
      }
    } catch (error) {
      console.error("Error inicializando autenticación:", error);
      localStorage.removeItem("authToken");
      localStorage.removeItem("userId");
      localStorage.removeItem("pc_user");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    initializeAuth();
  }, []);

  const loginWithCredentials = async (email, password) => {
    try {
      setLoading(true);
      setError(null);

      const response = await AuthService.login(email, password);

      if (response.token) {
        localStorage.setItem("authToken", response.token);
        localStorage.setItem("userId", response.id);

        const decoded = jwtDecode(response.token);
        const userType = getUserTypeFromToken(response.token);

        let userData = {
          id: response.id,
          name: decoded.name,
          email: decoded.sub,
          role: userType,
          roles: decoded.roles,
        };

        // Si hay información del usuario en la respuesta, agregarla
        if (response.user) {
          userData = {
            ...userData,
            ...UserService.formatUserForDisplay(response.user),
          };
        }

        setUser(userData);
        localStorage.setItem("pc_user", JSON.stringify(userData));

        return userData;
      }

      throw new Error("No se recibió token de autenticación");
    } catch (error) {
      console.error("Error en login:", error);
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Método para login con token (para compatibilidad con el código existente)
  const login = (tokenOrEmail, password) => {
    // Si se pasan dos parámetros, es email y password
    if (password !== undefined) {
      return loginWithCredentials(tokenOrEmail, password);
    }

    // Si es un solo parámetro, es un token
    const token = tokenOrEmail;
    localStorage.setItem("authToken", token);
    const decoded = jwtDecode(token);
    const userType = getUserTypeFromToken(token);

    const userData = {
      name: decoded.name,
      email: decoded.sub,
      role: userType,
      roles: decoded.roles,
    };

    setUser(userData);
    localStorage.setItem("pc_user", JSON.stringify(userData));

    return userData;
  };

  const register = async (registerData) => {
    try {
      setLoading(true);
      setError(null);

      const response = await AuthService.register(registerData);
      return response;
    } catch (error) {
      console.error("Error en registro:", error);
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    AuthService.logout();
    localStorage.removeItem("pc_user");
    setUser(null);
    setError(null);
  };

  const updateUserProfile = async (userData, profilePicture = null) => {
    try {
      setLoading(true);
      setError(null);

      const updatedUser = await UserService.updateCurrentUserProfile(
        userData,
        profilePicture
      );
      const currentRole = user?.role || AuthService.getCurrentUserRole();

      const userFormatted = {
        id: updatedUser.id || user.id,
        role: currentRole,
        name: `${updatedUser.firstName} ${updatedUser.lastName}`,
        ...UserService.formatUserForDisplay(updatedUser),
      };

      setUser(userFormatted);
      localStorage.setItem("pc_user", JSON.stringify(userFormatted));

      return userFormatted;
    } catch (error) {
      console.error("Error actualizando perfil:", error);
      setError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const isAuthenticated = () => {
    return !!user && !!localStorage.getItem("authToken");
  };

  const hasRole = (requiredRoles) => {
    if (!user || !user.role) return false;
    if (Array.isArray(requiredRoles)) {
      return requiredRoles.includes(user.role);
    }
    return user.role === requiredRoles;
  };

  const value = {
    user,
    loading,
    error,
    login,
    loginWithCredentials,
    register,
    logout,
    updateUserProfile,
    isAuthenticated,
    hasRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de AuthProvider");
  }
  return context;
};
