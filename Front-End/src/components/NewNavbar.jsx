import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useState } from "react";

export default function NewNavbar() {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

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
          <Link
            to="/buscar"
            className="text-gray-600 hover:text-gray-800 transition-colors"
          >
            Buscar Cuidadores
          </Link>
          <Link
            to="/servicios"
            className="text-gray-600 hover:text-gray-800 transition-colors"
          >
            Servicios
          </Link>
          <Link
            to="/como-funciona"
            className="text-gray-600 hover:text-gray-800 transition-colors"
          >
            Cómo Funciona
          </Link>
          <Link
            to="/ayuda"
            className="text-gray-600 hover:text-gray-800 transition-colors"
          >
            Ayuda
          </Link>
        </div>

        {/* Desktop Auth Buttons */}
        <div className="hidden lg:flex items-center space-x-4">
          {!user && (
            <>
              <Link
                to="/login"
                className="text-gray-600 hover:text-gray-800 font-medium transition-colors hover:bg-blue-50 px-3 py-2 rounded-lg"
              >
                Iniciar Sesión
              </Link>
              <Link 
                to="/Register" 
                className="bg-gray-800 text-white px-6 py-2 rounded-lg font-medium hover:bg-gray-700 transition-colors"
              >
                Quiero registrarme
              </Link>
            </>
          )}
          {user && (
            <>
              {user.role === "owner" && (
                <>
                  <Link
                    to="/owner/book"
                    className="text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    Reservar
                  </Link>
                  <Link
                    to="/owner/bookings"
                    className="text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    Mis reservas
                  </Link>
                </>
              )}
              {user.role === "sitter" && (
                <Link
                  to="/sitter"
                  className="text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Panel cuidador
                </Link>
              )}
              {user.role === "admin" && (
                <Link
                  to="/admin"
                  className="text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Admin
                </Link>
              )}
              <button
                className="bg-gray-800 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-700 transition-colors"
                onClick={logout}
              >
                Salir
              </button>
            </>
          )}
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
          isMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-6">
          {/* Mobile Menu Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center mr-2">
                <span className="text-white text-lg">♥</span>
              </div>
              <span className="text-xl font-semibold text-gray-800">
                PetCare
              </span>
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
              to="/buscar"
              className="block text-gray-800 hover:bg-gray-50 px-4 py-3 rounded-lg font-medium transition-colors"
              onClick={closeMenu}
            >
              Buscar Cuidadores
            </Link>
            <Link
              to="/servicios"
              className="block text-gray-800 hover:bg-gray-50 px-4 py-3 rounded-lg font-medium transition-colors"
              onClick={closeMenu}
            >
              Servicios
            </Link>
            <Link
              to="/como-funciona"
              className="block text-gray-800 hover:bg-gray-50 px-4 py-3 rounded-lg font-medium transition-colors"
              onClick={closeMenu}
            >
              Cómo Funciona
            </Link>
            <Link
              to="/ayuda"
              className="block text-gray-800 hover:bg-gray-50 px-4 py-3 rounded-lg font-medium transition-colors"
              onClick={closeMenu}
            >
              Ayuda
            </Link>
          </div>

          {/* Mobile Auth Buttons */}
          <div className="space-y-3 border-t border-gray-200 pt-6">
            {!user && (
              <>
                <Link
                  to="/sitter-dashboard"
                  className="block text-center text-gray-800 hover:bg-gray-50 px-4 py-3 rounded-lg font-medium transition-colors border border-gray-300"
                  onClick={closeMenu}
                >
                  Iniciar Sesión
                </Link>
                <Link
                  to="/register"
                  className="block text-center bg-gray-800 text-white px-4 py-3 rounded-lg font-medium hover:bg-gray-700 transition-colors"
                  onClick={closeMenu}
                >
                  Quiero registrarme
                </Link>
              </>
            )}
            {user && (
              <>
                {user.role === "owner" && (
                  <>
                    <Link
                      to="/owner/book"
                      className="block text-gray-800 hover:bg-gray-50 px-4 py-3 rounded-lg font-medium transition-colors"
                      onClick={closeMenu}
                    >
                      Reservar
                    </Link>
                    <Link
                      to="/owner/bookings"
                      className="block text-gray-800 hover:bg-gray-50 px-4 py-3 rounded-lg font-medium transition-colors"
                      onClick={closeMenu}
                    >
                      Mis reservas
                    </Link>
                  </>
                )}
                {user.role === "sitter" && (
                  <Link
                    to="/sitter"
                    className="block text-gray-800 hover:bg-gray-50 px-4 py-3 rounded-lg font-medium transition-colors"
                    onClick={closeMenu}
                  >
                    Panel cuidador
                  </Link>
                )}
                {user.role === "admin" && (
                  <Link
                    to="/admin"
                    className="block text-gray-800 hover:bg-gray-50 px-4 py-3 rounded-lg font-medium transition-colors"
                    onClick={closeMenu}
                  >
                    Admin
                  </Link>
                )}
                <button
                  className="w-full text-center bg-gray-800 text-white px-4 py-3 rounded-lg font-medium hover:bg-gray-700 transition-colors"
                  onClick={() => {
                    logout();
                    closeMenu();
                  }}
                >
                  Salir
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
