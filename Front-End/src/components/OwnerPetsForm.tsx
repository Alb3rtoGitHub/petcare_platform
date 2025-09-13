import { useState } from "react"
import { Button } from "./ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Textarea } from "./ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Badge } from "./ui/badge"
import { 
  ArrowLeft, 
  Plus, 
  Trash2,
  PawPrint,
  Upload,
  Camera,
  X,
  Loader2
} from "lucide-react"
import { uploadPetImage } from "../services/uploadService"
import { createImagePreview, formatFileSize } from "../services/fileUtils"

interface Pet {
  id: string
  name: string
  type: string
  size: string
  age: string
  specialNeeds: string
  photo?: File | null
  photoUrl?: string
  breed?: string
  weight?: string
}

interface OwnerPetsFormProps {
  onBack: () => void
  onComplete: (data: any) => void
}

const PET_TYPES = [
  "Perro",
  "Gato", 
  "Ave",
  "Conejo",
  "Hámster",
  "Pez",
  "Reptil",
  "Otro"
]

const PET_SIZES = [
  "Pequeño",
  "Mediano", 
  "Grande"
]

export default function OwnerPetsForm({ onBack, onComplete }: OwnerPetsFormProps) {
  const [pets, setPets] = useState<Pet[]>([
    {
      id: Date.now().toString(),
      name: "",
      type: "",
      size: "",
      age: "",
      specialNeeds: ""
    }
  ])

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [uploadingFiles, setUploadingFiles] = useState<Record<string, boolean>>({})
  const [previews, setPreviews] = useState<Record<string, string>>({})

  const addPet = () => {
    const newPet: Pet = {
      id: Date.now().toString(),
      name: "",
      type: "",
      size: "",
      age: "",
      specialNeeds: ""
    }
    setPets(prev => [...prev, newPet])
  }

  const removePet = (petId: string) => {
    if (pets.length > 1) {
      setPets(prev => prev.filter(pet => pet.id !== petId))
      // Limpiar estados relacionados
      setUploadingFiles(prev => {
        const newState = { ...prev }
        delete newState[petId]
        return newState
      })
      setPreviews(prev => {
        const newState = { ...prev }
        delete newState[petId]
        return newState
      })
    }
  }

  const updatePet = (petId: string, field: keyof Pet, value: string) => {
    setPets(prev => prev.map(pet => 
      pet.id === petId ? { ...pet, [field]: value } : pet
    ))
  }

  const handlePhotoUpload = (petId: string) => async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      setUploadingFiles(prev => ({ ...prev, [petId]: true }))
      
      // Crear preview inmediatamente
      const preview = await createImagePreview(file)
      setPreviews(prev => ({ ...prev, [petId]: preview }))

      // Subir archivo
      const userId = `user_${Date.now()}` // En producción esto vendría del usuario autenticado
      const uploadResult = await uploadPetImage(file, userId, petId)

      // Actualizar pet con la foto y URL
      setPets(prev => prev.map(pet => 
        pet.id === petId 
          ? { ...pet, photo: file, photoUrl: uploadResult.url }
          : pet
      ))

      // Limpiar errores del campo
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[`pet-${petId}-photo`]
        return newErrors
      })

    } catch (error) {
      console.error(`Error al subir foto de mascota ${petId}:`, error)
      setErrors(prev => ({
        ...prev,
        [`pet-${petId}-photo`]: error instanceof Error ? error.message : 'Error al subir foto'
      }))
    } finally {
      setUploadingFiles(prev => ({ ...prev, [petId]: false }))
    }
  }

  const removePhoto = (petId: string) => {
    setPets(prev => prev.map(pet => 
      pet.id === petId 
        ? { ...pet, photo: null, photoUrl: "" }
        : pet
    ))
    setPreviews(prev => {
      const newPreviews = { ...prev }
      delete newPreviews[petId]
      return newPreviews
    })
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    pets.forEach((pet, index) => {
      const prefix = `pet-${index}`
      if (!pet.name.trim()) newErrors[`${prefix}-name`] = "El nombre es requerido"
      if (!pet.type) newErrors[`${prefix}-type`] = "Selecciona el tipo de mascota"
      if (!pet.size) newErrors[`${prefix}-size`] = "Selecciona el tamaño"
      if (!pet.age.trim()) newErrors[`${prefix}-age`] = "La edad es requerida"
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onComplete({ pets })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-4xl">
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
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <PawPrint className="h-6 w-6 text-blue-600" />
                  Información de tus Mascotas
                </CardTitle>
                <p className="text-gray-600 mt-2">Registra la información de tus mascotas para encontrar el mejor cuidador</p>
              </div>
              <Button onClick={addPet} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Agregar Mascota
              </Button>
            </div>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-8">
              {pets.map((pet, index) => (
                <div key={pet.id} className="border rounded-lg p-6 space-y-4 relative">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium">
                      Mascota {index + 1}
                    </h3>
                    {pets.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removePet(pet.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Nombre */}
                    <div className="space-y-2">
                      <Label htmlFor={`pet-${index}-name`}>Nombre *</Label>
                      <Input
                        id={`pet-${index}-name`}
                        value={pet.name}
                        onChange={(e) => updatePet(pet.id, 'name', e.target.value)}
                        placeholder="Nombre de tu mascota"
                      />
                      {errors[`pet-${index}-name`] && (
                        <p className="text-sm text-red-500">{errors[`pet-${index}-name`]}</p>
                      )}
                    </div>

                    {/* Tipo */}
                    <div className="space-y-2">
                      <Label>Tipo *</Label>
                      <Select 
                        value={pet.type} 
                        onValueChange={(value) => updatePet(pet.id, 'type', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona el tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          {PET_TYPES.map((type) => (
                            <SelectItem key={type} value={type}>{type}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors[`pet-${index}-type`] && (
                        <p className="text-sm text-red-500">{errors[`pet-${index}-type`]}</p>
                      )}
                    </div>

                    {/* Tamaño */}
                    <div className="space-y-2">
                      <Label>Tamaño *</Label>
                      <Select 
                        value={pet.size} 
                        onValueChange={(value) => updatePet(pet.id, 'size', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona el tamaño" />
                        </SelectTrigger>
                        <SelectContent>
                          {PET_SIZES.map((size) => (
                            <SelectItem key={size} value={size}>{size}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors[`pet-${index}-size`] && (
                        <p className="text-sm text-red-500">{errors[`pet-${index}-size`]}</p>
                      )}
                    </div>

                    {/* Edad */}
                    <div className="space-y-2">
                      <Label htmlFor={`pet-${index}-age`}>Edad *</Label>
                      <Input
                        id={`pet-${index}-age`}
                        value={pet.age}
                        onChange={(e) => updatePet(pet.id, 'age', e.target.value)}
                        placeholder="Ej: 3 años, 6 meses"
                      />
                      {errors[`pet-${index}-age`] && (
                        <p className="text-sm text-red-500">{errors[`pet-${index}-age`]}</p>
                      )}
                    </div>
                  </div>

                  {/* Necesidades especiales */}
                  <div className="space-y-2">
                    <Label htmlFor={`pet-${index}-special`}>Necesidades Especiales</Label>
                    <Textarea
                      id={`pet-${index}-special`}
                      value={pet.specialNeeds}
                      onChange={(e) => updatePet(pet.id, 'specialNeeds', e.target.value)}
                      placeholder="Ej: Medicamentos, alergias, comportamientos especiales..."
                      rows={3}
                    />
                  </div>

                  {/* Foto de la mascota */}
                  <div className="space-y-2">
                    <Label>Foto de la mascota (opcional)</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload(pet.id)}
                        className="hidden"
                        id={`pet-photo-${pet.id}`}
                        disabled={uploadingFiles[pet.id]}
                      />
                      
                      {/* Mostrar preview si existe */}
                      {previews[pet.id] ? (
                        <div className="relative">
                          <img 
                            src={previews[pet.id]} 
                            alt={`Preview ${pet.name || 'mascota'}`}
                            className="w-32 h-32 object-cover rounded-lg mx-auto border-2 border-gray-200"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute top-2 right-2"
                            onClick={() => removePhoto(pet.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                          <div className="mt-2 text-sm text-gray-600 text-center">
                            <span>{pet.photo?.name}</span>
                            <span className="text-green-600 ml-2">✓ Subido</span>
                          </div>
                        </div>
                      ) : (
                        <div 
                          onClick={() => !uploadingFiles[pet.id] && document.getElementById(`pet-photo-${pet.id}`)?.click()}
                          className={`cursor-pointer ${uploadingFiles[pet.id] ? 'opacity-50' : ''}`}
                        >
                          <div className="flex flex-col items-center space-y-2">
                            {uploadingFiles[pet.id] ? (
                              <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
                            ) : (
                              <Camera className="h-8 w-8 text-gray-400" />
                            )}
                            <span className="text-sm text-gray-600">
                              {uploadingFiles[pet.id] ? 'Subiendo...' : 'Agregar foto de la mascota'}
                            </span>
                            <Button 
                              type="button" 
                              variant="outline" 
                              size="sm"
                              disabled={uploadingFiles[pet.id]}
                              onClick={(e) => {
                                e.stopPropagation();
                                document.getElementById(`pet-photo-${pet.id}`)?.click();
                              }}
                            >
                              <Upload className="h-4 w-4 mr-2" />
                              {uploadingFiles[pet.id] ? 'Subiendo...' : 'Seleccionar foto'}
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                    {errors[`pet-${pet.id}-photo`] && (
                      <p className="text-sm text-red-500">{errors[`pet-${pet.id}-photo`]}</p>
                    )}
                  </div>
                </div>
              ))}

              {/* Resumen de mascotas */}
              {pets.length > 1 && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Resumen de mascotas registradas:</h4>
                  <div className="flex flex-wrap gap-2">
                    {pets.map((pet, index) => (
                      <Badge key={pet.id} variant="secondary">
                        {pet.name || `Mascota ${index + 1}`} - {pet.type || 'Sin tipo'} {pet.size && `(${pet.size})`}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-6 border-t">
                <Button type="button" variant="outline" onClick={onBack} className="flex-1">
                  Atrás
                </Button>
                <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700">
                  Registrar Como Dueño
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}