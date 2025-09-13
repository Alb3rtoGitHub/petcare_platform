import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { Input } from "./ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Clock, DollarSign, MapPin, Star, Search, Filter, ArrowLeft, Heart, User, CheckCircle } from "lucide-react"
import BookingModal from "./BookingModal"
import { getActiveServices, formatServicePrice, getServicePrice } from "../services/servicesPricing.js"

interface Service {
  id: string
  name: string
  type: 'walk' | 'home-care' | 'boarding' | 'daycare'
  description: string
  price: number
  duration: string
  location: string
  availability: string[]
  sitterName: string
  sitterRating: number
  sitterImage: string
  sitterExperience: string
}

const serviceTypes = {
  'walk': 'Paseos',
  'home-care': 'Cuidado en Casa',
  'boarding': 'Hospedaje',
  'daycare': 'Guardería'
}

// Servicios mock que usan precios del archivo compartido
const mockServices: Service[] = [
  {
    id: '1',
    name: 'Paseo Relajado en el Parque',
    type: 'walk',
    description: 'Paseo tranquilo por el parque con tu mascota, ideal para perros de todas las edades',
    price: getServicePrice("1"), // Paseo de perros
    duration: '30 min',
    location: 'Parques cercanos',
    availability: ['Mañana', 'Tarde'],
    sitterName: 'María García',
    sitterRating: 4.8,
    sitterImage: 'https://images.unsplash.com/photo-1494790108755-2616b9c29490?w=100&h=100&fit=crop&crop=face',
    sitterExperience: '5 años de experiencia'
  },
  {
    id: '2',
    name: 'Cuidado Premium en Casa',
    type: 'home-care',
    description: 'Cuidado completo en tu hogar con atención personalizada y actualizaciones regulares',
    price: getServicePrice("2"), // Cuidado en casa
    duration: '2 horas',
    location: 'En casa del cliente',
    availability: ['Mañana', 'Tarde', 'Todo el día'],
    sitterName: 'Carlos López',
    sitterRating: 4.9,
    sitterImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    sitterExperience: '8 años de experiencia'
  },
  {
    id: '3',
    name: 'Guardería Divertida',
    type: 'daycare',
    description: 'Cuidado grupal con actividades, socialización y mucha diversión',
    price: getServicePrice("2"), // Usar precio de cuidado en casa
    duration: '8 horas',
    location: 'Centro de cuidado',
    availability: ['Todo el día'],
    sitterName: 'Ana Martínez',
    sitterRating: 4.7,
    sitterImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
    sitterExperience: '3 años de experiencia'
  },
  {
    id: '4',
    name: 'Hospedaje Nocturno',
    type: 'boarding',
    description: 'Tu mascota se queda en un hogar amoroso durante tu ausencia',
    price: getServicePrice("3"), // Hospedaje nocturno
    duration: 'Por día',
    location: 'Casa del cuidador',
    availability: ['Todo el día', 'Fines de semana'],
    sitterName: 'Luis Rodríguez',
    sitterRating: 4.6,
    sitterImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
    sitterExperience: '4 años de experiencia'
  },
  {
    id: '5',
    name: 'Paseo Activo',
    type: 'walk',
    description: 'Paseo energético perfecto para perros jóvenes y activos',
    price: getServicePrice("1"), // Paseo de perros
    duration: '45 min',
    location: 'Parques y rutas',
    availability: ['Mañana', 'Tarde'],
    sitterName: 'Sofia Herrera',
    sitterRating: 4.9,
    sitterImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face',
    sitterExperience: '6 años de experiencia'
  },
  {
    id: '6',
    name: 'Cuidado Básico',
    type: 'home-care',
    description: 'Cuidado esencial en casa con alimentación y compañía',
    price: getServicePrice("2"), // Cuidado en casa
    duration: '1 hora',
    location: 'En casa del cliente',
    availability: ['Mañana', 'Tarde', 'Noche'],
    sitterName: 'Pedro Morales',
    sitterRating: 4.5,
    sitterImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
    sitterExperience: '2 años de experiencia'
  }
]

