import { useState } from "react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Alert, AlertDescription } from "./ui/alert"
import { ImageWithFallback } from "./figma/ImageWithFallback"
import { 
  ArrowLeft, 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  AlertCircle,
  CheckCircle
} from "lucide-react"

interface LoginProps {
  onBack: () => void
  onGoBack: () => void
  onLogin: (userType: 'owner' | 'sitter' | 'admin', userData: any) => void
  onShowRegister: () => void
}

interface LoginForm {
  email: string
  password: string
}

export default function Login({ onBack, onGoBack, onLogin, onShowRegister }: LoginProps) {
  const [showPassword, setShowPassword] = useState(false)
  const [loginForm, setLoginForm] = useState<LoginForm>({
    email: '',
    password: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  // Mock user data for different types
  const mockUsers = {
    owner: {
      email: 'owner@petcare.es',
      password: '123456',
      userData: {
        id: 1,
        name: 'María García',
        email: 'owner@petcare.es',
        type: 'owner',
        pets: [
          { name: 'Luna', type: 'Perro', breed: 'Golden Retriever' },
          { name: 'Milo', type: 'Gato', breed: 'Siamés' }
        ],
        location: 'Madrid, España'
      }
    },
    sitter: {
      email: 'sitter@petcare.es',
      password: '123456',
      userData: {
        id: 2,
        name: 'Carlos Rodríguez',
        email: 'sitter@petcare.es',
        type: 'sitter',
        rating: 4.8,
        reviews: 142,
        services: ['Paseos', 'Cuidado en casa', 'Hospedaje'],
        location: 'Barcelona, España',
        verified: true
      }
    },
    admin: {
      email: 'admin@petcare.es',
      password: 'admin123',
      userData: {
        id: 3,
        name: 'Ana Martínez',
        email: 'admin@petcare.es',
        type: 'admin',
        role: 'Super Admin',
        permissions: ['users', 'services', 'payments', 'reports']
      }
    }
  }

  // Function to determine user type from email
  const getUserTypeFromEmail = (email: string): 'owner' | 'sitter' | 'admin' | null => {
    const userCredentials = [
      { email: 'owner@petcare.es', type: 'owner' as const },
      { email: 'sitter@petcare.es', type: 'sitter' as const },
      { email: 'admin@petcare.es', type: 'admin' as const }
    ]
    
    const user = userCredentials.find(user => user.email === email)
    return user ? user.type : null
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Determine user type from email
    const userType = getUserTypeFromEmail(loginForm.email)
    
    if (!userType) {
      setError('Email no registrado en el sistema')
      setIsLoading(false)
      return
    }

    const mockUser = mockUsers[userType]
    
    if (loginForm.email === mockUser.email && loginForm.password === mockUser.password) {
      onLogin(userType, mockUser.userData)
    } else {
      setError('Email o contraseña incorrectos')
    }
    
    setIsLoading(false)
  }

  const handleInputChange = (field: keyof LoginForm, value: string) => {
    setLoginForm(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="sm" onClick={onGoBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Image and Info */}
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl mb-4">Inicia Sesión en PetCare</h1>
              <p className="text-lg text-gray-600 mb-6">
                Accede a tu cuenta y continúa brindando el mejor cuidado para las mascotas
              </p>
            </div>

            <ImageWithFallback
              src="https://images.unsplash.com/photo-1638732953935-22b80ccdb281?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXQlMjBjYXJlJTIwbG9naW4lMjBzZWN1cml0eXxlbnwxfHx8fDE3NTY0NDA1NjN8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
              alt="Login seguro"
              className="w-full h-64 md:h-80 object-cover rounded-lg shadow-lg"
            />

            <div className="grid gap-4">
              <h3 className="text-lg">¿Por qué elegir PetCare?</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-gray-700">Plataforma 100% segura y verificada</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-gray-700">Miles de usuarios satisfechos</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-gray-700">Soporte 24/7 disponible</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className="space-y-6">
            {/* Login Form */}
            <Card>
              <CardHeader>
                <CardTitle>Iniciar Sesión en PetCare</CardTitle>
                <p className="text-gray-600 text-sm">
                  Ingresa tus credenciales para acceder a tu cuenta
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                {error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className="text-sm mb-2 block">Email</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        type="email"
                        placeholder="tu@email.com"
                        value={loginForm.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-sm mb-2 block">Contraseña</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        type={showPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={loginForm.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        className="pl-10 pr-10"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                  </Button>
                </form>

                <div className="text-center space-y-2">
                  <button 
                    type="button"
                    className="text-sm text-primary hover:underline"
                  >
                    ¿Olvidaste tu contraseña?
                  </button>
                  <div className="text-sm text-gray-600">
                    ¿No tienes una cuenta?{' '}
                    <button 
                      type="button"
                      onClick={onShowRegister}
                      className="text-primary hover:underline"
                    >
                      Regístrate aquí
                    </button>
                  </div>
                </div>

                {/* Demo Credentials */}
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <h4 className="text-sm mb-2">Credenciales de prueba:</h4>
                  <div className="text-xs space-y-1 text-gray-600">
                    <div><strong>Dueño:</strong> owner@petcare.es / 123456</div>
                    <div><strong>Cuidador:</strong> sitter@petcare.es / 123456</div>
                    <div><strong>Admin:</strong> admin@petcare.es / admin123</div>
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