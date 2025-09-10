import { useState } from "react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import { Separator } from "./ui/separator"
import { RadioGroup, RadioGroupItem } from "./ui/radio-group"
import { Label } from "./ui/label"
import { Checkbox } from "./ui/checkbox"
import { Alert, AlertDescription } from "./ui/alert"
import { 
  ArrowLeft, 
  CreditCard, 
  Shield, 
  Lock,
  CheckCircle,
  AlertCircle,
  Smartphone,
  Banknote
} from "lucide-react"

interface CartItem {
  id: string
  sitterId: string
  sitterName: string
  service: string
  date: string
  startTime: string
  endTime: string
  duration: number
  pricePerHour: number
  location: string
  petType: string
  quantity: number
}

interface PaymentGatewayProps {
  onBack: () => void
  onPaymentSuccess: (paymentData: any) => void
  cartItems: CartItem[]
  totalAmount: number
}

interface PaymentForm {
  paymentMethod: 'card' | 'paypal' | 'bizum'
  cardNumber: string
  expiryDate: string
  cvv: string
  cardholderName: string
  email: string
  phone: string
  billingAddress: {
    street: string
    city: string
    postalCode: string
    country: string
  }
  acceptTerms: boolean
  acceptMarketing: boolean
}

export default function PaymentGateway({ onBack, onPaymentSuccess, cartItems, totalAmount }: PaymentGatewayProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState('')
  const [currentStep, setCurrentStep] = useState<'payment' | 'processing' | 'success'>('payment')
  
  const [paymentForm, setPaymentForm] = useState<PaymentForm>({
    paymentMethod: 'card',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    email: '',
    phone: '',
    billingAddress: {
      street: '',
      city: '',
      postalCode: '',
      country: 'España'
    },
    acceptTerms: false,
    acceptMarketing: false
  })

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    const matches = v.match(/\d{4,16}/g)
    const match = matches && matches[0] || ''
    const parts = []
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }
    if (parts.length) {
      return parts.join(' ')
    } else {
      return v
    }
  }

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
    if (v.length >= 2) {
      return v.substring(0, 2) + '/' + v.substring(2, 4)
    }
    return v
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.')
      setPaymentForm(prev => ({
        ...prev,
        [parent]: {
          ...(prev as any)[parent],
          [child]: value
        }
      }))
    } else {
      setPaymentForm(prev => ({
        ...prev,
        [field]: value
      }))
    }
  }

  const validateForm = () => {
    if (!paymentForm.acceptTerms) {
      setError('Debes aceptar los términos y condiciones')
      return false
    }

    if (paymentForm.paymentMethod === 'card') {
      if (!paymentForm.cardNumber || paymentForm.cardNumber.length < 16) {
        setError('Número de tarjeta inválido')
        return false
      }
      if (!paymentForm.expiryDate || paymentForm.expiryDate.length < 5) {
        setError('Fecha de expiración inválida')
        return false
      }
      if (!paymentForm.cvv || paymentForm.cvv.length < 3) {
        setError('CVV inválido')
        return false
      }
      if (!paymentForm.cardholderName) {
        setError('Nombre del titular requerido')
        return false
      }
    }

    if (!paymentForm.email) {
      setError('Email requerido')
      return false
    }

    return true
  }

  const processPayment = async () => {
    if (!validateForm()) return

    setIsProcessing(true)
    setError('')
    setCurrentStep('processing')

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 3000))

      // Mock payment success
      const paymentData = {
        transactionId: `TXN_${Date.now()}`,
        paymentMethod: paymentForm.paymentMethod,
        amount: totalAmount,
        currency: 'EUR',
        status: 'completed',
        timestamp: new Date().toISOString(),
        cartItems: cartItems,
        billingInfo: {
          email: paymentForm.email,
          phone: paymentForm.phone,
          address: paymentForm.billingAddress
        }
      }

      setCurrentStep('success')
      setTimeout(() => {
        onPaymentSuccess(paymentData)
      }, 2000)

    } catch (error) {
      setError('Error al procesar el pago. Inténtalo de nuevo.')
      setCurrentStep('payment')
    } finally {
      setIsProcessing(false)
    }
  }

  if (currentStep === 'processing') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
            <h2 className="text-xl mb-2">Procesando Pago</h2>
            <p className="text-gray-600">
              Estamos procesando tu pago de forma segura. No cierres esta ventana.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (currentStep === 'success') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-xl mb-2">¡Pago Exitoso!</h2>
            <p className="text-gray-600 mb-4">
              Tu reserva ha sido confirmada. Recibirás un email con los detalles.
            </p>
            <Badge variant="secondary" className="mb-4">
              Total pagado: {totalAmount.toFixed(2)}€
            </Badge>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver al Carrito
            </Button>
            <h1 className="text-2xl">Pago Seguro</h1>
            <Badge variant="secondary">
              <Lock className="h-3 w-3 mr-1" />
              SSL Seguro
            </Badge>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Payment Form */}
          <div className="space-y-6">
            {/* Payment Method Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Método de Pago</CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup 
                  value={paymentForm.paymentMethod} 
                  onValueChange={(value) => handleInputChange('paymentMethod', value)}
                >
                  <div className="flex items-center space-x-2 p-4 border rounded-lg">
                    <RadioGroupItem value="card" id="card" />
                    <Label htmlFor="card" className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4" />
                      Tarjeta de Crédito/Débito
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-4 border rounded-lg">
                    <RadioGroupItem value="paypal" id="paypal" />
                    <Label htmlFor="paypal" className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-blue-600 rounded"></div>
                      PayPal
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2 p-4 border rounded-lg">
                    <RadioGroupItem value="bizum" id="bizum" />
                    <Label htmlFor="bizum" className="flex items-center gap-2">
                      <Smartphone className="h-4 w-4" />
                      Bizum
                    </Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Card Details */}
            {paymentForm.paymentMethod === 'card' && (
              <Card>
                <CardHeader>
                  <CardTitle>Detalles de la Tarjeta</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Número de Tarjeta</Label>
                    <Input
                      placeholder="1234 5678 9012 3456"
                      value={paymentForm.cardNumber}
                      onChange={(e) => handleInputChange('cardNumber', formatCardNumber(e.target.value))}
                      maxLength={19}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Fecha de Expiración</Label>
                      <Input
                        placeholder="MM/AA"
                        value={paymentForm.expiryDate}
                        onChange={(e) => handleInputChange('expiryDate', formatExpiryDate(e.target.value))}
                        maxLength={5}
                      />
                    </div>
                    <div>
                      <Label>CVV</Label>
                      <Input
                        placeholder="123"
                        value={paymentForm.cvv}
                        onChange={(e) => handleInputChange('cvv', e.target.value.replace(/\D/g, ''))}
                        maxLength={4}
                        type="password"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label>Nombre del Titular</Label>
                    <Input
                      placeholder="Como aparece en la tarjeta"
                      value={paymentForm.cardholderName}
                      onChange={(e) => handleInputChange('cardholderName', e.target.value)}
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>Información de Contacto</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Email</Label>
                  <Input
                    type="email"
                    placeholder="tu@email.com"
                    value={paymentForm.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                  />
                </div>
                <div>
                  <Label>Teléfono</Label>
                  <Input
                    placeholder="+34 600 000 000"
                    value={paymentForm.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Billing Address */}
            <Card>
              <CardHeader>
                <CardTitle>Dirección de Facturación</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Dirección</Label>
                  <Input
                    placeholder="Calle, número, piso..."
                    value={paymentForm.billingAddress.street}
                    onChange={(e) => handleInputChange('billingAddress.street', e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Ciudad</Label>
                    <Input
                      placeholder="Madrid"
                      value={paymentForm.billingAddress.city}
                      onChange={(e) => handleInputChange('billingAddress.city', e.target.value)}
                    />
                  </div>
                  <div>
                    <Label>Código Postal</Label>
                    <Input
                      placeholder="28001"
                      value={paymentForm.billingAddress.postalCode}
                      onChange={(e) => handleInputChange('billingAddress.postalCode', e.target.value)}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Terms and Conditions */}
            <Card>
              <CardContent className="p-4 space-y-4">
                <div className="flex items-start space-x-2">
                  <Checkbox 
                    id="terms"
                    checked={paymentForm.acceptTerms}
                    onCheckedChange={(checked) => handleInputChange('acceptTerms', checked)}
                  />
                  <Label htmlFor="terms" className="text-sm">
                    Acepto los <a href="#" className="text-primary underline">términos y condiciones</a> y la 
                    <a href="#" className="text-primary underline"> política de privacidad</a>
                  </Label>
                </div>
                
                <div className="flex items-start space-x-2">
                  <Checkbox 
                    id="marketing"
                    checked={paymentForm.acceptMarketing}
                    onCheckedChange={(checked) => handleInputChange('acceptMarketing', checked)}
                  />
                  <Label htmlFor="marketing" className="text-sm">
                    Acepto recibir ofertas y promociones por email (opcional)
                  </Label>
                </div>
              </CardContent>
            </Card>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Resumen del Pedido</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Cart Items Summary */}
                <div className="space-y-3">
                  {cartItems.map((item, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <div>
                        <div className="font-medium">{item.service}</div>
                        <div className="text-gray-600">
                          {item.sitterName} • {item.date} • {item.duration}h × {item.quantity}
                        </div>
                      </div>
                      <div className="font-medium">
                        {(item.pricePerHour * item.duration * item.quantity).toFixed(2)}€
                      </div>
                    </div>
                  ))}
                </div>

                <Separator />
                
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{(totalAmount / 1.26).toFixed(2)}€</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Comisión de servicio</span>
                    <span>{(totalAmount * 0.05 / 1.26).toFixed(2)}€</span>
                  </div>
                  <div className="flex justify-between">
                    <span>IVA (21%)</span>
                    <span>{(totalAmount * 0.21 / 1.26).toFixed(2)}€</span>
                  </div>
                </div>
                
                <Separator />
                
                <div className="flex justify-between text-lg font-medium">
                  <span>Total</span>
                  <span>{totalAmount.toFixed(2)}€</span>
                </div>

                <Button 
                  className="w-full" 
                  size="lg"
                  onClick={processPayment}
                  disabled={isProcessing || !paymentForm.acceptTerms}
                >
                  <Shield className="h-4 w-4 mr-2" />
                  {isProcessing ? 'Procesando...' : `Pagar ${totalAmount.toFixed(2)}€`}
                </Button>

                <div className="text-center space-y-2">
                  <div className="flex items-center justify-center gap-2 text-green-600 text-sm">
                    <Shield className="h-4 w-4" />
                    <span>Pago 100% seguro</span>
                  </div>
                  <p className="text-xs text-gray-600">
                    Protegido por encriptación SSL 256-bit
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Security Features */}
            <Card>
              <CardContent className="p-4">
                <h4 className="font-medium mb-3">Seguridad del Pago</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Encriptación SSL de 256 bits</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Procesado por Stripe</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Protección antifraude</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Garantía de devolución</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}