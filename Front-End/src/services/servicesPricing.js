// Archivo de servicios y precios centralizados
// Este archivo define los precios de todos los servicios que se replican en toda la aplicación
// Preparado para ser reemplazado por datos del backend en el futuro

export const SERVICE_TYPES = {
  WALK: 'walk',
  HOME_CARE: 'home_care',
  OVERNIGHT: 'overnight',
  GROOMING: 'grooming',
  TRAINING: 'training',
  VET_VISIT: 'vet_visit'
}

export const PRICE_TYPES = {
  HOURLY: 'hourly',
  DAILY: 'daily', 
  FIXED: 'fixed'
}

// Tipos de moneda soportados
export const CURRENCY_TYPES = {
  EUR: 'EUR',
  USD: 'USD',
  GBP: 'GBP',
  COP: 'COP'
}

// Símbolos de moneda para display
export const CURRENCY_SYMBOLS = {
  [CURRENCY_TYPES.EUR]: '€',
  [CURRENCY_TYPES.USD]: '$',
  [CURRENCY_TYPES.GBP]: '£',
  [CURRENCY_TYPES.COP]: '$'
}

export const SERVICE_CATEGORIES = {
  BASIC_CARE: 'Cuidado básico',
  HOSTING: 'Hospedaje',
  SPECIALIZED: 'Servicios especializados',
  EMERGENCY: 'Emergencias'
}

// Datos maestros de servicios y precios
// En el futuro, estos datos vendrán del backend vía API
export const SERVICES_PRICING = [
  {
    id: "1",
    name: "Paseo de perros",
    type: SERVICE_TYPES.WALK,
    category: SERVICE_CATEGORIES.BASIC_CARE,
    price: 15.00, // Precio numérico con 2 decimales
    currency: CURRENCY_TYPES.EUR, // Nueva columna de moneda
    priceType: PRICE_TYPES.HOURLY,
    commission: 15,
    active: true,
    lastUpdated: "2025-01-20",
    averageMarketPrice: 16.50,
    popularityScore: 95,
    description: "Paseos personalizados para tu mascota",
    icon: "🚶‍♂️"
  },
  {
    id: "2", 
    name: "Cuidado en casa",
    type: SERVICE_TYPES.HOME_CARE,
    category: SERVICE_CATEGORIES.BASIC_CARE,
    price: 18.50,
    currency: CURRENCY_TYPES.EUR,
    priceType: PRICE_TYPES.HOURLY,
    commission: 15,
    active: true,
    lastUpdated: "2025-01-19",
    averageMarketPrice: 19.25,
    popularityScore: 87,
    description: "Cuidado de mascotas en tu hogar",
    icon: "🏠"
  },
  {
    id: "3",
    name: "Hospedaje nocturno",
    type: SERVICE_TYPES.OVERNIGHT,
    category: SERVICE_CATEGORIES.HOSTING,
    price: 35.00,
    currency: CURRENCY_TYPES.EUR,
    priceType: PRICE_TYPES.DAILY,
    commission: 20,
    active: true,
    lastUpdated: "2025-01-18",
    averageMarketPrice: 38.75,
    popularityScore: 72,
    description: "Tu mascota se queda en casa del cuidador",
    icon: "🌙"
  },
  {
    id: "4",
    name: "Grooming básico",
    type: SERVICE_TYPES.GROOMING,
    category: SERVICE_CATEGORIES.SPECIALIZED,
    price: 45.90,
    currency: CURRENCY_TYPES.EUR,
    priceType: PRICE_TYPES.FIXED,
    commission: 25,
    active: true,
    lastUpdated: "2025-01-15",
    averageMarketPrice: 48.50,
    popularityScore: 64,
    description: "Baño, corte y arreglo básico",
    icon: "✂️"
  },
  {
    id: "5",
    name: "Entrenamiento",
    type: SERVICE_TYPES.TRAINING,
    category: SERVICE_CATEGORIES.SPECIALIZED,
    price: 50.00,
    currency: CURRENCY_TYPES.EUR,
    priceType: PRICE_TYPES.HOURLY,
    commission: 20,
    active: true,
    lastUpdated: "2025-01-12",
    averageMarketPrice: 55.25,
    popularityScore: 58,
    description: "Entrenamiento básico de obediencia",
    icon: "🎾"
  },
  {
    id: "6",
    name: "Visitas veterinarias",
    type: SERVICE_TYPES.VET_VISIT,
    category: SERVICE_CATEGORIES.SPECIALIZED,
    price: 25.75,
    currency: CURRENCY_TYPES.EUR,
    priceType: PRICE_TYPES.FIXED,
    commission: 15,
    active: false,
    lastUpdated: "2025-01-10",
    averageMarketPrice: 28.00,
    popularityScore: 41,
    description: "Acompañamiento a citas veterinarias",
    icon: "🏥"
  }
]

// Función para obtener todos los servicios activos
export const getActiveServices = () => {
  return SERVICES_PRICING.filter(service => service.active)
}

// Función para obtener un servicio por ID
export const getServiceById = (id) => {
  return SERVICES_PRICING.find(service => service.id === id)
}

// Función para obtener servicios por categoría
export const getServicesByCategory = (category) => {
  return SERVICES_PRICING.filter(service => service.category === category && service.active)
}

// Función para obtener el precio de un servicio
export const getServicePrice = (serviceId) => {
  const service = getServiceById(serviceId)
  return service ? parseFloat(service.price.toFixed(2)) : 0.00
}

// Función para obtener la moneda de un servicio
export const getServiceCurrency = (serviceId) => {
  const service = getServiceById(serviceId)
  return service ? service.currency : CURRENCY_TYPES.EUR
}

