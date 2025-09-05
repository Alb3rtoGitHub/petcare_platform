import { useEffect, useState } from 'react'
import { Heart, Calendar, Users, MessageSquare, Eye, Plus, Search, BookOpen } from 'lucide-react'
import OwnerNavbar from '../../components/OwnerNavbar.jsx'
import { Link } from 'react-router-dom'

export default function OwnerDashboard() {
  const [activeSection, setActiveSection] = useState('reservas')

  // Mock data para mascotas favoritas
  const myPets = [
    {
      id: 1,
      name: "Max",
      type: "Perro",
      breed: "Golden Retriever",
      age: "3 años",
      image: "/api/placeholder/300/200"
    },
    {
      id: 2,
      name: "Luna",
      type: "Gato",
      breed: "Siamés",
      age: "2 años", 
      image: "/api/placeholder/300/200"
    }
  ]

  const renderReservas = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Mis Reservas</h2>
        <div className="flex gap-2">
          <button className="text-blue-600 hover:text-blue-800 text-sm">Ver Todas las Reservas</button>
          <button className="bg-gray-900 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm">
            <Plus className="w-4 h-4" />
            Nueva Reserva
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {/* Reserva confirmada */}
        <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-gray-300 rounded-full flex-shrink-0">
              <img 
                src="/api/placeholder/50/50" 
                alt="María González" 
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-800">María González</h3>
                <div className="flex items-center gap-2">
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                    confirmado
                  </span>
                  <span className="text-lg font-bold text-gray-900">15€</span>
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-2">Paseo</p>
              <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Hoy
                </span>
                <span>14:00 - 15:00</span>
                <span>Para Max</span>
              </div>
              <div className="flex gap-2">
                <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm flex items-center gap-2 hover:bg-gray-50">
                  <MessageSquare className="w-4 h-4" />
                  Mensaje
                </button>
                <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm hover:bg-gray-50">
                  Ver Detalles
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Reserva pendiente */}
        <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-gray-300 rounded-full flex-shrink-0">
              <img 
                src="/api/placeholder/50/50" 
                alt="Carlos Rodríguez" 
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-800">Carlos Rodríguez</h3>
                <div className="flex items-center gap-2">
                  <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
                    pendiente
                  </span>
                  <span className="text-lg font-bold text-gray-900">120€</span>
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-2">Cuidado en casa</p>
              <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                <span className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  Mañana
                </span>
                <span>09:00 - 17:00</span>
                <span>Para Luna</span>
              </div>
              <div className="flex gap-2">
                <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm flex items-center gap-2 hover:bg-gray-50">
                  <MessageSquare className="w-4 h-4" />
                  Mensaje
                </button>
                <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm hover:bg-gray-50">
                  Ver Detalles
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderMascotas = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Mis Mascotas</h2>
        <button className="bg-gray-900 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm">
          <Plus className="w-4 h-4" />
          Agregar Mascota
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {myPets.map(pet => (
          <div key={pet.id} className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="h-48 bg-gray-300 relative">
              <img 
                src={pet.image} 
                alt={pet.name} 
                className="w-full h-full object-cover"
              />
              <button className="absolute top-3 right-3 text-red-500 hover:text-red-600">
                <Heart className="w-6 h-6 fill-current" />
              </button>
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">{pet.name}</h3>
              <div className="space-y-1 text-sm text-gray-600 mb-4">
                <p><span className="font-medium">Tipo:</span> {pet.type}</p>
                <p><span className="font-medium">Raza:</span> {pet.breed}</p>
                <p><span className="font-medium">Edad:</span> {pet.age}</p>
              </div>
              <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 rounded-lg text-sm font-medium transition-colors">
                Editar Perfil
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  const renderFavoritos = () => (
    <div className="space-y-6">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Cuidadores Favoritos</h2>
      
      <div className="flex flex-col items-center justify-center py-12">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <Heart className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-600 mb-2">No tienes favoritos aún</h3>
        <p className="text-gray-500 text-center mb-6 max-w-md">
          Agrega cuidadores a favoritos para encontrarlos fácilmente
        </p>
        <button className="bg-gray-900 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors">
          Buscar Cuidadores
        </button>
      </div>
    </div>
  )

  return (
    <>
      <OwnerNavbar />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">Mi Dashboard</h1>
          <p className="text-gray-600">Bienvenido, María García. Gestiona tus mascotas y reservas</p>
        </div>

        {/* Navigation Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6 mb-8">
          {/* Buscar Cuidadores */}
          <Link
            to="/buscar"
            className="p-6 rounded-lg border-2 border-gray-200 bg-white hover:border-gray-300 transition-all text-left"
          >
            <div className="flex flex-col items-center text-center">
              <Search className="w-12 h-12 text-gray-700 mb-3" />
              <h3 className="text-lg font-semibold text-gray-800 mb-1">Buscar Cuidadores</h3>
              <p className="text-sm text-gray-600">Encuentra el cuidador perfecto</p>
            </div>
          </Link>

          {/* Reservar Servicio */}
          <Link
            to="/owner/book"
            className="p-6 rounded-lg border-2 border-gray-200 bg-white hover:border-gray-300 transition-all text-left"
          >
            <div className="flex flex-col items-center text-center">
              <BookOpen className="w-12 h-12 text-gray-700 mb-3" />
              <h3 className="text-lg font-semibold text-gray-800 mb-1">Reservar Servicio</h3>
              <p className="text-sm text-gray-600">Agenda un nuevo servicio</p>
            </div>
          </Link>

          {/* Mis Reservas */}
          <button
            onClick={() => setActiveSection('reservas')}
            className={`p-6 rounded-lg border-2 transition-all text-left ${
              activeSection === 'reservas' 
                ? 'border-gray-900 bg-gray-50' 
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
          >
            <div className="flex flex-col items-center text-center">
              <Calendar className="w-12 h-12 text-gray-700 mb-3" />
              <h3 className="text-lg font-semibold text-gray-800 mb-1">Mis Reservas</h3>
              <p className="text-sm text-gray-600">Gestiona todas tus reservas</p>
            </div>
          </button>

          {/* Mis Mascotas */}
          <button
            onClick={() => setActiveSection('mascotas')}
            className={`p-6 rounded-lg border-2 transition-all text-left ${
              activeSection === 'mascotas' 
                ? 'border-gray-900 bg-gray-50' 
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
          >
            <div className="flex flex-col items-center text-center">
              <Users className="w-12 h-12 text-gray-700 mb-3" />
              <h3 className="text-lg font-semibold text-gray-800 mb-1">Mis Mascotas</h3>
              <p className="text-sm text-gray-600">Gestiona tus mascotas</p>
            </div>
          </button>

          {/* Favoritos */}
          <button
            onClick={() => setActiveSection('favoritos')}
            className={`p-6 rounded-lg border-2 transition-all text-left ${
              activeSection === 'favoritos' 
                ? 'border-gray-900 bg-gray-50' 
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
          >
            <div className="flex flex-col items-center text-center">
              <Heart className="w-12 h-12 text-gray-700 mb-3" />
              <h3 className="text-lg font-semibold text-gray-800 mb-1">Favoritos</h3>
              <p className="text-sm text-gray-600">Tus cuidadores favoritos</p>
            </div>
          </button>
        </div>

        {/* Content Section */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6">
            {activeSection === 'reservas' && renderReservas()}
            {activeSection === 'mascotas' && renderMascotas()}
            {activeSection === 'favoritos' && renderFavoritos()}
          </div>
        </div>
        </div>
      </div>
    </>
  )
}
