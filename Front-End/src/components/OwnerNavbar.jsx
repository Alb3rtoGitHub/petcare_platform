import { Link } from "react-router-dom";
import { useState } from "react";

export default function OwnerNavbar() {
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
            to="/owner-dashboard"
            className="text-gray-600 hover:text-gray-800 transition-colors"
          >
            Mi Dashboard
          </Link>
          <Link
            to="/buscar"
            className="text-gray-600 hover:text-gray-800 transition-colors"
          >
            Buscar Cuidadores
          </Link>
          <Link
            to="/owner/book"
            className="text-gray-600 hover:text-gray-800 transition-colors"
            onClick={(e) => {
              // dispatch a global event so OwnerDashboard can open the modal if mounted
              const ev = new CustomEvent("open:reservation-modal");
              window.dispatchEvent(ev);
            }}
          >
            Reservar Servicio
          </Link>
          <Link
            to="/owner/bookings"
            className="text-gray-600 hover:text-gray-800 transition-colors"
          >
            Mis Reservas
          </Link>
          <Link
            to="/owner/pets"
            className="text-gray-600 hover:text-gray-800 transition-colors"
          >
            Mis Mascotas
          </Link>
        </div>

        {/* Desktop Right Side */}
        <div className="hidden lg:flex items-center space-x-4">
          <Link
            to="/notificaciones"
            className="text-gray-600 hover:text-gray-800 hover:bg-gray-100 transition-colors p-2 rounded-lg"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              id="notifications"
            >
              <path fill="none" d="M0 0h24v24H0V0z"></path>
              <path d="M19.29 17.29L18 16v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-1.29 1.29c-.63.63-.19 1.71.7 1.71h13.17c.9 0 1.34-1.08.71-1.71zM16 17H8v-6c0-2.48 1.51-4.5 4-4.5s4 2.02 4 4.5v6zm-4 5c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2z"></path>
            </svg>
          </Link>
          <div className="flex items-center space-x-2">
            <Link
              to="/perfil"
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 transition-colors p-2 rounded-lg"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                id="profile"
              >
                <path fill="none" d="M0 0h24v24H0V0z"></path>
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-3.31 0-6 2.69-6 6v1h12v-1c0-3.31-2.69-6-6-6z"></path>
              </svg>
              <span className="text-gray-800 font-medium">Maria Garcia</span>
            </Link>
          </div>
          <button
            className="text-gray-600 hover:text-gray-800 hover:bg-gray-100 border border-gray-200 hover:border-gray-300 transition-colors font-medium px-3 py-2 rounded-lg"
            title="Cerrar Sesión"
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
              to="/owner-dashboard"
              className="block text-gray-800 hover:bg-gray-50 px-4 py-3 rounded-lg font-medium transition-colors"
              onClick={closeMenu}
            >
              Mi Dashboard
            </Link>
            <Link
              to="/buscar"
              className="block text-gray-800 hover:bg-gray-50 px-4 py-3 rounded-lg font-medium transition-colors"
              onClick={closeMenu}
            >
              Buscar Cuidadores
            </Link>
            <Link
              to="/owner/book"
              className="block text-gray-800 hover:bg-gray-50 px-4 py-3 rounded-lg font-medium transition-colors"
              onClick={(e) => {
                const ev = new CustomEvent("open:reservation-modal");
                window.dispatchEvent(ev);
                closeMenu();
              }}
            >
              Reservar Servicio
            </Link>
            <Link
              to="/owner/bookings"
              className="block text-gray-800 hover:bg-gray-50 px-4 py-3 rounded-lg font-medium transition-colors"
              onClick={closeMenu}
            >
              Mis Reservas
            </Link>
            <Link
              to="/owner/pets"
              className="block text-gray-800 hover:bg-gray-50 px-4 py-3 rounded-lg font-medium transition-colors"
              onClick={closeMenu}
            >
              Mis Mascotas
            </Link>
          </div>

          {/* Mobile Auth Buttons */}
          <div className="space-y-3 border-t border-gray-200 pt-6">
            <div className="text-center text-gray-800 font-medium">
              Maria Garcia
            </div>
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
  );
}
