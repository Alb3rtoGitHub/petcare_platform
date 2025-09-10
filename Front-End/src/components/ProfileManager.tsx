import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Textarea } from "./ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Badge } from "./ui/badge"
import { ImageWithFallback } from "./figma/ImageWithFallback"
import { Camera, Save, Edit3, MapPin, Phone, Mail, Star, Shield, Upload, CreditCard } from "lucide-react"
import { toast } from "sonner@2.0.3"

interface ProfileManagerProps {
  userData: any
  userType: 'owner' | 'sitter'
  onUpdateProfile?: (updatedData: any) => void
}

export default function ProfileManager({ userData, userType, onUpdateProfile }: ProfileManagerProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [profileData, setProfileData] = useState({
    name: userData?.name || '',
    email: userData?.email || '',
    phone: userData?.phone || '',
    address: userData?.address || '',
    bio: userData?.bio || '',
    profileImage: userData?.profileImage || '',
    // Campos específicos para cuidadores
    experience: userData?.experience || '',
    services: userData?.services || [],
    hourlyRate: userData?.hourlyRate || '',
    availability: userData?.availability || '',
    specialties: userData?.specialties || []
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
      name: userData?.name || '',
      email: userData?.email || '',
      phone: userData?.phone || '',
      address: userData?.address || '',
      bio: userData?.bio || '',
      profileImage: userData?.profileImage || '',
      experience: userData?.experience || '',
      services: userData?.services || [],
      hourlyRate: userData?.hourlyRate || '',
      availability: userData?.availability || '',
      specialties: userData?.specialties || []
    })
    setImageFile(null)
    setImagePreview('')
  }

  const currentImage = imagePreview || profileData.profileImage || userData?.profileImage

  return (
    <div className="space-y-6">
      {/* Cabecera del perfil */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Mi Perfil
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
                    <AvatarFallback className="text-2xl">
                      {profileData.name.slice(0, 2).toUpperCase()}
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
              
              {userType === 'sitter' && (
                <div className="flex flex-col items-center space-y-2">
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-400" />
                    <span className="text-sm">4.8 (127 reseñas)</span>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    <Shield className="h-3 w-3 mr-1" />
                    Verificado
                  </Badge>
                </div>
              )}
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
                  <Label htmlFor="address">Dirección</Label>
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
            <Label htmlFor="bio">
              {userType === 'sitter' ? 'Sobre mí y mi experiencia' : 'Sobre mí'}
            </Label>
            {isEditing ? (
              <Textarea
                id="bio"
                value={profileData.bio}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                rows={4}
                placeholder={userType === 'sitter' 
                  ? "Cuéntanos sobre tu experiencia cuidando mascotas, tu motivación y lo que te hace especial..." 
                  : "Cuéntanos sobre ti y tus mascotas..."
                }
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
                    const idType = userData?.identificationType;
                    switch(idType) {
                      case 'cedula_ciudadania': return 'Cédula de Ciudadanía';
                      case 'nit': return 'NIT';
                      case 'pasaporte': return 'Pasaporte';
                      case 'id_card': return 'ID Card';
                      case 'driver_license': return 'Driver License';
                      default: return 'No especificado';
                    }
                  })()}
                </p>
              </div>
              <div>
                <Label>Número de Identificación</Label>
                <p className="text-gray-900 mt-1">
                  {userData?.identificationNumber || 'No especificado'}
                </p>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              La información de identificación no puede ser modificada por motivos de seguridad. 
              Contacta con soporte si necesitas actualizarla.
            </p>
          </div>

          {/* Campos específicos para cuidadores */}
          {userType === 'sitter' && (
            <div className="mt-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="experience">Años de experiencia</Label>
                  {isEditing ? (
                    <Input
                      id="experience"
                      value={profileData.experience}
                      onChange={(e) => handleInputChange('experience', e.target.value)}
                      placeholder="ej. 3 años"
                    />
                  ) : (
                    <p className="text-gray-900 mt-1">{profileData.experience || 'No especificado'}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="hourlyRate">Tarifa por hora</Label>
                  {isEditing ? (
                    <Input
                      id="hourlyRate"
                      value={profileData.hourlyRate}
                      onChange={(e) => handleInputChange('hourlyRate', e.target.value)}
                      placeholder="ej. 15€"
                    />
                  ) : (
                    <p className="text-gray-900 mt-1">{profileData.hourlyRate || 'No especificado'}</p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="availability">Disponibilidad</Label>
                {isEditing ? (
                  <Input
                    id="availability"
                    value={profileData.availability}
                    onChange={(e) => handleInputChange('availability', e.target.value)}
                    placeholder="ej. Lunes a Viernes 9:00-18:00"
                  />
                ) : (
                  <p className="text-gray-900 mt-1">{profileData.availability || 'No especificado'}</p>
                )}
              </div>
            </div>
          )}

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

      {/* Estadísticas adicionales para cuidadores */}
      {userType === 'sitter' && !isEditing && (
        <Card>
          <CardHeader>
            <CardTitle>Estadísticas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-2xl text-primary">127</p>
                <p className="text-sm text-gray-600">Reseñas</p>
              </div>
              <div className="text-center">
                <p className="text-2xl text-primary">243</p>
                <p className="text-sm text-gray-600">Trabajos</p>
              </div>
              <div className="text-center">
                <p className="text-2xl text-primary">98%</p>
                <p className="text-sm text-gray-600">Satisfacción</p>
              </div>
              <div className="text-center">
                <p className="text-2xl text-primary">2h</p>
                <p className="text-sm text-gray-600">Respuesta</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}