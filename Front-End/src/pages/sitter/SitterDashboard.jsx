import { useEffect, useState } from 'react'
import { Calendar, Users, Heart, MessageSquare, Eye, Plus, Star } from 'lucide-react'
import SitterNavbar from '../../components/SitterNavbar.jsx'
import { getOpenBookings, acceptBooking, completeBooking } from '../../data/fakeApi.js'

export default function SitterDashboard() {
  const [activeSection, setActiveSection] = useState('solicitudes')
  const [open, setOpen] = useState([])
  const [mine, setMine] = useState([])

  const refresh = () => {
    const { open: o, mine: m } = getOpenBookings()
    setOpen(o); setMine(m)
  }

  useEffect(() => { refresh() }, [])

  // Mock data para servicios y clientes
  const myServices = [
    {
      id: 1,
      name: "Paseo de Perros",
      price: "15€/hora",
      active: true,
      bookings: 12
    },
    {
      id: 2,
      name: "Cuidado en Casa",
      price: "25€/día",
      active: true,
      bookings: 8
    },
    {
      id: 3,
      name: "Entrenamiento Básico",
      price: "30€/sesión",
      active: false,
      bookings: 3
    }
  ]

  const favoriteClients = [
    {
      id: 1,
      name: "María García",
      pet: "Max (Golden Retriever)",
      rating: 5,
      totalBookings: 15,
      image: "/api/placeholder/50/50"
    },
    {
      id: 2,
      name: "Carlos Rodríguez", 
      pet: "Luna (Siamés)",
      rating: 5,
      totalBookings: 8,
      image: "/api/placeholder/50/50"
    }
  ]

  const renderSolicitudes = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Solicitudes de Servicio</h2>
        <div className="text-sm text-gray-600">
          {open.length} solicitudes disponibles
        </div>
      </div>

      <div className="space-y-4">
        {/* Mis servicios activos */}
        <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Mis Servicios Aceptados</h3>
          <div className="space-y-3">
            {mine.map(b => (
              <div key={b.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <div className="font-medium text-gray-800">{b.petName} — {b.type}</div>
                  <div className="text-sm text-gray-600">{b.date} {b.time}</div>
                </div>
                <div className="flex gap-2">
                  <button className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700">
                    Contactar Cliente
                  </button>
                  <button 
                    className="bg-gray-800 text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-700"
                    onClick={() => { completeBooking(b.id); refresh() }}
                  >
                    Completar
                  </button>
                </div>
              </div>
            ))}
            {mine.length === 0 && (
              <p className="text-gray-500 text-center py-4">No tienes servicios activos</p>
            )}
          </div>
        </div>

        {/* Solicitudes disponibles */}
        <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Nuevas Solicitudes</h3>
          <div className="space-y-3">
            {open.map(b => (
              <div key={b.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-medium text-gray-800">{b.type}</h4>
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                        Nueva
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      <p>Mascota: {b.petName}</p>
                      <p>Fecha: {b.date} a las {b.time}</p>
                      <p>Duración estimada: 1-2 horas</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-gray-900 mb-2">€15-25</div>
                    <div className="flex gap-2">
                      <button className="border border-gray-300 text-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-50">
                        Ver Detalles
                      </button>
                      <button 
                        className="bg-gray-800 text-white px-3 py-1 rounded text-sm hover:bg-gray-700"
                        onClick={() => { acceptBooking(b.id); refresh() }}
                      >
                        Aceptar
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {open.length === 0 && (
              <p className="text-gray-500 text-center py-4">No hay solicitudes disponibles</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )

  const renderServicios = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Mis Servicios</h2>
        <button className="bg-gray-900 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm">
          <Plus className="w-4 h-4" />
          Agregar Servicio
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {myServices.map(service => (
          <div key={service.id} className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">{service.name}</h3>
              <div className={`w-3 h-3 rounded-full ${service.active ? 'bg-green-500' : 'bg-gray-400'}`}></div>
            </div>
            <div className="space-y-3">
              <div className="text-2xl font-bold text-gray-900">{service.price}</div>
              <div className="text-sm text-gray-600">
                {service.bookings} reservas completadas
              </div>
              <div className="flex gap-2">
                <button className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 rounded-lg text-sm">
                  Editar
                </button>
                <button className={`flex-1 py-2 rounded-lg text-sm ${
                  service.active 
                    ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                    : 'bg-green-100 text-green-700 hover:bg-green-200'
                }`}>
                  {service.active ? 'Pausar' : 'Activar'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  const renderClientes = () => (
    <div className="space-y-6">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Mis Clientes Favoritos</h2>
      
      <div className="space-y-4">
        {favoriteClients.map(client => (
          <div key={client.id} className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gray-300 rounded-full flex-shrink-0">
                <img 
                  src={client.image} 
                  alt={client.name} 
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-800">{client.name}</h3>
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm text-gray-600">{client.rating}</span>
                  </div>
                </div>
                <p className="text-gray-600 text-sm mb-2">Mascota: {client.pet}</p>
                <p className="text-gray-500 text-xs mb-3">{client.totalBookings} servicios completados</p>
                <div className="flex gap-2">
                  <button className="bg-gray-800 text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-700">
                    Enviar Mensaje
                  </button>
                  <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg text-sm hover:bg-gray-50">
                    Ver Historial
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {favoriteClients.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Heart className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-600 mb-2">Aún no tienes clientes favoritos</h3>
            <p className="text-gray-500 text-center mb-6 max-w-md">
              Cuando completes servicios, podrás agregar clientes a favoritos
            </p>
          </div>
        )}
      </div>
    </div>
  )

  return (
    <>
      <SitterNavbar />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">Panel de Cuidador</h1>
          <p className="text-gray-600">Gestiona tus servicios y clientes</p>
        </div>

        {/* Navigation Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8">
          {/* Solicitudes */}
          <button
            onClick={() => setActiveSection('solicitudes')}
            className={`p-6 rounded-lg border-2 transition-all text-left ${
              activeSection === 'solicitudes' 
                ? 'border-gray-900 bg-gray-50' 
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
          >
            <div className="flex flex-col items-center text-center">
              <Calendar className="w-12 h-12 text-gray-700 mb-3" />
              <h3 className="text-lg font-semibold text-gray-800 mb-1">Solicitudes</h3>
              <p className="text-sm text-gray-600">Nuevas solicitudes de servicio</p>
            </div>
          </button>

          {/* Mis Servicios */}
          <button
            onClick={() => setActiveSection('servicios')}
            className={`p-6 rounded-lg border-2 transition-all text-left ${
              activeSection === 'servicios' 
                ? 'border-gray-900 bg-gray-50' 
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
          >
            <div className="flex flex-col items-center text-center">
              <Users className="w-12 h-12 text-gray-700 mb-3" />
              <h3 className="text-lg font-semibold text-gray-800 mb-1">Mis Servicios</h3>
              <p className="text-sm text-gray-600">Gestiona tus servicios</p>
            </div>
          </button>

          {/* Clientes */}
          <button
            onClick={() => setActiveSection('clientes')}
            className={`p-6 rounded-lg border-2 transition-all text-left ${
              activeSection === 'clientes' 
                ? 'border-gray-900 bg-gray-50' 
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
          >
            <div className="flex flex-col items-center text-center">
              <Heart className="w-12 h-12 text-gray-700 mb-3" />
              <h3 className="text-lg font-semibold text-gray-800 mb-1">Mis Clientes</h3>
              <p className="text-sm text-gray-600">Clientes favoritos</p>
            </div>
          </button>
        </div>

        {/* Content Section */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6">
            {activeSection === 'solicitudes' && renderSolicitudes()}
            {activeSection === 'servicios' && renderServicios()}
            {activeSection === 'clientes' && renderClientes()}
          </div>
        </div>
        </div>
      </div>
    </>
  )
}
