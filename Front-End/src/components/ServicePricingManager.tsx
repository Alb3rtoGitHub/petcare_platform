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
import { 
  SERVICES_PRICING, 
  SERVICE_CATEGORIES, 
  PRICE_TYPES,
  CURRENCY_TYPES,
  CURRENCY_SYMBOLS,
  validatePrice,
  normalizePrice,
  formatPriceWithCurrency,
  fetchAvailableCurrencies,
  calculateCommissionGain,
  calculateMarketPrice,
  formatCommissionGain,
  formatMarketPrice
} from "../services/servicesPricing.js"

interface ServicePrice {
  id: string
  name: string
  category: string
  price: number
  currency: string
  priceType: 'hourly' | 'daily' | 'fixed'
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
  const [availableCurrencies, setAvailableCurrencies] = useState([
    { code: 'EUR', symbol: '€', name: 'Euro' },
    { code: 'USD', symbol: '$', name: 'Dólar' },
    { code: 'GBP', symbol: '£', name: 'Libra' },
    { code: 'COP', symbol: '$', name: 'Peso Colombiano' }
  ])
  
  const [services, setServices] = useState<ServicePrice[]>(SERVICES_PRICING.map(service => ({
    id: service.id,
    name: service.name,
    category: service.category,
    price: normalizePrice(service.price),
    currency: service.currency || CURRENCY_TYPES.EUR,
    priceType: service.priceType as 'hourly' | 'daily' | 'fixed',
    commission: service.commission,
    active: service.active,
    lastUpdated: service.lastUpdated,
    averageMarketPrice: normalizePrice(service.averageMarketPrice),
    popularityScore: service.popularityScore
  })))
  
  const [newService, setNewService] = useState({
    name: "",
    category: "",
    price: 0.00,
    currency: CURRENCY_TYPES.EUR,
    priceType: "hourly" as const,
    commission: 15
  })
  
  const categories = Object.values(SERVICE_CATEGORIES)
  
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
    let processedValue = value
    
    // Validar y normalizar el precio si es el campo price
    if (field === 'price') {
      if (!validatePrice(value)) {
        return // No actualizar si el precio no es válido
      }
      processedValue = normalizePrice(value)
    }
    
    setServices(prev => prev.map(service => 
      service.id === serviceId 
        ? { ...service, [field]: processedValue, lastUpdated: new Date().toISOString().split('T')[0] }
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
    if (!newService.name || !newService.category || !validatePrice(newService.price)) return
    
    const service: ServicePrice = {
      id: Date.now().toString(),
      ...newService,
      price: normalizePrice(newService.price), // Normalizar precio
      active: true,
      lastUpdated: new Date().toISOString().split('T')[0],
      averageMarketPrice: normalizePrice(newService.price),
      popularityScore: 0
    }
    
    setServices(prev => [...prev, service])
    setNewService({
      name: "",
      category: "",
      price: 0.00,
      currency: CURRENCY_TYPES.EUR,
      priceType: "hourly",
      commission: 15
    })
    setShowAddForm(false)
  }
  
  const calculateRevenue = () => {
    return services.reduce((total, service) => {
      if (!service.active) return total
      // Simulación de cálculo de ingresos basado en popularidad
      return total + (service.price * service.popularityScore * 0.1)
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
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={onBack} className="p-0 h-auto">
          ← Volver al Panel
        </Button>
        <div>
          <h2 className="text-xl">Gestión de Precios de Servicios</h2>
          <p className="text-sm text-gray-600">Administra los precios base, comisiones y rangos de todos los servicios</p>
        </div>
      </div>
      
      {/* Estadísticas */}
      <div className="grid md:grid-cols-3 gap-6">
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
      </div>
      
      {/* Controles */}
      <div className="flex flex-col sm:flex-row gap-4">
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
        <Card>
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
                <Label htmlFor="newCurrency">Moneda</Label>
                <Select 
                  value={newService.currency} 
                  onValueChange={(value) => setNewService(prev => ({ ...prev, currency: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {availableCurrencies.map(currency => (
                      <SelectItem key={currency.code} value={currency.code}>
                        {currency.symbol} {currency.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="newPrice">
                  Precio ({CURRENCY_SYMBOLS[newService.currency]})
                </Label>
                <Input
                  id="newPrice"
                  type="number"
                  value={newService.price}
                  onChange={(e) => setNewService(prev => ({ 
                    ...prev, 
                    price: normalizePrice(e.target.value) 
                  }))}
                  min="0"
                  max="999999.99"
                  step="0.01"
                  placeholder="0.00"
                />
              </div>
              
              <div>
                <Label htmlFor="newCommission">Comisión (%)</Label>
                <Input
                  id="newCommission"
                  type="number"
                  value={newService.commission}
                  onChange={(e) => setNewService(prev => ({ ...prev, commission: Number(e.target.value) }))}
                  min="0"
                  max="100"
                  step="1"
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
                  <TableHead>Precio</TableHead>
                  <TableHead>Moneda</TableHead>
                  <TableHead>Ganancia Comisión</TableHead>
                  <TableHead>Comisión (%)</TableHead>
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
                          value={service.price}
                          onChange={(e) => handlePriceChange(service.id, 'price', e.target.value)}
                          className="w-24"
                          min="0"
                          max="999999.99"
                          step="0.01"
                        />
                      ) : (
                        <span className="font-medium">
                          {formatPriceWithCurrency(service.price, service.currency)}
                        </span>
                      )}
                    </TableCell>

                    <TableCell>
                      {editingService === service.id ? (
                        <Select 
                          value={service.currency} 
                          onValueChange={(value) => handlePriceChange(service.id, 'currency', value)}
                        >
                          <SelectTrigger className="w-24">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {availableCurrencies.map(currency => (
                              <SelectItem key={currency.code} value={currency.code}>
                                {currency.symbol}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <Badge variant="outline">
                          {CURRENCY_SYMBOLS[service.currency]} {service.currency}
                        </Badge>
                      )}
                    </TableCell>

                    <TableCell>
                      <span className="font-medium text-green-600">
                        {formatCommissionGain(service.price, service.commission, service.currency)}
                      </span>
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
                        <span className="font-medium text-blue-600">
                          {formatMarketPrice(service.price, service.commission, service.currency)}
                        </span>
                        {(service.commission > 35 || service.commission < 10) && (
                          <div className="flex items-center gap-1 mt-1">
                            {service.commission > 35 ? (
                              <TrendingUp className="h-3 w-3 text-green-500" />
                            ) : (
                              <TrendingDown className="h-3 w-3 text-red-500" />
                            )}
                            <span className="text-xs text-gray-500">
                              {service.commission > 35 ? 'Alto' : 'Bajo'}
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
  )
}