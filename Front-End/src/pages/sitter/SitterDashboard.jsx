import { useEffect, useState } from 'react'
import { Calendar, Users, Heart, Star, Plus, Trash2 } from 'lucide-react'
import SitterNavbar from '../../components/SitterNavbar.jsx'
import ReviewCard from '../../components/ReviewCard';
import { BASE_URL } from '../../config/constants';

// Función para formatear fecha y hora como dd/mm/YYYY HH
function formatDateTimeCustom(dateStr) {
  const date = new Date(dateStr)
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()
  const hour = String(date.getHours()).padStart(2, '0')
  return `${day}/${month}/${year} ${hour}`
}

function formatHour(dateStr) {
  const date = new Date(dateStr)
  const hour = String(date.getHours()).padStart(2, '0')
  const min = String(date.getMinutes()).padStart(2, '0')
  return `${hour}:${min} Hs`
}

export default function SitterDashboard() {
  const [activeSection, setActiveSection] = useState('solicitudes')
  const [sitterData, setSitterData] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [serviceEntities, setServiceEntities] = useState([])
  const [form, setForm] = useState({
    serviceName: '',
    startDate: '',
    startHour: '',
    endDate: '',
    endHour: ''
  })
  const [loading, setLoading] = useState(false)
  const [reviewModal, setReviewModal] = useState({ open: false, review: null })

  const token = sessionStorage.getItem('token')
  const sitterId = sessionStorage.getItem('id')

  // Fetch datos del cuidador
  const fetchSitterData = async () => {
    try {
      const response = await fetch(`${BASE_URL}/sitters/${sitterId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      if (!response.ok)
        throw new Error('Error al obtener datos del cuidador')
      const data = await response.json()
      setSitterData(data)
    } catch (error) {
      console.error(error)
    }
  }

  // Fetch servicios disponibles
  const fetchServiceEntities = async () => {
    try {
      const response = await fetch(`${BASE_URL}/service-entities`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) {
        throw new Error('Error al obtener servicios');
      }
      const data = await response.json();
      setServiceEntities(data);
    } catch (error) {
      console.error('Error al obtener servicios:', error);
    }
  };

  useEffect(() => { fetchSitterData() }, [])
  useEffect(() => {
    if (showModal) {
      fetchServiceEntities();
    }
  }, [showModal])

  // Modal para agregar availability
  const handleFormChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleAddAvailability = async () => {
    if (!form.serviceName || !form.startDate || !form.startHour || !form.endDate || !form.endHour) {
      alert('Completa todos los campos')
      return
    }
    const startTime = `${form.startDate}T${form.startHour}:00`
    const endTime = `${form.endDate}T${form.endHour}:00`
    if (new Date(startTime) <= new Date()) {
      alert('La fecha de inicio debe ser a futuro')
      return
    }
    if (new Date(endTime) <= new Date(startTime)) {
      alert('La fecha de fin debe ser posterior a la de inicio')
      return
    }
    setLoading(true)
    try {
      const res = await fetch(`${BASE_URL}/availabilities/sitters/${sitterId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          serviceName: form.serviceName,
          startTime,
          endTime
        })
      })
      if (!res.ok) throw new Error('Error al agregar disponibilidad')
      await fetchSitterData()
      setShowModal(false)
      setForm({
        serviceName: '',
        startDate: '',
        startHour: '',
        endDate: '',
        endHour: ''
      })
    } catch (err) {
      alert(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Eliminar availability
  const handleDeleteAvailability = async (availabilityId) => {
    if (!window.confirm('¿Seguro que deseas eliminar esta disponibilidad?')) return
    setLoading(true)
    try {
      const res = await fetch(`${BASE_URL}/availabilities/${availabilityId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (!res.ok) throw new Error('Error al eliminar disponibilidad')
      await fetchSitterData()
    } catch (err) {
      alert(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Renderiza los servicios usando los datos de availabilities
  const renderServicios = () => {
    const availabilities = sitterData?.availabilities ?? []
    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">Mis Disponibilidades</h2>
          <button
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            onClick={() => setShowModal(true)}
          >
            <Plus className="w-5 h-5" /> Agregar Servicio
          </button>
        </div>
        {availabilities.length === 0 ? (
          <p className="text-gray-500">No tienes disponibilidades registradas.</p>
        ) : (
          <div className="space-y-4">
            {availabilities.map(a => (
              <div key={a.id} className="border rounded-lg p-4 shadow-sm bg-white">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="text-lg font-semibold text-gray-800">{a.serviceName || 'Servicio'}</h4>
                  <span className="text-sm text-gray-600">
                    {formatDateTimeCustom(a.startTime)} - {formatDateTimeCustom(a.endTime)}
                  </span>
                </div>
                <p className="text-sm text-gray-700">Estado: {a.active ? 'Activa' : 'Inactiva'}</p>
                {a.active && (
                  <button
                    className="flex items-center gap-1 text-red-600 hover:text-red-800 mt-2"
                    onClick={() => handleDeleteAvailability(a.id)}
                    disabled={loading}
                  >
                    <Trash2 className="w-4 h-4" /> Eliminar
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-md w-full shadow-lg relative">
              <button
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                onClick={() => setShowModal(false)}
              >×</button>
              <h3 className="text-xl font-bold mb-4 text-gray-800">Agregar Disponibilidad</h3>
              <form className="space-y-4" onSubmit={e => { e.preventDefault(); handleAddAvailability() }}>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Servicio</label>
                  <select
                    name="serviceName"
                    value={form.serviceName}
                    onChange={handleFormChange}
                    className="w-full p-3 border rounded-lg bg-gray-100 text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                    required
                  >
                    <option value="">Selecciona un servicio</option>
                    {serviceEntities.map(s => (
                      <option key={s.id} value={s.serviceName}>{s.serviceName}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de inicio</label>
                  <input
                    type="date"
                    name="startDate"
                    min={new Date().toISOString().split('T')[0]}
                    value={form.startDate}
                    onChange={handleFormChange}
                    className="w-full p-3 border rounded-lg bg-gray-100 text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hora de inicio</label>
                  <input
                    type="number"
                    name="startHour"
                    min="0"
                    max="23"
                    value={form.startHour}
                    onChange={handleFormChange}
                    className="w-full p-3 border rounded-lg bg-gray-100 text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fecha de fin</label>
                  <input
                    type="date"
                    name="endDate"
                    min={form.startDate || new Date().toISOString().split('T')[0]}
                    value={form.endDate}
                    onChange={handleFormChange}
                    className="w-full p-3 border rounded-lg bg-gray-100 text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hora de fin</label>
                  <input
                    type="number"
                    name="endHour"
                    min="0"
                    max="23"
                    value={form.endHour}
                    onChange={handleFormChange}
                    className="w-full p-3 border rounded-lg bg-gray-100 text-gray-800 placeholder-gray-400 focus:ring-2 focus:ring-gray-500 focus:border-gray-500"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
                  disabled={loading}
                >
                  {loading ? 'Agregando...' : 'Agregar'}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    )
  }

 // Cancelar booking pendiente
  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('¿Seguro que deseas cancelar esta solicitud?')) return
    setLoading(true)
    try {
      const res = await fetch(`${BASE_URL}/bookings/${bookingId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (!res.ok) throw new Error('Error al cancelar la solicitud')
      await fetchSitterData()
    } catch (err) {
      alert(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Renderiza las solicitudes usando los datos de bookings
  const renderSolicitudes = () => {
    const bookings = sitterData?.bookings ?? []
    const reviews = sitterData?.reviews ?? []
    if (bookings.length === 0) {
      return <p className="text-gray-500">No tienes solicitudes.</p>
    }
    return (
      <div className="space-y-4">
        {bookings.map(b => {
          // Buscar review asociada al booking
          const review = reviews.find(r => r.bookingId === b.id)
          return (
            <div key={b.id} className="border rounded-lg p-4 shadow-sm bg-white">
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-lg font-semibold text-gray-800">Solicitud #{b.id}</h4>
                <div>
                  <span className="text-sm font-bold text-purple-700 bg-purple-100 px-2 py-1 rounded mr-2">
                    {formatDateTimeCustom(b.startDateTime)}
                  </span>
                  <span className="text-sm font-bold text-pink-700 bg-pink-100 px-2 py-1 rounded">
                    {formatDateTimeCustom(b.endDateTime)}
                  </span>
                </div>
              </div>
              <p className="text-sm text-gray-700 mb-1">Cliente: {b.ownerName}</p>
              <p className="text-sm text-gray-700">Mascota: {b.petName}</p>
              <p className="text-sm text-gray-700">Servicio ID: {b.serviceEntityId}</p>
              <p className="text-sm text-gray-700">Precio: ${b.totalPrice}</p>
              <p className="text-sm text-gray-700">Instrucciones: {b.specialInstructions || 'Sin instrucciones'}</p>
              <p className="text-sm text-gray-700">Estado: <span className="font-semibold">{b.status}</span></p>
              <p className="text-sm text-gray-700">Duración: {
                (() => {
                  const start = new Date(b.startDateTime)
                  const end = new Date(b.endDateTime)
                  const diffMs = end - start
                  const diffHours = diffMs / (1000 * 60 * 60)
                  return diffHours.toFixed(2) + ' horas'
                })()
              }</p>
              <div className="flex items-center gap-2 mt-2">
                {review && (
                  <>
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    ))}
                    <button
                      className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded hover:bg-yellow-200"
                      onClick={() => setReviewModal({ open: true, review })}
                    >
                      Ver Review
                    </button>
                  </>
                )}
                {b.status === 'PENDIENTE' && (
                  <button
                    className="bg-red-100 text-red-700 px-3 py-1 rounded hover:bg-red-200"
                    onClick={() => handleCancelBooking(b.id)}
                    disabled={loading}
                  >
                    Cancelar
                  </button>
                )}
              </div>
            </div>
          )
        })}
        {/* Modal para mostrar review */}
        {reviewModal.open && reviewModal.review && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 max-w-md w-full shadow-lg relative">
              <button
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                onClick={() => setReviewModal({ open: false, review: null })}
              >×</button>
              <h3 className="text-xl font-bold mb-4 text-gray-800">Review de la Solicitud</h3>
              <ul className="space-y-2 text-gray-700 text-sm">
                <li><strong>Cliente:</strong> {reviewModal.review.ownerName || 'Cliente'}</li>
                <li><strong>Comentario:</strong> {reviewModal.review.comment || 'Sin comentario'}</li>
                <li className="flex items-center gap-1">
                  <strong>Rating:</strong>
                  {[...Array(reviewModal.review.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  ))}
                </li>
                <li><strong>Fecha:</strong> {reviewModal.review.createdAt ? formatDateTimeCustom(reviewModal.review.createdAt) : 'N/A'}</li>
              </ul>
              <div className="mt-6 text-right">
                <button
                  className="bg-gray-800 text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-700"
                  onClick={() => setReviewModal({ open: false, review: null })}
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  // Renderiza los clientes favoritos usando los datos de reviews
  const renderMisClientes = () => {
    const reviews = sitterData?.reviews ?? [];
    if (reviews.length === 0) {
      return <p className="text-gray-500">No tienes clientes favoritos aún.</p>;
    }
    return (
      <div className="space-y-4">
        {reviews.map(review => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>
    );
  }

  return (
    <> <SitterNavbar />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:py-8">
          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">Panel de Cuidador</h1>
            <p className="text-gray-600">Gestiona tus servicios y clientes</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8">
            <button
              onClick={() => setActiveSection('solicitudes')}
              className={`p-6 rounded-lg border-2 transition-all text-left ${activeSection === 'solicitudes'
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

            <button
              onClick={() => setActiveSection('servicios')}
              className={`p-6 rounded-lg border-2 transition-all text-left ${activeSection === 'servicios'
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

            <button
              onClick={() => setActiveSection('clientes')}
              className={`p-6 rounded-lg border-2 transition-all text-left ${activeSection === 'clientes'
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

          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6">
              {activeSection === 'solicitudes'
                ? renderSolicitudes()
                : activeSection === 'servicios'
                  ? renderServicios()
                  : renderMisClientes()
              }
            </div>
          </div>
        </div>
      </div>
    </>

  )
}