import { useState } from "react"
import Header from "./components/Header"
import LandingPage from "./components/LandingPage"
import OwnerDashboard from "./components/OwnerDashboard"
import SitterDashboard from "./components/SitterDashboard"
import AdminDashboard from "./components/AdminDashboard"
import SearchSitters from "./components/SearchSitters"
import ServicesView from "./components/ServicesView"
import HowItWorks from "./components/HowItWorks"
import Help from "./components/Help"
import Login from "./components/Login"
import Register from "./components/Register"
import EmailVerification from "./components/EmailVerification"
import ShoppingCart from "./components/ShoppingCart"
import PaymentGateway from "./components/PaymentGateway"
import BookingManager from "./components/BookingManager"
import BookingCalendar from "./components/BookingCalendar"
import EnhancedBookingCalendar from "./components/EnhancedBookingCalendar"
import SitterProfileForm from "./components/SitterProfileForm"
import OwnerPetsForm from "./components/OwnerPetsForm"
import SitterRegistrationSuccess from "./components/SitterRegistrationSuccess"

type UserType = 'owner' | 'sitter' | 'admin' | null
type CurrentView = 'landing' | 'search' | 'dashboard' | 'services' | 'how-it-works' | 'help' | 'login' | 'register' | 'email-verification' | 'cart' | 'payment' | 'bookings' | 'calendar' | 'sitter-profile' | 'owner-pets' | 'sitter-registration-success'

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

