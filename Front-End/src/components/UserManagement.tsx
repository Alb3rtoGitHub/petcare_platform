import { useState } from "react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs"
import { Alert, AlertDescription } from "./ui/alert"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"
import { Textarea } from "./ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { 
  Search, 
  Filter, 
  MoreHorizontal, 
  Edit, 
  Shield, 
  ShieldOff, 
  Trash2, 
  Eye, 
  Mail,
  Phone,
  MapPin,
  Calendar,
  Star,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Users,
  Heart,
  PawPrint,
  ArrowLeft,
  Save
} from "lucide-react"

interface User {
  id: number
  name: string
  email: string
  phone: string
  type: 'owner' | 'sitter'
  status: 'active' | 'blocked' | 'pending'
  verified: boolean
  createdAt: string
  location: string
  avatar?: string
  // Owner specific
  pets?: Array<{
    name: string
    type: string
    breed: string
  }>
  // Sitter specific
  rating?: number
  reviews?: number
  services?: string[]
  lastActivity?: string
}

interface UserManagementProps {
  onBack: () => void
}

export default function UserManagement({ onBack }: UserManagementProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedTab, setSelectedTab] = useState("all")
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editForm, setEditForm] = useState<Partial<User>>({})

  // Mock user data
  const [users, setUsers] = useState<User[]>([
    {
      id: 1,
      name: "María García",
      email: "maria@email.com",
      phone: "+34 600 123 456",
      type: "owner",
      status: "active",
      verified: true,
      createdAt: "2024-01-15",
      location: "Madrid, España",
      pets: [
        { name: "Luna", type: "Perro", breed: "Golden Retriever" },
        { name: "Milo", type: "Gato", breed: "Siamés" }
      ],
      lastActivity: "Hace 2 horas"
    },
    {
      id: 2,
      name: "Carlos Rodríguez",
      email: "carlos@email.com",
      phone: "+34 600 234 567",
      type: "sitter",
      status: "active",
      verified: true,
      createdAt: "2024-01-10",
      location: "Barcelona, España",
      rating: 4.8,
      reviews: 142,
      services: ["Paseos", "Cuidado en casa", "Hospedaje"],
      lastActivity: "Hace 1 hora"
    },
    {
      id: 3,
      name: "Ana Martínez",
      email: "ana@email.com",
      phone: "+34 600 345 678",
      type: "owner",
      status: "pending",
      verified: false,
      createdAt: "2024-01-20",
      location: "Valencia, España",
      pets: [
        { name: "Rocky", type: "Perro", breed: "Pastor Alemán" }
      ],
      lastActivity: "Hace 1 día"
    },
    {
      id: 4,
      name: "Luis Fernández",
      email: "luis@email.com",
      phone: "+34 600 456 789",
      type: "sitter",
      status: "blocked",
      verified: false,
      createdAt: "2024-01-05",
      location: "Sevilla, España",
      rating: 3.2,
      reviews: 23,
      services: ["Paseos"],
      lastActivity: "Hace 3 días"
    },
    {
      id: 5,
      name: "Carmen López",
      email: "carmen@email.com",
      phone: "+34 600 567 890",
      type: "sitter",
      status: "active",
      verified: true,
      createdAt: "2024-01-12",
      location: "Bilbao, España",
      rating: 4.9,
      reviews: 89,
      services: ["Paseos", "Cuidado en casa", "Grooming", "Entrenamiento"],
      lastActivity: "Hace 30 minutos"
    }
  ])

  const stats = {
    total: users.length,
    owners: users.filter(u => u.type === 'owner').length,
    sitters: users.filter(u => u.type === 'sitter').length,
    active: users.filter(u => u.status === 'active').length,
    pending: users.filter(u => u.status === 'pending').length,
    blocked: users.filter(u => u.status === 'blocked').length,
    verified: users.filter(u => u.verified).length
  }

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase())
    
    switch (selectedTab) {
      case 'owners':
        return matchesSearch && user.type === 'owner'
      case 'sitters':
        return matchesSearch && user.type === 'sitter'
      case 'active':
        return matchesSearch && user.status === 'active'
      case 'pending':
        return matchesSearch && user.status === 'pending'
      case 'blocked':
        return matchesSearch && user.status === 'blocked'
      default:
        return matchesSearch
    }
  })

  const handleEditUser = (user: User) => {
    setSelectedUser(user)
    setEditForm(user)
    setIsEditDialogOpen(true)
  }

  const handleSaveEdit = () => {
    if (selectedUser && editForm) {
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === selectedUser.id ? { ...user, ...editForm } : user
        )
      )
      setIsEditDialogOpen(false)
      setSelectedUser(null)
      setEditForm({})
    }
  }

  const handleBlockUser = (userId: number) => {
    setUsers(prevUsers =>
      prevUsers.map(user =>
        user.id === userId 
          ? { ...user, status: user.status === 'blocked' ? 'active' : 'blocked' as 'active' | 'blocked' }
          : user
      )
    )
  }

  const handleVerifyUser = (userId: number) => {
    setUsers(prevUsers =>
      prevUsers.map(user =>
        user.id === userId 
          ? { ...user, verified: !user.verified, status: user.verified ? 'pending' : 'active' as 'pending' | 'active' }
          : user
      )
    )
  }

  const handleDeleteUser = (userId: number) => {
    if (confirm('¿Estás seguro de que quieres eliminar este usuario? Esta acción no se puede deshacer.')) {
      setUsers(prevUsers => prevUsers.filter(user => user.id !== userId))
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'blocked':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-3 w-3" />
      case 'pending':
        return <AlertTriangle className="h-3 w-3" />
      case 'blocked':
        return <XCircle className="h-3 w-3" />
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver al Panel
          </Button>
          <div>
            <h1 className="text-3xl mb-2">Gestión de Usuarios</h1>
            <p className="text-gray-600">Administra todos los usuarios de la plataforma</p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl mb-1">{stats.total}</div>
            <div className="text-sm text-gray-600">Total</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl text-blue-600 mb-1">{stats.owners}</div>
            <div className="text-sm text-gray-600">Dueños</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl text-green-600 mb-1">{stats.sitters}</div>
            <div className="text-sm text-gray-600">Cuidadores</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl text-green-600 mb-1">{stats.active}</div>
            <div className="text-sm text-gray-600">Activos</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl text-yellow-600 mb-1">{stats.pending}</div>
            <div className="text-sm text-gray-600">Pendientes</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl text-red-600 mb-1">{stats.blocked}</div>
            <div className="text-sm text-gray-600">Bloqueados</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl text-purple-600 mb-1">{stats.verified}</div>
            <div className="text-sm text-gray-600">Verificados</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Buscar usuarios..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Tabs value={selectedTab} onValueChange={setSelectedTab}>
              <TabsList>
                <TabsTrigger value="all">Todos</TabsTrigger>
                <TabsTrigger value="owners">Dueños</TabsTrigger>
                <TabsTrigger value="sitters">Cuidadores</TabsTrigger>
                <TabsTrigger value="active">Activos</TabsTrigger>
                <TabsTrigger value="pending">Pendientes</TabsTrigger>
                <TabsTrigger value="blocked">Bloqueados</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </CardContent>
      </Card>

      {/* Users List */}
      <Card>
        <CardHeader>
          <CardTitle>Usuarios ({filteredUsers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredUsers.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback>
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm">{user.name}</h3>
                      {user.type === 'owner' ? (
                        <PawPrint className="h-4 w-4 text-blue-500" />
                      ) : (
                        <Heart className="h-4 w-4 text-green-500" />
                      )}
                      {user.verified && (
                        <CheckCircle className="h-4 w-4 text-blue-500" />
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Mail className="h-3 w-3" />
                        {user.email}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {user.location}
                      </div>
                      {user.rating && (
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 text-yellow-500" />
                          {user.rating} ({user.reviews} reseñas)
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Badge className={`${getStatusColor(user.status)} flex items-center gap-1`}>
                    {getStatusIcon(user.status)}
                    {user.status === 'active' ? 'Activo' : 
                     user.status === 'pending' ? 'Pendiente' : 'Bloqueado'}
                  </Badge>
                  
                  <div className="flex items-center space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditUser(user)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleVerifyUser(user.id)}
                      className={user.verified ? "text-orange-600" : "text-green-600"}
                    >
                      {user.verified ? <ShieldOff className="h-4 w-4" /> : <Shield className="h-4 w-4" />}
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleBlockUser(user.id)}
                      className={user.status === 'blocked' ? "text-green-600" : "text-red-600"}
                    >
                      {user.status === 'blocked' ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteUser(user.id)}
                      className="text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}

            {filteredUsers.length === 0 && (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg mb-2">No se encontraron usuarios</h3>
                <p className="text-gray-500">Intenta cambiar los filtros de búsqueda</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Editar Usuario</DialogTitle>
          </DialogHeader>
          
          {selectedUser && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm mb-2 block">Nombre</label>
                  <Input
                    value={editForm.name || ''}
                    onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="text-sm mb-2 block">Email</label>
                  <Input
                    type="email"
                    value={editForm.email || ''}
                    onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="text-sm mb-2 block">Teléfono</label>
                  <Input
                    value={editForm.phone || ''}
                    onChange={(e) => setEditForm(prev => ({ ...prev, phone: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="text-sm mb-2 block">Ubicación</label>
                  <Input
                    value={editForm.location || ''}
                    onChange={(e) => setEditForm(prev => ({ ...prev, location: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="text-sm mb-2 block">Estado</label>
                  <Select
                    className="w-full p-2 border rounded-md"
                    value={editForm.status || 'active'}
                    onValueChange={(value) => setEditForm(prev => ({ ...prev, status: value as 'active' | 'blocked' | 'pending' }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Activo</SelectItem>
                      <SelectItem value="pending">Pendiente</SelectItem>
                      <SelectItem value="blocked">Bloqueado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm mb-2 block">Verificado</label>
                  <Select
                    className="w-full p-2 border rounded-md"
                    value={editForm.verified ? 'true' : 'false'}
                    onValueChange={(value) => setEditForm(prev => ({ ...prev, verified: value === 'true' }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar verificación" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">Sí</SelectItem>
                      <SelectItem value="false">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {selectedUser.pets && (
                <div>
                  <label className="text-sm mb-2 block">Mascotas</label>
                  <div className="space-y-2">
                    {selectedUser.pets.map((pet, index) => (
                      <div key={index} className="text-sm p-2 bg-gray-50 rounded">
                        {pet.name} - {pet.type} ({pet.breed})
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedUser.services && (
                <div>
                  <label className="text-sm mb-2 block">Servicios</label>
                  <div className="flex flex-wrap gap-1">
                    {selectedUser.services.map((service, index) => (
                      <Badge key={index} variant="secondary">{service}</Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleSaveEdit}>
                  Guardar Cambios
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}