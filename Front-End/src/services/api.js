// Servicio API centralizado para integración con Spring Boot
// Gestiona todas las llamadas HTTP al backend de manera consistente

const API_CONFIG = {
  // URLs base para diferentes entornos
  baseURL: {
    development: 'http://localhost:8080/api',
    production: process.env.REACT_APP_API_BASE_URL || 'https://your-backend-domain.com/api'
  },
  
  // Configuración de timeouts
  timeout: 30000, // 30 segundos
  
  // Headers por defecto
  defaultHeaders: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
}

// Obtener URL base según el entorno
const getBaseURL = () => {
  const env = process.env.NODE_ENV || 'development'
  return API_CONFIG.baseURL[env]
}

// Estado global del token
let authToken = localStorage.getItem('authToken') || null
let refreshToken = localStorage.getItem('refreshToken') || null

// Funciones de gestión de tokens
export const tokenManager = {
  setTokens: (auth, refresh) => {
    authToken = auth
    refreshToken = refresh
    localStorage.setItem('authToken', auth)
    localStorage.setItem('refreshToken', refresh)
  },
  
  clearTokens: () => {
    authToken = null
    refreshToken = null
    localStorage.removeItem('authToken')
    localStorage.removeItem('refreshToken')
  },
  
  getAuthToken: () => authToken,
  getRefreshToken: () => refreshToken,
  
  isTokenExpired: (token) => {
    if (!token) return true
    try {
      const payload = JSON.parse(atob(token.split('.')[1]))
      return payload.exp * 1000 < Date.now()
    } catch {
      return true
    }
  }
}

// Función base para hacer peticiones HTTP
const makeRequest = async (endpoint, options = {}) => {
  const url = `${getBaseURL()}${endpoint}`
  
  // Configurar headers
  const headers = {
    ...API_CONFIG.defaultHeaders,
    ...options.headers
  }
  
  // Añadir token de autenticación si existe
  if (authToken && !tokenManager.isTokenExpired(authToken)) {
    headers.Authorization = `Bearer ${authToken}`
  }
  
  // Configuración de la petición
  const requestConfig = {
    method: options.method || 'GET',
    headers,
    signal: AbortSignal.timeout(API_CONFIG.timeout),
    ...options
  }
  
  // Para FormData, remover Content-Type para que el navegador lo configure automáticamente
  if (options.body instanceof FormData) {
    delete requestConfig.headers['Content-Type']
  } else if (options.body && typeof options.body === 'object') {
    requestConfig.body = JSON.stringify(options.body)
  } else if (options.body) {
    requestConfig.body = options.body
  }
  
  try {
    console.log(`🌐 API Request: ${requestConfig.method} ${url}`)
    
    const response = await fetch(url, requestConfig)
    
    // Manejar token expirado
    if (response.status === 401 && authToken) {
      console.log('🔄 Token expirado, intentando refresh...')
      const refreshed = await refreshAuthToken()
      if (refreshed) {
        // Reintentar la petición original con nuevo token
        headers.Authorization = `Bearer ${authToken}`
        const retryResponse = await fetch(url, { ...requestConfig, headers })
        return handleResponse(retryResponse)
      } else {
        // Redirect to login if refresh fails
        tokenManager.clearTokens()
        window.location.href = '/login'
        throw new Error('Sesión expirada')
      }
    }
    
    return handleResponse(response)
    
  } catch (error) {
    console.error(`❌ API Error: ${requestConfig.method} ${url}`, error)
    
    if (error.name === 'AbortError') {
      throw new Error('La petición tardó demasiado tiempo')
    }
    
    if (!navigator.onLine) {
      throw new Error('Sin conexión a internet')
    }
    
    throw error
  }
}

// Procesar respuestas HTTP
const handleResponse = async (response) => {
  const isJson = response.headers.get('content-type')?.includes('application/json')
  const data = isJson ? await response.json() : await response.text()
  
  if (!response.ok) {
    const error = new Error(data.message || data || `HTTP ${response.status}`)
    error.status = response.status
    error.data = data
    throw error
  }
  
  console.log(`✅ API Success: ${response.status}`)
  return data
}

