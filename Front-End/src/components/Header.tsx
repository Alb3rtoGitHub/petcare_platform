import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { Heart, MapPin, User, Bell, Menu, ShoppingCart, Calendar } from "lucide-react"
import { useState } from "react"

interface HeaderProps {
  userType: 'owner' | 'sitter' | 'admin' | null
  userData?: any
  isAuthenticated: boolean
  onUserTypeChange: (type: 'owner' | 'sitter' | 'admin' | null) => void
  onSearchSitters?: () => void
  onViewServices?: () => void
  onViewHowItWorks?: () => void
  onViewHelp?: () => void
  onShowLogin?: () => void
  onShowRegister?: () => void
  onLogout?: () => void
  onViewCart?: () => void
  onViewBookings?: () => void
  onGoToDashboard?: () => void
  cartItemsCount?: number
}

export default function Header({ userType, userData, isAuthenticated, onUserTypeChange, onSearchSitters, onViewServices, onViewHowItWorks, onViewHelp, onShowLogin, onShowRegister, onLogout, onViewCart, onViewBookings, onGoToDashboard, cartItemsCount = 0 }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleLogoClick = () => {
    // Para admin y sitter autenticados, ir al dashboard
    if (isAuthenticated && (userType === 'admin' || userType === 'sitter')) {
      if (onGoToDashboard) {
        onGoToDashboard()
      }
    } else {
      // Para owners y usuarios no autenticados, flujo normal (logout/landing)
      if (onLogout) {
        onLogout()
      } else {
        onUserTypeChange(null)
      }
    }
  }

  return (
    <header className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div 
              className="flex items-center space-x-2 cursor-pointer" 
              onClick={handleLogoClick}
            >
              <Heart className="h-8 w-8 text-primary" />
              <span className="text-xl font-semibold text-gray-900">PetCare</span>
            </div>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            {/* Buscar Cuidadores - Solo para owners y usuarios no autenticados */}
            {(!isAuthenticated || userType === 'owner') && (
              <button 
                onClick={onSearchSitters}
                className="text-gray-600 hover:text-gray-900"
              >
                Buscar Cuidadores
              </button>
            )}
            {/* Servicios - Solo para owners y usuarios no autenticados */}
            {(!isAuthenticated || userType === 'owner') && (
              <button 
                onClick={onViewServices}
                className="text-gray-600 hover:text-gray-900"
              >
                Servicios
              </button>
            )}
            {/* Cómo Funciona - Solo para owners y usuarios no autenticados */}
            {(!isAuthenticated || userType === 'owner') && (
              <button 
                onClick={onViewHowItWorks}
                className="text-gray-600 hover:text-gray-900"
              >
                Cómo Funciona
              </button>
            )}
            {/* Ayuda - Disponible para todos */}
            <button 
              onClick={onViewHelp}
              className="text-gray-600 hover:text-gray-900"
            >
              Ayuda
            </button>
          </nav>

          <div className="flex items-center space-x-4">
            {isAuthenticated && userType ? (
              <>
                {userType === 'owner' && (
                  <>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="relative"
                      onClick={onViewCart}
                    >
                      <ShoppingCart className="h-4 w-4" />
                      {cartItemsCount > 0 && (
                        <Badge 
                          variant="destructive" 
                          className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs"
                        >
                          {cartItemsCount}
                        </Badge>
                      )}
                      <span className="hidden md:inline ml-2">Carrito</span>
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={onViewBookings}
                    >
                      <Calendar className="h-4 w-4" />
                      <span className="hidden md:inline ml-2">Reservas</span>
                    </Button>
                  </>
                )}
                {userType === 'sitter' && (
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={onViewBookings}
                  >
                    <Calendar className="h-4 w-4" />
                    <span className="hidden md:inline ml-2">Mis Trabajos</span>
                  </Button>
                )}
                <Button variant="ghost" size="sm">
                  <Bell className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={onGoToDashboard}>
                  <User className="h-4 w-4" />
                  <span className="hidden md:inline ml-2">{userData?.name}</span>
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={onLogout}
                >
                  Cerrar Sesión
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="md:hidden"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                  <Menu className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <>
                <div className="hidden md:flex space-x-2">
                  <Button 
                    variant="ghost" 
                    onClick={onShowLogin}
                  >
                    Iniciar Sesión
                  </Button>
                  <Button 
                    variant="default" 
                    onClick={onShowRegister}
                  >
                    Quiero registrarme
                  </Button>
                  {/* <Button 
                    variant="ghost" 
                    onClick={() => onUserTypeChange('owner')}
                  >
                    Soy Dueño
                  </Button>
                  <Button 
                    variant="ghost" 
                    onClick={() => onUserTypeChange('sitter')}
                  >
                    Soy Cuidador
                  </Button>
                  <Button 
                    onClick={() => onUserTypeChange('admin')}
                  >
                    Administrador
                  </Button>*/}
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="md:hidden"
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                >
                  <Menu className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
        </div>

        {(isMenuOpen && !isAuthenticated) && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col space-y-2">
              <Button 
                variant="ghost" 
                className="justify-start"
                onClick={() => {
                  if (onSearchSitters) onSearchSitters()
                  setIsMenuOpen(false)
                }}
              >
                Buscar Cuidadores
              </Button>
              <Button 
                variant="ghost" 
                className="justify-start"
                onClick={() => {
                  if (onViewServices) onViewServices()
                  setIsMenuOpen(false)
                }}
              >
                Servicios
              </Button>
              <Button 
                variant="ghost" 
                className="justify-start"
                onClick={() => {
                  if (onViewHowItWorks) onViewHowItWorks()
                  setIsMenuOpen(false)
                }}
              >
                Cómo Funciona
              </Button>
              <Button 
                variant="ghost" 
                className="justify-start"
                onClick={() => {
                  if (onViewHelp) onViewHelp()
                  setIsMenuOpen(false)
                }}
              >
                Ayuda
              </Button>
              <Button 
                variant="ghost" 
                className="justify-start"
                onClick={() => {
                  if (onShowLogin) onShowLogin()
                  setIsMenuOpen(false)
                }}
              >
                Iniciar Sesión
              </Button>
              <Button 
                variant="default" 
                className="justify-start"
                onClick={() => {
                  if (onShowRegister) onShowRegister()
                  setIsMenuOpen(false)
                }}
              >
                Quiero registrarme
              </Button>
              <Button 
                variant="ghost" 
                onClick={() => {
                  onUserTypeChange('owner')
                  setIsMenuOpen(false)
                }}
              >
                Soy Dueño
              </Button>
              <Button 
                variant="ghost" 
                onClick={() => {
                  onUserTypeChange('sitter')
                  setIsMenuOpen(false)
                }}
              >
                Soy Cuidador
              </Button>
              <Button 
                onClick={() => {
                  onUserTypeChange('admin')
                  setIsMenuOpen(false)
                }}
              >
                Administrador
              </Button>
            </div>
          </div>
        )}

        {/* Menú móvil para usuarios autenticados */}
        {isMenuOpen && isAuthenticated && (
          <div className="md:hidden py-4 border-t">
            <div className="flex flex-col space-y-2">
              {/* Opciones específicas para owners */}
              {userType === 'owner' && (
                <>
                  <Button 
                    variant="ghost" 
                    className="justify-start"
                    onClick={() => {
                      if (onSearchSitters) onSearchSitters()
                      setIsMenuOpen(false)
                    }}
                  >
                    Buscar Cuidadores
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="justify-start"
                    onClick={() => {
                      if (onViewServices) onViewServices()
                      setIsMenuOpen(false)
                    }}
                  >
                    Servicios
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="justify-start"
                    onClick={() => {
                      if (onViewCart) onViewCart()
                      setIsMenuOpen(false)
                    }}
                  >
                    Carrito ({cartItemsCount})
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="justify-start"
                    onClick={() => {
                      if (onViewBookings) onViewBookings()
                      setIsMenuOpen(false)
                    }}
                  >
                    Mis Reservas
                  </Button>
                </>
              )}
              
              {/* Opciones específicas para sitters */}
              {userType === 'sitter' && (
                <Button 
                  variant="ghost" 
                  className="justify-start"
                  onClick={() => {
                    if (onViewBookings) onViewBookings()
                    setIsMenuOpen(false)
                  }}
                >
                  Mis Trabajos
                </Button>
              )}
              
              {/* Opciones disponibles para todos los usuarios autenticados */}
              {userType === 'owner' && (
                <Button 
                  variant="ghost" 
                  className="justify-start"
                  onClick={() => {
                    if (onViewHowItWorks) onViewHowItWorks()
                    setIsMenuOpen(false)
                  }}
                >
                  Cómo Funciona
                </Button>
              )}
              <Button 
                variant="ghost" 
                className="justify-start"
                onClick={() => {
                  if (onViewHelp) onViewHelp()
                  setIsMenuOpen(false)
                }}
              >
                Ayuda
              </Button>
              <Button 
                variant="ghost" 
                className="justify-start"
                onClick={() => {
                  if (onGoToDashboard) onGoToDashboard()
                  setIsMenuOpen(false)
                }}
              >
                Dashboard
              </Button>
              <Button 
                variant="outline" 
                className="justify-start"
                onClick={() => {
                  if (onLogout) onLogout()
                  setIsMenuOpen(false)
                }}
              >
                Cerrar Sesión
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}