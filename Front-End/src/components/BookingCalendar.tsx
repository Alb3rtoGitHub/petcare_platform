import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { Calendar } from "./ui/calendar"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Textarea } from "./ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
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
  Info
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

interface BookingCalendarProps {
  service: Service
  onBack: () => void
  onAddToCart: (item: CartItem) => void
  onGoToCart: () => void
}

export default function BookingCalendar({ service, onBack, onAddToCart, onGoToCart }: BookingCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [selectedTime, setSelectedTime] = useState("")
  const [duration, setDuration] = useState("1")
  const [petType, setPetType] = useState("")
  const [petName, setPetName] = useState("")
  const [specialRequests, setSpecialRequests] = useState("")
  const [location, setLocation] = useState("")

  // Available time slots
  const timeSlots = [
    "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
    "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30",
    "16:00", "16:30", "17:00", "17:30", "18:00", "18:30", "19:00", "19:30", "20:00"
  ]

  const petTypes = ["Perro", "Gato", "Ave", "Reptil", "Roedor", "Pez", "Otro"]

  const isFormValid = selectedDate && selectedTime && petType && petName && location

  const calculateEndTime = (startTime: string, duration: number) => {
    const [hours, minutes] = startTime.split(':').map(Number)
    const endHours = hours + duration
    const endMinutes = minutes
    
    if (endHours >= 24) {
      return `${(endHours - 24).toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')} (+1 día)`
    }
    
    return `${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`
  }

  const handleConfirmBooking = () => {
    if (!isFormValid) return

    const cartItem: CartItem = {
      id: `${service.id}-${selectedDate?.getTime()}-${selectedTime}`,
      sitterId: service.id.toString(),
      sitterName: service.provider.name,
      sitterImage: service.provider.image,
      sitterRating: service.provider.rating,
      service: service.title,
      date: selectedDate!.toISOString().split('T')[0],
      startTime: selectedTime,
      endTime: calculateEndTime(selectedTime, parseInt(duration)).replace(' (+1 día)', ''),
      duration: parseInt(duration),
      pricePerHour: parseInt(service.price.replace('€', '').split('/')[0]),
      location: location,
      petType: petType,
      quantity: 1,
      specialRequests: specialRequests
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

  const totalPrice = selectedTime && duration ? 
    parseInt(service.price.replace('€', '').split('/')[0]) * parseInt(duration) : 0

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
                      <span className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {service.duration}
                      </span>
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
            {selectedTime && duration && (
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
                    <span>Duración</span>
                    <span>{duration}h</span>
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
                <CardTitle>Hora y Duración</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
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

                <div>
                  <Label htmlFor="duration">Duración (horas)</Label>
                  <Select value={duration} onValueChange={setDuration}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar duración" />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5, 6, 7, 8].map(hour => (
                        <SelectItem key={hour} value={hour.toString()}>
                          {hour} {hour === 1 ? 'hora' : 'horas'}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedTime && duration && (
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

            {/* Pet Information */}
            <Card>
              <CardHeader>
                <CardTitle>Información de la Mascota</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="petType">Tipo de mascota</Label>
                  <Select value={petType} onValueChange={setPetType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      {petTypes.map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="petName">Nombre de la mascota</Label>
                  <Input
                    id="petName"
                    value={petName}
                    onChange={(e) => setPetName(e.target.value)}
                    placeholder="Nombre de tu mascota"
                  />
                </div>

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
                    placeholder="Cualquier información adicional sobre tu mascota o el servicio..."
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
                  Añadir al Carrito - {totalPrice > 0 ? `${totalPrice}€` : 'Selecciona horario'}
                </Button>
                
                {!isFormValid && (
                  <div className="flex items-start gap-2 mt-3 text-sm text-gray-600">
                    <Info className="h-4 w-4 mt-0.5 text-amber-500" />
                    <span>
                      Por favor completa todos los campos obligatorios para continuar
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