export default function App() {
  const [userType, setUserType] = useState<UserType>(null)
  const [currentView, setCurrentView] = useState<CurrentView>('landing')
  const [userData, setUserData] = useState<any>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [selectedUserTypeForLogin, setSelectedUserTypeForLogin] = useState<'owner' | 'sitter' | 'admin' | null>(null)
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [cartTotal, setCartTotal] = useState(0)
  const [selectedService, setSelectedService] = useState<any>(null)
  const [pendingUserEmail, setPendingUserEmail] = useState<string>("")
  const [previousView, setPreviousView] = useState<CurrentView | null>(null) // Nueva variable para recordar la vista anterior
  const [navigationHistory, setNavigationHistory] = useState<CurrentView[]>(['landing']) // Historial completo de navegación

  // Función universal para navegar con historial
  const navigateToView = (newView: CurrentView, updateHistory: boolean = true) => {
    if (updateHistory && currentView !== newView) {
      setNavigationHistory(prev => [...prev, currentView])
    }
    setCurrentView(newView)
  }

  // Función universal para volver atrás
  const handleGoBack = () => {
    if (navigationHistory.length > 0) {
      const lastView = navigationHistory[navigationHistory.length - 1]
      setNavigationHistory(prev => prev.slice(0, -1))
      setCurrentView(lastView)
    } else {
      // Si no hay historial, ir a landing por defecto
      setCurrentView('landing')
    }
  }

  const handleUserTypeChange = (type: UserType) => {
    if (type && !isAuthenticated) {
      // Save the selected user type and redirect to login
      setSelectedUserTypeForLogin(type)
      setCurrentView('login')
    } else if (type && isAuthenticated) {
      // If already authenticated, go directly to dashboard
      setUserType(type)
      setCurrentView('dashboard')
    } else {
      // If type is null, logout or go to landing
      setUserType(null)
      setSelectedUserTypeForLogin(null)
      setCurrentView('landing')
    }
  }

  const handleLogin = (type: 'owner' | 'sitter' | 'admin', userData: any) => {
    // Agregar mascotas de ejemplo para testing
    if (type === 'owner' && (!userData.pets || userData.pets.length === 0)) {
      userData.pets = [
        { 
          id: '1', 
          name: 'Max', 
          type: 'Perro', 
          breed: 'Golden Retriever', 
          age: '3 años',
          image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=100&h=100&fit=crop&crop=face'
        },
        { 
          id: '2', 
          name: 'Luna', 
          type: 'Gato', 
          breed: 'Siamés', 
          age: '2 años',
          image: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=100&h=100&fit=crop&crop=face'
        }
      ]
    }

    // Agregar datos de identificación de ejemplo para testing si no existen
    if (!userData.identificationType) {
      userData.identificationType = type === 'owner' ? 'cedula_ciudadania' : 'pasaporte'
      userData.identificationNumber = type === 'owner' ? '12345678X' : 'AA123456'
    }

    // Asegurar que todas las mascotas existentes tengan IDs únicos
    if (type === 'owner' && userData.pets && userData.pets.length > 0) {
      userData.pets = userData.pets.map((pet: any, index: number) => ({
        ...pet,
        id: pet.id || `pet-${Date.now()}-${index}`, // Asignar ID si no existe
        age: pet.age || '1 año', // Asegurar que tenga edad
        image: pet.image || 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=100&h=100&fit=crop&crop=face' // Imagen por defecto
      }))
    }

    setUserType(type)
    setUserData(userData)
    setIsAuthenticated(true)
    setSelectedUserTypeForLogin(null) // Clear the selected type after successful login
    
    // Ir a la vista anterior si existe, sino ir al dashboard
    if (previousView && previousView !== 'login' && previousView !== 'register') {
      setCurrentView(previousView)
      setPreviousView(null) // Limpiar la vista anterior después de usarla
    } else {
      setCurrentView('dashboard')
    }
  }

  const handleLogout = () => {
    setUserType(null)
    setUserData(null)
    setIsAuthenticated(false)
    setSelectedUserTypeForLogin(null)
    setPreviousView(null) // Limpiar la vista anterior al hacer logout
    setCurrentView('landing')
  }

  const handleRegister = (type: 'owner' | 'sitter', userData: any) => {
    // Asegurar que todas las mascotas del registro tengan IDs únicos
    if (type === 'owner' && userData.pets && userData.pets.length > 0) {
      userData.pets = userData.pets.map((pet: any, index: number) => ({
        ...pet,
        id: pet.id || `pet-${Date.now()}-${index}`, // Asignar ID si no existe
        age: pet.age || '1 año', // Asegurar que tenga edad
        image: pet.image || 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=100&h=100&fit=crop&crop=face' // Imagen por defecto
      }))
    }

    // After successful registration, automatically log in the user
    setUserType(type)
    setUserData(userData)
    setIsAuthenticated(true)
    setSelectedUserTypeForLogin(null) // Clear the selected type after successful registration
    setCurrentView('dashboard')
  }

  const handleSearchSitters = () => {
    navigateToView('search')
  }

  const handleViewServices = () => {
    navigateToView('services')
  }

  const handleViewHowItWorks = () => {
    navigateToView('how-it-works')
  }

  const handleViewHelp = () => {
    navigateToView('help')
  }

  const handleShowLogin = () => {
    setSelectedUserTypeForLogin(null) // Clear any pre-selected type when manually going to login
    navigateToView('login')
  }

  const handleShowRegister = () => {
    navigateToView('register')
  }

  // Nueva función para manejar login requerido desde otras vistas
  const handleLoginRequired = () => {
    setPreviousView(currentView) // Guardar la vista actual antes de ir a login
    setSelectedUserTypeForLogin(null)
    navigateToView('login')
  }

  const handleBackToLanding = () => {
    setNavigationHistory(['landing']) // Reset navigation history
    setCurrentView('landing')
    setSelectedUserTypeForLogin(null) // Clear selected type when going back to landing
    setPreviousView(null) // Limpiar la vista anterior cuando se va a landing
  }

  const handleViewCart = () => {
    navigateToView('cart')
  }

  const handleViewBookings = () => {
    navigateToView('bookings')
  }

  const handleGoToDashboard = () => {
    if (isAuthenticated) {
      navigateToView('dashboard')
    }
  }

  const handleEmailVerification = (email: string) => {
    setPendingUserEmail(email)
    navigateToView('email-verification')
  }

  const handleResendEmail = () => {
    // Aquí se puede implementar la lógica para reenviar el email
    console.log('Reenviando email de verificación a:', pendingUserEmail)
  }

  const handleAddToCart = (item: CartItem) => {
    setCartItems(prev => {
      const existingItem = prev.find(cartItem => cartItem.id === item.id)
      if (existingItem) {
        return prev.map(cartItem => 
          cartItem.id === item.id 
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        )
      }
      return [...prev, { ...item, quantity: 1 }]
    })
  }

  const handleBookService = (service: any) => {
    // Si es un objeto con cartItem y bookingData, ir directo a pago
    if (service.cartItem && service.bookingData) {
      setCartItems([service.cartItem])
      setCartTotal(service.bookingData.price)
      setCurrentView('payment')
      return
    }
    
    // Flujo original para calendario
    setSelectedService(service)
    setCurrentView('calendar')
  }

  const handleBackToServices = () => {
    setSelectedService(null)
    setCurrentView('services')
  }

  const handleUpdateCart = (items: CartItem[]) => {
    setCartItems(items)
  }

  const handleProceedToPayment = (items: CartItem[], total: number) => {
    setCartItems(items)
    setCartTotal(total)
    setCurrentView('payment')
  }

  const handlePaymentSuccess = (paymentData: any) => {
    // Clear cart after successful payment
    setCartItems([])
    setCartTotal(0)
    // Redirect to bookings to show the new reservation
    setCurrentView('bookings')
    // You could also show a success message or redirect to a confirmation page
  }

  const handleNavigateToSitterProfile = () => {
    navigateToView('sitter-profile')
  }

  const handleNavigateToOwnerPets = () => {
    navigateToView('owner-pets')
  }

  const handleSitterProfileComplete = (data: any) => {
    console.log('Perfil de cuidador completado:', data)
    // Registrar al usuario como cuidador
    setUserType('sitter')
    setUserData({ ...data, userType: 'sitter' })
    setIsAuthenticated(true)
    // Navegar a la vista de confirmación de registro exitoso
    navigateToView('sitter-registration-success')
  }

  const handleOwnerPetsComplete = (data: any) => {
    console.log('Registro de mascotas completado:', data)
    // Aquí puedes hacer el registro real del dueño
    setCurrentView('dashboard')
  }

  const renderContent = () => {
    if (currentView === 'search') {
      return (
        <SearchSitters 
          onBack={handleGoBack} 
          onBookService={handleBookService}
          isAuthenticated={isAuthenticated}
          userPets={userData?.pets || []}
          onLoginRequired={handleLoginRequired}
        />
      )
    }

    if (currentView === 'services') {
      return (
        <ServicesView 
          onBack={handleGoBack} 
          onBookService={handleBookService}
          isAuthenticated={isAuthenticated}
          userPets={userData?.pets || []}
          onLoginRequired={handleLoginRequired}
          onSearchSitters={handleSearchSitters}
          onViewServices={handleViewServices}
          onShowLogin={handleShowLogin}
          onShowRegister={handleShowRegister}
        />
      )
    }

    if (currentView === 'calendar' && selectedService) {
      // Obtener mascotas del usuario si está autenticado
      const userPets = userData?.pets || [
        { id: '1', name: 'Max', type: 'Perro', breed: 'Golden Retriever', age: '3 años' },
        { id: '2', name: 'Luna', type: 'Gato', breed: 'Siamés', age: '2 años' }
      ]
      
      return (
        <EnhancedBookingCalendar 
          service={selectedService}
          onBack={handleGoBack}
          onAddToCart={handleAddToCart}
          onGoToCart={handleViewCart}
          userPets={userPets}
        />
      )
    }

    if (currentView === 'how-it-works') {
      return (
        <HowItWorks 
          onBack={handleGoBack} 
          isAuthenticated={isAuthenticated}
          userType={userType}
          onShowLogin={handleShowLogin}
          onShowRegister={handleShowRegister}
          onSearchSitters={handleSearchSitters}
          onViewServices={handleViewServices}
        />
      )
    }

    if (currentView === 'help') {
      return <Help onBack={handleGoBack} />
    }

    if (currentView === 'email-verification') {
      return (
        <EmailVerification 
          onBack={handleGoBack}
          onResendEmail={handleResendEmail}
          userEmail={pendingUserEmail}
          onNavigateToSitterProfile={handleNavigateToSitterProfile}
          onNavigateToOwnerPets={handleNavigateToOwnerPets}
        />
      )
    }

    if (currentView === 'sitter-profile') {
      return (
        <SitterProfileForm 
          onBack={handleGoBack}
          onComplete={handleSitterProfileComplete}
        />
      )
    }

    if (currentView === 'owner-pets') {
      return (
        <OwnerPetsForm 
          onBack={handleGoBack}
          onComplete={handleOwnerPetsComplete}
        />
      )
    }

    if (currentView === 'cart') {
      return (
        <ShoppingCart 
          onBack={handleGoBack}
          onProceedToPayment={handleProceedToPayment}
          cartItems={cartItems}
          onUpdateCart={handleUpdateCart}
          onSearchSitters={handleSearchSitters}
        />
      )
    }

    if (currentView === 'payment') {
      return (
        <PaymentGateway 
          onBack={handleGoBack}
          onPaymentSuccess={handlePaymentSuccess}
          cartItems={cartItems}
          totalAmount={cartTotal}
        />
      )
    }

    if (currentView === 'bookings' && isAuthenticated) {
      return <BookingManager onBack={handleGoBack} userData={userData} />
    }

    if (currentView === 'login') {
      return (
        <Login 
          onBack={handleBackToLanding} 
          onGoBack={handleGoBack}
          onLogin={handleLogin}
          onShowRegister={handleShowRegister}
        />
      )
    }

    if (currentView === 'register') {
      return (
        <Register 
          onBack={handleGoBack} 
          onRegister={handleRegister}
          onShowLogin={handleShowLogin}
          onEmailVerification={handleEmailVerification}
        />
      )
    }

    if (currentView === 'dashboard' && isAuthenticated) {
      switch (userType) {
        case 'owner':
          return <OwnerDashboard 
            userData={userData} 
            onViewBookings={handleViewBookings} 
            onViewCart={handleViewCart} 
            onSearchSitters={handleSearchSitters}
            onProceedToPayment={handleProceedToPayment}
            onBookService={handleBookService}
          />
        case 'sitter':
          return <SitterDashboard userData={userData} onViewBookings={handleViewBookings} />
        case 'admin':
          return <AdminDashboard userData={userData} />
        default:
          return <LandingPage onUserTypeChange={handleUserTypeChange} onSearchSitters={handleSearchSitters} onViewServices={handleViewServices} onViewHowItWorks={handleViewHowItWorks} onShowLogin={handleShowLogin} onShowRegister={handleShowRegister} />
      }
    }

    if (currentView === 'sitter-registration-success') {
      return (
        <SitterRegistrationSuccess
          onGoToDashboard={handleGoToDashboard}
          onGoToLanding={handleBackToLanding}
        />
      )
    }

    return <LandingPage onUserTypeChange={handleUserTypeChange} onSearchSitters={handleSearchSitters} onViewServices={handleViewServices} onViewHowItWorks={handleViewHowItWorks} onShowLogin={handleShowLogin} onShowRegister={handleShowRegister} />
  }

  return (
    <div className="min-h-screen bg-background">
      <Header 
        userType={userType} 
        userData={userData}
        isAuthenticated={isAuthenticated}
        onUserTypeChange={handleUserTypeChange} 
        onSearchSitters={handleSearchSitters}
        onViewServices={handleViewServices}
        onViewHowItWorks={handleViewHowItWorks}
        onViewHelp={handleViewHelp}
        onShowLogin={handleShowLogin}
        onShowRegister={handleShowRegister}
        onLogout={handleLogout}
        onViewCart={handleViewCart}
        onViewBookings={handleViewBookings}
        onGoToDashboard={handleGoToDashboard}
        cartItemsCount={cartItems.length}
      />
      {renderContent()}
    </div>
  )
}