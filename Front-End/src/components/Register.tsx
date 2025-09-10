import { useState } from "react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Textarea } from "./ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Alert, AlertDescription } from "./ui/alert"
import { Checkbox } from "./ui/checkbox"
import { ImageWithFallback } from "./figma/ImageWithFallback"
import { 
  ArrowLeft, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  User, 
  Phone, 
  MapPin, 
  Heart, 
  PawPrint,
  Upload,
  AlertCircle,
  CheckCircle,
  Plus,
  X
} from "lucide-react"

interface RegisterProps {
  onBack: () => void
  onRegister: (userType: 'owner' | 'sitter', userData: any) => void
  onShowLogin: () => void
  onEmailVerification: (email: string) => void
}

interface OwnerRegisterForm {
  // Personal Info
  firstName: string
  lastName: string
  email: string
  password: string
  confirmPassword: string
  phone: string
  address: string
  country: string
  state: string
  city: string
  
  // Identification Info
  identificationType: string
  identificationNumber: string
  
  // Pets Info
  pets: Array<{
    name: string
    type: string
    breed: string
    age: string
    weight: string
    specialNeeds: string
  }>
  
  // Preferences
  emergencyContact: string
  emergencyPhone: string
  additionalInfo: string
  
  // Legal
  acceptTerms: boolean
  acceptMarketing: boolean
}

interface SitterRegisterForm {
  // Personal Info
  firstName: string
  lastName: string
  email: string
  password: string
  confirmPassword: string
  phone: string
  address: string
  country: string
  state: string
  city: string
  
  // Identification Info
  identificationType: string
  identificationNumber: string
  
  // Professional Info
  experience: string
  description: string
  services: string[]
  availability: string[]
  hourlyRate: string
  
  // Verification
  hasInsurance: boolean
  hasCriminalCheck: boolean
  emergencyContact: string
  emergencyPhone: string
  
  // Legal
  acceptTerms: boolean
  acceptMarketing: boolean
}

