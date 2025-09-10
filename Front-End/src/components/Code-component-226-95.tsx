import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { Calendar } from "./ui/calendar"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Textarea } from "./ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Checkbox } from "./ui/checkbox"
import { ImageWithFallback } from "./figma/ImageWithFallback"
import { 
  ArrowLeft, 
  Calendar as CalendarIcon, 
  Clock, 
  MapPin, 
  Star, 
  User,
  Heart,
  ShoppingCart,
  Info,
  Plus,
  X,
  PawPrint
} from "lucide-react"

interface Service {
  id: number
  title: string
  description: string
  price: string
  duration: string
  rating: number
  reviews: number
  category: string
  provider: {
    name: string
    image: string
    rating: number
    location: string
  }
  image: string
}

interface Pet {
  id: string
  name: string
  type: string
  breed?: string
  age?: string
  weight?: string
  specialNeeds?: string
}

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
  pricePerHour?: number
  pricePerDay?: number
  location: string
  pets: Pet[]
  quantity: number
  specialRequests?: string
  serviceType: 'hourly' | 'daily'
}

interface EnhancedBookingCalendarProps {
  service: Service
  onBack: () => void
  onAddToCart: (item: CartItem) => void
  onGoToCart: () => void
  userPets?: Pet[] // Pets registrados del usuario
}

