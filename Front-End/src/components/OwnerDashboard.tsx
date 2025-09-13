import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { ImageWithFallback } from "./figma/ImageWithFallback"
import { Calendar, Clock, MapPin, Star, Plus, MessageSquare, Camera, Heart, ShoppingCart, CreditCard, User, Settings, Search, CalendarPlus } from "lucide-react"
import BookingModal from "./BookingModal"
import ProfileManager from "./ProfileManager"

interface OwnerDashboardProps {
  userData?: any
  onViewBookings?: () => void
  onViewCart?: () => void
  onSearchSitters?: () => void
  onProceedToPayment?: (items: any[], total: number) => void
  onBookService?: (service: any) => void
}

export default function OwnerDashboard({ 
  userData, 
  onViewBookings, 
  onViewCart, 
  onSearchSitters, 
  onProceedToPayment,
  onBookService 
}: OwnerDashboardProps) {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false)

  // Datos de un cuidador por defecto para el modal
  const defaultSitter = {
    id: "default-sitter",
    name: "Cuidador Disponible",
    image: "https://images.unsplash.com/photo-1559198837-e3d443d28c02?w=100&h=100&fit=crop&crop=face",
    rating: 4.8,
    location: "Madrid Centro",
    priceRange: "15-25€/hora",
    services: ["Paseos", "Cuidado a domicilio", "Hospedaje"]
  }

  const handleOpenBookingModal = () => {
    setIsBookingModalOpen(true)
  }

  const handleCloseBookingModal = () => {
    setIsBookingModalOpen(false)
  }

  const handleBookingComplete = (bookingData: any) => {
    console.log('Reserva completada:', bookingData)
    setIsBookingModalOpen(false)
  }

  const handleProceedToPaymentFromModal = (bookingData: any) => {
    console.log('Proceder al pago con datos:', bookingData)
    
    // Crear cartItem compatible con el formato esperado
    const cartItem = {
      id: bookingData.id,
      sitterId: bookingData.sitterId,
      sitterName: bookingData.sitterName,
      sitterImage: bookingData.sitterImage,
      sitterRating: 4.8, // Valor por defecto
      service: bookingData.service,
      date: bookingData.date,
      startTime: bookingData.time === "Todo el día" ? "00:00" : bookingData.time,
      endTime: bookingData.time === "Todo el día" ? "23:59" : "18:00", // Valor por defecto
      duration: bookingData.duration,
      pricePerHour: Math.floor(bookingData.price / bookingData.duration),
      location: "Madrid", // Valor por defecto
      petType: bookingData.pets?.[0]?.type || "Mascota",
      quantity: 1,
      specialRequests: bookingData.specialRequests
    }

    // Cerrar modal y proceder al pago
    setIsBookingModalOpen(false)
    
    // Llamar a la función de pago si está disponible
    if (onProceedToPayment) {
      onProceedToPayment([cartItem], bookingData.price)
    }
  }

  const upcomingBookings = [
    {
      id: 1,
      sitterName: "María González",
      sitterImage: "https://images.unsplash.com/photo-1559198837-e3d443d28c02?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXQlMjBzaXR0ZXIlMjBwbGF5aW5nJTIwY2F0fGVufDF8fHx8MTc1NjI2MjQzOXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      service: "Paseo",
      date: "Hoy",
      time: "14:00 - 15:00",
      pet: "Max",
      status: "confirmado",
      price: "15€"
    },
    {
      id: 2,
      sitterName: "Carlos Rodríguez",
      sitterImage: "https://images.unsplash.com/photo-1649160388750-26fafdcaf4eb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXQzb24lMjB3YWxraW5nJTIwbXVsdGlwbGUlMjBkb2dzfGVufDF8fHx8MTc1NjI2MjQzOXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
      service: "Cuidado en casa",
      date: "Mañana",
      time: "09:00 - 17:00",
      pet: "Luna",
      status: "pendiente",
      price: "120€"
    }
  ]

  const pets = [
    {
      id: 1,
      name: "Max",
      type: "Perro",
      breed: "Golden Retriever",
      age: "3 años",
      image: "https://images.unsplash.com/photo-1596645537562-f35cf71ee459?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYXBweSUyMGRvZyUyMHdhbGtpbmclMjBwYXJrfGVufDF8fHx8MTc1NjE2MTc0NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    },
    {
      id: 2,
      name: "Luna",
      type: "Gato",
      breed: "Siamés",
      age: "2 años",
      image: "https://images.unsplash.com/photo-1559198837-e3d443d28c02?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXQlMjBzaXR0ZXIlMjBwbGF5aW5nJTIwY2F0fGVufDF8fHx8MTc1NjI2MjQzOXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
    }
  ]

  const recentActivities = [
    {
      id: 1,
      type: "photo",
      sitter: "María González",
      message: "Max tuvo un paseo genial en el parque!",
      time: "Hace 2 horas",
      pet: "Max"
    },
    {
      id: 2,
      type: "update",
      sitter: "Carlos Rodríguez",
      message: "Luna comió toda su comida y está descansando",
      time: "Hace 4 horas",
      pet: "Luna"
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl text-gray-900 mb-2">Mi Dashboard</h1>
          <p className="text-gray-600">Bienvenido, {userData?.name || 'Usuario'}. Gestiona tus mascotas y reservas</p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={onSearchSitters}>
            <CardContent className="p-6 text-center">
              <Search className="h-8 w-8 text-primary mx-auto mb-2" />
              <h3 className="text-lg mb-1">Buscar Cuidadores</h3>
              <p className="text-sm text-gray-600">Encuentra el cuidador perfecto</p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={handleOpenBookingModal}>
            <CardContent className="p-6 text-center">
              <CalendarPlus className="h-8 w-8 text-primary mx-auto mb-2" />
              <h3 className="text-lg mb-1">Reservar Servicio</h3>
              <p className="text-sm text-gray-600">Agenda un nuevo servicio</p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={onViewBookings}>
            <CardContent className="p-6 text-center">
              <Calendar className="h-8 w-8 text-primary mx-auto mb-2" />
              <h3 className="text-lg mb-1">Mis Reservas</h3>
              <p className="text-sm text-gray-600">Gestiona todas tus reservas</p>
            </CardContent>
          </Card>
          
          <Card className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-6 text-center">
              <CreditCard className="h-8 w-8 text-primary mx-auto mb-2" />
              <h3 className="text-lg mb-1">Pagos</h3>
              <p className="text-sm text-gray-600">Historial de pagos y facturas</p>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={onViewCart}>
            <CardContent className="p-6 text-center">
              <ShoppingCart className="h-8 w-8 text-primary mx-auto mb-2" />
              <h3 className="text-lg mb-1">Ver Carrito</h3>
              <p className="text-sm text-gray-600">Revisa tus servicios pendientes</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="bookings" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="bookings">Reservas</TabsTrigger>
            <TabsTrigger value="pets">Mis Mascotas</TabsTrigger>
            <TabsTrigger value="favorites">Favoritos</TabsTrigger>
            <TabsTrigger value="profile">Mi Perfil</TabsTrigger>
          </TabsList>

          <TabsContent value="bookings" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl">Próximas Reservas</h2>
              <div className="flex gap-2">
                <Button variant="outline" onClick={onViewBookings}>
                  Ver Todas las Reservas
                </Button>
                <Button onClick={handleOpenBookingModal}>
                  <Plus className="h-4 w-4 mr-2" />
                  Nueva Reserva
                </Button>
              </div>
            </div>

            <div className="grid gap-4">
              {upcomingBookings.map((booking) => (
                <Card key={booking.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={booking.sitterImage} />
                          <AvatarFallback>{booking.sitterName[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="text-lg">{booking.sitterName}</h3>
                          <p className="text-sm text-gray-600">{booking.service}</p>
                          <div className="flex items-center space-x-4 mt-1">
                            <span className="flex items-center text-sm text-gray-500">
                              <Calendar className="h-4 w-4 mr-1" />
                              {booking.date}
                            </span>
                            <span className="flex items-center text-sm text-gray-500">
                              <Clock className="h-4 w-4 mr-1" />
                              {booking.time}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge 
                          variant={booking.status === 'confirmado' ? 'default' : 'secondary'}
                          className="mb-2"
                        >
                          {booking.status}
                        </Badge>
                        <p className="text-lg text-primary">{booking.price}</p>
                        <p className="text-sm text-gray-600">Para {booking.pet}</p>
                      </div>
                    </div>
                    <div className="flex space-x-2 mt-4">
                      <Button variant="outline" size="sm">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Mensaje
                      </Button>
                      <Button variant="outline" size="sm">Ver Detalles</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="pets" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl">Mis Mascotas</h2>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Agregar Mascota
              </Button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pets.map((pet) => (
                <Card key={pet.id} className="overflow-hidden">
                  <div className="aspect-w-16 aspect-h-9">
                    <ImageWithFallback
                      src={pet.image}
                      alt={pet.name}
                      className="w-full h-48 object-cover"
                    />
                  </div>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      {pet.name}
                      <Heart className="h-5 w-5 text-red-500" />
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">
                        <span className="text-gray-900">Tipo:</span> {pet.type}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="text-gray-900">Raza:</span> {pet.breed}
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="text-gray-900">Edad:</span> {pet.age}
                      </p>
                    </div>
                    <Button variant="outline" className="w-full mt-4">
                      Editar Perfil
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="favorites" className="space-y-6">
            <h2 className="text-xl">Cuidadores Favoritos</h2>
            
            <div className="text-center py-12">
              <Heart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg text-gray-900 mb-2">No tienes favoritos aún</h3>
              <p className="text-gray-600 mb-4">Agrega cuidadores a favoritos para encontrarlos fácilmente</p>
              <Button onClick={onSearchSitters}>Buscar Cuidadores</Button>
            </div>
          </TabsContent>

          <TabsContent value="profile" className="space-y-6">
            <ProfileManager userData={userData} userType="owner" />
          </TabsContent>
        </Tabs>

        {/* Modal de Reserva */}
        <BookingModal
          isOpen={isBookingModalOpen}
          onClose={handleCloseBookingModal}
          service="Paseos"
          userPets={userData?.pets || pets}
          isAuthenticated={true}
          onBookingComplete={handleBookingComplete}
          onProceedToPayment={handleProceedToPaymentFromModal}
        />
      </div>
    </div>
  )
}