export default function Register({ onBack, onRegister, onShowLogin, onEmailVerification }: RegisterProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [selectedUserType, setSelectedUserType] = useState<'owner' | 'sitter'>('owner')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [currentStep, setCurrentStep] = useState(1)

  const [ownerForm, setOwnerForm] = useState<OwnerRegisterForm>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: '',
    country: '',
    state: '',
    city: '',
    identificationType: '',
    identificationNumber: '',
    pets: [{ name: '', type: '', breed: '', age: '', weight: '', specialNeeds: '' }],
    emergencyContact: '',
    emergencyPhone: '',
    additionalInfo: '',
    acceptTerms: false,
    acceptMarketing: false
  })

  const [sitterForm, setSitterForm] = useState<SitterRegisterForm>({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: '',
    country: '',
    state: '',
    city: '',
    identificationType: '',
    identificationNumber: '',
    experience: '',
    description: '',
    services: [],
    availability: [],
    hourlyRate: '',
    hasInsurance: false,
    hasCriminalCheck: false,
    emergencyContact: '',
    emergencyPhone: '',
    acceptTerms: false,
    acceptMarketing: false
  })

  const serviceOptions = [
    'Paseos', 'Cuidado en casa', 'Hospedaje nocturno', 'Guardería diurna', 
    'Administración de medicamentos', 'Grooming básico', 'Entrenamiento', 'Visitas de chequeo'
  ]

  const availabilityOptions = [
    'Mañanas (6-12h)', 'Tardes (12-18h)', 'Noches (18-24h)', 'Madrugadas (0-6h)',
    'Fines de semana', 'Días festivos', 'Emergencias 24/7'
  ]

  // Identification types
  const identificationTypes = [
    { value: 'cedula_ciudadania', label: 'Cédula de Ciudadanía' },
    { value: 'nit', label: 'NIT' },
    { value: 'pasaporte', label: 'Pasaporte' },
    { value: 'id_card', label: 'ID Card' },
    { value: 'driver_license', label: 'Driver License' }
  ]

  // Location data
  const countries = [
    { value: 'ES', label: 'España' },
    { value: 'MX', label: 'México' },
    { value: 'CO', label: 'Colombia' },
    { value: 'AR', label: 'Argentina' },
    { value: 'PE', label: 'Perú' },
    { value: 'CL', label: 'Chile' },
    { value: 'VE', label: 'Venezuela' },
    { value: 'EC', label: 'Ecuador' },
    { value: 'UY', label: 'Uruguay' }
  ]

  const states: Record<string, Array<{value: string, label: string}>> = {
    ES: [
      { value: 'MD', label: 'Madrid' },
      { value: 'CT', label: 'Cataluña' },
      { value: 'AN', label: 'Andalucía' },
      { value: 'VC', label: 'Valencia' },
      { value: 'PV', label: 'País Vasco' },
      { value: 'GA', label: 'Galicia' }
    ],
    MX: [
      { value: 'CDMX', label: 'Ciudad de México' },
      { value: 'JAL', label: 'Jalisco' },
      { value: 'NL', label: 'Nuevo León' },
      { value: 'BC', label: 'Baja California' },
      { value: 'PUE', label: 'Puebla' }
    ],
    CO: [
      { value: 'BOG', label: 'Bogotá D.C.' },
      { value: 'ANT', label: 'Antioquia' },
      { value: 'VAC', label: 'Valle del Cauca' },
      { value: 'ATL', label: 'Atlántico' },
      { value: 'SAN', label: 'Santander' }
    ],
    AR: [
      { value: 'CABA', label: 'Ciudad Autónoma de Buenos Aires' },
      { value: 'BA', label: 'Buenos Aires' },
      { value: 'CB', label: 'Córdoba' },
      { value: 'SF', label: 'Santa Fe' },
      { value: 'MZ', label: 'Mendoza' }
    ]
  }

  const cities: Record<string, Array<{value: string, label: string}>> = {
    MD: [
      { value: 'madrid', label: 'Madrid' },
      { value: 'alcala', label: 'Alcalá de Henares' },
      { value: 'mostoles', label: 'Móstoles' },
      { value: 'fuenlabrada', label: 'Fuenlabrada' }
    ],
    CT: [
      { value: 'barcelona', label: 'Barcelona' },
      { value: 'hospitalet', label: 'L\'Hospitalet de Llobregat' },
      { value: 'badalona', label: 'Badalona' },
      { value: 'terrassa', label: 'Terrassa' }
    ],
    CDMX: [
      { value: 'cdmx-centro', label: 'Centro Histórico' },
      { value: 'roma', label: 'Roma' },
      { value: 'condesa', label: 'Condesa' },
      { value: 'polanco', label: 'Polanco' }
    ],
    BOG: [
      { value: 'chapinero', label: 'Chapinero' },
      { value: 'zona-rosa', label: 'Zona Rosa' },
      { value: 'la-candelaria', label: 'La Candelaria' },
      { value: 'usaquen', label: 'Usaquén' }
    ]
  }

  const getAvailableStates = (country: string) => {
    return states[country] || []
  }

  const getAvailableCities = (state: string) => {
    return cities[state] || []
  }

  const handleOwnerInputChange = (field: keyof OwnerRegisterForm, value: any) => {
    setOwnerForm(prev => {
      const newForm = { ...prev, [field]: value }
      
      // Reset dependent fields when country or state changes
      if (field === 'country') {
        newForm.state = ''
        newForm.city = ''
      } else if (field === 'state') {
        newForm.city = ''
      }
      
      return newForm
    })
  }

  const handleSitterInputChange = (field: keyof SitterRegisterForm, value: any) => {
    setSitterForm(prev => {
      const newForm = { ...prev, [field]: value }
      
      // Reset dependent fields when country or state changes
      if (field === 'country') {
        newForm.state = ''
        newForm.city = ''
      } else if (field === 'state') {
        newForm.city = ''
      }
      
      return newForm
    })
  }

  const addPet = () => {
    setOwnerForm(prev => ({
      ...prev,
      pets: [...prev.pets, { name: '', type: '', breed: '', age: '', weight: '', specialNeeds: '' }]
    }))
  }

  const removePet = (index: number) => {
    setOwnerForm(prev => ({
      ...prev,
      pets: prev.pets.filter((_, i) => i !== index)
    }))
  }

  const updatePet = (index: number, field: string, value: string) => {
    setOwnerForm(prev => ({
      ...prev,
      pets: prev.pets.map((pet, i) => i === index ? { ...pet, [field]: value } : pet)
    }))
  }

  const toggleService = (service: string) => {
    setSitterForm(prev => ({
      ...prev,
      services: prev.services.includes(service)
        ? prev.services.filter(s => s !== service)
        : [...prev.services, service]
    }))
  }

  const toggleAvailability = (availability: string) => {
    setSitterForm(prev => ({
      ...prev,
      availability: prev.availability.includes(availability)
        ? prev.availability.filter(a => a !== availability)
        : [...prev.availability, availability]
    }))
  }

  const validateStep = () => {
    setError('')
    
    if (!selectedUserType) {
      setError('Por favor selecciona tu tipo de usuario')
      return false
    }
    
    if (selectedUserType === 'owner') {
      if (currentStep === 1) {
        if (!selectedUserType || !ownerForm.firstName || !ownerForm.lastName || !ownerForm.email || 
            !ownerForm.password || !ownerForm.phone || !ownerForm.country || !ownerForm.state || !ownerForm.city) {
          setError('Por favor completa todos los campos obligatorios')
          return false
        }
        if (ownerForm.password !== ownerForm.confirmPassword) {
          setError('Las contraseñas no coinciden')
          return false
        }
        if (ownerForm.password.length < 6) {
          setError('La contraseña debe tener al menos 6 caracteres')
          return false
        }
      } else if (currentStep === 2) {
        if (ownerForm.pets.some(pet => !pet.name || !pet.type)) {
          setError('Por favor completa la información básica de todas las mascotas')
          return false
        }
      }
    } else {
      if (currentStep === 1) {
        if (!selectedUserType || !sitterForm.firstName || !sitterForm.lastName || !sitterForm.email || 
            !sitterForm.password || !sitterForm.phone || !sitterForm.country || !sitterForm.state || !sitterForm.city) {
          setError('Por favor completa todos los campos obligatorios')
          return false
        }
        if (sitterForm.password !== sitterForm.confirmPassword) {
          setError('Las contraseñas no coinciden')
          return false
        }
      } else if (currentStep === 2) {
        if (!sitterForm.experience || !sitterForm.description || sitterForm.services.length === 0) {
          setError('Por favor completa tu información profesional y selecciona al menos un servicio')
          return false
        }
      }
    }
    return true
  }

  const handleNext = () => {
    if (validateStep()) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    setCurrentStep(currentStep - 1)
    setError('')
  }

  const handleSubmit = async () => {
    if (!validateStep()) return
    
    const currentForm = selectedUserType === 'owner' ? ownerForm : sitterForm
    
    if (!currentForm.acceptTerms) {
      setError('Debes aceptar los términos y condiciones')
      return
    }

    if (!currentForm.acceptMarketing) {
      setError('Debes aceptar recibir comunicaciones de marketing y promociones')
      return
    }

    setIsLoading(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Redirigir a verificación de email en lugar de registrar directamente
    onEmailVerification(currentForm.email)
    setIsLoading(false)
  }

  const totalSteps = 1

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-4xl mb-4">Únete a PetCare</h1>
            <p className="text-lg text-gray-600">
              Crea tu cuenta y forma parte de nuestra comunidad de amantes de las mascotas
            </p>
          </div>

          {/* Progress Indicator */}
          <div className="flex items-center justify-center space-x-4">
            {Array.from({ length: totalSteps }, (_, i) => (
              <div key={i} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                  i + 1 <= currentStep ? 'bg-primary text-white' : 'bg-gray-200 text-gray-400'
                }`}>
                  {i + 1}
                </div>
                {i < totalSteps - 1 && (
                  <div className={`w-16 h-1 mx-2 ${
                    i + 1 < currentStep ? 'bg-primary' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>

          {/* Form Content */}
          <Card>
            <CardHeader>
              <CardTitle>
                {selectedUserType === 'owner' ? 'Registro como Dueño' : 'Registro como Cuidador'} - 
                Paso {currentStep} de {totalSteps}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {selectedUserType === 'owner' && (
                <>
                  {/* Owner Step 1: Personal Info */}
                  {currentStep === 1 && (
                    <div className="space-y-4">
                      <h3 className="text-lg">Información Personal</h3>
                      
                      {/* User Type Selection within form */}
                      <div>
                        <label className="text-sm mb-2 block">Tipo de usuario *</label>
                        <Select 
                          value={selectedUserType} 
                          onValueChange={(value) => {
                            setSelectedUserType(value as 'owner' | 'sitter')
                            setCurrentStep(1)
                            setError('')
                          }}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Selecciona tu tipo de usuario" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="owner">
                              <div className="flex items-center">
                                <PawPrint className="h-4 w-4 mr-2" />
                                Soy Dueño de Mascota
                              </div>
                            </SelectItem>
                            <SelectItem value="sitter">
                              <div className="flex items-center">
                                <Heart className="h-4 w-4 mr-2" />
                                Quiero ser Cuidador
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-4">
						<div>
                          <label className="text-sm mb-2 block">Tipo de Identificación *</label>
                          <Select 
                            value={ownerForm.identificationType} 
                            onValueChange={(value) => handleOwnerInputChange('identificationType', value)}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Selecciona tu tipo de identificación" />
                            </SelectTrigger>
                            <SelectContent>
                              {identificationTypes.map((idType) => (
                                <SelectItem key={idType.value} value={idType.value}>
                                  {idType.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <label className="text-sm mb-2 block">Número de Identificación *</label>
                          <Input
                            value={ownerForm.identificationNumber}
                            onChange={(e) => handleOwnerInputChange('identificationNumber', e.target.value)}
                            placeholder="Ej: 12345678A"
                            required
                          />
                        </div>
                        <div>
                          <label className="text-sm mb-2 block">Nombre *</label>
                          <Input
                            value={ownerForm.firstName}
                            onChange={(e) => handleOwnerInputChange('firstName', e.target.value)}
                            required
                          />
                        </div>
                        <div>
                          <label className="text-sm mb-2 block">Apellidos *</label>
                          <Input
                            value={ownerForm.lastName}
                            onChange={(e) => handleOwnerInputChange('lastName', e.target.value)}
                            required
                          />
                        </div>
                        <div>
                          <label className="text-sm mb-2 block">Email *</label>
                          <Input
                            type="email"
                            value={ownerForm.email}
                            onChange={(e) => handleOwnerInputChange('email', e.target.value)}
                            required
                          />
                        </div>
                        <div>
                          <label className="text-sm mb-2 block">Teléfono *</label>
                          <Input
                            type="tel"
                            value={ownerForm.phone}
                            onChange={(e) => handleOwnerInputChange('phone', e.target.value)}
                            required
                          />
                        </div>
                        <div>
                          <label className="text-sm mb-2 block">Contraseña *</label>
                          <div className="relative">
                            <Input
                              type={showPassword ? "text" : "password"}
                              value={ownerForm.password}
                              onChange={(e) => handleOwnerInputChange('password', e.target.value)}
                              className="pr-10"
                              required
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                            >
                              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                          </div>
                        </div>
                        <div>
                          <label className="text-sm mb-2 block">Confirmar Contraseña *</label>
                          <div className="relative">
                            <Input
                              type={showConfirmPassword ? "text" : "password"}
                              value={ownerForm.confirmPassword}
                              onChange={(e) => handleOwnerInputChange('confirmPassword', e.target.value)}
                              className="pr-10"
                              required
                            />
                            <button
                              type="button"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                            >
                              {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                          </div>
                        </div>
                        <div>
                          <label className="text-sm mb-2 block">País *</label>
                          <Select 
                            value={ownerForm.country} 
                            onValueChange={(value) => handleOwnerInputChange('country', value)}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Selecciona tu país" />
                            </SelectTrigger>
                            <SelectContent>
                              {countries.map((country) => (
                                <SelectItem key={country.value} value={country.value}>
                                  {country.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <label className="text-sm mb-2 block">Estado/Provincia *</label>
                          <Select 
                            value={ownerForm.state} 
                            onValueChange={(value) => handleOwnerInputChange('state', value)}
                            disabled={!ownerForm.country}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Selecciona tu estado/provincia" />
                            </SelectTrigger>
                            <SelectContent>
                              {getAvailableStates(ownerForm.country).map((state) => (
                                <SelectItem key={state.value} value={state.value}>
                                  {state.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <label className="text-sm mb-2 block">Ciudad *</label>
                          <Select 
                            value={ownerForm.city} 
                            onValueChange={(value) => handleOwnerInputChange('city', value)}
                            disabled={!ownerForm.state}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Selecciona tu ciudad" />
                            </SelectTrigger>
                            <SelectContent>
                              {getAvailableCities(ownerForm.state).map((city) => (
                                <SelectItem key={city.value} value={city.value}>
                                  {city.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <label className="text-sm mb-2 block">Dirección</label>
                          <Input
                            value={ownerForm.address}
                            onChange={(e) => handleOwnerInputChange('address', e.target.value)}
                            placeholder="Calle, número, código postal"
                          />
                        </div>
                    </div>
                      
                      <div className="space-y-3 mt-6">
                        <div className="flex items-start space-x-2">
                          <Checkbox
                            id="terms-owner"
                            checked={ownerForm.acceptTerms}
                            onCheckedChange={(checked) => handleOwnerInputChange('acceptTerms', checked)}
                          />
                          <label htmlFor="terms-owner" className="text-sm">
                            Acepto los <a href="#" className="text-primary hover:underline">Términos y Condiciones</a> y la <a href="#" className="text-primary hover:underline">Política de Privacidad</a> *
                          </label>
                        </div>
                        <div className="flex items-start space-x-2">
                          <Checkbox
                            id="marketing-owner"
                            checked={ownerForm.acceptMarketing}
                            onCheckedChange={(checked) => handleOwnerInputChange('acceptMarketing', checked)}
                          />
                          <label htmlFor="marketing-owner" className="text-sm">
                            Acepto recibir comunicaciones de marketing y promociones *
                          </label>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Owner Step 2: Pets Info */}
                  {currentStep === 2 && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg">Información de tus Mascotas</h3>
                        <Button variant="outline" size="sm" onClick={addPet}>
                          <Plus className="h-4 w-4 mr-2" />
                          Agregar Mascota
                        </Button>
                      </div>
                      
                      {ownerForm.pets.map((pet, index) => (
                        <Card key={index} className="relative">
                          <CardContent className="p-4">
                            {ownerForm.pets.length > 1 && (
                              <button
                                onClick={() => removePet(index)}
                                className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                              >
                                <X className="h-4 w-4" />
                              </button>
                            )}
                            <h4 className="mb-3">Mascota {index + 1}</h4>
                            <div className="grid md:grid-cols-3 gap-4">
                              <div>
                                <label className="text-sm mb-2 block">Nombre *</label>
                                <Input
                                  value={pet.name}
                                  onChange={(e) => updatePet(index, 'name', e.target.value)}
                                  required
                                />
                              </div>
                              <div>
                                <label className="text-sm mb-2 block">Tipo *</label>
                                <select
                                  className="w-full p-2 border rounded-md"
                                  value={pet.type}
                                  onChange={(e) => updatePet(index, 'type', e.target.value)}
                                  required
                                >
                                  <option value="">Seleccionar</option>
                                  <option value="Perro">Perro</option>
                                  <option value="Gato">Gato</option>
                                  <option value="Ave">Ave</option>
                                  <option value="Otro">Otro</option>
                                </select>
                              </div>
                              <div>
                                <label className="text-sm mb-2 block">Raza</label>
                                <Input
                                  value={pet.breed}
                                  onChange={(e) => updatePet(index, 'breed', e.target.value)}
                                />
                              </div>
                              <div>
                                <label className="text-sm mb-2 block">Edad</label>
                                <Input
                                  value={pet.age}
                                  onChange={(e) => updatePet(index, 'age', e.target.value)}
                                  placeholder="ej: 3 años"
                                />
                              </div>
                              <div>
                                <label className="text-sm mb-2 block">Peso</label>
                                <Input
                                  value={pet.weight}
                                  onChange={(e) => updatePet(index, 'weight', e.target.value)}
                                  placeholder="ej: 15 kg"
                                />
                              </div>
                              <div className="md:col-span-1">
                                <label className="text-sm mb-2 block">Necesidades Especiales</label>
                                <Textarea
                                  rows={2}
                                  value={pet.specialNeeds}
                                  onChange={(e) => updatePet(index, 'specialNeeds', e.target.value)}
                                  placeholder="Medicamentos, alergias, etc."
                                />
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}

                  {/* Owner Step 3: Emergency and Final */}
                  {currentStep === 3 && (
                    <div className="space-y-4">
                      <h3 className="text-lg">Contacto de Emergencia y Finalización</h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm mb-2 block">Contacto de Emergencia</label>
                          <Input
                            value={ownerForm.emergencyContact}
                            onChange={(e) => handleOwnerInputChange('emergencyContact', e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="text-sm mb-2 block">Teléfono de Emergencia</label>
                          <Input
                            type="tel"
                            value={ownerForm.emergencyPhone}
                            onChange={(e) => handleOwnerInputChange('emergencyPhone', e.target.value)}
                          />
                        </div>
                      </div>
                      <div>
                        <label className="text-sm mb-2 block">Información Adicional</label>
                        <Textarea
                          rows={3}
                          value={ownerForm.additionalInfo}
                          onChange={(e) => handleOwnerInputChange('additionalInfo', e.target.value)}
                          placeholder="Cualquier información adicional que consideres importante..."
                        />
                      </div>
                      
                      <div className="space-y-3">
                        <div className="flex items-start space-x-2">
                          <Checkbox
                            id="terms-owner"
                            checked={ownerForm.acceptTerms}
                            onCheckedChange={(checked) => handleOwnerInputChange('acceptTerms', checked)}
                          />
                          <label htmlFor="terms-owner" className="text-sm">
                            Acepto los <a href="#" className="text-primary hover:underline">Términos y Condiciones</a> y la <a href="#" className="text-primary hover:underline">Política de Privacidad</a> *
                          </label>
                        </div>
                        <div className="flex items-start space-x-2">
                          <Checkbox
                            id="marketing-owner"
                            checked={ownerForm.acceptMarketing}
                            onCheckedChange={(checked) => handleOwnerInputChange('acceptMarketing', checked)}
                          />
                          <label htmlFor="marketing-owner" className="text-sm">
                            Acepto recibir comunicaciones de marketing y promociones *
                          </label>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}

              {selectedUserType === 'sitter' && (
                <>
                  {/* Sitter Step 1: Personal Info */}
                  {currentStep === 1 && (
                    <div className="space-y-4">
                      <h3 className="text-lg">Información Personal</h3>
                      
                      {/* User Type Selection within form */}
                      <div>
                        <label className="text-sm mb-2 block">Tipo de usuario *</label>
                        <Select 
                          value={selectedUserType} 
                          onValueChange={(value) => {
                            setSelectedUserType(value as 'owner' | 'sitter')
                            setCurrentStep(1)
                            setError('')
                          }}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Selecciona tu tipo de usuario" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="owner">
                              <div className="flex items-center">
                                <PawPrint className="h-4 w-4 mr-2" />
                                Soy Dueño de Mascota
                              </div>
                            </SelectItem>
                            <SelectItem value="sitter">
                              <div className="flex items-center">
                                <Heart className="h-4 w-4 mr-2" />
                                Quiero ser Cuidador
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm mb-2 block">Nombre *</label>
                          <Input
                            value={sitterForm.firstName}
                            onChange={(e) => handleSitterInputChange('firstName', e.target.value)}
                            required
                          />
                        </div>
                        <div>
                          <label className="text-sm mb-2 block">Apellidos *</label>
                          <Input
                            value={sitterForm.lastName}
                            onChange={(e) => handleSitterInputChange('lastName', e.target.value)}
                            required
                          />
                        </div>
                        <div>
                          <label className="text-sm mb-2 block">Email *</label>
                          <Input
                            type="email"
                            value={sitterForm.email}
                            onChange={(e) => handleSitterInputChange('email', e.target.value)}
                            required
                          />
                        </div>
                        <div>
                          <label className="text-sm mb-2 block">Teléfono *</label>
                          <Input
                            type="tel"
                            value={sitterForm.phone}
                            onChange={(e) => handleSitterInputChange('phone', e.target.value)}
                            required
                          />
                        </div>
                        <div>
                          <label className="text-sm mb-2 block">Contraseña *</label>
                          <div className="relative">
                            <Input
                              type={showPassword ? "text" : "password"}
                              value={sitterForm.password}
                              onChange={(e) => handleSitterInputChange('password', e.target.value)}
                              className="pr-10"
                              required
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                            >
                              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                          </div>
                        </div>
                        <div>
                          <label className="text-sm mb-2 block">Confirmar Contraseña *</label>
                          <div className="relative">
                            <Input
                              type={showConfirmPassword ? "text" : "password"}
                              value={sitterForm.confirmPassword}
                              onChange={(e) => handleSitterInputChange('confirmPassword', e.target.value)}
                              className="pr-10"
                              required
                            />
                            <button
                              type="button"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                            >
                              {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                          </div>
                        </div>
                        <div>
                          <label className="text-sm mb-2 block">País *</label>
                          <Select 
                            value={sitterForm.country} 
                            onValueChange={(value) => handleSitterInputChange('country', value)}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Selecciona tu país" />
                            </SelectTrigger>
                            <SelectContent>
                              {countries.map((country) => (
                                <SelectItem key={country.value} value={country.value}>
                                  {country.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <label className="text-sm mb-2 block">Estado/Provincia *</label>
                          <Select 
                            value={sitterForm.state} 
                            onValueChange={(value) => handleSitterInputChange('state', value)}
                            disabled={!sitterForm.country}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Selecciona tu estado/provincia" />
                            </SelectTrigger>
                            <SelectContent>
                              {getAvailableStates(sitterForm.country).map((state) => (
                                <SelectItem key={state.value} value={state.value}>
                                  {state.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <label className="text-sm mb-2 block">Ciudad *</label>
                          <Select 
                            value={sitterForm.city} 
                            onValueChange={(value) => handleSitterInputChange('city', value)}
                            disabled={!sitterForm.state}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Selecciona tu ciudad" />
                            </SelectTrigger>
                            <SelectContent>
                              {getAvailableCities(sitterForm.state).map((city) => (
                                <SelectItem key={city.value} value={city.value}>
                                  {city.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <label className="text-sm mb-2 block">Dirección</label>
                          <Input
                            value={sitterForm.address}
                            onChange={(e) => handleSitterInputChange('address', e.target.value)}
                            placeholder="Calle, número, código postal"
                          />
                        </div>
                        <div>
                          <label className="text-sm mb-2 block">Tipo de Identificación *</label>
                          <Select 
                            value={sitterForm.identificationType} 
                            onValueChange={(value) => handleSitterInputChange('identificationType', value)}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Selecciona tu tipo de identificación" />
                            </SelectTrigger>
                            <SelectContent>
                              {identificationTypes.map((idType) => (
                                <SelectItem key={idType.value} value={idType.value}>
                                  {idType.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <label className="text-sm mb-2 block">Número de Identificación *</label>
                          <Input
                            value={sitterForm.identificationNumber}
                            onChange={(e) => handleSitterInputChange('identificationNumber', e.target.value)}
                            placeholder="Ej: 12345678A"
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-3 mt-6">
                        <div className="flex items-start space-x-2">
                          <Checkbox
                            id="terms-sitter"
                            checked={sitterForm.acceptTerms}
                            onCheckedChange={(checked) => handleSitterInputChange('acceptTerms', checked)}
                          />
                          <label htmlFor="terms-sitter" className="text-sm">
                            Acepto los <a href="#" className="text-primary hover:underline">Términos y Condiciones</a> y la <a href="#" className="text-primary hover:underline">Política de Privacidad</a> *
                          </label>
                        </div>
                        <div className="flex items-start space-x-2">
                          <Checkbox
                            id="marketing-sitter"
                            checked={sitterForm.acceptMarketing}
                            onCheckedChange={(checked) => handleSitterInputChange('acceptMarketing', checked)}
                          />
                          <label htmlFor="marketing-sitter" className="text-sm">
                            Acepto recibir comunicaciones de marketing y promociones *
                          </label>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Sitter Step 2: Professional Info */}
                  {currentStep === 2 && (
                    <div className="space-y-6">
                      <h3 className="text-lg">Información Profesional</h3>
                      
                      <div>
                        <label className="text-sm mb-2 block">Experiencia con mascotas *</label>
                        <Textarea
                          rows={3}
                          value={sitterForm.experience}
                          onChange={(e) => handleSitterInputChange('experience', e.target.value)}
                          placeholder="Describe tu experiencia cuidando mascotas..."
                          required
                        />
                      </div>
                      
                      <div>
                        <label className="text-sm mb-2 block">Descripción de tu perfil *</label>
                        <Textarea
                          rows={4}
                          value={sitterForm.description}
                          onChange={(e) => handleSitterInputChange('description', e.target.value)}
                          placeholder="Cuéntanos sobre ti, por qué amas a los animales y qué te hace especial como cuidador..."
                          required
                        />
                      </div>

                      <div>
                        <label className="text-sm mb-2 block">Servicios que ofreces * (selecciona al menos uno)</label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                          {serviceOptions.map((service) => (
                            <div key={service} className="flex items-center space-x-2">
                              <Checkbox
                                id={`service-${service}`}
                                checked={sitterForm.services.includes(service)}
                                onCheckedChange={() => toggleService(service)}
                              />
                              <label htmlFor={`service-${service}`} className="text-sm">
                                {service}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="text-sm mb-2 block">Disponibilidad</label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {availabilityOptions.map((availability) => (
                            <div key={availability} className="flex items-center space-x-2">
                              <Checkbox
                                id={`availability-${availability}`}
                                checked={sitterForm.availability.includes(availability)}
                                onCheckedChange={() => toggleAvailability(availability)}
                              />
                              <label htmlFor={`availability-${availability}`} className="text-sm">
                                {availability}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="text-sm mb-2 block">Tarifa por hora (€)</label>
                        <Input
                          type="number"
                          value={sitterForm.hourlyRate}
                          onChange={(e) => handleSitterInputChange('hourlyRate', e.target.value)}
                          placeholder="15"
                          min="10"
                          max="50"
                        />
                        <p className="text-xs text-gray-500 mt-1">Tarifa promedio: 12-20€/hora</p>
                      </div>
                    </div>
                  )}

                  {/* Sitter Step 3: Verification and Final */}
                  {currentStep === 3 && (
                    <div className="space-y-4">
                      <h3 className="text-lg">Verificación y Finalización</h3>
                      
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm mb-2 block">Contacto de Emergencia</label>
                          <Input
                            value={sitterForm.emergencyContact}
                            onChange={(e) => handleSitterInputChange('emergencyContact', e.target.value)}
                          />
                        </div>
                        <div>
                          <label className="text-sm mb-2 block">Teléfono de Emergencia</label>
                          <Input
                            type="tel"
                            value={sitterForm.emergencyPhone}
                            onChange={(e) => handleSitterInputChange('emergencyPhone', e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-start space-x-2">
                          <Checkbox
                            id="insurance"
                            checked={sitterForm.hasInsurance}
                            onCheckedChange={(checked) => handleSitterInputChange('hasInsurance', checked)}
                          />
                          <label htmlFor="insurance" className="text-sm">
                            Tengo seguro de responsabilidad civil (recomendado)
                          </label>
                        </div>
                        <div className="flex items-start space-x-2">
                          <Checkbox
                            id="criminal-check"
                            checked={sitterForm.hasCriminalCheck}
                            onCheckedChange={(checked) => handleSitterInputChange('hasCriminalCheck', checked)}
                          />
                          <label htmlFor="criminal-check" className="text-sm">
                            Acepto someterme a verificación de antecedentes (obligatorio)
                          </label>
                        </div>
                      </div>

                      <Alert>
                        <CheckCircle className="h-4 w-4" />
                        <AlertDescription>
                          Después del registro, nuestro equipo revisará tu perfil y te contactará en 2-3 días hábiles para completar el proceso de verificación.
                        </AlertDescription>
                      </Alert>
                      
                      <div className="space-y-3">
                        <div className="flex items-start space-x-2">
                          <Checkbox
                            id="terms-sitter"
                            checked={sitterForm.acceptTerms}
                            onCheckedChange={(checked) => handleSitterInputChange('acceptTerms', checked)}
                          />
                          <label htmlFor="terms-sitter" className="text-sm">
                            Acepto los <a href="#" className="text-primary hover:underline">Términos y Condiciones</a> y la <a href="#" className="text-primary hover:underline">Política de Privacidad</a> *
                          </label>
                        </div>
                        <div className="flex items-start space-x-2">
                          <Checkbox
                            id="marketing-sitter"
                            checked={sitterForm.acceptMarketing}
                            onCheckedChange={(checked) => handleSitterInputChange('acceptMarketing', checked)}
                          />
                          <label htmlFor="marketing-sitter" className="text-sm">
                            Acepto recibir comunicaciones de marketing y promociones
                          </label>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between pt-6">
                {currentStep > 1 ? (
                  <Button variant="outline" onClick={handlePrevious}>
                    Anterior
                  </Button>
                ) : (
                  <div></div>
                )}

                {currentStep < totalSteps ? (
                  <Button onClick={handleNext}>
                    Siguiente
                  </Button>
                ) : (
                  <Button onClick={handleSubmit} disabled={isLoading}>
                    {isLoading ? 'Creando cuenta...' : 'Crear Cuenta'}
                  </Button>
                )}
              </div>

              {/* Login Link */}
              <div className="text-center text-sm text-gray-600 pt-4">
                ¿Ya tienes una cuenta?{' '}
                <button 
                  type="button"
                  onClick={onShowLogin}
                  className="text-primary hover:underline"
                >
                  Inicia sesión aquí
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}