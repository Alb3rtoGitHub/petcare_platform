import { useEffect, useState } from "react";
import {
  Calendar,
  Users,
  Heart,
  MessageSquare,
  Eye,
  Plus,
  Star,
  Loader2,
  AlertCircle,
} from "lucide-react";
import SitterNavbar from "../../components/SitterNavbar.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import BookingService from "../../services/BookingService.js";
import SitterService from "../../services/SitterService.js";
import { showNotification } from "../../components/NotificationProvider.jsx";

export default function SitterDashboard() {
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState("solicitudes");

  // Estados para datos
  const [openBookings, setOpenBookings] = useState([]);
  const [myBookings, setMyBookings] = useState([]);
  const [sitterProfile, setSitterProfile] = useState(null);

  // Estados para loading y errores
  const [loading, setLoading] = useState({
    bookings: false,
    profile: false,
    general: false,
  });
  const [error, setError] = useState({
    bookings: null,
    profile: null,
    general: null,
  });

  // Cargar datos iniciales
  useEffect(() => {
    if (user?.id) {
      loadBookings();
      loadSitterProfile();
    }
  }, [user]);

  // Cargar reservas abiertas y las del sitter
  const loadBookings = async () => {
    try {
      setLoading((prev) => ({ ...prev, bookings: true }));
      setError((prev) => ({ ...prev, bookings: null }));

      // Obtener reservas pendientes
      const pendingBookings = await BookingService.getPendingBookings();
      setOpenBookings(pendingBookings.content || []);

      // Obtener reservas aceptadas por este sitter
      const acceptedBookings = await BookingService.getAcceptedBookingsBySitter(
        user.id
      );
      setMyBookings(acceptedBookings.content || []);
    } catch (error) {
      console.error("Error cargando reservas:", error);
      setError((prev) => ({ ...prev, bookings: error.message }));
    } finally {
      setLoading((prev) => ({ ...prev, bookings: false }));
    }
  };

  // Cargar perfil del sitter
  const loadSitterProfile = async () => {
    try {
      setLoading((prev) => ({ ...prev, profile: true }));
      setError((prev) => ({ ...prev, profile: null }));

      const profile = await SitterService.getSitter(user.id);
      setSitterProfile(profile);
    } catch (error) {
      console.error("Error cargando perfil de sitter:", error);
      setError((prev) => ({ ...prev, profile: error.message }));
    } finally {
      setLoading((prev) => ({ ...prev, profile: false }));
    }
  };

  // Manejar aceptación de reserva
  const handleAcceptBooking = async (bookingId) => {
    try {
      setLoading((prev) => ({ ...prev, general: true }));
      await BookingService.updateBookingStatus(bookingId, "ACCEPTED");
      await loadBookings(); // Recargar datos
      showNotification(
        "success",
        "Reserva Aceptada",
        "Has aceptado la reserva exitosamente. El cliente será notificado."
      );
    } catch (error) {
      console.error("Error aceptando reserva:", error);
      setError((prev) => ({ ...prev, general: error.message }));
      showNotification(
        "error",
        "Error",
        "No se pudo aceptar la reserva. Inténtalo de nuevo."
      );
    } finally {
      setLoading((prev) => ({ ...prev, general: false }));
    }
  };

  // Manejar rechazo de reserva
  const handleRejectBooking = async (bookingId) => {
    try {
      setLoading((prev) => ({ ...prev, general: true }));
      await BookingService.updateBookingStatus(bookingId, "REJECTED");
      await loadBookings(); // Recargar datos
      showNotification(
        "info",
        "Reserva Rechazada",
        "Has rechazado la reserva. El cliente será notificado."
      );
    } catch (error) {
      console.error("Error rechazando reserva:", error);
      setError((prev) => ({ ...prev, general: error.message }));
      showNotification(
        "error",
        "Error",
        "No se pudo rechazar la reserva. Inténtalo de nuevo."
      );
    } finally {
      setLoading((prev) => ({ ...prev, general: false }));
    }
  };

  // Manejar completar servicio
  const handleCompleteBooking = async (bookingId) => {
    try {
      setLoading((prev) => ({ ...prev, general: true }));
      await BookingService.updateBookingStatus(bookingId, "COMPLETED");
      await loadBookings(); // Recargar datos
      showNotification(
        "success",
        "Servicio Completado",
        "¡Excelente! Has marcado el servicio como completado. El cliente puede dejarte una reseña."
      );
    } catch (error) {
      console.error("Error completando reserva:", error);
      setError((prev) => ({ ...prev, general: error.message }));
      showNotification(
        "error",
        "Error",
        "No se pudo completar el servicio. Inténtalo de nuevo."
      );
    } finally {
      setLoading((prev) => ({ ...prev, general: false }));
    }
  };

  // Formatear fecha para mostrar
  const formatDate = (dateString) => {
    if (!dateString) return "Fecha no disponible";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("es-ES", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch (error) {
      return dateString;
    }
  };

  // Formatear hora para mostrar
  const formatTime = (timeString) => {
    if (!timeString) return "Hora no disponible";
    try {
      const time = new Date(`1970-01-01T${timeString}`);
      return time.toLocaleTimeString("es-ES", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      return timeString;
    }
  };

  // Obtener tipo de servicio formateado
  const getServiceTypeDisplay = (type) => {
    const typeMap = {
      DOG_WALKING: "Paseo de Perros",
      PET_SITTING: "Cuidado en Casa",
      GROOMING: "Peluquería",
      VETERINARY: "Veterinaria",
      TRAINING: "Entrenamiento",
      DAYCARE: "Guardería",
    };
    return typeMap[type] || type;
  };

  const renderSolicitudes = () => (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
          Solicitudes de Servicio
        </h2>
        <div className="text-sm text-gray-600">
          {openBookings.length} solicitudes disponibles
        </div>
      </div>

      {/* Error de carga */}
      {error.bookings && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-500" />
          <div>
            <h3 className="font-medium text-red-800">
              Error al cargar reservas
            </h3>
            <p className="text-sm text-red-600">{error.bookings}</p>
          </div>
          <button
            onClick={loadBookings}
            className="ml-auto text-red-700 hover:text-red-800 text-sm font-medium"
          >
            Reintentar
          </button>
        </div>
      )}

      {/* Loading indicator */}
      {loading.bookings && (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
          <span className="ml-2 text-gray-600">Cargando reservas...</span>
        </div>
      )}

      {!loading.bookings && !error.bookings && (
        <div className="space-y-4">
          {/* Mis servicios activos */}
          <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Mis Servicios Aceptados
            </h3>
            <div className="space-y-3">
              {myBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex-1">
                    <div className="font-medium text-gray-800">
                      {booking.pet?.name || "Mascota"} —{" "}
                      {getServiceTypeDisplay(booking.serviceType)}
                    </div>
                    <div className="text-sm text-gray-600">
                      {formatDate(booking.scheduledDate)} a las{" "}
                      {formatTime(booking.scheduledTime)}
                    </div>
                    <div className="text-sm text-gray-500">
                      Cliente: {booking.user?.name || "No disponible"}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700">
                      Contactar Cliente
                    </button>
                    <button
                      className="bg-gray-800 text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-700 flex items-center gap-1"
                      onClick={() => handleCompleteBooking(booking.id)}
                      disabled={loading.general}
                    >
                      {loading.general ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : null}
                      Completar
                    </button>
                  </div>
                </div>
              ))}
              {myBookings.length === 0 && (
                <p className="text-gray-500 text-center py-4">
                  No tienes servicios activos
                </p>
              )}
            </div>
          </div>

          {/* Solicitudes disponibles */}
          <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Nuevas Solicitudes
            </h3>
            <div className="space-y-3">
              {openBookings.map((booking) => (
                <div
                  key={booking.id}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-medium text-gray-800">
                          {getServiceTypeDisplay(booking.serviceType)}
                        </h4>
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                          {booking.status || "PENDING"}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p>Mascota: {booking.pet?.name || "No disponible"}</p>
                        <p>
                          Fecha: {formatDate(booking.scheduledDate)} a las{" "}
                          {formatTime(booking.scheduledTime)}
                        </p>
                        <p>Cliente: {booking.user?.name || "No disponible"}</p>
                        {booking.notes && <p>Notas: {booking.notes}</p>}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-gray-900 mb-2">
                        €{booking.totalPrice || "25"}
                      </div>
                      <div className="flex gap-2">
                        <button className="border border-gray-300 text-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-50">
                          Ver Detalles
                        </button>
                        <button
                          className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 flex items-center gap-1"
                          onClick={() => handleRejectBooking(booking.id)}
                          disabled={loading.general}
                        >
                          {loading.general ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : null}
                          Rechazar
                        </button>
                        <button
                          className="bg-gray-800 text-white px-3 py-1 rounded text-sm hover:bg-gray-700 flex items-center gap-1"
                          onClick={() => handleAcceptBooking(booking.id)}
                          disabled={loading.general}
                        >
                          {loading.general ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : null}
                          Aceptar
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {openBookings.length === 0 && (
                <p className="text-gray-500 text-center py-4">
                  No hay solicitudes disponibles
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderServicios = () => {
    // Obtener estadísticas de reservas por tipo de servicio
    const getBookingStats = () => {
      const stats = {};
      myBookings.forEach((booking) => {
        const type = booking.serviceType;
        stats[type] = (stats[type] || 0) + 1;
      });
      return stats;
    };

    const bookingStats = getBookingStats();

    // Servicios disponibles con sus precios base
    const availableServices = [
      {
        type: "DOG_WALKING",
        name: "Paseo de Perros",
        basePrice: 15,
        unit: "hora",
      },
      {
        type: "PET_SITTING",
        name: "Cuidado en Casa",
        basePrice: 25,
        unit: "día",
      },
      { type: "GROOMING", name: "Peluquería", basePrice: 30, unit: "sesión" },
      {
        type: "TRAINING",
        name: "Entrenamiento",
        basePrice: 35,
        unit: "sesión",
      },
      { type: "DAYCARE", name: "Guardería", basePrice: 20, unit: "día" },
      {
        type: "VETERINARY",
        name: "Veterinaria",
        basePrice: 40,
        unit: "consulta",
      },
    ];

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
            Mis Servicios
          </h2>
          <button className="bg-gray-900 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm">
            <Plus className="w-4 h-4" />
            Agregar Servicio
          </button>
        </div>

        {/* Error de perfil */}
        {error.profile && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <div>
              <h3 className="font-medium text-red-800">
                Error al cargar perfil
              </h3>
              <p className="text-sm text-red-600">{error.profile}</p>
            </div>
          </div>
        )}

        {/* Información del perfil del sitter */}
        {sitterProfile && (
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Mi Perfil de Sitter
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Calificación promedio</p>
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-500 fill-current" />
                  <span className="font-semibold">
                    {sitterProfile.averageRating || "5.0"}
                  </span>
                  <span className="text-gray-500">
                    ({sitterProfile.totalReviews || 0} reseñas)
                  </span>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600">Servicios completados</p>
                <p className="text-2xl font-bold text-gray-900">
                  {myBookings.filter((b) => b.status === "COMPLETED").length}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Tarifa por hora</p>
                <p className="text-lg font-semibold text-gray-900">
                  €{sitterProfile.hourlyRate || 20}/hora
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Disponibilidad</p>
                <span
                  className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                    sitterProfile.available
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {sitterProfile.available ? "Disponible" : "No disponible"}
                </span>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {availableServices.map((service) => {
            const completedBookings = bookingStats[service.type] || 0;
            const isActive =
              completedBookings > 0 ||
              (sitterProfile?.services &&
                sitterProfile.services.includes(service.type));

            return (
              <div
                key={service.type}
                className="bg-white border border-gray-200 rounded-lg p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {service.name}
                  </h3>
                  <div
                    className={`w-3 h-3 rounded-full ${
                      isActive ? "bg-green-500" : "bg-gray-400"
                    }`}
                  ></div>
                </div>
                <div className="space-y-3">
                  <div className="text-2xl font-bold text-gray-900">
                    €{sitterProfile?.hourlyRate || service.basePrice}/
                    {service.unit}
                  </div>
                  <div className="text-sm text-gray-600">
                    {completedBookings} reservas completadas
                  </div>
                  <div className="flex gap-2">
                    <button className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 rounded-lg text-sm">
                      Editar
                    </button>
                    <button
                      className={`flex-1 py-2 rounded-lg text-sm ${
                        isActive
                          ? "bg-red-100 text-red-700 hover:bg-red-200"
                          : "bg-green-100 text-green-700 hover:bg-green-200"
                      }`}
                    >
                      {isActive ? "Pausar" : "Activar"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderClientes = () => {
    // Obtener clientes únicos de las reservas
    const getClientStats = () => {
      const clientMap = new Map();

      myBookings.forEach((booking) => {
        if (booking.user) {
          const clientId = booking.user.id;
          if (!clientMap.has(clientId)) {
            clientMap.set(clientId, {
              ...booking.user,
              pets: new Set(),
              totalBookings: 0,
              completedBookings: 0,
              lastBooking: null,
            });
          }

          const client = clientMap.get(clientId);
          client.totalBookings++;
          if (booking.status === "COMPLETED") {
            client.completedBookings++;
          }
          if (booking.pet) {
            client.pets.add(
              `${booking.pet.name} (${booking.pet.species || "Mascota"})`
            );
          }

          // Actualizar última reserva
          if (
            !client.lastBooking ||
            new Date(booking.scheduledDate) > new Date(client.lastBooking)
          ) {
            client.lastBooking = booking.scheduledDate;
          }
        }
      });

      return Array.from(clientMap.values()).map((client) => ({
        ...client,
        pets: Array.from(client.pets),
        rating: 5.0, // Por defecto hasta implementar sistema de ratings
      }));
    };

    const clients = getClientStats();

    return (
      <div className="space-y-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
          Mis Clientes
        </h2>

        {/* Estadísticas generales */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-500" />
              <span className="text-sm text-gray-600">Total Clientes</span>
            </div>
            <div className="text-2xl font-bold text-gray-900 mt-1">
              {clients.length}
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-green-500" />
              <span className="text-sm text-gray-600">Servicios Activos</span>
            </div>
            <div className="text-2xl font-bold text-gray-900 mt-1">
              {myBookings.filter((b) => b.status === "ACCEPTED").length}
            </div>
          </div>
          <div className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-red-500" />
              <span className="text-sm text-gray-600">Completados</span>
            </div>
            <div className="text-2xl font-bold text-gray-900 mt-1">
              {myBookings.filter((b) => b.status === "COMPLETED").length}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {clients.length > 0 ? (
            clients.map((client) => (
              <div
                key={client.id}
                className="bg-white border border-gray-200 rounded-lg p-6"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-gray-500" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold text-gray-800">
                        {client.name}
                      </h3>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-600">
                          {client.rating}
                        </span>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm mb-2">
                      Mascotas:{" "}
                      {client.pets.length > 0
                        ? client.pets.join(", ")
                        : "Sin mascotas registradas"}
                    </p>
                    <p className="text-gray-500 text-xs mb-3">
                      {client.completedBookings}/{client.totalBookings}{" "}
                      servicios completados
                    </p>
                    <p className="text-gray-500 text-xs mb-3">
                      Última reserva:{" "}
                      {client.lastBooking
                        ? formatDate(client.lastBooking)
                        : "Nunca"}
                    </p>
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
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Heart className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-600 mb-2">
                Aún no tienes clientes
              </h3>
              <p className="text-gray-500 text-center mb-6 max-w-md">
                Una vez que aceptes y completes servicios, aparecerán aquí tus
                clientes.
              </p>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      <SitterNavbar />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
              Panel de Cuidador
            </h1>
            <p className="text-gray-600">Gestiona tus servicios y clientes</p>
          </div>

          {/* Navigation Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8">
            {/* Solicitudes */}
            <button
              onClick={() => setActiveSection("solicitudes")}
              className={`p-6 rounded-lg border-2 transition-all text-left ${
                activeSection === "solicitudes"
                  ? "border-gray-900 bg-gray-50"
                  : "border-gray-200 bg-white hover:border-gray-300"
              }`}
            >
              <div className="flex flex-col items-center text-center">
                <Calendar className="w-12 h-12 text-gray-700 mb-3" />
                <h3 className="text-lg font-semibold text-gray-800 mb-1">
                  Solicitudes
                </h3>
                <p className="text-sm text-gray-600">
                  Nuevas solicitudes de servicio
                </p>
              </div>
            </button>

            {/* Mis Servicios */}
            <button
              onClick={() => setActiveSection("servicios")}
              className={`p-6 rounded-lg border-2 transition-all text-left ${
                activeSection === "servicios"
                  ? "border-gray-900 bg-gray-50"
                  : "border-gray-200 bg-white hover:border-gray-300"
              }`}
            >
              <div className="flex flex-col items-center text-center">
                <Users className="w-12 h-12 text-gray-700 mb-3" />
                <h3 className="text-lg font-semibold text-gray-800 mb-1">
                  Mis Servicios
                </h3>
                <p className="text-sm text-gray-600">Gestiona tus servicios</p>
              </div>
            </button>

            {/* Clientes */}
            <button
              onClick={() => setActiveSection("clientes")}
              className={`p-6 rounded-lg border-2 transition-all text-left ${
                activeSection === "clientes"
                  ? "border-gray-900 bg-gray-50"
                  : "border-gray-200 bg-white hover:border-gray-300"
              }`}
            >
              <div className="flex flex-col items-center text-center">
                <Heart className="w-12 h-12 text-gray-700 mb-3" />
                <h3 className="text-lg font-semibold text-gray-800 mb-1">
                  Mis Clientes
                </h3>
                <p className="text-sm text-gray-600">Clientes favoritos</p>
              </div>
            </button>
          </div>

          {/* Content Section */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6">
              {activeSection === "solicitudes" && renderSolicitudes()}
              {activeSection === "servicios" && renderServicios()}
              {activeSection === "clientes" && renderClientes()}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
