import { useState } from "react"
import { Button } from "./ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Textarea } from "./ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Badge } from "./ui/badge"
import { Alert, AlertDescription } from "./ui/alert"
import { 
  ArrowLeft, 
  Upload, 
  FileText, 
  Camera,
  Shield,
  CheckCircle,
  X,
  Loader2
} from "lucide-react"
import { uploadProfileImage, uploadIdentityDocument } from "../services/uploadService"
import { createImagePreview, validateImageDimensions, validatePDF, formatFileSize } from "../services/fileUtils"

interface SitterProfileFormProps {
  onBack: () => void
  onComplete: (data: any) => void
}

const AVAILABLE_SERVICES = [
  "Paseos de perros",
  "Cuidado en casa del dueño",
  "Cuidado en casa del cuidador",
  "Visitas durante el día",
  "Cuidado nocturno",
  "Administración de medicamentos",
  "Entrenamiento básico",
  "Transporte veterinario",
  "Cuidado de mascotas exóticas",
  "Servicios de grooming"
]

export default function SitterProfileForm({ onBack, onComplete }: SitterProfileFormProps) {
  const [formData, setFormData] = useState({
    documentType: "",
    documentNumber: "",
    experience: "",
    description: "",
    services: [] as string[],
    documentPhoto: null as File | null,
    backgroundCheck: null as File | null,
    profilePhoto: null as File | null,
    // URLs de archivos subidos
    documentPhotoUrl: "",
    backgroundCheckUrl: "",
    profilePhotoUrl: ""
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [uploadingFiles, setUploadingFiles] = useState<Record<string, boolean>>({})
  const [previews, setPreviews] = useState<Record<string, string>>({})

  const handleServiceToggle = (service: string) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter(s => s !== service)
        : [...prev.services, service]
    }))
  }

  const handleFileUpload = (field: 'documentPhoto' | 'backgroundCheck' | 'profilePhoto') => async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      setUploadingFiles(prev => ({ ...prev, [field]: true }))
      
      // Crear preview inmediatamente
      if (file.type.startsWith('image/')) {
        const preview = await createImagePreview(file)
        setPreviews(prev => ({ ...prev, [field]: preview }))
      }

      // Subir archivo
      let uploadResult
      const userId = `user_${Date.now()}` // En producción esto vendría del usuario autenticado
      
      if (field === 'profilePhoto') {
        uploadResult = await uploadProfileImage(file, userId)
      } else {
        const documentType = field === 'documentPhoto' ? 'identity' : 'background_check'
        uploadResult = await uploadIdentityDocument(file, userId, documentType)
      }

      // Actualizar formData con el archivo y la URL
      setFormData(prev => ({
        ...prev,
        [field]: file,
        [`${field}Url`]: uploadResult.url
      }))

      // Limpiar errores del campo
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })

    } catch (error) {
      console.error(`Error al subir ${field}:`, error)
      setErrors(prev => ({
        ...prev,
        [field]: error instanceof Error ? error.message : 'Error al subir archivo'
      }))
    } finally {
      setUploadingFiles(prev => ({ ...prev, [field]: false }))
    }
  }

  const removeFile = (field: 'documentPhoto' | 'backgroundCheck' | 'profilePhoto') => {
    setFormData(prev => ({
      ...prev,
      [field]: null,
      [`${field}Url`]: ""
    }))
    setPreviews(prev => {
      const newPreviews = { ...prev }
      delete newPreviews[field]
      return newPreviews
    })
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.documentType) newErrors.documentType = "Selecciona el tipo de documento"
    if (!formData.documentNumber.trim()) newErrors.documentNumber = "Ingresa el número de documento"
    if (!formData.experience.trim()) newErrors.experience = "Describe tu experiencia"
    if (!formData.description.trim()) newErrors.description = "Agrega una descripción de tu perfil"
    if (formData.services.length === 0) newErrors.services = "Selecciona al menos un servicio"
    
    // Validación de documentos obligatorios
    if (!formData.documentPhoto) newErrors.documentPhoto = "Debes subir la foto del documento de identidad"
    if (!formData.backgroundCheck) newErrors.backgroundCheck = "Debes subir el certificado de antecedentes penales"
    if (!formData.profilePhoto) newErrors.profilePhoto = "Debes subir una foto de perfil"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onComplete(formData)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-2xl">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onBack}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Atrás
          </Button>
        </div>

        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Información Personal del Cuidador</CardTitle>
            <p className="text-gray-600">Completa tu perfil para ofrecer servicios de cuidado</p>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Tipo de documento */}
              <div className="space-y-2">
                <Label htmlFor="documentType">Tipo de documento *</Label>
                <Select value={formData.documentType} onValueChange={(value) => 
                  setFormData(prev => ({ ...prev, documentType: value }))
                }>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona el tipo de documento" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cedula">Cédula de Ciudadanía</SelectItem>
                    <SelectItem value="cedula_extranjeria">Cédula de Extranjería</SelectItem>
                    <SelectItem value="pasaporte">Pasaporte</SelectItem>
                    <SelectItem value="dni">DNI</SelectItem>
                    <SelectItem value="nit">NIT</SelectItem>
                  </SelectContent>
                </Select>
                {errors.documentType && (
                  <p className="text-sm text-red-500">{errors.documentType}</p>
                )}
              </div>

              {/* Número de documento */}
              <div className="space-y-2">
                <Label htmlFor="documentNumber">Número de documento *</Label>
                <Input
                  id="documentNumber"
                  value={formData.documentNumber}
                  onChange={(e) => setFormData(prev => ({ ...prev, documentNumber: e.target.value }))}
                  placeholder="Ingresa tu número de documento"
                />
                {errors.documentNumber && (
                  <p className="text-sm text-red-500">{errors.documentNumber}</p>
                )}
              </div>

              {/* Experiencia */}
              <div className="space-y-2">
                <Label htmlFor="experience">Experiencia con mascotas *</Label>
                <Textarea
                  id="experience"
                  value={formData.experience}
                  onChange={(e) => setFormData(prev => ({ ...prev, experience: e.target.value }))}
                  placeholder="Describe tu experiencia cuidando mascotas..."
                  rows={3}
                />
                {errors.experience && (
                  <p className="text-sm text-red-500">{errors.experience}</p>
                )}
              </div>

              {/* Descripción del perfil */}
              <div className="space-y-2">
                <Label htmlFor="description">Descripción de tu perfil *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Cuéntanos sobre ti y por qué deberían confiar en ti para cuidar sus mascotas..."
                  rows={4}
                />
                {errors.description && (
                  <p className="text-sm text-red-500">{errors.description}</p>
                )}
              </div>

              {/* Servicios que ofreces */}
              <div className="space-y-3">
                <Label>Servicios que ofreces *</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {AVAILABLE_SERVICES.map((service) => (
                    <div
                      key={service}
                      onClick={() => handleServiceToggle(service)}
                      className={`flex items-center justify-between p-3 border rounded-lg cursor-pointer transition-all hover:border-green-300 ${
                        formData.services.includes(service)
                          ? 'border-green-500 bg-green-50'
                          : 'border-gray-200'
                      }`}
                    >
                      <span className="text-sm">{service}</span>
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        formData.services.includes(service)
                          ? 'border-green-500 bg-green-500'
                          : 'border-gray-300'
                      }`}>
                        {formData.services.includes(service) && (
                          <CheckCircle className="h-4 w-4 text-white" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                {errors.services && (
                  <p className="text-sm text-red-500">{errors.services}</p>
                )}
              </div>

              {/* Servicios seleccionados */}
              {formData.services.length > 0 && (
                <div className="space-y-2">
                  <Label>Servicios seleccionados:</Label>
                  <div className="flex flex-wrap gap-2">
                    {formData.services.map((service) => (
                      <Badge
                        key={service}
                        variant="secondary"
                        className="cursor-pointer hover:bg-red-100"
                        onClick={() => handleServiceToggle(service)}
                      >
                        {service}
                        <X className="h-3 w-3 ml-1" />
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Carga de documentos */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Documentos requeridos</h3>
                
                {/* Foto del documento */}
                <div className="space-y-2">
                  <Label>Foto del documento de identidad *</Label>
                  <div className={`border-2 border-dashed rounded-lg p-4 ${
                    errors.documentPhoto ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload('documentPhoto')}
                      className="hidden"
                      id="document-photo"
                      disabled={uploadingFiles.documentPhoto}
                    />
                    
                    {/* Mostrar preview si existe */}
                    {previews.documentPhoto ? (
                      <div className="relative">
                        <img 
                          src={previews.documentPhoto} 
                          alt="Preview documento"
                          className="w-full h-32 object-contain rounded-lg bg-gray-50"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute top-2 right-2"
                          onClick={() => removeFile('documentPhoto')}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                        <div className="mt-2 text-sm text-gray-600">
                          <span>{formData.documentPhoto?.name}</span>
                          <span className="text-green-600 ml-2">✓ Subido</span>
                        </div>
                      </div>
                    ) : (
                      <div 
                        onClick={() => !uploadingFiles.documentPhoto && document.getElementById('document-photo')?.click()}
                        className={`cursor-pointer ${uploadingFiles.documentPhoto ? 'opacity-50' : ''}`}
                      >
                        <div className="flex flex-col items-center space-y-2">
                          {uploadingFiles.documentPhoto ? (
                            <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
                          ) : (
                            <FileText className={`h-8 w-8 ${
                              errors.documentPhoto ? 'text-red-400' : 'text-gray-400'
                            }`} />
                          )}
                          <span className={`text-sm ${
                            errors.documentPhoto ? 'text-red-600' : 'text-gray-600'
                          }`}>
                            {uploadingFiles.documentPhoto ? 'Subiendo...' : 'Seleccionar archivo'}
                          </span>
                          <Button 
                            type="button" 
                            variant="outline" 
                            size="sm"
                            disabled={uploadingFiles.documentPhoto}
                            className={errors.documentPhoto ? 'border-red-300 text-red-600 hover:bg-red-50' : ''}
                            onClick={(e) => {
                              e.stopPropagation();
                              document.getElementById('document-photo')?.click();
                            }}
                          >
                            <Upload className="h-4 w-4 mr-2" />
                            Subir documento
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                  {errors.documentPhoto && (
                    <p className="text-sm text-red-500">{errors.documentPhoto}</p>
                  )}
                </div>

                {/* Certificado de antecedentes */}
                <div className="space-y-2">
                  <Label>Certificado de Antecedentes Penales *</Label>
                  <div className={`border-2 border-dashed rounded-lg p-4 ${
                    errors.backgroundCheck ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}>
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={handleFileUpload('backgroundCheck')}
                      className="hidden"
                      id="background-check"
                      disabled={uploadingFiles.backgroundCheck}
                    />
                    
                    {/* Mostrar preview si existe */}
                    {formData.backgroundCheck ? (
                      <div className="relative">
                        {previews.backgroundCheck ? (
                          <img 
                            src={previews.backgroundCheck} 
                            alt="Preview certificado"
                            className="w-full h-32 object-contain rounded-lg bg-gray-50"
                          />
                        ) : (
                          <div className="w-full h-32 bg-gray-100 rounded-lg flex items-center justify-center">
                            <FileText className="h-12 w-12 text-gray-400" />
                          </div>
                        )}
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute top-2 right-2"
                          onClick={() => removeFile('backgroundCheck')}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                        <div className="mt-2 text-sm text-gray-600">
                          <span>{formData.backgroundCheck?.name}</span>
                          <span className="text-green-600 ml-2">✓ Subido</span>
                        </div>
                      </div>
                    ) : (
                      <div 
                        onClick={() => !uploadingFiles.backgroundCheck && document.getElementById('background-check')?.click()}
                        className={`cursor-pointer ${uploadingFiles.backgroundCheck ? 'opacity-50' : ''}`}
                      >
                        <div className="flex flex-col items-center space-y-2">
                          {uploadingFiles.backgroundCheck ? (
                            <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
                          ) : (
                            <Shield className={`h-8 w-8 ${
                              errors.backgroundCheck ? 'text-red-400' : 'text-gray-400'
                            }`} />
                          )}
                          <span className={`text-sm ${
                            errors.backgroundCheck ? 'text-red-600' : 'text-gray-600'
                          }`}>
                            {uploadingFiles.backgroundCheck ? 'Subiendo...' : 'Seleccionar archivo'}
                          </span>
                          <Button 
                            type="button" 
                            variant="outline" 
                            size="sm"
                            disabled={uploadingFiles.backgroundCheck}
                            className={errors.backgroundCheck ? 'border-red-300 text-red-600 hover:bg-red-50' : ''}
                            onClick={(e) => {
                              e.stopPropagation();
                              document.getElementById('background-check')?.click();
                            }}
                          >
                            <Upload className="h-4 w-4 mr-2" />
                            Subir certificado
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                  {errors.backgroundCheck && (
                    <p className="text-sm text-red-500">{errors.backgroundCheck}</p>
                  )}
                </div>

                {/* Foto de perfil */}
                <div className="space-y-2">
                  <Label>Foto de perfil *</Label>
                  <div className={`border-2 border-dashed rounded-lg p-4 ${
                    errors.profilePhoto ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload('profilePhoto')}
                      className="hidden"
                      id="profile-photo"
                      disabled={uploadingFiles.profilePhoto}
                    />
                    
                    {/* Mostrar preview si existe */}
                    {previews.profilePhoto ? (
                      <div className="relative">
                        <img 
                          src={previews.profilePhoto} 
                          alt="Preview perfil"
                          className="w-32 h-32 object-cover rounded-full mx-auto border-4 border-white shadow-lg"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="absolute top-2 right-2"
                          onClick={() => removeFile('profilePhoto')}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                        <div className="mt-2 text-sm text-gray-600 text-center">
                          <span>{formData.profilePhoto?.name}</span>
                          <span className="text-green-600 ml-2">✓ Subido</span>
                        </div>
                      </div>
                    ) : (
                      <div 
                        onClick={() => !uploadingFiles.profilePhoto && document.getElementById('profile-photo')?.click()}
                        className={`cursor-pointer ${uploadingFiles.profilePhoto ? 'opacity-50' : ''}`}
                      >
                        <div className="flex flex-col items-center space-y-2">
                          {uploadingFiles.profilePhoto ? (
                            <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
                          ) : (
                            <Camera className={`h-8 w-8 ${
                              errors.profilePhoto ? 'text-red-400' : 'text-gray-400'
                            }`} />
                          )}
                          <span className={`text-sm ${
                            errors.profilePhoto ? 'text-red-600' : 'text-gray-600'
                          }`}>
                            {uploadingFiles.profilePhoto ? 'Subiendo...' : 'Seleccionar foto'}
                          </span>
                          <Button 
                            type="button" 
                            variant="outline" 
                            size="sm"
                            disabled={uploadingFiles.profilePhoto}
                            className={errors.profilePhoto ? 'border-red-300 text-red-600 hover:bg-red-50' : ''}
                            onClick={(e) => {
                              e.stopPropagation();
                              document.getElementById('profile-photo')?.click();
                            }}
                          >
                            <Upload className="h-4 w-4 mr-2" />
                            Subir foto
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                  {errors.profilePhoto && (
                    <p className="text-sm text-red-500">{errors.profilePhoto}</p>
                  )}
                </div>
              </div>

              <Alert>
                <Shield className="h-4 w-4" />
                <AlertDescription>
                  Todos los documentos serán revisados por nuestro equipo para garantizar la seguridad de las mascotas y sus dueños.
                </AlertDescription>
              </Alert>

              <div className="flex gap-3 pt-4">
                <Button type="button" variant="outline" onClick={onBack} className="flex-1">
                  Atrás
                </Button>
                <Button type="submit" className="flex-1 bg-green-600 hover:bg-green-700">
                  Completar registro como cuidador
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}