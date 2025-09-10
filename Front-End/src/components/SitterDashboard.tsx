import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { Avatar, AvatarFallback } from "./ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { Switch } from "./ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Calendar, Clock, DollarSign, Star, TrendingUp, CheckCircle, XCircle, MessageSquare, Settings, User } from "lucide-react"
import ServiceManager from "./ServiceManager"
import ProfileManager from "./ProfileManager"
import { useState } from "react"

interface SitterDashboardProps {
  userData?: any
  onViewBookings?: () => void
}

export default function SitterDashboard({ userData, onViewBookings }: SitterDashboardProps) {
  const [currentTab, setCurrentTab] = useState("requests")
  
  const pendingRequests = [
    {
      id: 1,
      ownerName: "Ana López",
      petName: "Max",
      petType: "Perro",
      service: "Paseo",
      date: "Mañana",
      time: "14:00 - 15:00",
      location: "Madrid Centro",
      price: "15€",
      notes: "Max es muy juguetón y le encanta correr en el parque"
    },
    {
      id: 2,
      ownerName: "Pedro Martín",
      petName: "Luna",
      petType: "Gato",
      service: "Cuidado en casa",
      date: "Este fin de semana",
      time: "Sáb-Dom completo",
      location: "Madrid Norte",
      price: "80€",
      notes: "Luna necesita medicación dos veces al día"
    }
  ]

  const upcomingJobs = [
    {
      id: 1,
      ownerName: "Carmen García",
      petName: "Rocco",
      service: "Paseo",
      date: "Hoy",
      time: "16:00 - 17:00",
      price: "15€",
      status: "confirmado"
    },
    {
      id: 2,
      ownerName: "Miguel Torres",
      petName: "Bella",
      service: "Visita",
      date: "Mañana",
      time: "12:00 - 13:00",
      price: "12€",
      status: "confirmado"
    }
  ]

  const stats = {
    totalEarnings: "1,250€",
    thisMonth: "340€",
    completedJobs: 127,
    rating: 4.9,
    reviews: 89
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl text-gray-900 mb-2">Dashboard del Cuidador</h1>
              <p className="text-gray-600">Gestiona tus servicios y ganancias</p>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Disponible</span>
              <Switch defaultChecked />
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <DollarSign className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Ganancias Totales</p>
                  <p className="text-2xl">{stats.totalEarnings}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Este Mes</p>
                  <p className="text-2xl">{stats.thisMonth}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <CheckCircle className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Trabajos</p>
                  <p className="text-2xl">{stats.completedJobs}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Star className="h-8 w-8 text-yellow-500" />
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Calificación</p>
                  <p className="text-2xl">{stats.rating}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <MessageSquare className="h-8 w-8 text-indigo-600" />
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Reseñas</p>
                  <p className="text-2xl">{stats.reviews}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs value={currentTab} onValueChange={setCurrentTab} className="space-y-6">
          <div className="flex flex-col space-y-4">
            {/* Tabs normales para desktop y tablet */}
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
              <TabsTrigger value="requests" className="text-xs sm:text-sm">Solicitudes</TabsTrigger>
              <TabsTrigger value="schedule" className="text-xs sm:text-sm">Programación</TabsTrigger>
              <TabsTrigger value="services" className="text-xs sm:text-sm lg:block hidden">Servicios</TabsTrigger>
              <TabsTrigger value="earnings" className="text-xs sm:text-sm lg:block hidden">Ganancias</TabsTrigger>
              <TabsTrigger value="profile" className="text-xs sm:text-sm lg:block hidden">Perfil</TabsTrigger>
            </TabsList>

            {/* Dropdown para tabs adicionales en móvil/tablet */}
            <div className="lg:hidden">
              <Select value={currentTab} onValueChange={setCurrentTab}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Más opciones" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="services">Servicios</SelectItem>
                  <SelectItem value="earnings">Ganancias</SelectItem>
                  <SelectItem value="profile">Perfil</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <TabsContent value="requests" className="space-y-6">
            <h2 className="text-xl">Solicitudes Pendientes ({pendingRequests.length})</h2>

            <div className="space-y-4">
              {pendingRequests.map((request) => (
                <Card key={request.id}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg mb-1">{request.service} para {request.petName}</h3>
                        <p className="text-sm text-gray-600">Propietario: {request.ownerName}</p>
                        <div className="flex items-center space-x-4 mt-2">
                          <span className="flex items-center text-sm text-gray-500">
                            <Calendar className="h-4 w-4 mr-1" />
                            {request.date}
                          </span>
                          <span className="flex items-center text-sm text-gray-500">
                            <Clock className="h-4 w-4 mr-1" />
                            {request.time}
                          </span>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xl text-primary mb-1">{request.price}</p>
                        <Badge variant="secondary">{request.petType}</Badge>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-3 rounded-lg mb-4">
                      <p className="text-sm text-gray-700">
                        <span className="text-gray-900">Notas:</span> {request.notes}
                      </p>
                    </div>

                    <div className="flex space-x-3">
                      <Button className="flex-1">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Aceptar
                      </Button>
                      <Button variant="outline" className="flex-1">
                        <XCircle className="h-4 w-4 mr-2" />
                        Declinar
                      </Button>
                      <Button variant="outline">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Mensaje
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="schedule" className="space-y-6">
            <h2 className="text-xl">Próximos Trabajos</h2>

            <div className="space-y-4">
              {upcomingJobs.map((job) => (
                <Card key={job.id}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-4">
                        <Avatar>
                          <AvatarFallback>{job.petName[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="text-lg">{job.service} - {job.petName}</h3>
                          <p className="text-sm text-gray-600">{job.ownerName}</p>
                          <div className="flex items-center space-x-4 mt-1">
                            <span className="flex items-center text-sm text-gray-500">
                              <Calendar className="h-4 w-4 mr-1" />
                              {job.date}
                            </span>
                            <span className="flex items-center text-sm text-gray-500">
                              <Clock className="h-4 w-4 mr-1" />
                              {job.time}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-lg text-primary">{job.price}</p>
                        <Badge variant="default">Confirmado</Badge>
                      </div>
                    </div>
                    <div className="flex space-x-2 mt-4">
                      <Button variant="outline" size="sm">Ver Detalles</Button>
                      <Button variant="outline" size="sm">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Contactar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="services" className="space-y-6">
            <ServiceManager />
          </TabsContent>

          <TabsContent value="earnings" className="space-y-6">
            <h2 className="text-xl">Resumen de Ganancias</h2>

            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Ganancias por Mes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Enero 2025</span>
                      <span className="text-primary">420€</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Febrero 2025</span>
                      <span className="text-primary">380€</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Marzo 2025</span>
                      <span className="text-primary">340€</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Servicios Más Solicitados</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Paseos</span>
                      <span className="text-primary">45%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Cuidado en casa</span>
                      <span className="text-primary">30%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Visitas</span>
                      <span className="text-primary">25%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="profile" className="space-y-6">
            <ProfileManager userData={userData} userType="sitter" />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}