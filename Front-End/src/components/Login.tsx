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
  onLogin: (userType: 'owner' | 'sitter' | 'admin', userData: any) => void
  onShowRegister: () => void
}

interface LoginForm {
  email: string
  password: string
}

export default function Login({ onBack, onLogin, onShowRegister }: LoginProps) {
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

  const handleGoogleLogin = async () => {
    setIsLoading(true)
    setError('')
    
    try {
      // Mock Google OAuth flow
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Simulate successful Google login - default to owner type for Google users
      const googleUserData = {
        id: Date.now(),
        name: 'Usuario Google',
        email: 'google@user.com',
        type: 'owner',
        verified: true,
        provider: 'google'
      }
      
      onLogin('owner', googleUserData)
    } catch (error) {
      setError('Error al conectar con Google')
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
            <Button variant="ghost" size="sm" onClick={onBack}>
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

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">O continúa con</span>
                  </div>
                </div>

                <Button 
                  variant="outline" 
                  className="w-full" 
                  onClick={handleGoogleLogin}
                  disabled={isLoading}
                >
                  <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  {isLoading ? 'Conectando...' : 'Continuar con Google'}
                </Button>

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