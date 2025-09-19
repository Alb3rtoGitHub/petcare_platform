import { Link } from 'react-router-dom'
import React, { useEffect, useState } from 'react'
import OwnerNavbar from '../components/OwnerNavbar.jsx'
import SitterNavbar from '../components/SitterNavbar.jsx'
import DefaultNavbar from '../components/NewNavbar.jsx'

// Función para decodificar el token y obtener datos
function parseJwt(token) {
  try {
    const base64Url = token.split('.')[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    )
    return JSON.parse(jsonPayload)
  } catch (e) {
    return null
  }
}

// Verifica si el token está expirado
function isTokenExpired(token) {
  const claims = parseJwt(token)
  if (!claims || !claims.exp) return true
  const now = Math.floor(Date.now() / 1000)
  return claims.exp < now
}

export default function Home() {
  const [sitters, setSitters] = useState([]);
  const [loadingSitters, setLoadingSitters] = useState(true);
  const [navbar, setNavbar] = useState(<DefaultNavbar />);


  useEffect(() => {
    // Revisar token y rol
    const token = sessionStorage.getItem('token')
    if (token && !isTokenExpired(token)) {
      const claims = parseJwt(token)
      if (claims && claims.roles) {
        if (claims.roles.includes('ROLE_OWNER')) {
          setNavbar(<OwnerNavbar />)
        } else if (claims.roles.includes('ROLE_SITTER')) {
          setNavbar(<SitterNavbar />)
        }
      } else {
        setNavbar(<DefaultNavbar />)
      }
    }
  }, [])

  useEffect(() => {
    fetch('http://localhost:8080/api/v1/sitters?page=0&size=3&sortBy=averageRating&sortDir=desc')
      .then(res => res.json())
      .then(data => {
        setSitters(data.content || []);
        setLoadingSitters(false);
      })
      .catch(() => setLoadingSitters(false));
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-blue-50 to-white text-center py-12 sm:py-16 lg:py-20 px-4">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 mb-4 sm:mb-6 leading-tight">
          El mejor cuidado para tu mascota
        </h1>
        <p className="text-base sm:text-lg text-gray-600 mb-3 sm:mb-4 max-w-2xl mx-auto px-4">
          Conectamos dueños de mascotas con cuidadores profesionales y confiables.
        </p>
        <p className="text-base sm:text-lg text-gray-600 mb-8 sm:mb-12 max-w-2xl mx-auto px-4">
          Selecciona tu perfil para comenzar y acceder a tu cuenta.
        </p>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto flex flex-col sm:flex-row items-stretch bg-white rounded-lg shadow-lg border border-gray-200 p-2 mb-6 sm:mb-8">
          <div className="flex items-center px-4 text-gray-500 flex-1 mb-2 sm:mb-0">
            <span className="mr-2">📍</span>
            <input 
              type="text" 
              placeholder="¿Dónde necesitas cuidado?" 
              className="bg-transparent border-none outline-none text-gray-700 placeholder-gray-500 w-full py-2 sm:py-0"
            />
          </div>
          <button className="bg-gray-800 text-white px-6 sm:px-8 py-3 rounded-lg font-medium hover:bg-gray-700 transition-colors flex items-center justify-center sm:ml-auto">
            <span className="mr-2">🔍</span>
            Buscar Cuidadores
          </button>
        </div>

        {/* Call to Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6 sm:mt-8 max-w-3xl mx-auto px-4">
          <Link 
            to="/register-sitter" 
            className="bg-gray-800 text-white px-8 py-3 rounded-lg font-medium hover:bg-gray-700 transition-colors text-center border border-gray-800"
          >
            Convertirme en Cuidador
          </Link>
          <Link 
            to="/register-owner" 
            className="bg-gray-800 text-white px-8 py-3 rounded-lg font-medium hover:bg-gray-700 transition-colors text-center border border-gray-800"
          >
            Registrarme como Dueño
          </Link>
        </div>
      </section>

      {/* Why Choose PetCare Section */}
      <section className="py-12 sm:py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-8 sm:mb-12 px-4">
            ¿Por qué elegir PetCare?
          </h2>
          <p className="text-center text-gray-600 mb-8 sm:mb-12 text-sm sm:text-base px-4">
            Cuidado profesional y confiable para tu mascota
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 px-4">
            {/* Seguridad Garantizada */}
            <div className="text-center p-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">✓</span>
                </div>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">
                Seguridad Garantizada
              </h3>
              <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                Todos nuestros cuidadores pasan por verificación de antecedentes y evaluaciones.
              </p>
            </div>

            {/* Disponibilidad 24/7 */}
            <div className="text-center p-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-xs">24</span>
                </div>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">
                Disponibilidad 24/7
              </h3>
              <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                Encuentra cuidadores disponibles cuando los necesites, 
                incluso en horarios y emergencias.
              </p>
            </div>

            {/* Amor Genuino */}
            <div className="text-center p-4">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">♥</span>
                </div>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">
                Amor Genuino
              </h3>
              <p className="text-gray-600 text-xs sm:text-sm leading-relaxed">
                Cuidadores apasionados que aman a los animales tanto 
                como tú los amas.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Sitters Section */}
      <section className="py-12 sm:py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-8 sm:mb-12 px-4">
            Cuidadores Destacados
          </h2>
          <p className="text-center text-gray-600 mb-8 sm:mb-12 text-sm sm:text-base px-4">
            Conoce algunos de nuestros mejores cuidadores
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 px-4">
            {loadingSitters ? (
              <div className="col-span-3 text-center text-gray-500">Cargando cuidadores...</div>
            ) : sitters.length === 0 ? (
              <div className="col-span-3 text-center text-gray-500">No hay cuidadores destacados.</div>
            ) : (
              sitters.map(sitter => (
                <div key={sitter.id} className="bg-white rounded-lg shadow-lg overflow-hidden max-w-sm mx-auto sm:max-w-none">
                  <div className="h-48 sm:h-52 bg-gray-300 relative">
                    <img 
                      src={sitter.profilePicture || "/api/placeholder/300/200"} 
                      alt={sitter.firstName} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4 sm:p-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg sm:text-xl font-semibold text-gray-800">
                        {sitter.firstName}
                      </h3>
                      <div className="flex items-center">
                        <span className="text-yellow-400">⭐</span>
                        <span className="text-gray-600 ml-1 text-sm">{sitter.averageRating?.toFixed(1) ?? 'N/A'}</span>
                      </div>
                    </div>
                    <p className="text-gray-600 text-xs sm:text-sm mb-2 flex items-center">
                      <span className="mr-2">📍</span>
                      {sitter.cityName ? sitter.cityName : 'Ciudad desconocida'}
                    </p>
                    {sitter.bio && (
                      <p className="text-gray-500 text-xs mb-4">{sitter.bio}</p>
                    )}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {/* Puedes agregar tags si el backend los provee */}
                      <span className="bg-gray-100 text-gray-700 px-2 sm:px-3 py-1 rounded-full text-xs">Paseos</span>
                    </div>
                    <div className="text-center">
                      <Link
                        to={`/sitters/${sitter.id}`}
                        className="bg-gray-800 text-white px-4 sm:px-6 py-2 rounded-lg text-xs sm:text-sm font-medium hover:bg-gray-700 transition-colors w-full block"
                      >
                        Ver Perfil
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="text-center mt-6 sm:mt-8 px-4">
            <Link 
              to="/sitters" 
              className="text-gray-600 hover:text-gray-800 underline text-sm sm:text-base"
            >
              Ver Todos los Cuidadores
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-6 sm:py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {/* Logo y descripción */}
            <div className="col-span-2 lg:col-span-1">
              <div className="flex items-center mb-2">
                <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center mr-2">
                  <span className="text-gray-900 text-sm">♥</span>
                </div>
                <span className="text-lg font-semibold">PetCare</span>
              </div>
              <p className="text-gray-400 text-xs mb-3 leading-relaxed">
                Conectamos dueños de mascotas con cuidadores profesionales para brindar el mejor cuidado a tu mejor amigo.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.024-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.739.099.12.112.225.085.347-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.746-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24c6.624 0 11.99-5.367 11.99-12C24.007 5.367 18.641.001.012.001z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.017 2.154c3.198 0 3.586.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.154c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Servicios */}
            <div className="col-span-1">
              <h3 className="text-base font-semibold mb-2">Servicios</h3>
              <ul className="space-y-1 text-gray-400">
                <li><Link to="/paseos" className="hover:text-white transition-colors text-xs">Paseos</Link></li>
                <li><Link to="/cuidado" className="hover:text-white transition-colors text-xs">Cuidado en Casa</Link></li>
                <li><Link to="/entrenamiento" className="hover:text-white transition-colors text-xs">Entrenamiento</Link></li>
                <li><Link to="/grooming" className="hover:text-white transition-colors text-xs">Grooming</Link></li>
                <li><Link to="/veterinario" className="hover:text-white transition-colors text-xs">Servicios Veterinarios</Link></li>
              </ul>
            </div>

            {/* Soporte */}
            <div className="col-span-1">
              <h3 className="text-base font-semibold mb-2">Soporte</h3>
              <ul className="space-y-1 text-gray-400">
                <li><Link to="/ayuda" className="hover:text-white transition-colors text-xs">Centro de Ayuda</Link></li>
                <li><Link to="/contacto" className="hover:text-white transition-colors text-xs">Contactanos</Link></li>
                <li><Link to="/como-funciona" className="hover:text-white transition-colors text-xs">Cómo Funciona</Link></li>
                <li><Link to="/seguridad" className="hover:text-white transition-colors text-xs">Seguridad</Link></li>
                <li><Link to="/emergencias" className="hover:text-white transition-colors text-xs">Emergencias</Link></li>
              </ul>
            </div>

            {/* Empresa */}
            <div className="col-span-2 lg:col-span-1">
              <h3 className="text-base font-semibold mb-2">Empresa</h3>
              <div className="grid grid-cols-2 lg:block gap-x-4">
                <ul className="space-y-1 text-gray-400">
                  <li><Link to="/nosotros" className="hover:text-white transition-colors text-xs">Sobre Nosotros</Link></li>
                  <li><Link to="/carreras" className="hover:text-white transition-colors text-xs">Carreras</Link></li>
                  <li><Link to="/prensa" className="hover:text-white transition-colors text-xs">Prensa</Link></li>
                </ul>
                <ul className="space-y-1 text-gray-400">
                  <li><Link to="/blog" className="hover:text-white transition-colors text-xs">Blog</Link></li>
                  <li><Link to="/inversores" className="hover:text-white transition-colors text-xs">Inversores</Link></li>
                </ul>
              </div>
            </div>
          </div>

          {/* Newsletter */}
          <div className="border-t border-gray-800 mt-4 sm:mt-6 pt-3 sm:pt-4">
            <div className="lg:flex lg:items-center lg:justify-between">
              <div className="mb-3 lg:mb-0">
                <h3 className="text-base font-semibold mb-1">Mantente informado</h3>
                <p className="text-gray-400 text-xs">Recibe consejos para el cuidado de mascotas y ofertas especiales</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <input 
                  type="email" 
                  placeholder="Tu email" 
                  className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-gray-600 text-xs w-full sm:w-auto"
                />
                <button className="bg-white text-gray-900 px-3 sm:px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors text-xs whitespace-nowrap">
                  Suscribirse
                </button>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-gray-800 mt-3 sm:mt-4 pt-3 sm:pt-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <p className="text-gray-400 text-xs text-center sm:text-left">
                © 2025 PetCare. Todos los derechos reservados.
              </p>
              <div className="flex flex-col sm:flex-row justify-center sm:justify-end space-y-1 sm:space-y-0 sm:space-x-4">
                <Link to="/privacidad" className="text-gray-400 text-xs hover:text-white transition-colors text-center">
                  Política de Privacidad
                </Link>
                <Link to="/terminos" className="text-gray-400 text-xs hover:text-white transition-colors text-center">
                  Términos de Servicio
                </Link>
                <Link to="/cookies" className="text-gray-400 text-xs hover:text-white transition-colors text-center">
                  Cookies
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