// Función para obtener el símbolo de moneda de un servicio
export const getServiceCurrencySymbol = (serviceId) => {
  const currency = getServiceCurrency(serviceId)
  return CURRENCY_SYMBOLS[currency] || '€'
}

// Función para formatear precio con moneda
export const formatPriceWithCurrency = (price, currency) => {
  const symbol = CURRENCY_SYMBOLS[currency] || '€'
  const formattedPrice = parseFloat(price).toFixed(2)
  
  // Para pesos colombianos, mostrar sin decimales si son .00
  if (currency === CURRENCY_TYPES.COP) {
    const priceNumber = parseFloat(formattedPrice)
    if (priceNumber % 1 === 0) {
      return `${symbol}${priceNumber.toLocaleString('es-CO', { maximumFractionDigits: 0 })}`
    }
    return `${symbol}${priceNumber.toLocaleString('es-CO', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }
  
  return `${formattedPrice}${symbol}`
}

// Función para obtener el tipo de precio de un servicio (por hora, por día, fijo)
export const getServicePriceType = (serviceId) => {
  const service = getServiceById(serviceId)
  return service ? service.priceType : PRICE_TYPES.HOURLY
}

// Función para formatear el precio con el tipo y moneda
export const formatServicePrice = (serviceId) => {
  const service = getServiceById(serviceId)
  if (!service) return '0.00€'
  
  const priceText = formatPriceWithCurrency(service.price, service.currency)
  
  switch (service.priceType) {
    case PRICE_TYPES.HOURLY:
      return `${priceText}/hora`
    case PRICE_TYPES.DAILY:
      return `${priceText}/día`
    case PRICE_TYPES.FIXED:
      return priceText
    default:
      return priceText
  }
}

// Función para calcular la ganancia por comisión
export const calculateCommissionGain = (price, commissionPercentage) => {
  const numPrice = parseFloat(price) || 0
  const numCommission = parseFloat(commissionPercentage) || 0
  return parseFloat((numPrice * numCommission / 100).toFixed(2))
}

// Función para calcular el precio de mercado (precio + comisión)
export const calculateMarketPrice = (price, commissionPercentage) => {
  const numPrice = parseFloat(price) || 0
  const commissionGain = calculateCommissionGain(price, commissionPercentage)
  return parseFloat((numPrice + commissionGain).toFixed(2))
}

// Función para formatear la ganancia por comisión con moneda
export const formatCommissionGain = (price, commissionPercentage, currency) => {
  const gain = calculateCommissionGain(price, commissionPercentage)
  return formatPriceWithCurrency(gain, currency)
}

// Función para formatear el precio de mercado con moneda
export const formatMarketPrice = (price, commissionPercentage, currency) => {
  const marketPrice = calculateMarketPrice(price, commissionPercentage)
  return formatPriceWithCurrency(marketPrice, currency)
}

// Función para calcular el precio total basado en duración
export const calculateTotalPrice = (serviceId, duration = 1) => {
  const service = getServiceById(serviceId)
  if (!service) return 0.00
  
  const total = service.price * duration
  return parseFloat(total.toFixed(2))
}

// Función para validar precio numérico con 2 decimales
export const validatePrice = (price) => {
  const numPrice = parseFloat(price)
  return !isNaN(numPrice) && numPrice >= 0 && numPrice <= 999999.99
}

// Función para normalizar precio a 2 decimales
export const normalizePrice = (price) => {
  const numPrice = parseFloat(price)
  return isNaN(numPrice) ? 0.00 : parseFloat(numPrice.toFixed(2))
}

// Funciones para uso futuro con backend
export const API_ENDPOINTS = {
  GET_SERVICES: '/api/services',
  GET_SERVICE_BY_ID: '/api/services/:id',
  UPDATE_SERVICE_PRICE: '/api/services/:id/price',
  GET_ACTIVE_SERVICES: '/api/services/active',
  GET_CURRENCIES: '/api/currencies', // Nuevo endpoint para monedas
  UPDATE_SERVICE_CURRENCY: '/api/services/:id/currency' // Nuevo endpoint para actualizar moneda
}

// Función placeholder para cuando se integre con el backend
export const fetchServicesFromAPI = async () => {
  // TODO: Implementar cuando se tenga el backend
  // const response = await fetch(API_ENDPOINTS.GET_SERVICES)
  // return response.json()
  
  // Por ahora devolver datos locales
  return SERVICES_PRICING
}

// Función placeholder para actualizar precios vía API
export const updateServicePriceAPI = async (serviceId, newPrice, currency = null) => {
  // TODO: Implementar cuando se tenga el backend
  // const payload = { price: parseFloat(newPrice).toFixed(2) }
  // if (currency) payload.currency = currency
  
  // const response = await fetch(API_ENDPOINTS.UPDATE_SERVICE_PRICE.replace(':id', serviceId), {
  //   method: 'PATCH',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(payload)
  // })
  // return response.json()
  
  const normalizedPrice = normalizePrice(newPrice)
  const currencySymbol = currency ? CURRENCY_SYMBOLS[currency] : '€'
  console.log(`Actualizando precio del servicio ${serviceId} a ${normalizedPrice}${currencySymbol}`)
  return { 
    success: true, 
    price: normalizedPrice,
    currency: currency || CURRENCY_TYPES.EUR
  }
}

// Función placeholder para obtener monedas disponibles
export const fetchAvailableCurrencies = async () => {
  // TODO: Implementar cuando se tenga el backend
  // const response = await fetch(API_ENDPOINTS.GET_CURRENCIES)
  // return response.json()
  
  // Por ahora devolver monedas estáticas
  return Object.entries(CURRENCY_TYPES).map(([key, value]) => ({
    code: value,
    symbol: CURRENCY_SYMBOLS[value],
    name: key
  }))
}