// Renovar token de autenticación
const refreshAuthToken = async () => {
  if (!refreshToken || tokenManager.isTokenExpired(refreshToken)) {
    return false
  }
  
  try {
    const response = await fetch(`${getBaseURL()}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken })
    })
    
    if (response.ok) {
      const data = await response.json()
      tokenManager.setTokens(data.accessToken, data.refreshToken || refreshToken)
      return true
    }
    
    return false
  } catch {
    return false
  }
}

// API Methods - Authentication
export const export default defineConfig({
  server: {
    port: 5173
  }
})authAPI = {
  login: async (credentials) => {
    const response = await makeRequest('/auth/login', {
      method: 'POST',
      body: credentials
    })
    
    // Guardar tokens después del login exitoso
    if (response.accessToken) {
      tokenManager.setTokens(response.accessToken, response.refreshToken)
    }
    
    return response
  },
  register: async (userData) => {
    return makeRequest('/v1/auth/register', {
      method: 'POST',
      body: userData
    })
  },
  verifyEmail: async (token) => {
    // Cambia el endpoint aquí:
    return makeRequest(`/v1/auth/confirm?token=${token}`, {
      method: 'GET'
    })
  },
  logout: async () => {
    try {
      await makeRequest('/auth/logout', { method: 'POST' })
    } finally {
      tokenManager.clearTokens()
    }
  },
  
  resendVerification: async (email) => {
    return makeRequest('/auth/resend-verification', {
      method: 'POST',
      body: { email }
    })
  },
  
  refreshToken: async () => {
    return refreshAuthToken()
  }
}

// API Methods - Users
export const usersAPI = {
  getProfile: async (userId = 'me') => {
    return makeRequest(`/users/${userId}`)
  },
  
  updateProfile: async (userData) => {
    return makeRequest('/users/profile', {
      method: 'PUT',
      body: userData
    })
  },
  
  changePassword: async (passwordData) => {
    return makeRequest('/users/change-password', {
      method: 'POST',
      body: passwordData
    })
  },
  
  deleteAccount: async () => {
    return makeRequest('/users/profile', {
      method: 'DELETE'
    })
  }
}

// API Methods - Sitters
export const sittersAPI = {
  search: async (filters = {}) => {
    const queryParams = new URLSearchParams()
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        queryParams.append(key, value)
      }
    })
    
    const endpoint = queryParams.toString() 
      ? `/sitters/search?${queryParams.toString()}` 
      : '/sitters/search'
    
    return makeRequest(endpoint)
  },
  
  getById: async (sitterId) => {
    return makeRequest(`/sitters/${sitterId}`)
  },
  
  registerSitter: async (sitterData) => {
    return makeRequest('/sitters/register', {
      method: 'POST',
      body: sitterData
    })
  },
  
  updateSitterProfile: async (sitterData) => {
    return makeRequest('/sitters/profile', {
      method: 'PUT',
      body: sitterData
    })
  },
  
  getSitterBookings: async (status = null) => {
    const endpoint = status ? `/sitters/bookings?status=${status}` : '/sitters/bookings'
    return makeRequest(endpoint)
  }
}

// API Methods - Owners
export const ownersAPI = {
  getProfile: async () => {
    return makeRequest('/owners/profile')
  },
  
  updateProfile: async (ownerData) => {
    return makeRequest('/owners/profile', {
      method: 'PUT',
      body: ownerData
    })
  },
  
  getBookings: async (status = null) => {
    const endpoint = status ? `/owners/bookings?status=${status}` : '/owners/bookings'
    return makeRequest(endpoint)
  }
}

// API Methods - Pets
export const petsAPI = {
  list: async () => {
    return makeRequest('/pets')
  },
  
  create: async (petData) => {
    return makeRequest('/pets', {
      method: 'POST',
      body: petData
    })
  },
  
  update: async (petId, petData) => {
    return makeRequest(`/pets/${petId}`, {
      method: 'PUT',
      body: petData
    })
  },
  
  delete: async (petId) => {
    return makeRequest(`/pets/${petId}`, {
      method: 'DELETE'
    })
  }
}

// API Methods - Bookings
export const bookingsAPI = {
  create: async (bookingData) => {
    return makeRequest('/bookings', {
      method: 'POST',
      body: bookingData
    })
  },
  
  list: async (filters = {}) => {
    const queryParams = new URLSearchParams()
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        queryParams.append(key, value)
      }
    })
    
    const endpoint = queryParams.toString() 
      ? `/bookings?${queryParams.toString()}` 
      : '/bookings'
    
    return makeRequest(endpoint)
  },
  
  getById: async (bookingId) => {
    return makeRequest(`/bookings/${bookingId}`)
  },
  
  update: async (bookingId, bookingData) => {
    return makeRequest(`/bookings/${bookingId}`, {
      method: 'PUT',
      body: bookingData
    })
  },
  
  cancel: async (bookingId, reason = '') => {
    return makeRequest(`/bookings/${bookingId}/cancel`, {
      method: 'POST',
      body: { reason }
    })
  },
  
  confirm: async (bookingId) => {
    return makeRequest(`/bookings/${bookingId}/confirm`, {
      method: 'POST'
    })
  },
  
  complete: async (bookingId) => {
    return makeRequest(`/bookings/${bookingId}/complete`, {
      method: 'POST'
    })
  },
  
  checkAvailability: async (sitterId, date) => {
    return makeRequest(`/bookings/availability/${sitterId}?date=${date}`)
  }
}

// API Methods - Payments
export const paymentsAPI = {
  processPayment: async (paymentData) => {
    return makeRequest('/payments/process', {
      method: 'POST',
      body: paymentData
    })
  },
  
  confirmPayment: async (paymentId, confirmationData) => {
    return makeRequest(`/payments/${paymentId}/confirm`, {
      method: 'POST',
      body: confirmationData
    })
  },
  
  getPaymentHistory: async () => {
    return makeRequest('/payments/history')
  },
  
  refundPayment: async (paymentId, refundData) => {
    return makeRequest(`/payments/${paymentId}/refund`, {
      method: 'POST',
      body: refundData
    })
  }
}

// API Methods - Services
export const servicesAPI = {
  list: async () => {
    return makeRequest('/services')
  },
  
  getPricing: async () => {
    return makeRequest('/services/pricing')
  },
  
  updatePricing: async (pricingData) => {
    return makeRequest('/services/pricing', {
      method: 'PUT',
      body: pricingData
    })
  }
}

// API Methods - Reviews
export const reviewsAPI = {
  create: async (reviewData) => {
    return makeRequest('/reviews', {
      method: 'POST',
      body: reviewData
    })
  },
  
  getByBooking: async (bookingId) => {
    return makeRequest(`/reviews/booking/${bookingId}`)
  },
  
  getBySitter: async (sitterId) => {
    return makeRequest(`/reviews/sitter/${sitterId}`)
  },
  
  update: async (reviewId, reviewData) => {
    return makeRequest(`/reviews/${reviewId}`, {
      method: 'PUT',
      body: reviewData
    })
  },
  
  delete: async (reviewId) => {
    return makeRequest(`/reviews/${reviewId}`, {
      method: 'DELETE'
    })
  }
}

// API Methods - Admin
export const adminAPI = {
  getStats: async () => {
    return makeRequest('/admin/stats')
  },
  
  getUsers: async (filters = {}) => {
    const queryParams = new URLSearchParams()
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        queryParams.append(key, value)
      }
    })
    
    const endpoint = queryParams.toString() 
      ? `/admin/users?${queryParams.toString()}` 
      : '/admin/users'
    
    return makeRequest(endpoint)
  },
  
  updateUser: async (userId, userData) => {
    return makeRequest(`/admin/users/${userId}`, {
      method: 'PUT',
      body: userData
    })
  },
  
  suspendUser: async (userId, reason) => {
    return makeRequest(`/admin/users/${userId}/suspend`, {
      method: 'POST',
      body: { reason }
    })
  },
  
  getReports: async () => {
    return makeRequest('/admin/reports')
  },
  
  resolveReport: async (reportId, resolution) => {
    return makeRequest(`/admin/reports/${reportId}/resolve`, {
      method: 'POST',
      body: { resolution }
    })
  },
  
  getFlaggedContent: async () => {
    return makeRequest('/admin/flagged-content')
  },
  
  moderateContent: async (contentId, action) => {
    return makeRequest(`/admin/content/${contentId}/moderate`, {
      method: 'POST',
      body: { action }
    })
  }
}

// API Methods - File Upload (integrado con el sistema existente)
export const uploadAPI = {
  uploadProfile: async (file, userId) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('userId', userId)
    
    return makeRequest('/upload/profile', {
      method: 'POST',
      body: formData
    })
  },
  
  uploadDocument: async (file, userId, documentType) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('userId', userId)
    formData.append('documentType', documentType)
    
    return makeRequest('/upload/document', {
      method: 'POST',
      body: formData
    })
  },
  
  uploadPet: async (file, userId, petId = null) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('userId', userId)
    if (petId) formData.append('petId', petId)
    
    return makeRequest('/upload/pet', {
      method: 'POST',
      body: formData
    })
  },
  
  deleteFile: async (folder, fileName) => {
    return makeRequest(`/files/${folder}/${fileName}`, {
      method: 'DELETE'
    })
  }
}

// Función para verificar conectividad
export const healthCheck = async () => {
  try {
    const response = await makeRequest('/health')
    return { status: 'healthy', data: response }
  } catch (error) {
    return { status: 'unhealthy', error: error.message }
  }
}

// Export del módulo principal
const api = {
  auth: authAPI,
  users: usersAPI,
  sitters: sittersAPI,
  owners: ownersAPI,
  pets: petsAPI,
  bookings: bookingsAPI,
  payments: paymentsAPI,
  services: servicesAPI,
  reviews: reviewsAPI,
  admin: adminAPI,
  upload: uploadAPI,
  healthCheck,
  tokenManager
}

export default api

useEffect(() => {
  const urlParams = new URLSearchParams(window.location.search)
  const token = urlParams.get('token')
  if (token) {
    api.auth.verifyEmail(token)
      .then(() => setSuccess(true))
      .catch(() => setError(true))
  }
}, [])