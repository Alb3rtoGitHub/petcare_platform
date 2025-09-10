import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Badge } from "./ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Checkbox } from "./ui/checkbox"
import { ImageWithFallback } from "./figma/ImageWithFallback"
import { Search, MapPin, Star, Heart, MessageSquare, Calendar, Filter, SlidersHorizontal, X, ShoppingCart, Clock } from "lucide-react"
import BookingModal from "./BookingModal"

interface CartItem {
  id: string
  sitterId: string
  sitterName: string
  sitterImage: string
  sitterRating: number
  service: string
  date: string
  startTime: string
  endTime: string
  duration: number
  pricePerHour: number
  location: string
  petType: string
  quantity: number
  specialRequests?: string
}

interface SearchSittersProps {
  onBack: () => void
  onBookService?: (service: any) => void
  isAuthenticated?: boolean
  userPets?: any[]
  onLoginRequired?: () => void
}

export default function SearchSitters({ onBack, onBookService, isAuthenticated, userPets, onLoginRequired }: SearchSittersProps) {
  const [searchLocation, setSearchLocation] = useState("")
  const [selectedServices, setSelectedServices] = useState<string[]>([])
  const [minRating, setMinRating] = useState("0")
  const [availability, setAvailability] = useState("any")
  const [showFilters, setShowFilters] = useState(false)
  
  // Nuevos filtros avanzados
  const [selectedDate, setSelectedDate] = useState("")
  const [selectedDays, setSelectedDays] = useState<string[]>([])
  const [timeSlot, setTimeSlot] = useState("any")
  const [serviceType, setServiceType] = useState("any")
  
  // Estados para el modal de reserva
  const [showBookingModal, setShowBookingModal] = useState(false)
  const [selectedSitter, setSelectedSitter] = useState<any>(null)
  const [selectedService, setSelectedService] = useState("")
  
  const daysOfWeek = [
    { value: "monday", label: "Lunes" },
    { value: "tuesday", label: "Martes" },
    { value: "wednesday", label: "Miércoles" },
    { value: "thursday", label: "Jueves" },
    { value: "friday", label: "Viernes" },
    { value: "saturday", label: "Sábado" },
    { value: "sunday", label: "Domingo" }
  ]
  
  const timeSlots = [
    { value: "any", label: "Cualquier hora" },
    { value: "morning", label: "Mañana (6:00 - 12:00)" },
    { value: "afternoon", label: "Tarde (12:00 - 18:00)" },
    { value: "evening", label: "Noche (18:00 - 24:00)" },
    { value: "overnight", label: "Madrugada (0:00 - 6:00)" }
  ]

  const services = [
    "Paseos",
    "Cuidado en casa",
    "Visitas",
    "Grooming",
    "Entrenamiento",
    "Emergencias",
    "Transporte",
    "Medicación"
  ]

  const sitters = [
    {
      id: 1,
      name: "María González",
      location: "Madrid Centro",
      distance: "0.8 km",
      rating: 4.9,
      reviews: 127,
      completedJobs: 243,
      services: ["Paseos", "Cuidado en casa", "Visitas"],
      priceRange: "15-20€/hora",
      availability: "Disponible hoy",
      verified: true,
      responseTime: "En 1 hora",
      experience: "5 años",
      about: "Amante de los animales con experiencia cuidando perros y gatos. Disponible para paseos diarios y cuidado en casa.",
      image: "https://images.unsplash.com/photo-1559198837-e3d443d28c02?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXQlMjBzaXR0ZXIlMjBwbGF5aW5nJTIwY2F0fGVufDF8fHx8MTc1NjI2MjQzOXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      specialties: ["Perros grandes", "Cachorros", "Medicación"]
    },
    {
      id: 2,
      name: "Carlos Rodríguez",
      location: "Barcelona Eixample",
      distance: "1.2 km",
      rating: 4.8,
      reviews: 89,
      completedJobs: 156,
      services: ["Paseos", "Entrenamiento", "Grooming"],
      priceRange: "18-25€/hora",
      availability: "Disponible mañana",
      verified: true,
      responseTime: "En 30 min",
      experience: "3 años",
      about: "Entrenador canino profesional. Especializado en comportamiento y obediencia básica.",
      image: "https://images.unsplash.com/photo-1649160388750-26fafdcaf4eb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXJzb24lMjB3YWxraW5nJTIwY2F0fGVufDF8fHx8MTc1NjI2MjQzOXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      specialties: ["Entrenamiento", "Perros reactivos", "Socialización"]
    },
    {
      id: 3,
      name: "Ana Martín",
      location: "Valencia Centro",
      distance: "2.1 km",
      rating: 5.0,
      reviews: 203,
      completedJobs: 387,
      services: ["Cuidado en casa", "Visitas", "Emergencias"],
      priceRange: "20-30€/hora",
      availability: "Disponible 24/7",
      verified: true,
      responseTime: "Inmediato",
      experience: "7 años",
      about: "Veterinaria con años de experiencia. Disponible para emergencias y cuidados especializados.",
      image: "https://images.unsplash.com/photo-1643213641079-1e60ef170910?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2ZXRlcmluYXJpYW4lMjBjYXJpbmclMjBwZXR8ZW58MXx8fHwxNzU2MjYyNDM5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      specialties: ["Emergencias", "Medicación", "Cuidados post-operatorios"]
    },
    {
      id: 4,
      name: "Lucía Hernández",
      location: "Sevilla Centro",
      distance: "1.5 km",
      rating: 4.7,
      reviews: 145,
      completedJobs: 298,
      services: ["Paseos", "Cuidado en casa", "Transporte"],
      priceRange: "16-22€/hora",
      availability: "Disponible hoy",
      verified: true,
      responseTime: "En 2 horas",
      experience: "4 años",
      about: "Estudiante de veterinaria apasionada por el bienestar animal. Flexible con horarios.",
      image: "https://images.unsplash.com/photo-1559198837-e3d443d28c02?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXQlMjBzaXR0ZXIlMjBwbGF5aW5nJTIwY2F0fGVufDF8fHx8MTc1NjI2MjQzOXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      specialties: ["Gatos", "Animales exóticos", "Transporte"]
    },
    {
      id: 5,
      name: "Roberto Silva",
      location: "Bilbao Casco Viejo",
      distance: "0.9 km",
      rating: 4.9,
      reviews: 76,
      completedJobs: 134,
      services: ["Paseos", "Grooming", "Entrenamiento"],
      priceRange: "17-24€/hora",
      availability: "Disponible fin de semana",
      verified: true,
      responseTime: "En 45 min",
      experience: "2 años",
      about: "Peluquero canino profesional. Me encanta mantener a las mascotas limpias y felices.",
      image: "https://images.unsplash.com/photo-1649160388750-26fafdcaf4eb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXJzb24lMjB3YWxraW5nJTIwY2F0fGVufDF8fHx8MTc1NjI2MjQzOXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      specialties: ["Grooming", "Razas de pelo largo", "Cortes especializados"]
    }
  ]

  const handleServiceToggle = (service: string) => {
    setSelectedServices(prev => 
      prev.includes(service) 
        ? prev.filter(s => s !== service)
        : [...prev, service]
    )
  }
  
  const handleDayToggle = (day: string) => {
    setSelectedDays(prev => 
      prev.includes(day) 
        ? prev.filter(d => d !== day)
        : [...prev, day]
    )
  }

  const handleBookService = (sitter: any, service: string) => {
    setSelectedSitter(sitter)
    setSelectedService(service)
    setShowBookingModal(true)
  }

  const handleViewProfile = (sitter: any) => {
    if (!isAuthenticated) {
      onLoginRequired?.()
      return
    }
    // Aquí se puede implementar la navegación al perfil del cuidador
    console.log('Ver perfil de:', sitter.name)
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
    <div className="min-h-screen bg-gray-50">
      {/* Header de búsqueda */}
      <div className="bg-white border-b sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex items-center space-x-2 sm:space-x-4 mb-4">
            <Button variant="ghost" onClick={onBack} className="shrink-0">
              ← Volver
            </Button>
            <h1 className="text-xl sm:text-2xl truncate">Buscar Cuidadores</h1>
          </div>

          <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:gap-4">
            <div className="flex-1 relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                placeholder="¿Dónde necesitas el servicio?"
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button className="flex-1 sm:flex-none">
                <Search className="h-4 w-4 mr-2" />
                Buscar
              </Button>
              <Button 
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="flex-1 sm:flex-none"
              >
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Filtros
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
        <div className="lg:flex lg:gap-6">
          {/* Panel de filtros - Modal en móvil, sidebar en desktop */}
          {showFilters && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden">
              <div className="fixed right-0 top-0 h-full w-80 max-w-[85vw] bg-white overflow-y-auto">
                <div className="p-4 border-b flex justify-between items-center">
                  <h2 className="text-lg">Filtros</h2>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setShowFilters(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <div className="p-4 space-y-6">
                  {/* Contenido de filtros */}
                  
                  {/* Fecha específica */}
                  <div>
                    <label className="text-sm text-gray-700 mb-3 block">Fecha específica</label>
                    <Input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  
                  {/* Días de la semana */}
                  <div>
                    <label className="text-sm text-gray-700 mb-3 block">Días de la semana</label>
                    <div className="grid grid-cols-2 gap-2">
                      {daysOfWeek.map((day) => (
                        <div key={day.value} className="flex items-center space-x-2">
                          <Checkbox
                            id={`mobile-day-${day.value}`}
                            checked={selectedDays.includes(day.value)}
                            onCheckedChange={() => handleDayToggle(day.value)}
                          />
                          <label htmlFor={`mobile-day-${day.value}`} className="text-sm text-gray-700">
                            {day.label}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Horario */}
                  <div>
                    <label className="text-sm text-gray-700 mb-3 block">Horario preferido</label>
                    <Select value={timeSlot} onValueChange={setTimeSlot}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar horario" />
                      </SelectTrigger>
                      <SelectContent>
                        {timeSlots.map((slot) => (
                          <SelectItem key={slot.value} value={slot.value}>
                            {slot.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {/* Tipo de servicio */}
                  <div>
                    <label className="text-sm text-gray-700 mb-3 block">Tipo de servicio</label>
                    <Select value={serviceType} onValueChange={setServiceType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="any">Todos los servicios</SelectItem>
                        <SelectItem value="hourly">Por horas (Paseos, Cuidado)</SelectItem>
                        <SelectItem value="daily">Por días (Hospedaje)</SelectItem>
                        <SelectItem value="emergency">Emergencias</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm text-gray-700 mb-3 block">Calificación mínima</label>
                    <Select value={minRating} onValueChange={setMinRating}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar calificación" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">Cualquiera</SelectItem>
                        <SelectItem value="3">3+ estrellas</SelectItem>
                        <SelectItem value="4">4+ estrellas</SelectItem>
                        <SelectItem value="4.5">4.5+ estrellas</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm text-gray-700 mb-3 block">Disponibilidad</label>
                    <Select value={availability} onValueChange={setAvailability}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar disponibilidad" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="any">Cualquier momento</SelectItem>
                        <SelectItem value="today">Disponible hoy</SelectItem>
                        <SelectItem value="tomorrow">Disponible mañana</SelectItem>
                        <SelectItem value="weekend">Fin de semana</SelectItem>
                        <SelectItem value="24/7">Disponible 24/7</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm text-gray-700 mb-3 block">Servicios</label>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {services.map((service) => (
                        <div key={service} className="flex items-center space-x-2">
                          <Checkbox
                            id={`mobile-${service}`}
                            checked={selectedServices.includes(service)}
                            onCheckedChange={() => handleServiceToggle(service)}
                          />
                          <label htmlFor={`mobile-${service}`} className="text-sm text-gray-700">
                            {service}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Panel de filtros desktop */}
          <div className="hidden lg:block lg:w-80 lg:shrink-0 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Filter className="h-5 w-5 mr-2" />
                  Filtros
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                
                {/* Fecha específica */}
                <div>
                  <label className="text-sm text-gray-700 mb-3 block">Fecha específica</label>
                  <Input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                
                {/* Días de la semana */}
                <div>
                  <label className="text-sm text-gray-700 mb-3 block">Días de la semana</label>
                  <div className="grid grid-cols-2 gap-2">
                    {daysOfWeek.map((day) => (
                      <div key={day.value} className="flex items-center space-x-2">
                        <Checkbox
                          id={`day-${day.value}`}
                          checked={selectedDays.includes(day.value)}
                          onCheckedChange={() => handleDayToggle(day.value)}
                        />
                        <label htmlFor={`day-${day.value}`} className="text-sm text-gray-700">
                          {day.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Horario */}
                <div>
                  <label className="text-sm text-gray-700 mb-3 block">Horario preferido</label>
                  <Select value={timeSlot} onValueChange={setTimeSlot}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar horario" />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots.map((slot) => (
                        <SelectItem key={slot.value} value={slot.value}>
                          {slot.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Tipo de servicio */}
                <div>
                  <label className="text-sm text-gray-700 mb-3 block">Tipo de servicio</label>
                  <Select value={serviceType} onValueChange={setServiceType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Todos los servicios</SelectItem>
                      <SelectItem value="hourly">Por horas (Paseos, Cuidado)</SelectItem>
                      <SelectItem value="daily">Por días (Hospedaje)</SelectItem>
                      <SelectItem value="emergency">Emergencias</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm text-gray-700 mb-3 block">Calificación mínima</label>
                  <Select value={minRating} onValueChange={setMinRating}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar calificación" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">Cualquiera</SelectItem>
                      <SelectItem value="3">3+ estrellas</SelectItem>
                      <SelectItem value="4">4+ estrellas</SelectItem>
                      <SelectItem value="4.5">4.5+ estrellas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm text-gray-700 mb-3 block">Disponibilidad</label>
                  <Select value={availability} onValueChange={setAvailability}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar disponibilidad" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Cualquier momento</SelectItem>
                      <SelectItem value="today">Disponible hoy</SelectItem>
                      <SelectItem value="tomorrow">Disponible mañana</SelectItem>
                      <SelectItem value="weekend">Fin de semana</SelectItem>
                      <SelectItem value="24/7">Disponible 24/7</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm text-gray-700 mb-3 block">Servicios</label>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {services.map((service) => (
                      <div key={service} className="flex items-center space-x-2">
                        <Checkbox
                          id={service}
                          checked={selectedServices.includes(service)}
                          onCheckedChange={() => handleServiceToggle(service)}
                        />
                        <label htmlFor={service} className="text-sm text-gray-700">
                          {service}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Lista de cuidadores */}
          <div className="flex-1 lg:min-w-0">
            <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-3 sm:space-y-0">
              <p className="text-gray-600 text-sm sm:text-base">{sitters.length} cuidadores encontrados</p>
              <Select defaultValue="rating">
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Ordenar por" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rating">Mejor calificación</SelectItem>
                  <SelectItem value="distance">Distancia</SelectItem>
                  <SelectItem value="reviews">Más reseñas</SelectItem>
                  <SelectItem value="experience">Experiencia</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4 sm:space-y-6">
              {sitters.map((sitter) => (
                <Card key={sitter.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <CardContent className="p-0">
                    <div className="flex flex-col sm:flex-row">
                      {/* Imagen */}
                      <div className="sm:w-48 sm:h-48 h-40 sm:shrink-0">
                        <ImageWithFallback
                          src={sitter.image}
                          alt={sitter.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Contenido */}
                      <div className="flex-1 p-4 sm:p-6">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-3 sm:mb-4 space-y-2 sm:space-y-0">
                          <div className="flex-1">
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                              <h3 className="text-lg sm:text-xl">{sitter.name}</h3>
                              {sitter.verified && (
                                <Badge variant="secondary" className="text-xs">
                                  ✓ Verificado
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center text-sm text-gray-600 mb-1">
                              <MapPin className="h-4 w-4 mr-1 shrink-0" />
                              <span className="truncate">{sitter.location} • {sitter.distance}</span>
                            </div>
                            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                              <div className="flex items-center">
                                <Star className="h-4 w-4 text-yellow-400 mr-1" />
                                {sitter.rating} ({sitter.reviews})
                              </div>
                              <span className="hidden sm:inline">{sitter.completedJobs} trabajos</span>
                            </div>
                          </div>
                          <div className="text-left sm:text-right shrink-0">
                            <p className="text-lg text-primary mb-1">{sitter.priceRange}</p>
                            <p className="text-sm text-green-600">{sitter.availability}</p>
                          </div>
                        </div>

                        <p className="text-gray-700 mb-3 sm:mb-4 text-sm line-clamp-2 sm:line-clamp-none">{sitter.about}</p>

                        {/* Servicios y especialidades */}
                        <div className="mb-3 sm:mb-4">
                          <div className="flex flex-wrap gap-1 mb-2">
                            {sitter.services.map((service) => (
                              <Badge key={service} variant="outline" className="text-xs">
                                {service}
                              </Badge>
                            ))}
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {sitter.specialties.slice(0, 3).map((specialty) => (
                              <Badge key={specialty} variant="secondary" className="text-xs">
                                {specialty}
                              </Badge>
                            ))}
                            {sitter.specialties.length > 3 && (
                              <Badge variant="secondary" className="text-xs">
                                +{sitter.specialties.length - 3} más
                              </Badge>
                            )}
                          </div>
                        </div>

                        {/* Información adicional */}
                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3 sm:mb-4">
                          <span>Exp: {sitter.experience}</span>
                          <span>Responde: {sitter.responseTime}</span>
                        </div>

                        {/* Botones de acción */}
                        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                          <Button 
                            className="flex-1 h-12 text-lg"
                            onClick={() => handleBookService(sitter, sitter.services[0])}
                            size="lg"
                          >
                            <Calendar className="h-5 w-5 mr-2" />
                            Reservar
                          </Button>
                          <Button 
                            variant="outline" 
                            className="flex-1"
                            onClick={() => handleViewProfile(sitter)}
                          >
                            Ver Perfil
                          </Button>
                          <Button variant="outline" size="icon" className="sm:shrink-0">
                            <Heart className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Paginación */}
            <div className="mt-6 sm:mt-8 flex justify-center">
              <div className="flex gap-1 sm:gap-2">
                <Button variant="outline" size="sm" disabled className="px-2 sm:px-4">Anterior</Button>
                <Button variant="outline" size="sm" className="px-2 sm:px-4">1</Button>
                <Button size="sm" className="px-2 sm:px-4">2</Button>
                <Button variant="outline" size="sm" className="px-2 sm:px-4">3</Button>
                <Button variant="outline" size="sm" className="px-2 sm:px-4">Siguiente</Button>
              </div>
            </div>
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
  )
}