export default function EnhancedBookingCalendar({ 
  service, 
  onBack, 
  onAddToCart, 
  onGoToCart,
  userPets = []
}: EnhancedBookingCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [selectedTime, setSelectedTime] = useState("")
  const [duration, setDuration] = useState("1")
  const [days, setDays] = useState("1")
  const [selectedPets, setSelectedPets] = useState<string[]>([])
  const [customPets, setCustomPets] = useState<Pet[]>([])
  const [specialRequests, setSpecialRequests] = useState("")
  const [location, setLocation] = useState("")
  const [serviceType, setServiceType] = useState<'hourly' | 'daily'>('hourly')

  // Available time slots
  const timeSlots = [
    "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30",
    "16:00", "16:30", "17:00", "17:30", "18:00", "18:30", "19:00", "19:30", "20:00"
  ]

  const petTypes = ["Perro", "Gato", "Ave", "Reptil", "Roedor", "Pez", "Otro"]

  // Determinar tipo de servicio basado en la categoría
  useEffect(() => {
    if (service.category === "Hospedaje" || service.title.toLowerCase().includes("hospedaje")) {
      setServiceType('daily')
    } else {
      setServiceType('hourly')
    }
  }, [service])

  const getAllPets = () => [...userPets, ...customPets]
  const getSelectedPetObjects = () => {
    const allPets = getAllPets()
    return selectedPets.map(petId => allPets.find(pet => pet.id === petId)).filter(Boolean) as Pet[]
  }

  const isFormValid = selectedDate && 
    (serviceType === 'daily' || selectedTime) && 
    selectedPets.length > 0 && 
    location

  const calculateEndTime = (startTime: string, duration: number) => {
    const [hours, minutes] = startTime.split(':').map(Number)
    const endHours = hours + duration
    const endMinutes = minutes
    
    if (endHours >= 24) {
      return `${(endHours - 24).toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')} (+1 día)`
    }
    
    return `${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`
  }

  const addCustomPet = () => {
    const newPet: Pet = {
      id: `custom-${Date.now()}`,
      name: "",
      type: "",
      breed: "",
      age: "",
      weight: "",
      specialNeeds: ""
    }
    setCustomPets(prev => [...prev, newPet])
  }

  const updateCustomPet = (petId: string, field: keyof Pet, value: string) => {
    setCustomPets(prev => prev.map(pet => 
      pet.id === petId ? { ...pet, [field]: value } : pet
    ))
  }

  const removeCustomPet = (petId: string) => {
    setCustomPets(prev => prev.filter(pet => pet.id !== petId))
    setSelectedPets(prev => prev.filter(id => id !== petId))
  }

  const togglePetSelection = (petId: string) => {
    setSelectedPets(prev => 
      prev.includes(petId) 
        ? prev.filter(id => id !== petId)
        : [...prev, petId]
    )
  }

  const handleConfirmBooking = () => {
    if (!isFormValid) return

    const selectedPetObjects = getSelectedPetObjects()
    const basePrice = parseInt(service.price.replace('€', '').split('/')[0])
    
    const cartItem: CartItem = {
      id: `${service.id}-${selectedDate?.getTime()}-${selectedTime || 'daily'}`,
      sitterId: service.id.toString(),
      sitterName: service.provider.name,
      sitterImage: service.provider.image,
      sitterRating: service.provider.rating,
      service: service.title,
      date: selectedDate!.toISOString().split('T')[0],
      startTime: serviceType === 'hourly' ? selectedTime : "00:00",
      endTime: serviceType === 'hourly' 
        ? calculateEndTime(selectedTime, parseInt(duration)).replace(' (+1 día)', '')
        : "23:59",
      duration: serviceType === 'hourly' ? parseInt(duration) : parseInt(days),
      pricePerHour: serviceType === 'hourly' ? basePrice : undefined,
      pricePerDay: serviceType === 'daily' ? basePrice : undefined,
      location: location,
      pets: selectedPetObjects,
      quantity: 1,
      specialRequests: specialRequests,
      serviceType: serviceType
    }

    onAddToCart(cartItem)
    onGoToCart()
  }

  const formatDate = (date: Date | undefined) => {
    if (!date) return ""
    return date.toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const calculateTotalPrice = () => {
    if (!selectedTime && serviceType === 'hourly') return 0
    
    const basePrice = parseInt(service.price.replace('€', '').split('/')[0])
    const timeUnit = serviceType === 'hourly' ? parseInt(duration) : parseInt(days)
    const petMultiplier = Math.max(1, selectedPets.length)
    
    return basePrice * timeUnit * petMultiplier
  }

  const totalPrice = calculateTotalPrice()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver a Servicios
            </Button>
            <h1 className="text-2xl">Reservar Servicio</h1>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Service Info */}
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex gap-4 mb-4">
                  <ImageWithFallback
                    src={service.image}
                    alt={service.title}
                    className="w-20 h-20 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h3 className="text-xl mb-2">{service.title}</h3>
                    <p className="text-gray-600 text-sm mb-3">{service.description}</p>
                    <div className="flex items-center gap-4 text-sm">
                      <Badge variant="secondary">{service.category}</Badge>
                      <Badge variant={serviceType === 'hourly' ? 'default' : 'destructive'}>
                        {serviceType === 'hourly' ? 'Por horas' : 'Por días'}
                      </Badge>
                      <span className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 mr-1" />
                        {service.rating} ({service.reviews})
                      </span>
                    </div>
                  </div>
                </div>

                {/* Provider Info */}
                <div className="border-t pt-4">
                  <div className="flex items-center gap-3">
                    <ImageWithFallback
                      src={service.provider.image}
                      alt={service.provider.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <h4 className="font-medium">{service.provider.name}</h4>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Star className="h-3 w-3 text-yellow-400" />
                        <span>{service.provider.rating}</span>
                        <span>•</span>
                        <MapPin className="h-3 w-3" />
                        <span>{service.provider.location}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Price Summary */}
            {((serviceType === 'hourly' && selectedTime) || serviceType === 'daily') && selectedPets.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Resumen de Precio</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span>{service.title}</span>
                    <span>{service.price}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{serviceType === 'hourly' ? 'Duración' : 'Días'}</span>
                    <span>{serviceType === 'hourly' ? `${duration}h` : `${days} días`}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Mascotas</span>
                    <span>{selectedPets.length}</span>
                  </div>
                  <div className="flex justify-between border-t pt-3 font-medium">
                    <span>Total</span>
                    <span className="text-xl text-primary">{totalPrice}€</span>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Booking Form */}
          <div className="space-y-6">
            {/* Service Type Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Tipo de Servicio</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    variant={serviceType === 'hourly' ? 'default' : 'outline'}
                    onClick={() => setServiceType('hourly')}
                    className="h-16 flex-col"
                  >
                    <Clock className="h-5 w-5 mb-1" />
                    Por Horas
                  </Button>
                  <Button
                    variant={serviceType === 'daily' ? 'default' : 'outline'}
                    onClick={() => setServiceType('daily')}
                    className="h-16 flex-col"
                  >
                    <CalendarIcon className="h-5 w-5 mb-1" />
                    Por Días
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Date Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Seleccionar Fecha</CardTitle>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={(date) => date < new Date() || date < new Date(Date.now() - 86400000)}
                  className="rounded-md border"
                />
                {selectedDate && (
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-2 text-blue-700">
                      <CalendarIcon className="h-4 w-4" />
                      <span className="font-medium">Fecha seleccionada:</span>
                    </div>
                    <p className="text-blue-600 mt-1">{formatDate(selectedDate)}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Time and Duration */}
            <Card>
              <CardHeader>
                <CardTitle>
                  {serviceType === 'hourly' ? 'Hora y Duración' : 'Duración del Hospedaje'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {serviceType === 'hourly' && (
                  <div>
                    <Label htmlFor="time">Hora de inicio</Label>
                    <Select value={selectedTime} onValueChange={setSelectedTime}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar hora" />
                      </SelectTrigger>
                      <SelectContent>
                        {timeSlots.map(time => (
                          <SelectItem key={time} value={time}>{time}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div>
                  <Label htmlFor="duration">
                    {serviceType === 'hourly' ? 'Duración (horas)' : 'Duración (días/noches)'}
                  </Label>
                  <Select 
                    value={serviceType === 'hourly' ? duration : days} 
                    onValueChange={serviceType === 'hourly' ? setDuration : setDays}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={`Seleccionar ${serviceType === 'hourly' ? 'duración' : 'días'}`} />
                    </SelectTrigger>
                    <SelectContent>
                      {serviceType === 'hourly' 
                        ? [1, 2, 3, 4, 5, 6, 7, 8].map(hour => (
                            <SelectItem key={hour} value={hour.toString()}>
                              {hour} {hour === 1 ? 'hora' : 'horas'}
                            </SelectItem>
                          ))
                        : [1, 2, 3, 4, 5, 6, 7, 14, 21, 30].map(day => (
                            <SelectItem key={day} value={day.toString()}>
                              {day} {day === 1 ? 'día/noche' : 'días/noches'}
                            </SelectItem>
                          ))
                      }
                    </SelectContent>
                  </Select>
                </div>

                {serviceType === 'hourly' && selectedTime && duration && (
                  <div className="p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-2 text-green-700">
                      <Clock className="h-4 w-4" />
                      <span className="font-medium">Horario confirmado:</span>
                    </div>
                    <p className="text-green-600 mt-1">
                      {selectedTime} - {calculateEndTime(selectedTime, parseInt(duration))}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Pet Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Seleccionar Mascotas</span>
                  <Button variant="outline" size="sm" onClick={addCustomPet}>
                    <Plus className="h-4 w-4 mr-1" />
                    Agregar
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Mascotas registradas */}
                {userPets.length > 0 && (
                  <div>
                    <Label className="text-sm text-gray-700 mb-2 block">Tus mascotas registradas</Label>
                    <div className="space-y-2">
                      {userPets.map(pet => (
                        <div key={pet.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                          <Checkbox
                            id={pet.id}
                            checked={selectedPets.includes(pet.id)}
                            onCheckedChange={() => togglePetSelection(pet.id)}
                          />
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <PawPrint className="h-4 w-4 text-gray-500" />
                              <span className="font-medium">{pet.name}</span>
                              <Badge variant="secondary" className="text-xs">{pet.type}</Badge>
                            </div>
                            {pet.breed && (
                              <p className="text-sm text-gray-600">{pet.breed}</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Mascotas personalizadas */}
                {customPets.length > 0 && (
                  <div>
                    <Label className="text-sm text-gray-700 mb-2 block">Mascotas adicionales</Label>
                    <div className="space-y-3">
                      {customPets.map(pet => (
                        <div key={pet.id} className="p-3 border rounded-lg space-y-3">
                          <div className="flex items-center justify-between">
                            <Checkbox
                              id={pet.id}
                              checked={selectedPets.includes(pet.id)}
                              onCheckedChange={() => togglePetSelection(pet.id)}
                            />
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => removeCustomPet(pet.id)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-2">
                            <Input
                              placeholder="Nombre"
                              value={pet.name}
                              onChange={(e) => updateCustomPet(pet.id, 'name', e.target.value)}
                            />
                            <Select 
                              value={pet.type} 
                              onValueChange={(value) => updateCustomPet(pet.id, 'type', value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Tipo" />
                              </SelectTrigger>
                              <SelectContent>
                                {petTypes.map(type => (
                                  <SelectItem key={type} value={type}>{type}</SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <Input
                            placeholder="Raza (opcional)"
                            value={pet.breed || ""}
                            onChange={(e) => updateCustomPet(pet.id, 'breed', e.target.value)}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {getAllPets().length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <PawPrint className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                    <p>No hay mascotas seleccionadas</p>
                    <p className="text-sm">Agrega una mascota para continuar</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Location and Special Requests */}
            <Card>
              <CardHeader>
                <CardTitle>Detalles del Servicio</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="location">Ubicación del servicio</Label>
                  <Input
                    id="location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Dirección donde se realizará el servicio"
                  />
                </div>

                <div>
                  <Label htmlFor="requests">Instrucciones especiales (opcional)</Label>
                  <Textarea
                    id="requests"
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                    placeholder="Cualquier información adicional sobre tus mascotas o el servicio..."
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Confirm Button */}
            <Card>
              <CardContent className="p-6">
                <Button 
                  className="w-full h-14 text-lg"
                  onClick={handleConfirmBooking}
                  disabled={!isFormValid}
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Añadir al Carrito - {totalPrice > 0 ? `${totalPrice}€` : 'Completa la información'}
                </Button>
                
                {!isFormValid && (
                  <div className="flex items-start gap-2 mt-3 text-sm text-gray-600">
                    <Info className="h-4 w-4 mt-0.5 text-amber-500" />
                    <span>
                      Por favor completa todos los campos obligatorios y selecciona al menos una mascota
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}