import { useState } from "react"
import { Button } from "./ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog"
import { Textarea } from "./ui/textarea"
import { Label } from "./ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { ImageWithFallback } from "./figma/ImageWithFallback"
import { 
  ArrowLeft, 
  Calendar, 
  Clock, 
  MapPin, 
  Star, 
  CheckCircle, 
  AlertCircle,
  Phone,
  MessageSquare,
  Download,
  Eye,
  MoreHorizontal,
  XCircle
} from "lucide-react"
import { toast } from "sonner@2.0.3"

interface Booking {
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
  status: 'pending' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled'
  totalAmount: number
  location: string
  petType: string
  petName: string
  specialRequests?: string
  paymentId: string
  createdAt: string
  bookedAt?: string
  completedAt?: string
  cancelledAt?: string
  cancellationReason?: string
  rating?: number
  review?: string
}

interface BookingManagerProps {
  onBack: () => void
  userData: any
}

export default function BookingManager({ onBack, userData }: BookingManagerProps) {
  const [activeTab, setActiveTab] = useState('all')
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [cancellationReason, setCancellationReason] = useState('')
  const [cancellationDetails, setCancellationDetails] = useState('')
  const [isProcessingCancellation, setIsProcessingCancellation] = useState(false)
  
  // Mock bookings data
  const [bookings] = useState<Booking[]>([
    {
      id: 'BK001',
      sitterId: 'ST001',
      sitterName: 'María González',
      sitterImage: 'https://images.unsplash.com/photo-1559198837-e3d443d28c02?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXQlMjBzaXR0ZXIlMjBwbGF5aW5nJTIwY2F0fGVufDF8fHx8MTc1NjI2MjQzOXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      sitterRating: 4.9,
      service: 'Paseo Diario',
      date: '2024-01-15',
      startTime: '09:00',
      endTime: '10:00',
      duration: 1,
      status: 'confirmed',
      totalAmount: 25.20,
      location: 'Parque del Retiro, Madrid',
      petType: 'Perro',
      petName: 'Luna',
      specialRequests: 'Luna es muy activa, por favor llevarla a la zona de juegos para perros.',
      paymentId: 'PAY001',
      createdAt: '2024-01-10T10:30:00Z',
      bookedAt: '2024-01-10T11:15:00Z'
    },
    {
      id: 'BK002',
      sitterId: 'ST002',
      sitterName: 'Carlos Rodríguez',
      sitterImage: 'https://images.unsplash.com/photo-1649160388750-26fafdcaf4eb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXJzb24lMjB3YWxraW5nJTIwbXVsdGlwbGUlMjBkb2dzfGVufDF8fHx8MTc1NjI2MjQzOXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      sitterRating: 4.8,
      service: 'Cuidado en Casa',
      date: '2024-01-08',
      startTime: '18:00',
      endTime: '22:00',
      duration: 4,
      status: 'completed',
      totalAmount: 100.80,
      location: 'Domicilio - Calle Alcalá 123, Madrid',
      petType: 'Gato',
      petName: 'Milo',
      specialRequests: 'Milo necesita medicación a las 20:00. Pastilla incluida.',
      paymentId: 'PAY002',
      createdAt: '2024-01-05T14:20:00Z',
      bookedAt: '2024-01-05T15:00:00Z',
      completedAt: '2024-01-08T22:30:00Z',
      rating: 5,
      review: 'Excelente cuidado, Carlos fue muy atento con Milo y siguió todas las instrucciones al pie de la letra.'
    },
    {
      id: 'BK003',
      sitterId: 'ST003',
      sitterName: 'Ana Martín',
      sitterImage: 'https://images.unsplash.com/photo-1643213641079-1e60ef170910?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx2ZXRlcmluYXJpYW4lMjBjYXJpbmclMjBwZXR8ZW58MXx8fHwxNzU2MjYyNDM5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      sitterRating: 5.0,
      service: 'Hospedaje Nocturno',
      date: '2024-01-20',
      startTime: '19:00',
      endTime: '09:00',
      duration: 14,
      status: 'pending',
      totalAmount: 280.00,
      location: 'Casa de Ana - Barrio Salamanca',
      petType: 'Perro',
      petName: 'Max',
      specialRequests: 'Max está acostumbrado a dormir en cama. Es muy tranquilo pero le gusta su manta azul.',
      paymentId: 'PAY003',
      createdAt: '2024-01-12T16:45:00Z'
    }
  ])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'confirmed': return 'bg-blue-100 text-blue-800'
      case 'in-progress': return 'bg-purple-100 text-purple-800'
      case 'completed': return 'bg-green-100 text-green-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Pendiente'
      case 'confirmed': return 'Confirmada'
      case 'in-progress': return 'En Progreso'
      case 'completed': return 'Completada'
      case 'cancelled': return 'Cancelada'
      default: return status
    }
  }

  const filterBookings = (status: string) => {
    if (status === 'all') return bookings
    return bookings.filter(booking => booking.status === status)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handleContactSitter = (booking: Booking) => {
    // Mock contact functionality
    toast.info(`Contactando con ${booking.sitterName}...`)
  }

  const handleCancelBooking = (booking: Booking) => {
    setSelectedBooking(booking)
    setShowCancelModal(true)
  }

  const handleConfirmCancellation = async () => {
    if (!selectedBooking || !cancellationReason) return

    setIsProcessingCancellation(true)

    try {
      // Simular proceso de cancelación
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      toast.success('Reserva cancelada exitosamente. Se procesará el reembolso en 3-5 días hábiles.')
      setShowCancelModal(false)
      setSelectedBooking(null)
      setCancellationReason('')
      setCancellationDetails('')
    } catch (error) {
      toast.error('Error al cancelar la reserva. Inténtalo de nuevo.')
    } finally {
      setIsProcessingCancellation(false)
    }
  }

  const handleDownloadReceipt = (bookingId: string) => {
    toast.info('Descargando recibo...')
  }

  const cancellationReasons = [
    { value: 'schedule_change', label: 'Cambio de planes' },
    { value: 'emergency', label: 'Emergencia personal' },
    { value: 'pet_health', label: 'Problema de salud de mi mascota' },
    { value: 'sitter_issue', label: 'Problema con el cuidador' },
    { value: 'weather', label: 'Condiciones climáticas' },
    { value: 'other', label: 'Otro motivo' }
  ]

  const getRefundAmount = (booking: Booking) => {
    // Simular cálculo de reembolso basado en política de cancelación
    const hoursUntilService = 24 // Simular horas hasta el servicio
    if (hoursUntilService >= 24) {
      return booking.totalAmount // Reembolso completo
    } else if (hoursUntilService >= 2) {
      return booking.totalAmount * 0.5 // 50% de reembolso
    } else {
      return 0 // Sin reembolso
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={onBack}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver al Dashboard
              </Button>
              <h1 className="text-2xl">Mis Reservas</h1>
            </div>
            <Badge variant="secondary">
              {bookings.length} {bookings.length === 1 ? 'reserva' : 'reservas'}
            </Badge>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="all">Todas</TabsTrigger>
            <TabsTrigger value="pending">Pendientes</TabsTrigger>
            <TabsTrigger value="confirmed">Confirmadas</TabsTrigger>
            <TabsTrigger value="in-progress">En Curso</TabsTrigger>
            <TabsTrigger value="completed">Completadas</TabsTrigger>
            <TabsTrigger value="cancelled">Canceladas</TabsTrigger>
          </TabsList>

          {/* All Bookings */}
          {(['all', 'pending', 'confirmed', 'in-progress', 'completed', 'cancelled'] as const).map(status => (
            <TabsContent key={status} value={status} className="space-y-4">
              {filterBookings(status).length === 0 ? (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg mb-2">No hay reservas</h3>
                    <p className="text-gray-600">
                      {status === 'all' 
                        ? 'No tienes reservas todavía. ¡Busca un cuidador y haz tu primera reserva!'
                        : `No tienes reservas ${getStatusText(status).toLowerCase()}`
                      }
                    </p>
                  </CardContent>
                </Card>
              ) : (
                filterBookings(status).map((booking) => (
                  <Card key={booking.id} className="overflow-hidden">
                    <CardContent className="p-6">
                      <div className="flex flex-col lg:flex-row gap-6">
                        {/* Sitter Info */}
                        <div className="flex gap-4">
                          <ImageWithFallback
                            src={booking.sitterImage}
                            alt={booking.sitterName}
                            className="w-16 h-16 rounded-full object-cover"
                          />
                          <div>
                            <h3 className="font-medium">{booking.sitterName}</h3>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Star className="h-4 w-4 text-yellow-400" />
                              <span>{booking.sitterRating}</span>
                            </div>
                            <Badge className={getStatusColor(booking.status)}>
                              {getStatusText(booking.status)}
                            </Badge>
                          </div>
                        </div>

                        {/* Booking Details */}
                        <div className="flex-1 space-y-3">
                          <div className="flex flex-wrap gap-4 text-sm">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4 text-gray-400" />
                              <span>{formatDate(booking.date)}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4 text-gray-400" />
                              <span>{booking.startTime} - {booking.endTime}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4 text-gray-400" />
                              <span>{booking.location}</span>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <div>
                              <span className="font-medium">{booking.service}</span>
                              <span className="text-gray-600"> para {booking.petName} ({booking.petType})</span>
                            </div>
                            
                            {booking.specialRequests && (
                              <div className="text-sm text-gray-600">
                                <span className="font-medium">Instrucciones especiales:</span> {booking.specialRequests}
                              </div>
                            )}

                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <span>ID: {booking.id}</span>
                              <span>Creada: {formatDateTime(booking.createdAt)}</span>
                              {booking.completedAt && (
                                <span>Completada: {formatDateTime(booking.completedAt)}</span>
                              )}
                            </div>
                          </div>

                          {/* Rating and Review */}
                          {booking.status === 'completed' && booking.rating && (
                            <div className="p-3 bg-green-50 rounded-lg">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="text-sm font-medium">Tu valoración:</span>
                                <div className="flex">
                                  {[...Array(5)].map((_, i) => (
                                    <Star 
                                      key={i} 
                                      className={`h-4 w-4 ${i < booking.rating! ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                                    />
                                  ))}
                                </div>
                              </div>
                              {booking.review && (
                                <p className="text-sm text-gray-700">{booking.review}</p>
                              )}
                            </div>
                          )}
                        </div>

                        {/* Actions and Price */}
                        <div className="flex flex-col justify-between items-end gap-4">
                          <div className="text-right">
                            <div className="text-2xl font-bold">{booking.totalAmount.toFixed(2)}€</div>
                            <div className="text-sm text-gray-600">{booking.duration}h total</div>
                          </div>

                          <div className="flex flex-col gap-2">
                            {booking.status === 'confirmed' && (
                              <>
                                <Button size="sm" onClick={() => handleContactSitter(booking)}>
                                  <MessageSquare className="h-4 w-4 mr-1" />
                                  Contactar
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => handleCancelBooking(booking)}
                                >
                                  Cancelar
                                </Button>
                              </>
                            )}

                            {booking.status === 'pending' && (
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => handleCancelBooking(booking)}
                              >
                                Cancelar
                              </Button>
                            )}

                            {booking.status === 'completed' && (
                              <>
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => handleDownloadReceipt(booking.id)}
                                >
                                  <Download className="h-4 w-4 mr-1" />
                                  Recibo
                                </Button>
                                {!booking.rating && (
                                  <Button size="sm">
                                    <Star className="h-4 w-4 mr-1" />
                                    Valorar
                                  </Button>
                                )}
                              </>
                            )}

                            <Button size="sm" variant="ghost">
                              <Eye className="h-4 w-4 mr-1" />
                              Detalles
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </TabsContent>
          ))}
        </Tabs>

        {/* Summary Stats */}
        {bookings.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {bookings.filter(b => b.status === 'pending').length}
                </div>
                <div className="text-sm text-gray-600">Pendientes</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">
                  {bookings.filter(b => b.status === 'confirmed').length}
                </div>
                <div className="text-sm text-gray-600">Confirmadas</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {bookings.filter(b => b.status === 'completed').length}
                </div>
                <div className="text-sm text-gray-600">Completadas</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {bookings.reduce((total, booking) => 
                    booking.status === 'completed' ? total + booking.totalAmount : total, 0
                  ).toFixed(0)}€
                </div>
                <div className="text-sm text-gray-600">Total Gastado</div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Modal de cancelación */}
        <Dialog open={showCancelModal} onOpenChange={setShowCancelModal}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <XCircle className="h-5 w-5 text-red-500" />
                Cancelar Reserva
              </DialogTitle>
            </DialogHeader>
            
            {selectedBooking && (
              <div className="space-y-6">
                {/* Información de la reserva */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm text-gray-900 mb-2">Reserva a cancelar:</h4>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p><span className="text-gray-900">Servicio:</span> {selectedBooking.service}</p>
                    <p><span className="text-gray-900">Cuidador:</span> {selectedBooking.sitterName}</p>
                    <p><span className="text-gray-900">Fecha:</span> {formatDate(selectedBooking.date)}</p>
                    <p><span className="text-gray-900">Hora:</span> {selectedBooking.startTime} - {selectedBooking.endTime}</p>
                    <p><span className="text-gray-900">Mascota:</span> {selectedBooking.petName}</p>
                    <p><span className="text-gray-900">Total:</span> {selectedBooking.totalAmount.toFixed(2)}€</p>
                  </div>
                </div>

                {/* Información de reembolso */}
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="text-sm text-blue-900 mb-2 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    Información de reembolso
                  </h4>
                  <p className="text-sm text-blue-800">
                    Reembolso estimado: <span className="text-blue-900">{getRefundAmount(selectedBooking).toFixed(2)}€</span>
                  </p>
                  <p className="text-xs text-blue-700 mt-1">
                    {getRefundAmount(selectedBooking) === selectedBooking.totalAmount 
                      ? "Reembolso completo - Cancelación con más de 24h de antelación"
                      : getRefundAmount(selectedBooking) > 0
                      ? "Reembolso parcial - Cancelación con menos de 24h"
                      : "Sin reembolso - Cancelación muy tardía"
                    }
                  </p>
                </div>

                {/* Motivo de cancelación */}
                <div>
                  <Label htmlFor="reason">Motivo de cancelación *</Label>
                  <Select value={cancellationReason} onValueChange={setCancellationReason}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Selecciona un motivo" />
                    </SelectTrigger>
                    <SelectContent>
                      {cancellationReasons.map((reason) => (
                        <SelectItem key={reason.value} value={reason.value}>
                          {reason.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Detalles adicionales */}
                <div>
                  <Label htmlFor="details">Detalles adicionales (opcional)</Label>
                  <Textarea
                    id="details"
                    value={cancellationDetails}
                    onChange={(e) => setCancellationDetails(e.target.value)}
                    placeholder="Comparte cualquier detalle adicional sobre la cancelación..."
                    rows={3}
                    className="mt-1"
                  />
                </div>

                {/* Advertencia */}
                <div className="bg-yellow-50 p-3 rounded-lg">
                  <p className="text-xs text-yellow-800">
                    <AlertCircle className="h-3 w-3 inline mr-1" />
                    Una vez cancelada, esta acción no se puede deshacer. El cuidador será notificado inmediatamente.
                  </p>
                </div>

                {/* Botones */}
                <div className="flex gap-3 pt-2">
                  <Button 
                    variant="outline" 
                    onClick={() => setShowCancelModal(false)}
                    className="flex-1"
                    disabled={isProcessingCancellation}
                  >
                    Mantener Reserva
                  </Button>
                  <Button 
                    onClick={handleConfirmCancellation}
                    className="flex-1 bg-red-600 hover:bg-red-700"
                    disabled={!cancellationReason || isProcessingCancellation}
                  >
                    {isProcessingCancellation ? "Cancelando..." : "Confirmar Cancelación"}
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}