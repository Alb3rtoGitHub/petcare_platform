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
  Flag, 
  Trash2, 
  CheckCircle,
  ArrowLeft,
  Calendar,
  User,
  MessageSquare,
  Image,
  FileText
} from "lucide-react"

interface FlaggedContent {
  id: number
  type: 'reseña' | 'perfil' | 'mensaje' | 'imagen' | 'descripcion'
  user: string
  content: string
  flags: number
  date: string
  status: 'pendiente' | 'revisado' | 'eliminado' | 'mantenido'
  severity: 'baja' | 'media' | 'alta'
  reason: string
}

interface AllFlaggedContentProps {
  onBack: () => void
}

export default function AllFlaggedContent({ onBack }: AllFlaggedContentProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTab, setSelectedTab] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [selectedSeverity, setSelectedSeverity] = useState("all")

  // Mock flagged content data
  const [flaggedContent, setFlaggedContent] = useState<FlaggedContent[]>([
    {
      id: 1,
      type: "reseña",
      user: "Usuario123",
      content: "Servicio terrible, no recomiendo para nada. El cuidador fue muy grosero...",
      flags: 5,
      date: "2025-01-25",
      status: "pendiente",
      severity: "media",
      reason: "Lenguaje inapropiado"
    },
    {
      id: 2,
      type: "perfil",
      user: "MascotaLover99",
      content: "Información de contacto incorrecta. Dirección falsa proporcionada.",
      flags: 3,
      date: "2025-01-24",
      status: "revisado",
      severity: "alta",
      reason: "Información falsa"
    },
    {
      id: 3,
      type: "mensaje",
      user: "SpamUser456",
      content: "¡Oferta especial! Servicios más baratos en otra plataforma...",
      flags: 8,
      date: "2025-01-23",
      status: "eliminado",
      severity: "alta",
      reason: "Spam comercial"
    },
    {
      id: 4,
      type: "reseña",
      user: "AngryOwner",
      content: "Pérdida de tiempo total. Nunca más usaré este servicio.",
      flags: 2,
      date: "2025-01-22",
      status: "mantenido",
      severity: "baja",
      reason: "Experiencia genuina"
    },
    {
      id: 5,
      type: "imagen",
      user: "FakeProfile789",
      content: "Imagen de perfil sospechosa - parece ser una foto de stock",
      flags: 6,
      date: "2025-01-21",
      status: "pendiente",
      severity: "alta",
      reason: "Identidad falsa"
    },
    {
      id: 6,
      type: "descripcion",
      user: "BadSitter001",
      content: "Experiencia fabricada. Menciona certificaciones que no posee.",
      flags: 4,
      date: "2025-01-20",
      status: "revisado",
      severity: "media",
      reason: "Información falsa"
    },
    {
      id: 7,
      type: "mensaje",
      user: "HarassUser",
      content: "Mensajes repetitivos y acosadores hacia otros usuarios",
      flags: 7,
      date: "2025-01-19",
      status: "eliminado",
      severity: "alta",
      reason: "Acoso"
    },
    {
      id: 8,
      type: "reseña",
      user: "CompetitorShill",
      content: "Reseña obviamente falsa promocionando competidor",
      flags: 3,
      date: "2025-01-18",
      status: "eliminado",
      severity: "media",
      reason: "Reseña falsa"
    }
  ])

  const stats = {
    total: flaggedContent.length,
    pendiente: flaggedContent.filter(c => c.status === 'pendiente').length,
    revisado: flaggedContent.filter(c => c.status === 'revisado').length,
    eliminado: flaggedContent.filter(c => c.status === 'eliminado').length,
    mantenido: flaggedContent.filter(c => c.status === 'mantenido').length,
    alta: flaggedContent.filter(c => c.severity === 'alta').length,
    media: flaggedContent.filter(c => c.severity === 'media').length,
    baja: flaggedContent.filter(c => c.severity === 'baja').length
  }

  const filteredContent = flaggedContent.filter(content => {
    const matchesSearch = content.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         content.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         content.reason.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesTab = selectedTab === 'all' || content.type === selectedTab
    const matchesStatus = selectedStatus === 'all' || content.status === selectedStatus
    const matchesSeverity = selectedSeverity === 'all' || content.severity === selectedSeverity
    
    return matchesSearch && matchesTab && matchesStatus && matchesSeverity
  })

  const handleStatusChange = (contentId: number, newStatus: 'pendiente' | 'revisado' | 'eliminado' | 'mantenido') => {
    setFlaggedContent(prevContent =>
      prevContent.map(content =>
        content.id === contentId ? { ...content, status: newStatus } : content
      )
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'mantenido':
        return 'bg-green-100 text-green-800'
      case 'revisado':
        return 'bg-blue-100 text-blue-800'
      case 'pendiente':
        return 'bg-yellow-100 text-yellow-800'
      case 'eliminado':
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

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'reseña':
        return <MessageSquare className="h-4 w-4" />
      case 'perfil':
        return <User className="h-4 w-4" />
      case 'mensaje':
        return <MessageSquare className="h-4 w-4" />
      case 'imagen':
        return <Image className="h-4 w-4" />
      case 'descripcion':
        return <FileText className="h-4 w-4" />
      default:
        return <Flag className="h-4 w-4" />
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
            <h1 className="text-3xl mb-2">Todo el Contenido Reportado</h1>
            <p className="text-gray-600">Gestiona todo el contenido flaggeado de la plataforma</p>
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
              <div className="text-2xl text-blue-600 mb-1">{stats.revisado}</div>
              <div className="text-sm text-gray-600">Revisados</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl text-red-600 mb-1">{stats.eliminado}</div>
              <div className="text-sm text-gray-600">Eliminados</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl text-green-600 mb-1">{stats.mantenido}</div>
              <div className="text-sm text-gray-600">Mantenidos</div>
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
                  placeholder="Buscar contenido..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <div className="flex gap-2">
                <Tabs value={selectedTab} onValueChange={setSelectedTab}>
                  <TabsList>
                    <TabsTrigger value="all">Todos</TabsTrigger>
                    <TabsTrigger value="reseña">Reseñas</TabsTrigger>
                    <TabsTrigger value="perfil">Perfiles</TabsTrigger>
                    <TabsTrigger value="mensaje">Mensajes</TabsTrigger>
                    <TabsTrigger value="imagen">Imágenes</TabsTrigger>
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
                    <SelectItem value="revisado">Revisado</SelectItem>
                    <SelectItem value="eliminado">Eliminado</SelectItem>
                    <SelectItem value="mantenido">Mantenido</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Content List */}
        <div className="space-y-4">
          {filteredContent.map((content) => (
            <Card key={content.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      {getTypeIcon(content.type)}
                    </div>
                    <div>
                      <h3 className="text-lg mb-1 capitalize">{content.type} de {content.user}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Calendar className="h-3 w-3" />
                        <span>{content.date}</span>
                        <span>•</span>
                        <span>Motivo: {content.reason}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 text-red-600">
                      <Flag className="h-4 w-4" />
                      <span className="text-sm">{content.flags} reportes</span>
                    </div>
                    <Badge className={getSeverityColor(content.severity)}>
                      {content.severity}
                    </Badge>
                    <Badge className={getStatusColor(content.status)}>
                      {content.status}
                    </Badge>
                  </div>
                </div>

                <div className="bg-gray-50 p-3 rounded-lg mb-4">
                  <p className="text-sm text-gray-700">{content.content}</p>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex gap-2">
                    {content.status === 'pendiente' && (
                      <>
                        <Button 
                          size="sm" 
                          onClick={() => handleStatusChange(content.id, 'revisado')}
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Marcar como Revisado
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleStatusChange(content.id, 'mantenido')}
                        >
                          Mantener
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => handleStatusChange(content.id, 'eliminado')}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Eliminar
                        </Button>
                      </>
                    )}
                    {content.status === 'revisado' && (
                      <>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleStatusChange(content.id, 'mantenido')}
                        >
                          Mantener
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => handleStatusChange(content.id, 'eliminado')}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Eliminar
                        </Button>
                      </>
                    )}
                    {(content.status === 'eliminado' || content.status === 'mantenido') && (
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleStatusChange(content.id, 'pendiente')}
                      >
                        Revisar Nuevamente
                      </Button>
                    )}
                  </div>
                  
                  <div className="text-sm text-gray-500">
                    ID: {content.id}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {filteredContent.length === 0 && (
            <Card>
              <CardContent className="text-center py-12">
                <Flag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg mb-2">No se encontró contenido</h3>
                <p className="text-gray-500">Intenta ajustar los filtros de búsqueda</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}