import { useState } from "react"
import { Button } from "./ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import { Separator } from "./ui/separator"
import { ImageWithFallback } from "./figma/ImageWithFallback"
import { 
  ArrowLeft, 
  Trash2, 
  Plus, 
  Minus, 
  ShoppingBag, 
  Clock,
  MapPin,
  Star,
  Calendar,
  CreditCard
} from "lucide-react"

interface CartItem {
  id: string
  sitterId: string
  sitterName: string
  sitterImage: string
  sitterRating: number
  service: string
  date: string
  startTime: string
  endTime: string
  duration: number
  pricePerHour: number
  location: string
  petType: string
  quantity: number
  specialRequests?: string
}

interface ShoppingCartProps {
  onBack: () => void
  onProceedToPayment: (cartItems: CartItem[], total: number) => void
  cartItems: CartItem[]
  onUpdateCart: (items: CartItem[]) => void
}

export default function ShoppingCart({ onBack, onProceedToPayment, cartItems, onUpdateCart }: ShoppingCartProps) {
  const [items, setItems] = useState<CartItem[]>(cartItems)

  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity === 0) {
      removeItem(itemId)
      return
    }
    
    const updatedItems = items.map(item => 
      item.id === itemId ? { ...item, quantity: newQuantity } : item
    )
    setItems(updatedItems)
    onUpdateCart(updatedItems)
  }

  const removeItem = (itemId: string) => {
    const updatedItems = items.filter(item => item.id !== itemId)
    setItems(updatedItems)
    onUpdateCart(updatedItems)
  }

  const calculateItemTotal = (item: CartItem) => {
    return item.pricePerHour * item.duration * item.quantity
  }

  const calculateSubtotal = () => {
    return items.reduce((total, item) => total + calculateItemTotal(item), 0)
  }

  const calculateTax = () => {
    return calculateSubtotal() * 0.21 // 21% IVA España
  }

  const calculateServiceFee = () => {
    return calculateSubtotal() * 0.05 // 5% comisión de la plataforma
  }

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax() + calculateServiceFee()
  }

  if (items.length === 0) {
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
              <h1 className="text-2xl">Carrito de Compras</h1>
            </div>
          </div>
        </div>

        {/* Empty Cart */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Card className="text-center py-12">
            <CardContent>
              <ShoppingBag className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h2 className="text-xl mb-2">Tu carrito está vacío</h2>
              <p className="text-gray-600 mb-6">
                Explora nuestros servicios y añade algunos al carrito para comenzar
              </p>
              <Button onClick={onBack}>
                Buscar Servicios
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={onBack}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver
              </Button>
              <h1 className="text-2xl">Carrito de Compras</h1>
            </div>
            <Badge variant="secondary">
              {items.length} {items.length === 1 ? 'servicio' : 'servicios'}
            </Badge>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Servicios Seleccionados</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {items.map((item, index) => (
                  <div key={item.id}>
                    <div className="flex gap-4">
                      <ImageWithFallback
                        src={item.sitterImage}
                        alt={item.sitterName}
                        className="w-20 h-20 rounded-lg object-cover"
                      />
                      
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h3 className="font-medium">{item.service}</h3>
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <span>{item.sitterName}</span>
                              <div className="flex items-center">
                                <Star className="h-3 w-3 text-yellow-400 mr-1" />
                                <span>{item.sitterRating}</span>
                              </div>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeItem(item.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {item.date}
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            {item.startTime} - {item.endTime}
                          </div>
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            {item.location}
                          </div>
                          <div>
                            <span className="font-medium">{item.petType}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span className="text-sm">Cantidad:</span>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                disabled={item.quantity <= 1}
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="w-8 text-center">{item.quantity}</span>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                          
                          <div className="text-right">
                            <div className="text-sm text-gray-600">
                              {item.pricePerHour}€/hora × {item.duration}h × {item.quantity}
                            </div>
                            <div className="font-medium">
                              {calculateItemTotal(item).toFixed(2)}€
                            </div>
                          </div>
                        </div>

                        {item.specialRequests && (
                          <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                            <span className="text-sm font-medium">Instrucciones especiales:</span>
                            <p className="text-sm text-gray-600 mt-1">{item.specialRequests}</p>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {index < items.length - 1 && <Separator className="mt-6" />}
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Resumen del Pedido</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{calculateSubtotal().toFixed(2)}€</span>
                </div>
                
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Comisión de servicio (5%)</span>
                  <span>{calculateServiceFee().toFixed(2)}€</span>
                </div>
                
                <div className="flex justify-between text-sm text-gray-600">
                  <span>IVA (21%)</span>
                  <span>{calculateTax().toFixed(2)}€</span>
                </div>
                
                <Separator />
                
                <div className="flex justify-between text-lg font-medium">
                  <span>Total</span>
                  <span>{calculateTotal().toFixed(2)}€</span>
                </div>

                <Button 
                  className="w-full" 
                  size="lg"
                  onClick={() => onProceedToPayment(items, calculateTotal())}
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  Proceder al Pago
                </Button>
              </CardContent>
            </Card>

            {/* Security Info */}
            <Card>
              <CardContent className="p-4">
                <div className="text-center space-y-2">
                  <div className="flex items-center justify-center gap-2 text-green-600">
                    <div className="w-4 h-4 bg-green-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                    <span className="text-sm font-medium">Pago 100% Seguro</span>
                  </div>
                  <p className="text-xs text-gray-600">
                    Protegido por encriptación SSL y procesado por Stripe
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Guarantee */}
            <Card>
              <CardContent className="p-4">
                <h4 className="font-medium mb-2">Garantía PetCare</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Cuidadores verificados</li>
                  <li>• Seguro de responsabilidad civil</li>
                  <li>• Soporte 24/7</li>
                  <li>• Garantía de satisfacción</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}