import { Link } from 'react-router-dom'
import { useState } from 'react'

export default function SitterNavbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const closeMenu = () => {
    setIsMenuOpen(false)
  }

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <nav className="mx-auto max-w-7xl px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center" onClick={closeMenu}>
          <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center mr-2">
            <span className="text-white text-lg">♥</span>
          </div>
          <span className="text-xl font-semibold text-gray-800">PetCare</span>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden lg:flex items-center space-x-8">
          <Link to="/sitter-dashboard" className="text-gray-600 hover:text-gray-800 transition-colors">
            Mi Panel
          </Link>
          <Link to="/sitter/requests" className="text-gray-600 hover:text-gray-800 transition-colors">
            Solicitudes
          </Link>
          <Link to="/sitter/services" className="text-gray-600 hover:text-gray-800 transition-colors">
            Mis Servicios
          </Link>
          <Link to="/sitter/clients" className="text-gray-600 hover:text-gray-800 transition-colors">
            Mis Clientes
          </Link>
          <Link to="/sitter/profile" className="text-gray-600 hover:text-gray-800 transition-colors">
            Mi Perfil
          </Link>
        </div>

        {/* Desktop Auth Buttons */}
        <div className="hidden lg:flex items-center space-x-4">
          <Link 
            to="/owner-dashboard" 
            className="text-gray-600 hover:text-gray-800 font-medium transition-colors hover:bg-blue-50 px-3 py-2 rounded-lg"
          >
            Vista Dueño
          </Link>
          <button 
            className="bg-gray-800 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-700 transition-colors"
          >
            Cerrar Sesión
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <svg
            className="w-6 h-6 text-gray-600"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            {isMenuOpen ? (
              <path d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={closeMenu}
        />
      )}

      {/* Mobile Menu */}
      <div
        className={`lg:hidden fixed top-0 right-0 h-full w-80 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out ${
          isMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-6">
          {/* Mobile Menu Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center mr-2">
                <span className="text-white text-lg">♥</span>
              </div>
              <span className="text-xl font-semibold text-gray-800">PetCare</span>
            </div>
            <button
              onClick={closeMenu}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Close menu"
            >
              <svg
                className="w-6 h-6 text-gray-600"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Mobile Navigation Links */}
          <div className="space-y-4 mb-8">
            <Link 
              to="/sitter-dashboard" 
              className="block text-gray-800 hover:bg-gray-50 px-4 py-3 rounded-lg font-medium transition-colors"
              onClick={closeMenu}
            >
              Mi Panel
            </Link>
            <Link 
              to="/sitter/requests" 
              className="block text-gray-800 hover:bg-gray-50 px-4 py-3 rounded-lg font-medium transition-colors"
              onClick={closeMenu}
            >
              Solicitudes
            </Link>
            <Link 
              to="/sitter/services" 
              className="block text-gray-800 hover:bg-gray-50 px-4 py-3 rounded-lg font-medium transition-colors"
              onClick={closeMenu}
            >
              Mis Servicios
            </Link>
            <Link 
              to="/sitter/clients" 
              className="block text-gray-800 hover:bg-gray-50 px-4 py-3 rounded-lg font-medium transition-colors"
              onClick={closeMenu}
            >
              Mis Clientes
            </Link>
            <Link 
              to="/sitter/profile" 
              className="block text-gray-800 hover:bg-gray-50 px-4 py-3 rounded-lg font-medium transition-colors"
              onClick={closeMenu}
            >
              Mi Perfil
            </Link>
          </div>

          {/* Mobile Auth Buttons */}
          <div className="space-y-3 border-t border-gray-200 pt-6">
            <Link 
              to="/owner-dashboard" 
              className="block text-center text-gray-800 hover:bg-gray-50 px-4 py-3 rounded-lg font-medium transition-colors border border-gray-300"
              onClick={closeMenu}
            >
              Vista Dueño
            </Link>
            <button 
              className="w-full text-center bg-gray-800 text-white px-4 py-3 rounded-lg font-medium hover:bg-gray-700 transition-colors"
              onClick={closeMenu}
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
