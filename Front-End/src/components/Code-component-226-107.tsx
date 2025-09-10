import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Badge } from "./ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table"
import { Alert, AlertDescription } from "./ui/alert"
import { 
  DollarSign, 
  Edit, 
  Save, 
  X, 
  Plus, 
  TrendingUp, 
  TrendingDown,
  AlertCircle,
  Clock,
  Calendar
} from "lucide-react"

interface ServicePrice {
  id: string
  name: string
  category: string
  basePrice: number
  priceType: 'hourly' | 'daily' | 'fixed'
  minPrice: number
  maxPrice: number
  commission: number
  active: boolean
  lastUpdated: string
  averageMarketPrice: number
  popularityScore: number
}

interface ServicePricingManagerProps {
  onBack: () => void
}

export default function ServicePricingManager({ onBack }: ServicePricingManagerProps) {
  const [editingService, setEditingService] = useState<string | null>(null)
  const [serviceFilter, setServiceFilter] = useState("all")
  const [showAddForm, setShowAddForm] = useState(false)
  
  const [services, setServices] = useState<ServicePrice[]>([
    {
      id: "1",
      name: "Paseo de perros",
      category: "Cuidado básico",
      basePrice: 15,
      priceType: "hourly",
      minPrice: 10,
      maxPrice: 25,
      commission: 15,
      active: true,
      lastUpdated: "2025-01-20",
      averageMarketPrice: 16,
      popularityScore: 95
    },
    {
      id: "2", 
      name: "Cuidado en casa",
      category: "Cuidado básico",
      basePrice: 18,
      priceType: "hourly",
      minPrice: 15,
      maxPrice: 30,
      commission: 15,
      active: true,
      lastUpdated: "2025-01-19",
      averageMarketPrice: 19,
      popularityScore: 87
    },
    {
      id: "3",
      name: "Hospedaje nocturno",
      category: "Hospedaje",
      basePrice: 35,
      priceType: "daily",
      minPrice: 25,
      maxPrice: 60,
      commission: 20,
      active: true,
      lastUpdated: "2025-01-18",
      averageMarketPrice: 38,
      popularityScore: 72
    },
    {
      id: "4",
      name: "Grooming básico",
      category: "Servicios especializados",
      basePrice: 45,
      priceType: "fixed",
      minPrice: 35,
      maxPrice: 80,
      commission: 25,
      active: true,
      lastUpdated: "2025-01-15",
      averageMarketPrice: 48,
      popularityScore: 64
    },
    {
      id: "5",
      name: "Entrenamiento",
      category: "Servicios especializados",
      basePrice: 50,
      priceType: "hourly",
      minPrice: 40,
      maxPrice: 100,
      commission: 20,
      active: true,
      lastUpdated: "2025-01-12",
      averageMarketPrice: 55,
      popularityScore: 58
    },
    {
      id: "6",
      name: "Visitas veterinarias",
      category: "Servicios especializados",
      basePrice: 25,
      priceType: "fixed",
      minPrice: 20,
      maxPrice: 40,
      commission: 15,
      active: false,
      lastUpdated: "2025-01-10",
      averageMarketPrice: 28,
      popularityScore: 41
    }
  ])
  
  const [newService, setNewService] = useState({
    name: "",
    category: "",
    basePrice: 0,
    priceType: "hourly" as const,
    minPrice: 0,
    maxPrice: 0,
    commission: 15
  })
  
  const categories = ["Cuidado básico", "Hospedaje", "Servicios especializados", "Emergencias"]
  
  const filteredServices = services.filter(service => {
    if (serviceFilter === "all") return true
    if (serviceFilter === "active") return service.active
    if (serviceFilter === "inactive") return !service.active
    return service.category === serviceFilter
  })
  
  const handleEditStart = (serviceId: string) => {
    setEditingService(serviceId)
  }
  
  const handleEditCancel = () => {
    setEditingService(null)
  }
  
  const handleSaveService = (serviceId: string) => {
    // Aquí se implementaría la lógica para guardar en la base de datos
    setEditingService(null)
    console.log("Guardando servicio:", serviceId)
  }
  
  const handlePriceChange = (serviceId: string, field: keyof ServicePrice, value: any) => {
    setServices(prev => prev.map(service => 
      service.id === serviceId 
        ? { ...service, [field]: value, lastUpdated: new Date().toISOString().split('T')[0] }
        : service
    ))
  }
  
  const handleToggleActive = (serviceId: string) => {
    setServices(prev => prev.map(service => 
      service.id === serviceId 
        ? { ...service, active: !service.active, lastUpdated: new Date().toISOString().split('T')[0] }
        : service
    ))
  }
  
  const handleAddService = () => {
    if (!newService.name || !newService.category || newService.basePrice <= 0) return
    
    const service: ServicePrice = {
      id: Date.now().toString(),
      ...newService,
      active: true,
      lastUpdated: new Date().toISOString().split('T')[0],
      averageMarketPrice: newService.basePrice,
      popularityScore: 0
    }
    
    setServices(prev => [...prev, service])
    setNewService({
      name: "",
      category: "",
      basePrice: 0,
      priceType: "hourly",
      minPrice: 0,
      maxPrice: 0,
      commission: 15
    })
    setShowAddForm(false)
  }
  
  const calculateRevenue = () => {
    return services.reduce((total, service) => {
      if (!service.active) return total
      // Simulación de cálculo de ingresos basado en popularidad
      return total + (service.basePrice * service.popularityScore * 0.1)
    }, 0)
  }
  
  const getPriceTypeIcon = (type: string) => {
    switch (type) {
      case 'hourly': return <Clock className="h-4 w-4" />
      case 'daily': return <Calendar className="h-4 w-4" />
      default: return <DollarSign className="h-4 w-4" />
    }
  }
  
  const getPriceTypeLabel = (type: string) => {
    switch (type) {
      case 'hourly': return 'Por hora'
      case 'daily': return 'Por día'
      default: return 'Precio fijo'
    }
  }
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="ghost" onClick={onBack}>
              ← Volver al Panel
            </Button>
            <h1 className="text-3xl text-gray-900">Gestión de Precios de Servicios</h1>
          </div>
          <p className="text-gray-600">Administra los precios base, comisiones y rangos de todos los servicios</p>
        </div>
        
        {/* Estadísticas */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <DollarSign className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Ingresos Estimados</p>
                  <p className="text-2xl">{calculateRevenue().toFixed(0)}€</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Servicios Activos</p>
                  <p className="text-2xl">{services.filter(s => s.active).length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <TrendingDown className="h-8 w-8 text-red-600" />
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Servicios Inactivos</p>
                  <p className="text-2xl">{services.filter(s => !s.active).length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <AlertCircle className="h-8 w-8 text-yellow-600" />
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Requieren Revisión</p>
                  <p className="text-2xl">
                    {services.filter(s => Math.abs(s.basePrice - s.averageMarketPrice) > 5).length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Alertas */}
        {services.some(s => Math.abs(s.basePrice - s.averageMarketPrice) > 5) && (
          <Alert className="mb-6 border-yellow-200 bg-yellow-50">
            <AlertCircle className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="text-yellow-800">
              Algunos servicios tienen precios significativamente diferentes al promedio del mercado. 
              Considera revisar los precios para mantener la competitividad.
            </AlertDescription>
          </Alert>
        )}
        
        {/* Controles */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <Select value={serviceFilter} onValueChange={setServiceFilter}>
            <SelectTrigger className="w-full sm:w-64">
              <SelectValue placeholder="Filtrar servicios" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los servicios</SelectItem>
              <SelectItem value="active">Solo activos</SelectItem>
              <SelectItem value="inactive">Solo inactivos</SelectItem>
              {categories.map(category => (
                <SelectItem key={category} value={category}>{category}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button onClick={() => setShowAddForm(true)} className="sm:ml-auto">
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Servicio
          </Button>
        </div>
        
        {/* Formulario para nuevo servicio */}
        {showAddForm && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Agregar Nuevo Servicio</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4 mb-4">
                <div>
                  <Label htmlFor="newName">Nombre del servicio</Label>
                  <Input
                    id="newName"
                    value={newService.name}
                    onChange={(e) => setNewService(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Ej: Paseo nocturno"
                  />
                </div>
                
                <div>
                  <Label htmlFor="newCategory">Categoría</Label>
                  <Select 
                    value={newService.category} 
                    onValueChange={(value) => setNewService(prev => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="newPriceType">Tipo de precio</Label>
                  <Select 
                    value={newService.priceType} 
                    onValueChange={(value: 'hourly' | 'daily' | 'fixed') => setNewService(prev => ({ ...prev, priceType: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hourly">Por hora</SelectItem>
                      <SelectItem value="daily">Por día</SelectItem>
                      <SelectItem value="fixed">Precio fijo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="newBasePrice">Precio base (€)</Label>
                  <Input
                    id="newBasePrice"
                    type="number"
                    value={newService.basePrice}
                    onChange={(e) => setNewService(prev => ({ ...prev, basePrice: Number(e.target.value) }))}
                    min="0"
                    step="0.01"
                  />
                </div>
                
                <div>
                  <Label htmlFor="newMinPrice">Precio mínimo (€)</Label>
                  <Input
                    id="newMinPrice"
                    type="number"
                    value={newService.minPrice}
                    onChange={(e) => setNewService(prev => ({ ...prev, minPrice: Number(e.target.value) }))}
                    min="0"
                    step="0.01"
                  />
                </div>
                
                <div>
                  <Label htmlFor="newMaxPrice">Precio máximo (€)</Label>
                  <Input
                    id="newMaxPrice"
                    type="number"
                    value={newService.maxPrice}
                    onChange={(e) => setNewService(prev => ({ ...prev, maxPrice: Number(e.target.value) }))}
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>
              
              <div className="flex gap-3">
                <Button onClick={handleAddService}>
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar Servicio
                </Button>
                <Button variant="outline" onClick={() => setShowAddForm(false)}>
                  <X className="h-4 w-4 mr-2" />
                  Cancelar
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
        
        {/* Tabla de servicios */}
        <Card>
          <CardHeader>
            <CardTitle>Servicios ({filteredServices.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Servicio</TableHead>
                    <TableHead>Categoría</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Precio Base</TableHead>
                    <TableHead>Rango</TableHead>
                    <TableHead>Comisión</TableHead>
                    <TableHead>Mercado</TableHead>
                    <TableHead>Popularidad</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredServices.map((service) => (
                    <TableRow key={service.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{service.name}</p>
                          <p className="text-sm text-gray-500">
                            Actualizado: {service.lastUpdated}
                          </p>
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <Badge variant="secondary">{service.category}</Badge>
                      </TableCell>
                      
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {getPriceTypeIcon(service.priceType)}
                          <span className="text-sm">{getPriceTypeLabel(service.priceType)}</span>
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        {editingService === service.id ? (
                          <Input
                            type="number"
                            value={service.basePrice}
                            onChange={(e) => handlePriceChange(service.id, 'basePrice', Number(e.target.value))}
                            className="w-20"
                            min="0"
                            step="0.01"
                          />
                        ) : (
                          <span className="font-medium">{service.basePrice}€</span>
                        )}
                      </TableCell>
                      
                      <TableCell>
                        <div className="text-sm">
                          {editingService === service.id ? (
                            <div className="flex gap-1">
                              <Input
                                type="number"
                                value={service.minPrice}
                                onChange={(e) => handlePriceChange(service.id, 'minPrice', Number(e.target.value))}
                                className="w-16"
                                min="0"
                                step="0.01"
                              />
                              <span>-</span>
                              <Input
                                type="number"
                                value={service.maxPrice}
                                onChange={(e) => handlePriceChange(service.id, 'maxPrice', Number(e.target.value))}
                                className="w-16"
                                min="0"
                                step="0.01"
                              />
                            </div>
                          ) : (
                            <span>{service.minPrice}€ - {service.maxPrice}€</span>
                          )}
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        {editingService === service.id ? (
                          <Input
                            type="number"
                            value={service.commission}
                            onChange={(e) => handlePriceChange(service.id, 'commission', Number(e.target.value))}
                            className="w-16"
                            min="0"
                            max="100"
                          />
                        ) : (
                          <span>{service.commission}%</span>
                        )}
                      </TableCell>
                      
                      <TableCell>
                        <div className="text-sm">
                          <span>{service.averageMarketPrice}€</span>
                          {Math.abs(service.basePrice - service.averageMarketPrice) > 5 && (
                            <div className="flex items-center gap-1 mt-1">
                              {service.basePrice > service.averageMarketPrice ? (
                                <TrendingUp className="h-3 w-3 text-red-500" />
                              ) : (
                                <TrendingDown className="h-3 w-3 text-green-500" />
                              )}
                              <span className="text-xs text-gray-500">
                                {service.basePrice > service.averageMarketPrice ? 'Alto' : 'Bajo'}
                              </span>
                            </div>
                          )}
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-600 h-2 rounded-full" 
                              style={{ width: `${service.popularityScore}%` }}
                            ></div>
                          </div>
                          <span className="text-sm">{service.popularityScore}%</span>
                        </div>
                      </TableCell>
                      
                      <TableCell>
                        <Badge 
                          variant={service.active ? "default" : "secondary"}
                          className="cursor-pointer"
                          onClick={() => handleToggleActive(service.id)}
                        >
                          {service.active ? "Activo" : "Inactivo"}
                        </Badge>
                      </TableCell>
                      
                      <TableCell>
                        <div className="flex gap-2">
                          {editingService === service.id ? (
                            <>
                              <Button 
                                size="sm" 
                                onClick={() => handleSaveService(service.id)}
                              >
                                <Save className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={handleEditCancel}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </>
                          ) : (
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleEditStart(service.id)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}