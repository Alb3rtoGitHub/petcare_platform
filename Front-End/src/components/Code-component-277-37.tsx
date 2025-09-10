import { useState } from "react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { 
  Search, 
  Filter, 
  Eye, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  ArrowLeft,
  Calendar,
  Clock,
  User,
  Flag
} from "lucide-react"

interface Report {
  id: number
  type: string
  reporter: string
  reported: string
  date: string
  status: 'pendiente' | 'investigando' | 'resuelto' | 'rechazado'
  severity: 'baja' | 'media' | 'alta'
  description: string
  category: 'usuario' | 'contenido' | 'servicio'
  reporterType: 'owner' | 'sitter' | 'admin'
  reportedType?: 'owner' | 'sitter'
}

interface AllReportsProps {
  onBack: () => void
}

export default function AllReports({ onBack }: AllReportsProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTab, setSelectedTab] = useState("all")
  const [selectedSeverity, setSelectedSeverity] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")

  // Mock reports data
  const [reports, setReports] = useState<Report[]>([
    {
      id: 1,
      type: "Calidad del servicio",
      reporter: "Ana López",
      reported: "Carlos Rodríguez",
      date: "2025-01-25",
      status: "pendiente",
      severity: "media",
      description: "El cuidador llegó 30 minutos tarde sin avisar",
      category: "servicio",
      reporterType: "owner",
      reportedType: "sitter"
    },
    {
      id: 2,
      type: "Comportamiento inapropiado",
      reporter: "Pedro Martín",
      reported: "Laura Sánchez",
      date: "2025-01-24",
      status: "investigando",
      severity: "alta",
      description: "No siguió las instrucciones específicas para la medicación",
      category: "servicio",
      reporterType: "owner",
      reportedType: "sitter"
    },
    {
      id: 3,
      type: "Contenido inapropiado",
      reporter: "Sistema Automático",
      reported: "Usuario123",
      date: "2025-01-23",
      status: "resuelto",
      severity: "baja",
      description: "Reseña con lenguaje inapropiado",
      category: "contenido",
      reporterType: "admin"
    },
    {
      id: 4,
      type: "Cancelación sin aviso",
      reporter: "María García",
      reported: "Luis Fernández",
      date: "2025-01-22",
      status: "resuelto",
      severity: "media",
      description: "Canceló el servicio 2 horas antes sin justificación",
      category: "servicio",
      reporterType: "owner",
      reportedType: "sitter"
    },
    {
      id: 5,
      type: "Perfil falso",
      reporter: "Carmen López",
      reported: "FakeUser456",
      date: "2025-01-21",
      status: "investigando",
      severity: "alta",
      description: "Sospecha de perfil falso con fotos robadas",
      category: "usuario",
      reporterType: "sitter"
    },
    {
      id: 6,
      type: "Spam",
      reporter: "Elena Ruiz",
      reported: "SpamUser789",
      date: "2025-01-20",
      status: "rechazado",
      severity: "baja",
      description: "Mensajes repetitivos promocionando otros servicios",
      category: "contenido",
      reporterType: "owner"
    },
    {
      id: 7,
      type: "Maltrato animal",
      reporter: "José García",
      reported: "BadSitter001",
      date: "2025-01-19",
      status: "investigando",
      severity: "alta",
      description: "Evidencia de trato inadecuado hacia la mascota",
      category: "servicio",
      reporterType: "owner",
      reportedType: "sitter"
    },
    {
      id: 8,
      type: "Información incorrecta",
      reporter: "System Check",
      reported: "IncorrectProfile",
      date: "2025-01-18",
      status: "pendiente",
      severity: "media",
      description: "Información de ubicación no coincide con la real",
      category: "usuario",
      reporterType: "admin"
    }
  ])

  const stats = {
    total: reports.length,
    pendiente: reports.filter(r => r.status === 'pendiente').length,
    investigando: reports.filter(r => r.status === 'investigando').length,
    resuelto: reports.filter(r => r.status === 'resuelto').length,
    rechazado: reports.filter(r => r.status === 'rechazado').length,
    alta: reports.filter(r => r.severity === 'alta').length,
    media: reports.filter(r => r.severity === 'media').length,
    baja: reports.filter(r => r.severity === 'baja').length
  }

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         report.reporter.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         report.reported.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         report.description.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesTab = selectedTab === 'all' || report.category === selectedTab
    const matchesSeverity = selectedSeverity === 'all' || report.severity === selectedSeverity
    const matchesStatus = selectedStatus === 'all' || report.status === selectedStatus
    
    return matchesSearch && matchesTab && matchesSeverity && matchesStatus
  })

  const handleStatusChange = (reportId: number, newStatus: 'pendiente' | 'investigando' | 'resuelto' | 'rechazado') => {
    setReports(prevReports =>
      prevReports.map(report =>
        report.id === reportId ? { ...report, status: newStatus } : report
      )
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resuelto':
        return 'bg-green-100 text-green-800'
      case 'investigando':
        return 'bg-blue-100 text-blue-800'
      case 'pendiente':
        return 'bg-yellow-100 text-yellow-800'
      case 'rechazado':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'alta':
        return 'bg-red-100 text-red-800'
      case 'media':
        return 'bg-yellow-100 text-yellow-800'
      case 'baja':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'usuario':
        return <User className="h-4 w-4" />
      case 'contenido':
        return <Flag className="h-4 w-4" />
      case 'servicio':
        return <Clock className="h-4 w-4" />
      default:
        return <AlertTriangle className="h-4 w-4" />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver al Panel
          </Button>
          <div>
            <h1 className="text-3xl mb-2">Todos los Reportes</h1>
            <p className="text-gray-600">Gestiona todos los reportes de la plataforma</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl mb-1">{stats.total}</div>
              <div className="text-sm text-gray-600">Total</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl text-yellow-600 mb-1">{stats.pendiente}</div>
              <div className="text-sm text-gray-600">Pendientes</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl text-blue-600 mb-1">{stats.investigando}</div>
              <div className="text-sm text-gray-600">Investigando</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl text-green-600 mb-1">{stats.resuelto}</div>
              <div className="text-sm text-gray-600">Resueltos</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl text-red-600 mb-1">{stats.rechazado}</div>
              <div className="text-sm text-gray-600">Rechazados</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl text-red-600 mb-1">{stats.alta}</div>
              <div className="text-sm text-gray-600">Alta Prioridad</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl text-yellow-600 mb-1">{stats.media}</div>
              <div className="text-sm text-gray-600">Media Prioridad</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl text-green-600 mb-1">{stats.baja}</div>
              <div className="text-sm text-gray-600">Baja Prioridad</div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar reportes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <div className="flex gap-2">
                <Tabs value={selectedTab} onValueChange={setSelectedTab}>
                  <TabsList>
                    <TabsTrigger value="all">Todos</TabsTrigger>
                    <TabsTrigger value="usuario">Usuario</TabsTrigger>
                    <TabsTrigger value="contenido">Contenido</TabsTrigger>
                    <TabsTrigger value="servicio">Servicio</TabsTrigger>
                  </TabsList>
                </Tabs>

                <Select value={selectedSeverity} onValueChange={setSelectedSeverity}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Severidad" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas</SelectItem>
                    <SelectItem value="alta">Alta</SelectItem>
                    <SelectItem value="media">Media</SelectItem>
                    <SelectItem value="baja">Baja</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="pendiente">Pendiente</SelectItem>
                    <SelectItem value="investigando">Investigando</SelectItem>
                    <SelectItem value="resuelto">Resuelto</SelectItem>
                    <SelectItem value="rechazado">Rechazado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Reports List */}
        <div className="space-y-4">
          {filteredReports.map((report) => (
            <Card key={report.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      {getCategoryIcon(report.category)}
                    </div>
                    <div>
                      <h3 className="text-lg mb-1">{report.type}</h3>
                      <p className="text-sm text-gray-600">
                        Reportado por: <span className="font-medium">{report.reporter}</span> | 
                        Usuario reportado: <span className="font-medium">{report.reported}</span>
                      </p>
                      <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                        <Calendar className="h-3 w-3" />
                        <span>{report.date}</span>
                        <span>•</span>
                        <span className="capitalize">{report.category}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Badge className={getSeverityColor(report.severity)}>
                      {report.severity}
                    </Badge>
                    <Badge className={getStatusColor(report.status)}>
                      {report.status}
                    </Badge>
                  </div>
                </div>

                <div className="bg-gray-50 p-3 rounded-lg mb-4">
                  <p className="text-sm text-gray-700">{report.description}</p>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex gap-2">
                    {report.status === 'pendiente' && (
                      <Button 
                        size="sm" 
                        onClick={() => handleStatusChange(report.id, 'investigando')}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Investigar
                      </Button>
                    )}
                    {(report.status === 'pendiente' || report.status === 'investigando') && (
                      <>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleStatusChange(report.id, 'resuelto')}
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Resolver
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => handleStatusChange(report.id, 'rechazado')}
                        >
                          <XCircle className="h-4 w-4 mr-2" />
                          Rechazar
                        </Button>
                      </>
                    )}
                  </div>
                  
                  <div className="text-sm text-gray-500">
                    ID: {report.id}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {filteredReports.length === 0 && (
            <Card>
              <CardContent className="text-center py-12">
                <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg mb-2">No se encontraron reportes</h3>
                <p className="text-gray-500">Intenta ajustar los filtros de búsqueda</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}