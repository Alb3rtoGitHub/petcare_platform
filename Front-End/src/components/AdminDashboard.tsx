import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table"
import { Alert, AlertDescription } from "./ui/alert"
import UserManagement from "./UserManagement"
import ServicePricingManager from "./ServicePricingManager"
import { BarChart3, Users, DollarSign, AlertTriangle, CheckCircle, XCircle, Eye, Flag, TrendingUp, Calendar } from "lucide-react"

interface AdminDashboardProps {
  userData?: any
}

export default function AdminDashboard({ userData }: AdminDashboardProps) {
  const [showUserManagement, setShowUserManagement] = useState(false)
  const [showServicePricing, setShowServicePricing] = useState(false)

  if (showUserManagement) {
    return <UserManagement onBack={() => setShowUserManagement(false)} />
  }
  
  if (showServicePricing) {
    return <ServicePricingManager onBack={() => setShowServicePricing(false)} />
  }
  const systemStats = {
    totalUsers: "2,847",
    activeSitters: "437",
    activeOwners: "2,410",
    totalBookings: "12,456",
    monthlyRevenue: "28,450€",
    averageRating: "4.7"
  }

  const pendingReports = [
    {
      id: 1,
      type: "Calidad del servicio",
      reporter: "Ana López",
      reported: "Carlos Rodríguez",
      date: "2025-01-25",
      status: "pendiente",
      severity: "media",
      description: "El cuidador llegó 30 minutos tarde sin avisar"
    },
    {
      id: 2,
      type: "Comportamiento inapropiado",
      reporter: "Pedro Martín",
      reported: "Laura Sánchez",
      date: "2025-01-24",
      status: "investigando",
      severity: "alta",
      description: "No siguió las instrucciones específicas para la medicación"
    }
  ]

  const recentUsers = [
    {
      id: 1,
      name: "Elena Ruiz",
      type: "Cuidador",
      joinDate: "2025-01-26",
      status: "verificando",
      location: "Barcelona"
    },
    {
      id: 2,
      name: "José García",
      type: "Propietario",
      joinDate: "2025-01-26",
      status: "activo",
      location: "Madrid"
    },
    {
      id: 3,
      name: "Carmen Díaz",
      type: "Cuidador",
      joinDate: "2025-01-25",
      status: "pendiente",
      location: "Valencia"
    }
  ]

  const flaggedContent = [
    {
      id: 1,
      type: "Reseña",
      user: "Usuario123",
      content: "Servicio terrible, no recomiendo para nada...",
      flags: 3,
      date: "2025-01-25"
    },
    {
      id: 2,
      type: "Perfil",
      user: "MascotaLover99",
      content: "Información de contacto incorrecta",
      flags: 2,
      date: "2025-01-24"
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl text-gray-900 mb-2">Panel de Administración</h1>
          <p className="text-gray-600">Supervisión y gestión de la plataforma</p>
        </div>

        {/* Alert for urgent issues */}
        <Alert className="mb-8 border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            Hay 2 reportes de alta prioridad que requieren atención inmediata.
          </AlertDescription>
        </Alert>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Usuarios Total</p>
                  <p className="text-2xl">{systemStats.totalUsers}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Cuidadores</p>
                  <p className="text-2xl">{systemStats.activeSitters}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Users className="h-8 w-8 text-purple-600" />
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Propietarios</p>
                  <p className="text-2xl">{systemStats.activeOwners}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Calendar className="h-8 w-8 text-indigo-600" />
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Reservas</p>
                  <p className="text-2xl">{systemStats.totalBookings}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <DollarSign className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Ingresos Mes</p>
                  <p className="text-2xl">{systemStats.monthlyRevenue}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-yellow-500" />
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Rating Prom.</p>
                  <p className="text-2xl">{systemStats.averageRating}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="reports" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="reports">Reportes</TabsTrigger>
            <TabsTrigger value="users">Usuarios</TabsTrigger>
            <TabsTrigger value="services">Servicios</TabsTrigger>
            <TabsTrigger value="content">Contenido</TabsTrigger>
            <TabsTrigger value="analytics">Analíticas</TabsTrigger>
            <TabsTrigger value="settings">Configuración</TabsTrigger>
          </TabsList>

          <TabsContent value="reports" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl">Reportes Pendientes ({pendingReports.length})</h2>
              <Button variant="outline">Ver Todos los Reportes</Button>
            </div>

            <div className="space-y-4">
              {pendingReports.map((report) => (
                <Card key={report.id}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg mb-1">{report.type}</h3>
                        <p className="text-sm text-gray-600">
                          Reportado por: {report.reporter} | Usuario reportado: {report.reported}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">Fecha: {report.date}</p>
                      </div>
                      <div className="flex space-x-2">
                        <Badge 
                          variant={report.severity === 'alta' ? 'destructive' : 'secondary'}
                        >
                          {report.severity}
                        </Badge>
                        <Badge variant="outline">{report.status}</Badge>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-3 rounded-lg mb-4">
                      <p className="text-sm text-gray-700">{report.description}</p>
                    </div>

                    <div className="flex space-x-3">
                      <Button size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        Investigar
                      </Button>
                      <Button variant="outline" size="sm">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Aprobar
                      </Button>
                      <Button variant="destructive" size="sm">
                        <XCircle className="h-4 w-4 mr-2" />
                        Rechazar
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl">Gestión de Usuarios</h2>
              <Button onClick={() => setShowUserManagement(true)}>
                <Users className="h-4 w-4 mr-2" />
                Gestión Completa de Usuarios
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Usuarios Recientes</CardTitle>
              </CardHeader>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Ubicación</TableHead>
                    <TableHead>Fecha Registro</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.type}</TableCell>
                      <TableCell>{user.location}</TableCell>
                      <TableCell>{user.joinDate}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={user.status === 'activo' ? 'default' : 'secondary'}
                        >
                          {user.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">Ver</Button>
                          {user.status === 'pendiente' && (
                            <Button size="sm">Aprobar</Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>
          </TabsContent>

          <TabsContent value="services" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl">Gestión de Servicios y Precios</h2>
              <Button onClick={() => setShowServicePricing(true)}>
                <DollarSign className="h-4 w-4 mr-2" />
                Gestión Completa de Precios
              </Button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Servicios por Horas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Paseos</span>
                      <span className="font-medium">10€ - 25€/h</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Cuidado en casa</span>
                      <span className="font-medium">15€ - 30€/h</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Entrenamiento</span>
                      <span className="font-medium">40€ - 100€/h</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Servicios por Días</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Hospedaje nocturno</span>
                      <span className="font-medium">25€ - 60€/día</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Cuidado extendido</span>
                      <span className="font-medium">30€ - 80€/día</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Servicios Especializados</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Grooming básico</span>
                      <span className="font-medium">35€ - 80€</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Visita veterinaria</span>
                      <span className="font-medium">20€ - 40€</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Transporte</span>
                      <span className="font-medium">15€ - 35€</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Comisiones por Categoría</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">Cuidado Básico</p>
                    <p className="text-2xl font-bold text-green-600">15%</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">Hospedaje</p>
                    <p className="text-2xl font-bold text-blue-600">20%</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">Especializados</p>
                    <p className="text-2xl font-bold text-purple-600">25%</p>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600">Emergencias</p>
                    <p className="text-2xl font-bold text-red-600">30%</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="content" className="space-y-6">
            <h2 className="text-xl">Contenido Reportado</h2>

            <div className="space-y-4">
              {flaggedContent.map((content) => (
                <Card key={content.id}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-lg mb-1">{content.type} de {content.user}</h3>
                        <p className="text-sm text-gray-500">Reportado: {content.date}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Flag className="h-4 w-4 text-red-500" />
                        <span className="text-sm text-red-600">{content.flags} reportes</span>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-3 rounded-lg mb-4">
                      <p className="text-sm text-gray-700">{content.content}</p>
                    </div>

                    <div className="flex space-x-3">
                      <Button variant="outline" size="sm">Mantener</Button>
                      <Button variant="destructive" size="sm">Eliminar</Button>
                      <Button variant="outline" size="sm">Contactar Usuario</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <h2 className="text-xl">Analíticas del Sistema</h2>

            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BarChart3 className="h-5 w-5 mr-2" />
                    Crecimiento de Usuarios
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Enero 2025</span>
                      <span className="text-primary">+284 usuarios</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Febrero 2025</span>
                      <span className="text-primary">+321 usuarios</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Marzo 2025</span>
                      <span className="text-primary">+298 usuarios</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Servicios Más Populares</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span>Paseos</span>
                      <span className="text-primary">42%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Cuidado en casa</span>
                      <span className="text-primary">35%</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Visitas</span>
                      <span className="text-primary">23%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <h2 className="text-xl">Configuración del Sistema</h2>

            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Configuración General</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button variant="outline" className="w-full justify-start">
                    Gestionar Comisiones
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    Configurar Notificaciones
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    Políticas de Servicio
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Herramientas de Moderación</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button variant="outline" className="w-full justify-start">
                    Palabras Filtradas
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    Reglas Automáticas
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    Gestión de Baneos
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}