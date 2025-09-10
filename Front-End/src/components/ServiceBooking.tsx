import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Textarea } from "./ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"
import { Badge } from "./ui/badge"
import { Calendar } from "./ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover"
import { CalendarIcon, Clock, DollarSign, MapPin, User, Star } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"

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
}

interface Booking {
  id: string
  serviceId: string
  serviceName: string
  sitterName: string
  date: Date
  timeSlot: string
  petName: string
  specialInstructions: string
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
  totalPrice: number
}

const serviceTypes = {
  'walk': 'Paseos',
  'home-care': 'Cuidado en Casa',
  'boarding': 'Hospedaje',
  'daycare': 'Guardería'
}

// Servicios mock de ejemplo
const mockServices: Service[] = [
  {
    id: '1',
    name: 'Paseo Relajado',
    type: 'walk',
    description: 'Paseo tranquilo por el parque con tu mascota',
    price: 15,
    duration: '30 min',
    location: 'Parques cercanos',
    availability: ['Mañana', 'Tarde'],
    sitterName: 'María García',
    sitterRating: 4.8,
    sitterImage: 'https://images.unsplash.com/photo-1494790108755-2616b9c29490?w=100&h=100&fit=crop&crop=face'
  },
  {
    id: '2',
    name: 'Cuidado Premium',
    type: 'home-care',
    description: 'Cuidado completo en tu hogar con atención personalizada',
    price: 45,
    duration: '4 horas',
    location: 'En casa del cliente',
    availability: ['Mañana', 'Tarde', 'Todo el día'],
    sitterName: 'Carlos López',
    sitterRating: 4.9,
    sitterImage: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'
  },
  {
    id: '3',
    name: 'Guardería Divertida',
    type: 'daycare',
    description: 'Cuidado grupal con actividades y socialización',
    price: 25,
    duration: '8 horas',
    location: 'Centro de cuidado',
    availability: ['Todo el día'],
    sitterName: 'Ana Martínez',
    sitterRating: 4.7,
    sitterImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face'
  }
]

export default function ServiceBooking() {
  const [services] = useState<Service[]>(mockServices)
  const [bookings, setBookings] = useState<Booking[]>([])
  const [isBookingDialogOpen, setIsBookingDialogOpen] = useState(false)
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [bookingForm, setBookingForm] = useState({
    timeSlot: '',
    petName: '',
    specialInstructions: ''
  })

  const timeSlots = ['9:00 AM', '11:00 AM', '2:00 PM', '4:00 PM', '6:00 PM']

  const handleBookService = (service: Service) => {
    setSelectedService(service)
    setSelectedDate(undefined)
    setBookingForm({
      timeSlot: '',
      petName: '',
      specialInstructions: ''
    })
    setIsBookingDialogOpen(true)
  }

  const handleSubmitBooking = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedService || !selectedDate) return

    const newBooking: Booking = {
      id: Date.now().toString(),
      serviceId: selectedService.id,
      serviceName: selectedService.name,
      sitterName: selectedService.sitterName,
      date: selectedDate,
      timeSlot: bookingForm.timeSlot,
      petName: bookingForm.petName,
      specialInstructions: bookingForm.specialInstructions,
      status: 'pending',
      totalPrice: selectedService.price
    }

    setBookings([...bookings, newBooking])
    setIsBookingDialogOpen(false)
  }

  const getStatusColor = (status: Booking['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'confirmed': return 'bg-green-100 text-green-800'
      case 'completed': return 'bg-blue-100 text-blue-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: Booking['status']) => {
    switch (status) {
      case 'pending': return 'Pendiente'
      case 'confirmed': return 'Confirmado'
      case 'completed': return 'Completado'
      case 'cancelled': return 'Cancelado'
      default: return status
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2>Servicios Disponibles</h2>
        <p className="text-muted-foreground">
          Encuentra y reserva el cuidado perfecto para tu mascota
        </p>
      </div>

      {/* Servicios Disponibles */}
      <div className="grid gap-4">
        {services.map((service) => (
          <Card key={service.id}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="flex items-center gap-2">
                    {service.name}
                    <Badge variant="secondary">
                      {serviceTypes[service.type]}
                    </Badge>
                  </CardTitle>
                  <p className="text-muted-foreground mt-1">
                    {service.description}
                  </p>
                </div>
                <Button onClick={() => handleBookService(service)}>
                  Reservar
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-4">
                <img
                  src={service.sitterImage}
                  alt={service.sitterName}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span>{service.sitterName}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm">{service.sitterRating}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <span>${service.price}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{service.duration}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{service.location}</span>
                </div>
              </div>

              <div className="mt-3">
                <Label className="text-sm">Disponibilidad:</Label>
                <div className="flex flex-wrap gap-1 mt-1">
                  {service.availability.map((slot) => (
                    <Badge key={slot} variant="outline" className="text-xs">
                      {slot}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Mis Reservas */}
      {bookings.length > 0 && (
        <div>
          <h3>Mis Reservas</h3>
          <div className="grid gap-4 mt-4">
            {bookings.map((booking) => (
              <Card key={booking.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4>{booking.serviceName}</h4>
                      <p className="text-muted-foreground">
                        con {booking.sitterName}
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                        <span>{format(booking.date, "dd 'de' MMMM", { locale: es })}</span>
                        <span>{booking.timeSlot}</span>
                        <span>Mascota: {booking.petName}</span>
                      </div>
                      {booking.specialInstructions && (
                        <p className="text-sm mt-2">
                          <strong>Instrucciones:</strong> {booking.specialInstructions}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <Badge className={getStatusColor(booking.status)}>
                        {getStatusText(booking.status)}
                      </Badge>
                      <p className="mt-2">${booking.totalPrice}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Dialog de Reserva */}
      <Dialog open={isBookingDialogOpen} onOpenChange={setIsBookingDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Reservar Servicio</DialogTitle>
          </DialogHeader>
          {selectedService && (
            <form onSubmit={handleSubmitBooking} className="space-y-4">
              <div className="bg-muted p-3 rounded-lg">
                <h4>{selectedService.name}</h4>
                <p className="text-sm text-muted-foreground">
                  con {selectedService.sitterName}
                </p>
                <p className="mt-1">${selectedService.price} - {selectedService.duration}</p>
              </div>

              <div>
                <Label>Fecha</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDate ? format(selectedDate, "dd 'de' MMMM", { locale: es }) : "Seleccionar fecha"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      disabled={(date) => date < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <Label>Horario</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {timeSlots.map((slot) => (
                    <Button
                      key={slot}
                      type="button"
                      variant={bookingForm.timeSlot === slot ? "default" : "outline"}
                      size="sm"
                      onClick={() => setBookingForm({ ...bookingForm, timeSlot: slot })}
                    >
                      {slot}
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="petName">Nombre de la mascota</Label>
                <Input
                  id="petName"
                  value={bookingForm.petName}
                  onChange={(e) => setBookingForm({ ...bookingForm, petName: e.target.value })}
                  placeholder="Nombre de tu mascota"
                  required
                />
              </div>

              <div>
                <Label htmlFor="instructions">Instrucciones especiales</Label>
                <Textarea
                  id="instructions"
                  value={bookingForm.specialInstructions}
                  onChange={(e) => setBookingForm({ ...bookingForm, specialInstructions: e.target.value })}
                  placeholder="Instrucciones adicionales para el cuidador..."
                  rows={3}
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button 
                  type="submit" 
                  className="flex-1"
                  disabled={!selectedDate || !bookingForm.timeSlot || !bookingForm.petName}
                >
                  Confirmar Reserva
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsBookingDialogOpen(false)}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}