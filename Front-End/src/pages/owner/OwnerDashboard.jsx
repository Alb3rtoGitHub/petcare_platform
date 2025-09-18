import { useEffect, useState } from "react";
import {
  Heart,
  Calendar,
  Users,
  MessageSquare,
  Eye,
  Plus,
  Search,
  BookOpen,
  Star,
  AlertCircle,
  Loader2,
} from "lucide-react";
import OwnerNavbar from "../../components/OwnerNavbar.jsx";
import { Link } from "react-router-dom";
import ReservationModal from "../../components/modals/ReservationModal.jsx";
import RatingModal from "../../components/modals/RatingModal.jsx";
import CancelModal from "../../components/modals/CancelModal.jsx";
import ReceiptModal from "../../components/modals/ReceiptModal.jsx";
import DetailsModal from "../../components/modals/DetailsModal.jsx";
import AddPetModal from "../../components/modals/AddPetModal.jsx";
import EditPetModal from "../../components/modals/EditPetModal.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import PetService from "../../services/PetService.js";
import BookingService from "../../services/BookingService.js";
import UserService from "../../services/UserService.js";
import { showNotification } from "../../components/NotificationProvider.jsx";

export default function OwnerDashboard() {
  const { user } = useAuth();
  const [activeSection, setActiveSection] = useState("reservas");

  // Estados para datos
  const [pets, setPets] = useState([]);
  const [reservas, setReservas] = useState([]);
  const [previousReservas, setPreviousReservas] = useState([]);
  const [loading, setLoading] = useState({
    pets: false,
    reservas: false,
    general: false,
  });
  const [error, setError] = useState({
    pets: null,
    reservas: null,
    general: null,
  });

  // Estados para modales
  const [openRatingModal, setOpenRatingModal] = useState(false);
  const [openCancelModal, setOpenCancelModal] = useState(false);
  const [openReceiptModal, setOpenReceiptModal] = useState(false);
  const [openDetailsModal, setOpenDetailsModal] = useState(false);
  const [openAddPet, setOpenAddPet] = useState(false);
  const [openEditPet, setOpenEditPet] = useState(false);
  const [editingPet, setEditingPet] = useState(null);

  // Info para modales
  const [selectedReserva, setSelectedReserva] = useState(null);
  const [selectedCuidador, setSelectedCuidador] = useState(null);

  // Cargar datos iniciales y configurar polling
  useEffect(() => {
    if (user?.id) {
      loadPets();
      loadBookings();

      // Polling cada 30 segundos para actualizar reservas
      const interval = setInterval(() => {
        if (activeSection === "reservas") {
          loadBookings(true); // silent = true para no mostrar loading
        }
      }, 30000);

      return () => clearInterval(interval);
    }
  }, [user, activeSection]);

  // Cargar mascotas del owner
  const loadPets = async () => {
    try {
      setLoading((prev) => ({ ...prev, pets: true }));
      setError((prev) => ({ ...prev, pets: null }));

      const petsData = await PetService.getAllPetsByOwner(user.id);
      const formattedPets = petsData.map((pet) =>
        PetService.formatPetForDisplay(pet)
      );
      setPets(formattedPets);
    } catch (error) {
      console.error("Error cargando mascotas:", error);
      setError((prev) => ({ ...prev, pets: error.message }));
    } finally {
      setLoading((prev) => ({ ...prev, pets: false }));
    }
  };

  // Cargar reservas del owner
  const loadBookings = async (silent = false) => {
    try {
      if (!silent) {
        setLoading((prev) => ({ ...prev, reservas: true }));
      }
      setError((prev) => ({ ...prev, reservas: null }));

      const bookingsData = await BookingService.getBookingsByUser(user.id);
      const formattedBookings = bookingsData.content
        ? bookingsData.content.map(formatBookingForDisplay)
        : [];

      // Detectar cambios en el estado de las reservas
      if (reservas.length > 0) {
        formattedBookings.forEach((newBooking) => {
          const oldBooking = reservas.find((old) => old.id === newBooking.id);
          if (oldBooking && oldBooking.estado !== newBooking.estado) {
            // Notificar cambio de estado
            const statusMessages = {
              ACCEPTED: "Tu reserva ha sido aceptada por el cuidador",
              REJECTED:
                "Tu reserva ha sido rechazada. Puedes buscar otro cuidador",
              COMPLETED:
                "El servicio ha sido completado. ¡Puedes dejar una reseña!",
            };

            if (statusMessages[newBooking.estado]) {
              showNotification(
                "info",
                "Estado de Reserva Actualizado",
                statusMessages[newBooking.estado]
              );
            }
          }
        });
      }

      setPreviousReservas(reservas);
      setReservas(formattedBookings);
    } catch (error) {
      console.error("Error cargando reservas:", error);
      if (!silent) {
        setError((prev) => ({ ...prev, reservas: error.message }));
      }
    } finally {
      if (!silent) {
        setLoading((prev) => ({ ...prev, reservas: false }));
      }
    }
  };

  // Formatear reserva para mostrar en el dashboard
  const formatBookingForDisplay = (booking) => {
    const formatDate = (dateString) => {
      const date = new Date(dateString);
      return date.toLocaleDateString("es-ES", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    };

    const formatTime = (startDate, endDate) => {
      const start = new Date(startDate);
      const end = new Date(endDate);
      return `${start.toLocaleTimeString("es-ES", {
        hour: "2-digit",
        minute: "2-digit",
      })} - ${end.toLocaleTimeString("es-ES", {
        hour: "2-digit",
        minute: "2-digit",
      })}`;
    };

    const getStatusColor = (status) => {
      const statusColors = {
        PENDING: "bg-yellow-100 text-yellow-800",
        ACCEPTED: "bg-blue-100 text-blue-800",
        COMPLETED: "bg-green-100 text-green-800",
        CANCELLED: "bg-red-100 text-red-800",
        REJECTED: "bg-red-100 text-red-800",
      };
      return statusColors[status] || "bg-gray-100 text-gray-800";
    };

    const getStatusText = (status) => {
      const statusTexts = {
        PENDING: "Pendiente",
        ACCEPTED: "Confirmada",
        COMPLETED: "Finalizada",
        CANCELLED: "Cancelada",
        REJECTED: "Rechazada",
      };
      return statusTexts[status] || status;
    };

    return {
      id: booking.id,
      cuidador: booking.sitterName || "Sin asignar",
      avatar: `https://i.pravatar.cc/150?u=${booking.sitterId}`,
      estado: getStatusText(booking.status),
      estadoColor: getStatusColor(booking.status),
      fecha: formatDate(booking.startDateTime),
      hora: formatTime(booking.startDateTime, booking.endDateTime),
      lugar: "Ubicación del servicio", // Placeholder hasta tener datos de ubicación
      servicio: `${booking.serviceName} para ${booking.petName}`,
      precio: `€${booking.totalPrice?.toFixed(2) || "0.00"}`,
      puedeEvaluar: booking.status === "COMPLETED",
      specialInstructions: booking.specialInstructions,
      createdAt: booking.createdAt,
      status: booking.status,
      sitterId: booking.sitterId,
    };
  };

  // listen for navbar requests to open the reservation modal
  useEffect(() => {
    function onOpenReservation() {
      setActiveSection("reservar");
    }
    window.addEventListener("open:reservation-modal", onOpenReservation);
    return () =>
      window.removeEventListener("open:reservation-modal", onOpenReservation);
  }, []);

  // Event listener fallback for deletion triggered from modal (in case modal uses CustomEvent)
  useEffect(() => {
    function onPetDelete(e) {
      const id = e?.detail?.id;
      if (!id) return;
      setPets((list) => list.filter((p) => p.id !== id));
    }
    window.addEventListener("owner:pet-delete", onPetDelete);
    return () => window.removeEventListener("owner:pet-delete", onPetDelete);
  }, []);

  // Handlers para acciones de reservas
  const handleCancelBooking = async (bookingId) => {
    try {
      setLoading((prev) => ({ ...prev, general: true }));
      await BookingService.cancelBooking(bookingId);
      await loadBookings(); // Recargar datos
    } catch (error) {
      console.error("Error cancelando reserva:", error);
      alert("Error al cancelar la reserva: " + error.message);
    } finally {
      setLoading((prev) => ({ ...prev, general: false }));
    }
  };

  const handleAddPet = async (petData) => {
    try {
      setLoading((prev) => ({ ...prev, general: true }));
      const formattedPet = PetService.formatPetForBackend(petData);
      await PetService.createPet(user.id, formattedPet);
      await loadPets(); // Recargar mascotas
      setOpenAddPet(false);
    } catch (error) {
      console.error("Error agregando mascota:", error);
      throw error;
    } finally {
      setLoading((prev) => ({ ...prev, general: false }));
    }
  };

  const handleUpdatePet = async (petData) => {
    try {
      setLoading((prev) => ({ ...prev, general: true }));
      const formattedPet = PetService.formatPetForBackend(petData);
      await PetService.updatePet(editingPet.id, formattedPet);
      await loadPets(); // Recargar mascotas
      setOpenEditPet(false);
      setEditingPet(null);
    } catch (error) {
      console.error("Error actualizando mascota:", error);
      throw error;
    } finally {
      setLoading((prev) => ({ ...prev, general: false }));
    }
  };

  const handleDeletePet = async (petId) => {
    try {
      setLoading((prev) => ({ ...prev, general: true }));
      await PetService.deletePet(petId);
      await loadPets(); // Recargar mascotas
      setOpenEditPet(false);
      setEditingPet(null);
    } catch (error) {
      console.error("Error eliminando mascota:", error);
      throw error;
    } finally {
      setLoading((prev) => ({ ...prev, general: false }));
    }
  };

  // Helper: calcula la cantidad de horas a partir del string "HH:MM - HH:MM"
  function getHoursFromRange(horaRange) {
    try {
      const parts = horaRange.split("-").map((s) => s.trim());
      if (parts.length !== 2) return "";
      const [start, end] = parts;
      const [sh, sm] = start.split(":").map(Number);
      const [eh, em] = end.split(":").map(Number);
      let diff = eh + em / 60 - (sh + sm / 60);
      if (diff <= 0) diff = 0.5; // fallback
      return `${diff % 1 === 0 ? diff : diff.toFixed(1)} h`;
    } catch (e) {
      return "";
    }
  }

  const renderReservas = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-black">Mis Reservas</h2>
        <div className="flex gap-2">
          <button
            className="bg-gray-900 text-white px-6 py-2 rounded-lg flex items-center gap-2 text-base font-medium shadow hover:bg-gray-800"
            onClick={() => setActiveSection("reservar")}
          >
            <Plus className="w-5 h-5" /> Nueva Reserva
          </button>
        </div>
      </div>

      {/* Loading State */}
      {loading.reservas && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
          <span className="ml-2 text-gray-600">Cargando reservas...</span>
        </div>
      )}

      {/* Error State */}
      {error.reservas && (
        <div className="flex items-center justify-center py-12 text-red-600">
          <AlertCircle className="w-8 h-8 mr-2" />
          <span>Error: {error.reservas}</span>
        </div>
      )}

      {/* Empty State */}
      {!loading.reservas && !error.reservas && reservas.length === 0 && (
        <div className="text-center py-12">
          <Calendar className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-600 mb-2">
            No tienes reservas aún
          </h3>
          <p className="text-gray-500 mb-6">
            Crea tu primera reserva para comenzar a usar nuestros servicios
          </p>
          <button
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            onClick={() => setActiveSection("reservar")}
          >
            Crear Reserva
          </button>
        </div>
      )}

      {/* Reservas List */}
      {!loading.reservas && !error.reservas && (
        <div className="flex flex-col gap-3">
          {reservas.map((reserva) => (
            <div
              key={reserva.id}
              className="bg-white border border-gray-200 rounded-xl shadow p-4 flex flex-col sm:flex-row gap-4 items-start"
              style={{ minHeight: "140px" }}
            >
              <img
                src={reserva.avatar}
                alt={reserva.cuidador}
                className="w-16 h-16 rounded-full object-cover border-2 border-gray-300 flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-2 gap-4">
                  <div className="truncate">
                    <h3 className="text-xl sm:text-2xl font-semibold text-gray-800">
                      {reserva.cuidador}
                    </h3>
                    <p className="text-base text-gray-600">
                      {reserva.servicio}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-lg sm:text-xl font-bold text-gray-900">
                      {reserva.precio}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      {getHoursFromRange(reserva.hora)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-sm text-gray-600 mb-2">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm">{reserva.fecha}</span>
                  <span className="text-sm">{reserva.hora}</span>
                  <span className="text-sm">{reserva.lugar}</span>
                </div>

                {reserva.estado === "Finalizada" && (
                  <div className="bg-gray-100 p-3 rounded-lg mt-2">
                    <div className="flex items-center gap-2">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`w-5 h-5 ${
                            i < (reserva.rating || 0)
                              ? "text-yellow-500"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="text-base text-gray-700 font-medium">
                      Valoración: {reserva.rating}
                    </p>
                    <p className="text-sm text-gray-500 italic">
                      "{reserva.comment}"
                    </p>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row sm:justify-end gap-2 mt-4">
                  <div className="flex gap-2 order-2 sm:order-1">
                    <button
                      className="px-4 py-2 rounded-lg text-sm font-medium bg-red-500 text-white hover:bg-red-600"
                      onClick={() => {
                        setSelectedReserva(reserva);
                        setOpenCancelModal(true);
                      }}
                    >
                      Cancelar
                    </button>
                    <button
                      className="px-4 py-2 rounded-lg text-sm font-medium bg-blue-500 text-white hover:bg-blue-600"
                      onClick={() => {
                        setSelectedReserva(reserva);
                        setOpenDetailsModal(true);
                      }}
                    >
                      Detalles
                    </button>
                    <button
                      className="px-4 py-2 rounded-lg text-sm font-medium bg-green-600 text-white hover:bg-green-700"
                      onClick={() => {
                        setSelectedReserva(reserva);
                        setOpenReceiptModal(true);
                      }}
                    >
                      Recibo
                    </button>
                  </div>

                  {reserva.puedeEvaluar && (
                    <div className="order-1 sm:order-2">
                      <button
                        className="bg-yellow-500 text-black px-5 py-2 rounded-lg text-sm font-semibold hover:bg-yellow-600"
                        onClick={() => {
                          setSelectedReserva(reserva);
                          setOpenRatingModal(true);
                        }}
                      >
                        Evaluar Servicio
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderMascotas = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
          Mis Mascotas
        </h2>
        <button
          className="bg-gray-900 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm"
          onClick={() => setOpenAddPet(true)}
        >
          <Plus className="w-4 h-4" />
          Agregar Mascota
        </button>
      </div>

      {/* Loading State */}
      {loading.pets && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-gray-500" />
          <span className="ml-2 text-gray-600">Cargando mascotas...</span>
        </div>
      )}

      {/* Error State */}
      {error.pets && (
        <div className="flex items-center justify-center py-12 text-red-600">
          <AlertCircle className="w-8 h-8 mr-2" />
          <span>Error: {error.pets}</span>
        </div>
      )}

      {/* Empty State */}
      {!loading.pets && !error.pets && pets.length === 0 && (
        <div className="text-center py-12">
          <Users className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-lg font-medium text-gray-600 mb-2">
            No tienes mascotas registradas
          </h3>
          <p className="text-gray-500 mb-6">
            Agrega tu primera mascota para comenzar a usar nuestros servicios
          </p>
          <button
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            onClick={() => setOpenAddPet(true)}
          >
            Agregar Mascota
          </button>
        </div>
      )}

      {/* Pets Grid */}
      {!loading.pets && !error.pets && pets.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {pets.map((pet, idx) => (
            <div
              key={pet.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden"
            >
              <div className="h-48 bg-gray-300 relative">
                <img
                  src={
                    pet.image ||
                    `https://i.pravatar.cc/600?u=pet-${pet.id || idx}`
                  }
                  alt={pet.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-1">
                      {pet.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {pet.type} · {pet.breed}
                    </p>
                  </div>
                  <div className="text-sm text-gray-500">{pet.age}</div>
                </div>
                <div className="mt-4 flex gap-2">
                  <button
                    className="flex-1 bg-gray-900 text-white py-2 rounded-lg text-sm font-medium hover:bg-gray-800"
                    onClick={() => {
                      setEditingPet(pet);
                      setOpenEditPet(true);
                    }}
                  >
                    Editar Perfil
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // Renderizar formulario de reserva inline
  const renderReservationForm = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-black">Nueva Reserva</h2>
        <button
          className="text-gray-500 hover:text-gray-700"
          onClick={() => setActiveSection("reservas")}
        >
          ← Volver a Mis Reservas
        </button>
      </div>

      <ReservationModal
        open={true}
        onClose={() => setActiveSection("reservas")}
        onSubmit={() => {
          setActiveSection("reservas");
          loadBookings(); // Recargar reservas después de crear una nueva
        }}
      />
    </div>
  );

  const renderFavoritos = () => (
    <div className="space-y-6">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
        Cuidadores Favoritos
      </h2>

      <div className="flex flex-col items-center justify-center py-12">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <Heart className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-600 mb-2">
          No tienes favoritos aún
        </h3>
        <p className="text-gray-500 text-center mb-6 max-w-md">
          Agrega cuidadores a favoritos para encontrarlos fácilmente
        </p>
        <button className="bg-gray-900 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors">
          Buscar Cuidadores
        </button>
      </div>
    </div>
  );

  return (
    <>
      <OwnerNavbar />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2">
              Mi Dashboard
            </h1>
            <p className="text-gray-600">
              Bienvenido, {user?.fullName || user?.name || "Usuario"}. Gestiona
              tus mascotas y reservas
            </p>
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
                <h3 className="text-lg font-semibold text-gray-800 mb-1">
                  Buscar Cuidadores
                </h3>
                <p className="text-sm text-gray-600">
                  Encuentra el cuidador perfecto
                </p>
              </div>
            </Link>

            {/* Reservar Servicio */}
            <button
              onClick={() => setActiveSection("reservar")}
              className={`p-6 rounded-lg border-2 transition-all text-left ${
                activeSection === "reservar"
                  ? "border-gray-900 bg-gray-50"
                  : "border-gray-200 bg-white hover:border-gray-300"
              }`}
            >
              <div className="flex flex-col items-center text-center">
                <BookOpen className="w-12 h-12 text-gray-700 mb-3" />
                <h3 className="text-lg font-semibold text-gray-800 mb-1">
                  Reservar Servicio
                </h3>
                <p className="text-sm text-gray-600">
                  Agenda un nuevo servicio
                </p>
              </div>
            </button>

            {/* Mis Reservas */}
            <button
              onClick={() => setActiveSection("reservas")}
              className={`p-6 rounded-lg border-2 transition-all text-left ${
                activeSection === "reservas"
                  ? "border-gray-900 bg-gray-50"
                  : "border-gray-200 bg-white hover:border-gray-300"
              }`}
            >
              <div className="flex flex-col items-center text-center">
                <Calendar className="w-12 h-12 text-gray-700 mb-3" />
                <h3 className="text-lg font-semibold text-gray-800 mb-1">
                  Mis Reservas
                </h3>
                <p className="text-sm text-gray-600">
                  Gestiona todas tus reservas
                </p>
              </div>
            </button>

            {/* Mis Mascotas */}
            <button
              onClick={() => setActiveSection("mascotas")}
              className={`p-6 rounded-lg border-2 transition-all text-left ${
                activeSection === "mascotas"
                  ? "border-gray-900 bg-gray-50"
                  : "border-gray-200 bg-white hover:border-gray-300"
              }`}
            >
              <div className="flex flex-col items-center text-center">
                <Users className="w-12 h-12 text-gray-700 mb-3" />
                <h3 className="text-lg font-semibold text-gray-800 mb-1">
                  Mis Mascotas
                </h3>
                <p className="text-sm text-gray-600">Gestiona tus mascotas</p>
              </div>
            </button>

            {/* Favoritos */}
            <button
              onClick={() => setActiveSection("favoritos")}
              className={`p-6 rounded-lg border-2 transition-all text-left ${
                activeSection === "favoritos"
                  ? "border-gray-900 bg-gray-50"
                  : "border-gray-200 bg-white hover:border-gray-300"
              }`}
            >
              <div className="flex flex-col items-center text-center">
                <Heart className="w-12 h-12 text-gray-700 mb-3" />
                <h3 className="text-lg font-semibold text-gray-800 mb-1">
                  Favoritos
                </h3>
                <p className="text-sm text-gray-600">
                  Tus cuidadores favoritos
                </p>
              </div>
            </button>
          </div>

          {/* Content Section */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6">
              {activeSection === "reservas" && renderReservas()}
              {activeSection === "mascotas" && renderMascotas()}
              {activeSection === "favoritos" && renderFavoritos()}
              {activeSection === "reservar" && renderReservationForm()}
            </div>
          </div>

          {/* Modales */}
          <AddPetModal
            open={openAddPet}
            onClose={() => setOpenAddPet(false)}
            onSubmit={handleAddPet}
          />
          <EditPetModal
            open={openEditPet}
            onClose={() => {
              setOpenEditPet(false);
              setEditingPet(null);
            }}
            petData={editingPet}
            onSubmit={handleUpdatePet}
            onDelete={handleDeletePet}
          />
          <RatingModal
            open={openRatingModal}
            onClose={() => setOpenRatingModal(false)}
            onSubmit={() => setOpenRatingModal(false)}
          />
          <CancelModal
            open={openCancelModal}
            onClose={() => setOpenCancelModal(false)}
            onSubmit={() => setOpenCancelModal(false)}
          />
          <ReceiptModal
            open={openReceiptModal}
            onClose={() => setOpenReceiptModal(false)}
            data={selectedReserva}
          />
          <DetailsModal
            open={openDetailsModal}
            onClose={() => setOpenDetailsModal(false)}
            data={selectedReserva}
          />
        </div>
      </div>
    </>
  );
}