interface ServicesViewProps {
  onBack: () => void
  onBookService: (service: any) => void
  isAuthenticated?: boolean
  userPets?: any[]
  onLoginRequired?: () => void
  onSearchSitters?: () => void
  onViewServices?: () => void
  onShowLogin?: () => void
  onShowRegister?: () => void
}

export default function ServicesView({ 
  onBack, 
  onBookService, 
  isAuthenticated = false, 
  userPets = [], 
  onLoginRequired,
  onSearchSitters,
  onViewServices,
  onShowLogin,
  onShowRegister
}: ServicesViewProps) {
  const [services] = useState<Service[]>(mockServices)
  const [filteredServices, setFilteredServices] = useState<Service[]>(mockServices)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState<string>('all')
  
  // Estados para el modal de reserva
  const [showBookingModal, setShowBookingModal] = useState(false)
  const [selectedSitter, setSelectedSitter] = useState<any>(null)
  const [selectedService, setSelectedService] = useState("")
  
  const handleSearch = (term: string) => {
    setSearchTerm(term)
    filterServices(term, selectedType)
  }

  const handleTypeFilter = (type: string) => {
    setSelectedType(type)
    filterServices(searchTerm, type)
  }

  const filterServices = (search: string, type: string) => {
    let filtered = services

    // Filtro por búsqueda
    if (search) {
      filtered = filtered.filter(service =>
        service.name.toLowerCase().includes(search.toLowerCase()) ||
        service.sitterName.toLowerCase().includes(search.toLowerCase()) ||
        service.description.toLowerCase().includes(search.toLowerCase())
      )
    }

    // Filtro por tipo
    if (type !== 'all') {
      filtered = filtered.filter(service => service.type === type)
    }

    setFilteredServices(filtered)
  }

  const handleBookServiceDirect = (service: Service) => {
    // Convertir a formato sitter para el modal
    const sitterData = {
      id: service.id,
      name: service.sitterName,
      image: service.sitterImage,
      rating: service.sitterRating,
      location: service.location,
      priceRange: `${service.price}-${service.price + 10}€/hora`,
      services: [serviceTypes[service.type]]
    }
    
    setSelectedSitter(sitterData)
    setSelectedService(serviceTypes[service.type])
    setShowBookingModal(true)
  }

  const handleViewProfile = (service: Service) => {
    if (!isAuthenticated) {
      onLoginRequired?.()
      return
    }
    
    // Aquí se podría implementar la vista del perfil del cuidador
    console.log('Ver perfil de:', service.sitterName)
  }

  const handleBookingComplete = (bookingData: any) => {
    // Aquí se manejaría la reserva completada
    console.log('Reserva completada:', bookingData)
    setShowBookingModal(false)
    setSelectedSitter(null)
    setSelectedService("")
  }

  const handleProceedToPayment = (bookingData: any) => {
    // Crear item del carrito y proceder al pago
    const cartItem = {
      id: bookingData.id,
      sitterId: bookingData.sitterId,
      sitterName: bookingData.sitterName,
      sitterImage: bookingData.sitterImage,
      sitterRating: selectedSitter?.rating || 4.5,
      service: bookingData.service,
      date: bookingData.date,
      startTime: bookingData.time,
      endTime: bookingData.time,
      duration: bookingData.duration,
      pricePerHour: bookingData.price / bookingData.duration,
      location: selectedSitter?.location || "Por definir",
      petType: bookingData.pets[0]?.type || "Mascota",
      quantity: 1,
      specialRequests: bookingData.specialRequests
    }
    
    // Pasar al callback del padre para manejar el pago
    if (onBookService) {
      onBookService({ cartItem, bookingData })
    }
    
    setShowBookingModal(false)
    setSelectedSitter(null)
    setSelectedService("")
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
          </div>
          <div className="text-center">
            <h1 className="text-4xl text-gray-900 mb-4">Servicios de Cuidado</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Encuentra el cuidado perfecto para tu mascota con nuestros cuidadores verificados
            </p>
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar servicios o cuidadores..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedType} onValueChange={handleTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Tipo de servicio" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los tipos</SelectItem>
                {Object.entries(serviceTypes).map(([key, value]) => (
                  <SelectItem key={key} value={key}>{value}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Filter className="h-4 w-4" />
              {filteredServices.length} servicios encontrados
            </div>
          </div>
        </div>

        {/* Lista de Servicios */}
        <div className="grid gap-6">
          {filteredServices.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <Search className="h-8 w-8 text-gray-400" />
                </div>
                <h3>No se encontraron servicios</h3>
                <p className="text-gray-600 text-center mt-2">
                  Prueba ajustando los filtros o cambiando el término de búsqueda
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredServices.map((service) => (
              <Card key={service.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row gap-6">
                    {/* Información del Cuidador */}
                    <div className="flex items-center gap-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={service.sitterImage} alt={service.sitterName} />
                        <AvatarFallback>{service.sitterName[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h4>{service.sitterName}</h4>
                        <div className="flex items-center gap-1 mt-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm">{service.sitterRating}</span>
                        </div>
                        <p className="text-sm text-gray-600">{service.sitterExperience}</p>
                      </div>
                    </div>

                    {/* Información del Servicio */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center gap-2 mb-2">
                            <h3>{service.name}</h3>
                            <Badge variant="secondary">
                              {serviceTypes[service.type]}
                            </Badge>
                          </div>
                          <p className="text-gray-600">{service.description}</p>
                        </div>
                        <div className="text-right ml-4">
                          <p className="text-2xl text-primary">{service.price}€</p>
                          <p className="text-sm text-gray-600">{service.duration}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Clock className="h-4 w-4" />
                          <span>{service.duration}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <MapPin className="h-4 w-4" />
                          <span>{service.location}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <DollarSign className="h-4 w-4" />
                          <span>{service.price}€</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600 mb-1">Disponibilidad:</p>
                          <div className="flex flex-wrap gap-1">
                            {service.availability.map((slot) => (
                              <Badge key={slot} variant="outline" className="text-xs">
                                {slot}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <Button 
                          onClick={() => handleBookServiceDirect(service)}
                          className="ml-4 h-14 px-8 text-lg font-medium"
                          size="lg"
                        >
                          Reservar Ahora
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Call to Action */}
        <div className="mt-12 bg-primary text-white py-16 px-4 sm:px-6 lg:px-8 rounded-lg">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl mb-4">¿Listo para Comenzar?</h2>
            <p className="text-xl mb-8 opacity-90">
              Únete a la comunidad PetCare y experimenta el mejor cuidado para mascotas
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {isAuthenticated ? (
                // Botones para usuarios autenticados
                <>
                  <Button size="lg" variant="secondary" onClick={onSearchSitters}>
                    <Heart className="h-5 w-5 mr-2" />
                    Buscar Cuidadores
                  </Button>
                  <Button size="lg" variant="secondary" onClick={onViewServices}>
                    <Search className="h-5 w-5 mr-2" />
                    Servicios
                  </Button>
                </>
              ) : (
                // Botones para usuarios no autenticados
                <>
                  <Button size="lg" variant="secondary" onClick={onShowLogin}>
                    <Heart className="h-5 w-5 mr-2" />
                    Iniciar Sesión
                  </Button>
                  <Button size="lg" variant="secondary" onClick={onShowRegister}>
                    <CheckCircle className="h-5 w-5 mr-2" />
                    Registrarse
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Modal de reserva */}
        <BookingModal
          isOpen={showBookingModal}
          onClose={() => setShowBookingModal(false)}
          sitter={selectedSitter}
          service={selectedService}
          userPets={userPets || []}
          isAuthenticated={!!isAuthenticated}
          onLoginRequired={onLoginRequired}
          onBookingComplete={handleBookingComplete}
          onProceedToPayment={handleProceedToPayment}
        />
      </div>
    </div>
  )
}