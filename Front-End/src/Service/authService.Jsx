import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

// Configuración base de la API
const API_BASE_URL = 'http://localhost:8080/api/v1/auth/register'; // Ajusta el puerto según tu Spring Boot

// Crear instancia de axios con configuración base
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para agregar token a las peticiones
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Servicio de autenticación
const authService = {
  // Registro de Owner
  registerOwner: async (userData) => {
    try {
      const response = await apiClient.post('/auth/register', {
        ...userData,
        userType: 'ROLE_OWNER' // Asumiendo que necesitas especificar el tipo
      });
      return {
        success: true,
        data: response.data,
        message: 'Owner registrado exitosamente'
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Error al registrar Owner',
        error: error.response?.data
      };
    }
  },

  // Registro de Sitter
  registerSitter: async (userData) => {
    try {
      const response = await apiClient.post('/auth/register', {
        ...userData,
        userType: 'ROLE_SITTER' // Asumiendo que necesitas especificar el tipo
      });
      return {
        success: true,
        data: response.data,
        message: 'Sitter registrado exitosamente'
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Error al registrar Sitter',
        error: error.response?.data
      };
    }
  },

  // Registro de User
  registerUser: async (userData) => {
    try {
      const response = await apiClient.post('/auth', userData);
      return {
        success: true,
        data: response.data,
        message: 'Usuario registrado exitosamente'
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Error al registrar usuario',
        error: error.response?.data
      };
    }
  },

  // Login de usuario (para todos los tipos)
  login: async (credentials) => {
    try {
      const response = await apiClient.post('/auth', credentials);
      
      return {
        success: true,
        data: response.data,
        message: 'Login exitoso'
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Credenciales inválidas',
        error: error.response?.data
      };
    }
  },

  // Enviar email de verificación
  sendVerificationEmail: async (emailData) => {
    try {
      const response = await apiClient.post('/auth/send-verification-email', emailData);
      return {
        success: true,
        data: response.data,
        message: 'Email de verificación enviado exitosamente'
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Error al enviar email de verificación',
        error: error.response?.data
      };
    }
  },

  // Logout
  logout: () => {
    localStorage.removeItem('authToken');
  },

  // Verificar si está autenticado
  isAuthenticated: () => {
    return !!localStorage.getItem('authToken');
  },

  // Obtener usuario actual (desde el token)
  getCurrentUser: () => {
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        return {
          name: decoded.name,
          email: decoded.sub,
          roles: decoded.roles
        };
      } catch (error) {
        console.error('Error decodificando token:', error);
        return null;
      }
    }
    return null;
  }
};

export default authService;