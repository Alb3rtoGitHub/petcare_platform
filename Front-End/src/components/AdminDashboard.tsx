import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table"
import { Alert, AlertDescription } from "./ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import UserManagement from "./UserManagement"
import ServicePricingManager from "./ServicePricingManager"
import AllReports from "./AllReports"
import AllFlaggedContent from "./AllFlaggedContent"
import AdminProfileManager from "./AdminProfileManager"
import { BarChart3, Users, DollarSign, AlertTriangle, CheckCircle, XCircle, Eye, Flag, TrendingUp, Calendar } from "lucide-react"

interface AdminDashboardProps {
  userData?: any
}

export default function AdminDashboard({ userData }: AdminDashboardProps) {
  const [showUserManagement, setShowUserManagement] = useState(false)
  const [showAllReports, setShowAllReports] = useState(false)
  const [showAllFlaggedContent, setShowAllFlaggedContent] = useState(false)
  const [currentTab, setCurrentTab] = useState("reports")

  if (showUserManagement) {
    return <UserManagement onBack={() => setShowUserManagement(false)} />
  }
  
  if (showAllReports) {
    return <AllReports onBack={() => setShowAllReports(false)} />
  }

  if (showAllFlaggedContent) {
    return <AllFlaggedContent onBack={() => setShowAllFlaggedContent(false)} />
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

        <Tabs value={currentTab} onValueChange={setCurrentTab} className="space-y-6">
          <div className="flex flex-col space-y-4">
            {/* Tabs normales para desktop y tablet */}
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 lg:grid-cols-7">
              <TabsTrigger value="reports" className="text-xs sm:text-sm">Reportes</TabsTrigger>
              <TabsTrigger value="users" className="text-xs sm:text-sm">Usuarios</TabsTrigger>
              <TabsTrigger value="services" className="text-xs sm:text-sm">Servicios</TabsTrigger>
              <TabsTrigger value="content" className="text-xs sm:text-sm">Contenido</TabsTrigger>
              <TabsTrigger value="analytics" className="text-xs sm:text-sm lg:block hidden">Analíticas</TabsTrigger>
              <TabsTrigger value="settings" className="text-xs sm:text-sm lg:block hidden">Configuración</TabsTrigger>
              <TabsTrigger value="profile" className="text-xs sm:text-sm lg:block hidden">Perfil</TabsTrigger>
            </TabsList>

            {/* Dropdown para tabs adicionales en móvil/tablet */}
            <div className="lg:hidden">
              <Select value={currentTab} onValueChange={setCurrentTab}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Más opciones" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="analytics">Analíticas</SelectItem>
                  <SelectItem value="settings">Configuración</SelectItem>
                  <SelectItem value="profile">Perfil</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <TabsContent value="reports" className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <h2 className="text-xl hidden sm:inline">Reportes Pendientes ({pendingReports.length})</h2>
              <h2 className="text-lg sm:hidden">Reportes ({pendingReports.length})</h2>
              <Button variant="outline" onClick={() => setShowAllReports(true)} className="text-xs sm:text-sm w-full sm:w-auto">
                <span className="hidden sm:inline">Ver Todos los Reportes</span>
                <span className="sm:hidden">Ver Todos</span>
              </Button>
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
            <ServicePricingManager onBack={() => setCurrentTab("reports")} />
          </TabsContent>

          <TabsContent value="content" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl">Contenido Reportado</h2>
              <Button variant="outline" onClick={() => setShowAllFlaggedContent(true)}>
                <Flag className="h-4 w-4 mr-2" />
                Ver Todo el Contenido Reportado
              </Button>
            </div>

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

          <TabsContent value="profile" className="space-y-6">
            <h2 className="text-xl">Perfil del Administrador</h2>
            <AdminProfileManager userData={userData} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}