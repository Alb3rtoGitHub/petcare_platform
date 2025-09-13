import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Textarea } from "./ui/textarea"
import { Card, CardContent } from "./ui/card"
import { Badge } from "./ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { ImageWithFallback } from "./figma/ImageWithFallback"
import { Calendar, Clock, MapPin, Star, Heart, X, CheckCircle, Plus, Upload, Camera, ChevronDown, ChevronUp, Search } from "lucide-react"
import { getActiveServices, getServiceById, formatPriceWithCurrency, CURRENCY_TYPES } from "../services/servicesPricing.js"

interface Pet {
  id: string
  name: string
  type: string
  breed: string
  age: string
  image: string
  weight?: string
  specialNeeds?: string
}

interface Sitter {
  id: string
  name: string
  image: string
  rating: number
  location: string
  priceRange: string
  services: string[]
}

interface BookingModalProps {
  isOpen: boolean
  onClose: () => void
  sitter?: Sitter
  service: string
  userPets: Pet[]
  isAuthenticated: boolean
  onLoginRequired?: () => void
  onBookingComplete?: (bookingData: any) => void
  onProceedToPayment?: (bookingData: any) => void
}

export default function BookingModal({ 
  isOpen, 
  onClose, 
  sitter, 
  service, 
  userPets, 
  isAuthenticated, 
  onLoginRequired,
  onBookingComplete,
  onProceedToPayment 
}: BookingModalProps) {
  // Lista de cuidadores disponibles (datos de ejemplo)
  const availableSitters: Sitter[] = [
    {
      id: "sitter-1",
      name: "María González",
      image: "https://images.unsplash.com/photo-1559198837-e3d443d28c02?w=100&h=100&fit=crop&crop=face",
      rating: 4.9,
      location: "Madrid Centro",
      priceRange: "15-25€/hora",
      services: ["Paseos", "Cuidado a domicilio", "Hospedaje"]
    },
    {
      id: "sitter-2", 
      name: "Carlos Rodríguez",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
      rating: 4.8,
      location: "Madrid Norte",
      priceRange: "18-30€/hora",
      services: ["Paseos", "Cuidado a domicilio"]
    },
    {
      id: "sitter-3",
      name: "Ana Martín",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face",
      rating: 4.7,
      location: "Madrid Sur",
      priceRange: "12-22€/hora",
      services: ["Paseos", "Hospedaje"]
    },
    {
      id: "sitter-4",
      name: "Javier López",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
      rating: 4.6,
      location: "Madrid Este",
      priceRange: "20-35€/hora",
      services: ["Cuidado a domicilio", "Hospedaje"]
    },
    {
      id: "sitter-5",
      name: "Laura Fernández",
      image: "https://images.unsplash.com/photo-1494790108755-2616b9e8c8fa?w=100&h=100&fit=crop&crop=face",
      rating: 4.5,
      location: "Madrid Oeste",
      priceRange: "16-28€/hora",
      services: ["Paseos", "Hospedaje"]
    },
    {
      id: "sitter-6",
      name: "Miguel Santos",
      image: "https://images.unsplash.com/photo-1566492031773-4f4e44671d66?w=100&h=100&fit=crop&crop=face",
      rating: 4.4,
      location: "Madrid Centro",
      priceRange: "14-26€/hora",
      services: ["Cuidado a domicilio", "Hospedaje"]
    }
  ]

  const [selectedSitter, setSelectedSitter] = useState<Sitter | null>(sitter || null)
  const [showSitterSelection, setShowSitterSelection] = useState(!sitter)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedPets, setSelectedPets] = useState<string[]>([])
  const [selectedDate, setSelectedDate] = useState("")
  const [startTime, setStartTime] = useState("")
  const [endTime, setEndTime] = useState("")
  const [serviceType, setServiceType] = useState("Paseos")
  const [specialRequests, setSpecialRequests] = useState("")
  const [emergencyContact, setEmergencyContact] = useState("")
  const [step, setStep] = useState(1)
  const [isProcessing, setIsProcessing] = useState(false)
  
  // Estados para agregar mascota nueva
  const [showAddPetModal, setShowAddPetModal] = useState(false)
  const [newPet, setNewPet] = useState({
    name: "",
    type: "",
    breed: "",
    age: "",
    weight: "",
    specialNeeds: "",
    image: ""
  })
  const [customPets, setCustomPets] = useState<Pet[]>([])

  const timeSlots = [
    "08:00", "09:00", "10:00", "11:00", "12:00", 
    "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00", "22:00"
  ]

  const serviceTypes = [
    { value: "Paseos", label: "Paseos", unit: "horas" },
    { value: "Cuidado a domicilio", label: "Cuidado a domicilio", unit: "horas" },
    { value: "Hospedaje", label: "Hospedaje", unit: "días/noches" }
  ]

  const petTypes = ["Perro", "Gato", "Ave", "Reptil", "Roedor", "Pez", "Otro"]

  // Filtrar cuidadores basado en la búsqueda
  const filteredSitters = availableSitters.filter(sitter => {
    const query = searchQuery.toLowerCase()
    return (
      sitter.name.toLowerCase().includes(query) ||
      sitter.location.toLowerCase().includes(query) ||
      sitter.services.some(service => service.toLowerCase().includes(query))
    )
  })

  // Función para calcular la duración automáticamente
  const calculateDuration = () => {
    if (!selectedDate || !startTime || !endTime) return 0

    const selectedServiceType = serviceTypes.find(st => st.value === serviceType)
    const isHourlyService = selectedServiceType?.unit === "horas"

    if (isHourlyService) {
      // Para servicios por horas, calcular diferencia en horas
      const [startHour, startMin] = startTime.split(':').map(Number)
      const [endHour, endMin] = endTime.split(':').map(Number)
      
      const startMinutes = startHour * 60 + startMin
      const endMinutes = endHour * 60 + endMin
      
      if (endMinutes <= startMinutes) {
        return 0 // Hora de fin debe ser posterior a hora de inicio
      }
      
      const durationMinutes = endMinutes - startMinutes
      return Math.round(durationMinutes / 60 * 100) / 100 // Redondear a 2 decimales
    } else {
      // Para hospedaje, si hay fecha de inicio y fin diferentes, calcular días
      // Por ahora asumimos 1 día si no hay fecha de fin específica
      return 1
    }
  }

  // Función para obtener el precio del servicio desde el sistema centralizado
  const getServicePrice = (serviceName: string) => {
    const activeServices = getActiveServices()
    
    // Mapear nombres de servicios de la UI a nombres del sistema
    const serviceMapping: { [key: string]: string } = {
      "Paseos": "Paseo de perros",
      "Cuidado a domicilio": "Cuidado en casa", 
      "Hospedaje": "Hospedaje nocturno"
    }
    
    const mappedServiceName = serviceMapping[serviceName] || serviceName
    const service = activeServices.find(s => s.name === mappedServiceName)
    return service ? service.price : 20 // Precio por defecto si no se encuentra
  }

  // Calcular duración automáticamente
  const calculatedDuration = calculateDuration()

  // Obtener precio del servicio desde el sistema centralizado
  const basePrice = getServicePrice(serviceType)
  const selectedServiceType = serviceTypes.find(st => st.value === serviceType)
  const isHourlyService = selectedServiceType?.unit === "horas"
  const timeUnit = calculatedDuration || 1 // Usar duración calculada o 1 como mínimo
  const totalPrice = basePrice * timeUnit * Math.max(1, selectedPets.length)

  const allPets = [...userPets, ...customPets]

  // Validar que la hora de fin sea posterior a la de inicio
  const isValidTimeRange = () => {
    if (!startTime || !endTime) return true
    
    const [startHour, startMin] = startTime.split(':').map(Number)
    const [endHour, endMin] = endTime.split(':').map(Number)
    
    const startMinutes = startHour * 60 + startMin
    const endMinutes = endHour * 60 + endMin
    
    return endMinutes > startMinutes
  }

  const handleSitterSelect = (sitterId: string) => {
    const sitter = availableSitters.find(s => s.id === sitterId)
    if (sitter) {
      setSelectedSitter(sitter)
      setShowSitterSelection(false)
    }
  }

  const handlePetToggle = (petId: string) => {
    setSelectedPets(prev => {
      const isCurrentlySelected = prev.includes(petId)
      
      if (isCurrentlySelected) {
        return prev.filter(id => id !== petId)
      } else {
        return [...prev, petId]
      }
    })
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setNewPet(prev => ({
          ...prev,
          image: e.target?.result as string
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleAddPet = () => {
    if (newPet.name && newPet.type) {
      const pet: Pet = {
        id: `custom-${Date.now()}`,
        ...newPet,
        image: newPet.image || `https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=100&h=100&fit=crop&crop=face`
      }
      setCustomPets(prev => [...prev, pet])
      setNewPet({
        name: "",
        type: "",
        breed: "",
        age: "",
        weight: "",
        specialNeeds: "",
        image: ""
      })
      setShowAddPetModal(false)
    }
  }

  const handleSubmit = async () => {
    if (!isAuthenticated) {
      onLoginRequired?.()
      return
    }

    if (!selectedPets.length || !selectedDate || (isHourlyService && (!startTime || !endTime))) {
      return
    }

    // Validar que el rango de horas sea válido para servicios por horas
    if (isHourlyService && !isValidTimeRange()) {
      return
    }

    setIsProcessing(true)

    const selectedPetObjects = selectedPets.map(petId => 
      allPets.find(p => p.id === petId)
    ).filter(Boolean) as Pet[]

    const bookingData = {
      id: `booking-${Date.now()}`,
      sitterId: selectedSitter?.id || "",
      sitterName: selectedSitter?.name || "",
      sitterImage: selectedSitter?.image || "",
      service: serviceType,
      pets: selectedPetObjects,
      date: selectedDate,
      startTime: isHourlyService ? startTime : "Todo el día",
      endTime: isHourlyService ? endTime : "Todo el día",
      time: isHourlyService ? `${startTime} - ${endTime}` : "Todo el día",
      duration: timeUnit,
      serviceUnit: selectedServiceType?.unit,
      price: totalPrice,
      specialRequests,
      emergencyContact,
      status: 'pending',
      createdAt: new Date().toISOString()
    }

    setIsProcessing(false)
    
    // Ir directamente a la pasarela de pagos
    if (onProceedToPayment) {
      onProceedToPayment(bookingData)
    } else {
      onBookingComplete?.(bookingData)
    }
    
    handleClose()
  }

  const handleClose = () => {
    setStep(1)
    setSelectedPets([])
    setSelectedDate("")
    setStartTime("")
    setEndTime("")
    setServiceType("Paseos")
    setSpecialRequests("")
    setEmergencyContact("")
    setIsProcessing(false)
    setShowAddPetModal(false)
    setCustomPets([])
    onClose()
  }

  if (!isAuthenticated) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Iniciar Sesión Requerido</DialogTitle>
            <DialogDescription>
              Necesitas una cuenta para reservar servicios de cuidado para tus mascotas.
            </DialogDescription>
          </DialogHeader>
          <div className="text-center py-6">
            <div className="mx-auto w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
              <Heart className="h-8 w-8 text-orange-600" />
            </div>
            <h3 className="text-lg text-gray-900 mb-2">
              Inicia sesión para reservar
            </h3>
            <div className="flex gap-3">
              <Button variant="outline" onClick={handleClose} className="flex-1">
                Cancelar
              </Button>
              <Button onClick={onLoginRequired} className="flex-1">
                Iniciar Sesión
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Reservar Servicio</DialogTitle>
            <DialogDescription>
              Completa los detalles para reservar el servicio de cuidado para tu mascota.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Selección/Información del cuidador */}
            <Card>
              <CardContent className="p-4">
                {!selectedSitter || showSitterSelection ? (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <Label className="text-base">Selecciona tu cuidador</Label>
                      {selectedSitter && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setShowSitterSelection(false)}
                        >
                          <ChevronUp className="h-4 w-4 mr-1" />
                          Confirmar Selección
                        </Button>
                      )}
                    </div>
                    
                    {/* Campo de búsqueda */}
                    <div className="relative mb-4">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Buscar por nombre, ubicación o servicio..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                    
                    <div className="grid gap-3 max-h-80 overflow-y-auto">
                      {filteredSitters.length > 0 ? (
                        filteredSitters.map((sitter) => (
                          <Card 
                            key={sitter.id}
                            className={`cursor-pointer transition-all ${
                              selectedSitter?.id === sitter.id 
                                ? 'ring-2 ring-primary bg-primary/5' 
                                : 'hover:shadow-md'
                            }`}
                            onClick={() => handleSitterSelect(sitter.id)}
                          >
                            <CardContent className="p-3">
                              <div className="flex items-center space-x-3">
                                <Avatar className="h-10 w-10">
                                  <AvatarImage src={sitter.image} alt={sitter.name} />
                                  <AvatarFallback>{sitter.name.slice(0, 2)}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                  <h4 className="text-sm font-medium">{sitter.name}</h4>
                                  <div className="flex items-center text-xs text-gray-600 mb-1">
                                    <Star className="h-3 w-3 text-yellow-400 mr-1" />
                                    {sitter.rating}
                                    <span className="mx-2">•</span>
                                    <MapPin className="h-3 w-3 mr-1" />
                                    {sitter.location}
                                  </div>
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {sitter.services.map((service, index) => (
                                      <Badge key={service} variant="secondary" className="text-xs">
                                        {service}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                                <div className="flex-shrink-0">
                                  {selectedSitter?.id === sitter.id && (
                                    <CheckCircle className="h-5 w-5 text-primary" />
                                  )}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          <Search className="h-8 w-8 mx-auto mb-2 opacity-50" />
                          <p className="text-sm">No se encontraron cuidadores con "{searchQuery}"</p>
                          <p className="text-xs mt-1">Intenta con otros términos de búsqueda</p>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <Label className="text-base">Cuidador seleccionado</Label>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setShowSitterSelection(true)}
                      >
                        <ChevronDown className="h-4 w-4 mr-1" />
                        Cambiar Cuidador
                      </Button>
                    </div>
                    
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={selectedSitter.image} alt={selectedSitter.name} />
                        <AvatarFallback>{selectedSitter.name.slice(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h3 className="text-lg">{selectedSitter.name}</h3>
                        <div className="flex items-center text-sm text-gray-600 mb-1">
                          <Star className="h-4 w-4 text-yellow-400 mr-1" />
                          {selectedSitter.rating}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <MapPin className="h-4 w-4 mr-1" />
                          {selectedSitter.location}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg text-primary">{selectedSitter.priceRange}</p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Selección de tipo de servicio */}
            <div>
              <Label className="text-base mb-3 block">Tipo de servicio</Label>
              <Select value={serviceType} onValueChange={setServiceType}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar servicio" />
                </SelectTrigger>
                <SelectContent>
                  {serviceTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Selección de mascota */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <Label className="text-base">Selecciona tus mascotas</Label>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setShowAddPetModal(true)}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Agregar Mascota
                </Button>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {allPets.map((pet) => {
                  const isSelected = selectedPets.includes(pet.id)
                  return (
                    <Card 
                      key={pet.id} 
                      className={`cursor-pointer transition-all ${
                        isSelected ? 'ring-2 ring-primary bg-primary/5' : 'hover:shadow-md'
                      }`}
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        handlePetToggle(pet.id)
                      }}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 rounded-full overflow-hidden">
                            <ImageWithFallback
                              src={pet.image}
                              alt={pet.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <h4 className="text-sm">{pet.name}</h4>
                            <p className="text-xs text-gray-600">{pet.breed} • {pet.age}</p>
                            {pet.specialNeeds && (
                              <p className="text-xs text-orange-600 mt-1">{pet.specialNeeds}</p>
                            )}
                          </div>
                          {isSelected && (
                            <CheckCircle className="h-5 w-5 text-primary" />
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </div>

            {/* Fecha y horarios */}
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="date">Fecha del servicio</Label>
                  <Input
                    id="date"
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                
                {isHourlyService && (
                  <div>
                    <Label className="text-sm text-gray-600">
                      Duración: {calculatedDuration > 0 ? `${calculatedDuration} horas` : 'Selecciona horarios'}
                    </Label>
                    <div className="text-xs text-gray-500 mt-1">
                      {!isValidTimeRange() && startTime && endTime && (
                        <span className="text-red-500">La hora de fin debe ser posterior a la de inicio</span>
                      )}
                    </div>
                  </div>
                )}
              </div>
              
              {isHourlyService && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="startTime">Hora de inicio</Label>
                    <Select value={startTime} onValueChange={setStartTime}>
                      <SelectTrigger>
                        <SelectValue placeholder="Inicio" />
                      </SelectTrigger>
                      <SelectContent>
                        {timeSlots.map((time) => (
                          <SelectItem key={time} value={time}>
                            {time}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="endTime">Hora de fin</Label>
                    <Select value={endTime} onValueChange={setEndTime}>
                      <SelectTrigger>
                        <SelectValue placeholder="Fin" />
                      </SelectTrigger>
                      <SelectContent>
                        {timeSlots.map((time) => (
                          <SelectItem key={time} value={time}>
                            {time}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
              
              {!isHourlyService && (
                <div>
                  <Label htmlFor="days">Duración del hospedaje</Label>
                  <Select value="1" onValueChange={() => {}}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 6, 7, 14, 21, 30].map((day) => (
                        <SelectItem key={day} value={day.toString()}>
                          {day} {day === 1 ? 'día/noche' : 'días/noches'}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            {/* Contacto de emergencia */}
            <div>
              <Label htmlFor="emergency">Contacto de emergencia</Label>
              <Input
                id="emergency"
                placeholder="Nombre y teléfono"
                value={emergencyContact}
                onChange={(e) => setEmergencyContact(e.target.value)}
              />
            </div>

            {/* Instrucciones especiales */}
            <div>
              <Label htmlFor="requests">Instrucciones especiales (opcional)</Label>
              <Textarea
                id="requests"
                placeholder="Comparte cualquier información importante sobre tus mascotas..."
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
                rows={3}
              />
            </div>

            {/* Resumen de precio */}
            <Card className="bg-gray-50">
              <CardContent className="p-4 space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span>Servicio: {serviceType}</span>
                  <span>{basePrice}€/{selectedServiceType?.unit === "horas" ? "hora" : "día"}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span>Duración: {timeUnit} {selectedServiceType?.unit}</span>
                  <span>{basePrice * timeUnit}€</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span>Mascotas: {selectedPets.length}</span>
                  <span>x{selectedPets.length}</span>
                </div>
                <div className="border-t pt-2">
                  <div className="flex justify-between items-center">
                    <span className="text-lg">Total</span>
                    <span className="text-xl text-primary">{totalPrice}€</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-3 pt-4">
              <Button variant="outline" onClick={handleClose} className="flex-1">
                Cancelar
              </Button>
              <Button 
                onClick={handleSubmit}
                className="flex-1"
                disabled={!selectedPets.length || !selectedDate || (isHourlyService && (!startTime || !endTime)) || isProcessing}
              >
                {isProcessing ? "Procesando..." : "Continuar a Pago"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal para agregar mascota */}
      <Dialog open={showAddPetModal} onOpenChange={setShowAddPetModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Agregar Nueva Mascota</DialogTitle>
            <DialogDescription>
              Completa los datos de tu mascota para incluirla en la reserva.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {/* Foto de mascota */}
            <div>
              <Label>Foto de la mascota</Label>
              <div className="mt-2">
                {newPet.image ? (
                  <div className="relative w-24 h-24 mx-auto">
                    <img 
                      src={newPet.image} 
                      alt="Preview" 
                      className="w-full h-full object-cover rounded-full"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      className="absolute -top-2 -right-2 p-1 h-6 w-6 rounded-full"
                      onClick={() => setNewPet(prev => ({ ...prev, image: "" }))}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-24 h-24 border-2 border-dashed border-gray-300 rounded-full flex items-center justify-center">
                      <Camera className="h-8 w-8 text-gray-400" />
                    </div>
                    <label htmlFor="pet-photo" className="cursor-pointer">
                      <Button variant="outline" size="sm" asChild>
                        <span>
                          <Upload className="h-4 w-4 mr-2" />
                          Subir Foto
                        </span>
                      </Button>
                    </label>
                    <input
                      id="pet-photo"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="pet-name">Nombre *</Label>
                <Input
                  id="pet-name"
                  value={newPet.name}
                  onChange={(e) => setNewPet(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Nombre de la mascota"
                />
              </div>
              <div>
                <Label htmlFor="pet-type">Tipo *</Label>
                <Select 
                  value={newPet.type} 
                  onValueChange={(value) => setNewPet(prev => ({ ...prev, type: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent>
                    {petTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="pet-breed">Raza</Label>
                <Input
                  id="pet-breed"
                  value={newPet.breed}
                  onChange={(e) => setNewPet(prev => ({ ...prev, breed: e.target.value }))}
                  placeholder="Raza"
                />
              </div>
              <div>
                <Label htmlFor="pet-age">Edad</Label>
                <Input
                  id="pet-age"
                  value={newPet.age}
                  onChange={(e) => setNewPet(prev => ({ ...prev, age: e.target.value }))}
                  placeholder="Ej: 2 años"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="pet-needs">Necesidades especiales</Label>
              <Textarea
                id="pet-needs"
                value={newPet.specialNeeds}
                onChange={(e) => setNewPet(prev => ({ ...prev, specialNeeds: e.target.value }))}
                placeholder="Medicamentos, alergias, comportamiento especial..."
                rows={2}
              />
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setShowAddPetModal(false)} className="flex-1">
                Cancelar
              </Button>
              <Button onClick={handleAddPet} className="flex-1" disabled={!newPet.name || !newPet.type}>
                Agregar Mascota
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}