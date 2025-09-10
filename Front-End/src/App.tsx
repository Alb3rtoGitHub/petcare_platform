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

type UserType = 'owner' | 'sitter' | 'admin' | null
type CurrentView = 'landing' | 'search' | 'dashboard' | 'services' | 'how-it-works' | 'help' | 'login' | 'register' | 'email-verification' | 'cart' | 'payment' | 'bookings' | 'calendar'

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
    setUserType(type)
    setUserData(userData)
    setIsAuthenticated(true)
    setSelectedUserTypeForLogin(null) // Clear the selected type after successful login
    setCurrentView('dashboard')
  }

  const handleLogout = () => {
    setUserType(null)
    setUserData(null)
    setIsAuthenticated(false)
    setSelectedUserTypeForLogin(null)
    setCurrentView('landing')
  }

  const handleRegister = (type: 'owner' | 'sitter', userData: any) => {
    // After successful registration, automatically log in the user
    setUserType(type)
    setUserData(userData)
    setIsAuthenticated(true)
    setSelectedUserTypeForLogin(null) // Clear the selected type after successful registration
    setCurrentView('dashboard')
  }

  const handleSearchSitters = () => {
    setCurrentView('search')
  }

  const handleViewServices = () => {
    setCurrentView('services')
  }

  const handleViewHowItWorks = () => {
    setCurrentView('how-it-works')
  }

  const handleViewHelp = () => {
    setCurrentView('help')
  }

  const handleShowLogin = () => {
    setSelectedUserTypeForLogin(null) // Clear any pre-selected type when manually going to login
    setCurrentView('login')
  }

  const handleShowRegister = () => {
    setCurrentView('register')
  }

  const handleBackToLanding = () => {
    setCurrentView('landing')
    setSelectedUserTypeForLogin(null) // Clear selected type when going back to landing
  }

  const handleViewCart = () => {
    setCurrentView('cart')
  }

  const handleViewBookings = () => {
    setCurrentView('bookings')
  }

  const handleEmailVerification = (email: string) => {
    setPendingUserEmail(email)
    setCurrentView('email-verification')
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

  const renderContent = () => {
    if (currentView === 'search') {
      return <SearchSitters onBack={handleBackToLanding} onBookService={handleBookService} />
    }

    if (currentView === 'services') {
      return <ServicesView onBack={handleBackToLanding} onBookService={handleBookService} />
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
          onBack={handleBackToServices}
          onAddToCart={handleAddToCart}
          onGoToCart={handleViewCart}
          userPets={userPets}
        />
      )
    }

    if (currentView === 'how-it-works') {
      return <HowItWorks onBack={handleBackToLanding} />
    }

    if (currentView === 'help') {
      return <Help onBack={handleBackToLanding} />
    }

    if (currentView === 'email-verification') {
      return (
        <EmailVerification 
          onBack={handleBackToLanding}
          onResendEmail={handleResendEmail}
          userEmail={pendingUserEmail}
        />
      )
    }

    if (currentView === 'cart') {
      return (
        <ShoppingCart 
          onBack={() => setCurrentView('services')}
          onProceedToPayment={handleProceedToPayment}
          cartItems={cartItems}
          onUpdateCart={handleUpdateCart}
        />
      )
    }

    if (currentView === 'payment') {
      return (
        <PaymentGateway 
          onBack={handleViewCart}
          onPaymentSuccess={handlePaymentSuccess}
          cartItems={cartItems}
          totalAmount={cartTotal}
        />
      )
    }

    if (currentView === 'bookings' && isAuthenticated) {
      return <BookingManager onBack={() => setCurrentView('dashboard')} userData={userData} />
    }

    if (currentView === 'login') {
      return (
        <Login 
          onBack={handleBackToLanding} 
          onLogin={handleLogin}
          onShowRegister={handleShowRegister}
        />
      )
    }

    if (currentView === 'register') {
      return (
        <Register 
          onBack={handleBackToLanding} 
          onRegister={handleRegister}
          onShowLogin={handleShowLogin}
          onEmailVerification={handleEmailVerification}
        />
      )
    }

    if (currentView === 'dashboard' && isAuthenticated) {
      switch (userType) {
        case 'owner':
          return <OwnerDashboard userData={userData} onViewBookings={handleViewBookings} onViewCart={handleViewCart} />
        case 'sitter':
          return <SitterDashboard userData={userData} onViewBookings={handleViewBookings} />
        case 'admin':
          return <AdminDashboard userData={userData} />
        default:
          return <LandingPage onUserTypeChange={handleUserTypeChange} onSearchSitters={handleSearchSitters} onViewServices={handleViewServices} onViewHowItWorks={handleViewHowItWorks} onShowLogin={handleShowLogin} onShowRegister={handleShowRegister} />
      }
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
        cartItemsCount={cartItems.length}
      />
      {renderContent()}
    </div>
  )
}