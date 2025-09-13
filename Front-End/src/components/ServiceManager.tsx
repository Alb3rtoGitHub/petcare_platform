import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Textarea } from "./ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog"
import { Badge } from "./ui/badge"
import { Plus, Edit, Trash2, Clock, DollarSign, MapPin, Play, Pause } from "lucide-react"
import { getActiveServices, formatServicePrice, getServicePrice, getServiceById } from "../services/servicesPricing.js"

interface Service {
  id: string
  name: string
  type: 'walk' | 'home-care' | 'boarding' | 'daycare'
  description: string
  price: number
  duration: string
  location: string
  availability: string[]
  isActive: boolean
}

const serviceTypes = {
  'walk': 'Paseos',
  'home-care': 'Cuidado en Casa',
  'boarding': 'Hospedaje',
  'daycare': 'Guardería'
}

export default function ServiceManager() {
  const [services, setServices] = useState<Service[]>([
    {
      id: '1',
      name: 'Paseo Relajado',
      type: 'walk',
      description: 'Paseo tranquilo por el parque con tu mascota',
      price: getServicePrice("1"), // Usar precio del archivo compartido
      duration: '30 min',
      location: 'Parques cercanos',
      availability: ['Mañana', 'Tarde'],
      isActive: true
    },
    {
      id: '2',
      name: 'Cuidado Completo',
      type: 'home-care',
      description: 'Cuidado completo en tu hogar mientras estás fuera',
      price: getServicePrice("2"), // Usar precio del archivo compartido
      duration: '2 horas',
      location: 'En casa del cliente',
      availability: ['Todo el día'],
      isActive: false
    },
    {
      id: '3',
      name: 'Hospedaje de Fin de Semana',
      type: 'boarding',
      description: 'Tu mascota se queda en mi casa durante el fin de semana',
      price: getServicePrice("3"), // Usar precio del archivo compartido
      duration: '1 noche',
      location: 'En mi hogar',
      availability: ['Fines de semana'],
      isActive: true
    }
  ])

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingService, setEditingService] = useState<Service | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    type: 'walk' as Service['type'],
    description: '',
    price: '',
    duration: '',
    location: '',
    availability: [] as string[]
  })

  const availabilityOptions = ['Mañana', 'Tarde', 'Noche', 'Todo el día', 'Fines de semana']

  const handleAddService = () => {
    setEditingService(null)
    setFormData({
      name: '',
      type: 'walk',
      description: '',
      price: '',
      duration: '',
      location: '',
      availability: []
    })
    setIsDialogOpen(true)
  }

  const handleEditService = (service: Service) => {
    setEditingService(service)
    setFormData({
      name: service.name,
      type: service.type,
      description: service.description,
      price: service.price.toString(),
      duration: service.duration,
      location: service.location,
      availability: service.availability
    })
    setIsDialogOpen(true)
  }

  const handleDeleteService = (id: string) => {
    setServices(services.filter(service => service.id !== id))
  }

  const toggleServiceStatus = (id: string) => {
    setServices(services.map(service => 
      service.id === id ? { ...service, isActive: !service.isActive } : service
    ))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const serviceData: Service = {
      id: editingService?.id || Date.now().toString(),
      name: formData.name,
      type: formData.type,
      description: formData.description,
      price: parseFloat(formData.price),
      duration: formData.duration,
      location: formData.location,
      availability: formData.availability,
      isActive: true
    }

    if (editingService) {
      setServices(services.map(service => 
        service.id === editingService.id ? serviceData : service
      ))
    } else {
      setServices([...services, serviceData])
    }

    setIsDialogOpen(false)
  }

  const toggleAvailability = (option: string) => {
    const newAvailability = formData.availability.includes(option)
      ? formData.availability.filter(item => item !== option)
      : [...formData.availability, option]
    
    setFormData({ ...formData, availability: newAvailability })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2>Mis Servicios</h2>
          <p className="text-muted-foreground">
            Gestiona los servicios que ofreces a los dueños de mascotas
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAddService} className="gap-2">
              <Plus className="h-4 w-4" />
              Agregar Servicio
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingService ? 'Editar Servicio' : 'Nuevo Servicio'}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Nombre del Servicio</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ej: Paseo Matutino"
                  required
                />
              </div>

              <div>
                <Label htmlFor="type">Tipo de Servicio</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value: Service['type']) => 
                    setFormData({ ...formData, type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(serviceTypes).map(([key, value]) => (
                      <SelectItem key={key} value={key}>
                        {value}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe tu servicio..."
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price">Precio (€)</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="0.00"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="duration">Duración</Label>
                  <Input
                    id="duration"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    placeholder="Ej: 30 min"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="location">Ubicación</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="Ej: Parques cercanos"
                  required
                />
              </div>

              <div>
                <Label>Disponibilidad</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {availabilityOptions.map((option) => (
                    <Badge
                      key={option}
                      variant={formData.availability.includes(option) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => toggleAvailability(option)}
                    >
                      {option}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button type="submit" className="flex-1">
                  {editingService ? 'Actualizar' : 'Crear'} Servicio
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {services.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center mb-4">
                <Plus className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3>No tienes servicios creados</h3>
              <p className="text-muted-foreground text-center mb-4">
                Crea tu primera oferta de servicio para comenzar a recibir reservas
              </p>
              <Button onClick={handleAddService} className="gap-2">
                <Plus className="h-4 w-4" />
                Crear Primer Servicio
              </Button>
            </CardContent>
          </Card>
        ) : (
          services.map((service) => (
            <Card key={service.id}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {service.name}
                      <Badge variant="secondary">
                        {serviceTypes[service.type]}
                      </Badge>
                      <Badge 
                        variant={service.isActive ? "default" : "secondary"}
                        className={service.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"}
                      >
                        {service.isActive ? "Activo" : "Pausado"}
                      </Badge>
                    </CardTitle>
                    <p className="text-muted-foreground mt-1">
                      {service.description}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditService(service)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteService(service.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span>{service.price}€</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{service.duration}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{service.location}</span>
                  </div>
                </div>
                <div className="mt-4">
                  <Label className="text-sm">Disponibilidad:</Label>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {service.availability.map((slot) => (
                      <Badge key={slot} variant="outline" className="text-xs">
                        {slot}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="flex gap-2 mt-4 pt-4 border-t">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEditService(service)}
                    className="flex-1"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Editar
                  </Button>
                  <Button
                    variant={service.isActive ? "outline" : "default"}
                    size="sm"
                    onClick={() => toggleServiceStatus(service.id)}
                    className={`flex-1 ${
                      service.isActive 
                        ? 'text-pink-600 border-pink-300 hover:bg-pink-50 hover:text-pink-700' 
                        : 'bg-green-600 hover:bg-green-700 text-white'
                    }`}
                  >
                    {service.isActive ? (
                      <>
                        <Pause className="h-4 w-4 mr-2" />
                        Pausar
                      </>
                    ) : (
                      <>
                        <Play className="h-4 w-4 mr-2" />
                        Activar
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}