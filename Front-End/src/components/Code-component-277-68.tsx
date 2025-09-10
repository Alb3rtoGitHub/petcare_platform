import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Textarea } from "./ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Badge } from "./ui/badge"
import { ImageWithFallback } from "./figma/ImageWithFallback"
import { 
  Camera, 
  Save, 
  Edit3, 
  MapPin, 
  Phone, 
  Mail, 
  Shield, 
  CreditCard,
  Users,
  Calendar,
  Settings,
  Award,
  Clock,
  Building
} from "lucide-react"
import { toast } from "sonner@2.0.3"

interface AdminProfileManagerProps {
  userData: any
  onUpdateProfile?: (updatedData: any) => void
}

export default function AdminProfileManager({ userData, onUpdateProfile }: AdminProfileManagerProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState({
    name: userData?.name || 'Administrador Sistema',
    email: userData?.email || 'admin@petcare.com',
    phone: userData?.phone || '+34 600 000 000',
    address: userData?.address || 'Madrid, España',
    bio: userData?.bio || 'Administrador del sistema PetCare, responsable de la supervisión y gestión de la plataforma.',
    profileImage: userData?.profileImage || '',
    // Campos específicos para administradores
    department: userData?.department || 'Gestión de Plataforma',
    role: userData?.role || 'Administrador Principal',
    startDate: userData?.startDate || '2024-01-01',
    permissions: userData?.permissions || ['Gestión de usuarios', 'Moderación de contenido', 'Análisis del sistema', 'Configuración de precios']
  })
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>('')

  const handleInputChange = (field: string, value: string) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSave = async () => {
    try {
      // Simular carga de imagen
      if (imageFile) {
        // En una aplicación real, aquí subirías la imagen a un servicio de almacenamiento
        profileData.profileImage = imagePreview
      }

      // Simular actualización de perfil
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      onUpdateProfile?.(profileData)
      setIsEditing(false)
      setImageFile(null)
      setImagePreview('')
      
      toast.success("Perfil actualizado correctamente")
    } catch (error) {
      toast.error("Error al actualizar el perfil")
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
    setProfileData({
      name: userData?.name || 'Administrador Sistema',
      email: userData?.email || 'admin@petcare.com',
      phone: userData?.phone || '+34 600 000 000',
      address: userData?.address || 'Madrid, España',
      bio: userData?.bio || 'Administrador del sistema PetCare, responsable de la supervisión y gestión de la plataforma.',
      profileImage: userData?.profileImage || '',
      department: userData?.department || 'Gestión de Plataforma',
      role: userData?.role || 'Administrador Principal',
      startDate: userData?.startDate || '2024-01-01',
      permissions: userData?.permissions || ['Gestión de usuarios', 'Moderación de contenido', 'Análisis del sistema', 'Configuración de precios']
    })
    setImageFile(null)
    setImagePreview('')
  }

  const currentImage = imagePreview || profileData.profileImage || userData?.profileImage

  // Estadísticas del administrador
  const adminStats = {
    totalUsers: "2,847",
    resolvedReports: "1,234",
    systemUptime: "99.9%",
    avgResponseTime: "2h"
  }

  return (
    <div className="space-y-6">
      {/* Cabecera del perfil */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Shield className="h-5 w-5 mr-2 text-primary" />
              Perfil de Administrador
            </div>
            {!isEditing && (
              <Button variant="outline" onClick={() => setIsEditing(true)}>
                <Edit3 className="h-4 w-4 mr-2" />
                Editar
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-6">
            {/* Foto de perfil */}
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <Avatar className="h-24 w-24">
                  {currentImage ? (
                    <ImageWithFallback
                      src={currentImage}
                      alt="Foto de perfil"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                      {profileData.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  )}
                </Avatar>
                {isEditing && (
                  <label className="absolute -bottom-2 -right-2 bg-primary text-primary-foreground rounded-full p-2 cursor-pointer hover:bg-primary/90 transition-colors">
                    <Camera className="h-4 w-4" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
              
              <div className="flex flex-col items-center space-y-2">
                <Badge variant="default" className="text-xs bg-primary">
                  <Shield className="h-3 w-3 mr-1" />
                  Administrador
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  <Award className="h-3 w-3 mr-1" />
                  Acceso Total
                </Badge>
              </div>
            </div>

            {/* Información básica */}
            <div className="flex-1 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Nombre completo</Label>
                  {isEditing ? (
                    <Input
                      id="name"
                      value={profileData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                    />
                  ) : (
                    <p className="text-gray-900 mt-1">{profileData.name}</p>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="email">Email</Label>
                  {isEditing ? (
                    <Input
                      id="email"
                      type="email"
                      value={profileData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                    />
                  ) : (
                    <div className="flex items-center text-gray-600 mt-1">
                      <Mail className="h-4 w-4 mr-2" />
                      {profileData.email}
                    </div>
                  )}
                </div>

                <div>
                  <Label htmlFor="phone">Teléfono</Label>
                  {isEditing ? (
                    <Input
                      id="phone"
                      value={profileData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                    />
                  ) : (
                    <div className="flex items-center text-gray-600 mt-1">
                      <Phone className="h-4 w-4 mr-2" />
                      {profileData.phone || 'No especificado'}
                    </div>
                  )}
                </div>

                <div>
                  <Label htmlFor="address">Ubicación</Label>
                  {isEditing ? (
                    <Input
                      id="address"
                      value={profileData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                    />
                  ) : (
                    <div className="flex items-center text-gray-600 mt-1">
                      <MapPin className="h-4 w-4 mr-2" />
                      {profileData.address || 'No especificada'}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Biografía */}
          <div className="mt-6">
            <Label htmlFor="bio">Sobre mí</Label>
            {isEditing ? (
              <Textarea
                id="bio"
                value={profileData.bio}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                rows={4}
                placeholder="Describe tu rol como administrador y tu experiencia..."
              />
            ) : (
              <p className="text-gray-700 mt-1">
                {profileData.bio || 'No hay descripción disponible'}
              </p>
            )}
          </div>

          {/* Información de Identificación (Solo lectura) */}
          <div className="mt-6">
            <h3 className="text-lg mb-4 flex items-center">
              <CreditCard className="h-5 w-5 mr-2" />
              Información de Identificación
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
              <div>
                <Label>Tipo de Identificación</Label>
                <p className="text-gray-900 mt-1">
                  {(() => {
                    const idType = userData?.identificationType || 'cedula_ciudadania';
                    switch(idType) {
                      case 'cedula_ciudadania': return 'Cédula de Ciudadanía';
                      case 'nit': return 'NIT';
                      case 'pasaporte': return 'Pasaporte';
                      case 'id_card': return 'ID Card';
                      case 'driver_license': return 'Driver License';
                      default: return 'Cédula de Ciudadanía';
                    }
                  })()}
                </p>
              </div>
              <div>
                <Label>Número de Identificación</Label>
                <p className="text-gray-900 mt-1">
                  {userData?.identificationNumber || '00000000A'}
                </p>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              La información de identificación no puede ser modificada por motivos de seguridad. 
              Contacta con el administrador principal si necesitas actualizarla.
            </p>
          </div>

          {/* Información administrativa */}
          <div className="mt-6 space-y-4">
            <h3 className="text-lg mb-4 flex items-center">
              <Building className="h-5 w-5 mr-2" />
              Información Administrativa
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="department">Departamento</Label>
                {isEditing ? (
                  <Input
                    id="department"
                    value={profileData.department}
                    onChange={(e) => handleInputChange('department', e.target.value)}
                  />
                ) : (
                  <p className="text-gray-900 mt-1">{profileData.department}</p>
                )}
              </div>

              <div>
                <Label htmlFor="role">Rol</Label>
                {isEditing ? (
                  <Input
                    id="role"
                    value={profileData.role}
                    onChange={(e) => handleInputChange('role', e.target.value)}
                  />
                ) : (
                  <p className="text-gray-900 mt-1">{profileData.role}</p>
                )}
              </div>

              <div>
                <Label>Fecha de inicio</Label>
                <div className="flex items-center text-gray-600 mt-1">
                  <Calendar className="h-4 w-4 mr-2" />
                  {profileData.startDate}
                </div>
              </div>

              <div>
                <Label>Estado del sistema</Label>
                <div className="flex items-center text-green-600 mt-1">
                  <Settings className="h-4 w-4 mr-2" />
                  Operativo
                </div>
              </div>
            </div>

            {/* Permisos */}
            <div>
              <Label>Permisos del sistema</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {profileData.permissions.map((permission, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {permission}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Botones de acción */}
          {isEditing && (
            <div className="flex gap-3 mt-6 pt-6 border-t">
              <Button variant="outline" onClick={handleCancel} className="flex-1">
                Cancelar
              </Button>
              <Button onClick={handleSave} className="flex-1">
                <Save className="h-4 w-4 mr-2" />
                Guardar Cambios
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Estadísticas del administrador */}
      {!isEditing && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Estadísticas de Gestión
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-2xl text-blue-600">{adminStats.totalUsers}</p>
                <p className="text-sm text-gray-600">Usuarios Gestionados</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-2xl text-green-600">{adminStats.resolvedReports}</p>
                <p className="text-sm text-gray-600">Reportes Resueltos</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <p className="text-2xl text-purple-600">{adminStats.systemUptime}</p>
                <p className="text-sm text-gray-600">Tiempo Activo</p>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <p className="text-2xl text-orange-600">{adminStats.avgResponseTime}</p>
                <p className="text-sm text-gray-600">Tiempo Respuesta</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Actividad reciente */}
      {!isEditing && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              Actividad Reciente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                  <span className="text-sm">Usuario verificado: Elena Ruiz</span>
                </div>
                <span className="text-xs text-gray-500">Hace 2 horas</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                  <span className="text-sm">Reporte resuelto: Calidad del servicio</span>
                </div>
                <span className="text-xs text-gray-500">Hace 4 horas</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                  <span className="text-sm">Contenido moderado: Reseña eliminada</span>
                </div>
                <span className="text-xs text-gray-500">Hace 6 horas</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
                  <span className="text-sm">Precio actualizado: Servicios de grooming</span>
                </div>
                <span className="text-xs text-gray-500">Hace 1 día</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}