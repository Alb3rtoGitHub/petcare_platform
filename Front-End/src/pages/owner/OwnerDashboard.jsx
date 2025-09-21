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
import ReviewCard from '../../components/ReviewCard';
import { BASE_URL } from '../../config/constants';
import { fetchUserPets } from '../../services/apiService';

export default function OwnerDashboard() {
  const [activeSection, setActiveSection] = useState("mascotas");
  // Estados para modales
  const [openReservationModal, setOpenReservationModal] = useState(false);
  const [openRatingModal, setOpenRatingModal] = useState(false);
  const [openCancelModal, setOpenCancelModal] = useState(false);
  const [openReceiptModal, setOpenReceiptModal] = useState(false);
  const [openDetailsModal, setOpenDetailsModal] = useState(false);
  const [pets, setPets] = useState([]);
  const [openAddPet, setOpenAddPet] = useState(false);
  const [openEditPet, setOpenEditPet] = useState(false);
  const [editingPet, setEditingPet] = useState(null);
  // Info para modales
  const [selectedReserva, setSelectedReserva] = useState(null);
  const [selectedCuidador, setSelectedCuidador] = useState(null);
  const [reservas, setReservas] = useState([]);
  const [ownerName, setOwnerName] = useState('Usuario');

  useEffect(() => {
    // Corregido: obtener el id desde sessionStorage con la clave 'id'
    const userId = sessionStorage.getItem("id");
    const token = sessionStorage.getItem("token");
    console.log("OwnerDashboard userId:", userId, "token:", token); // Verifica valores
    if (!userId || !token) return;

    fetch(
      `${BASE_URL}/bookings/user/${userId}?page=0&size=3&sortBy=startDateTime`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        const reservasAdaptadas = (data.content || []).map((b) => ({
          id: b.id,
          cuidador: b.ownerName,
          avatar: `https://i.pravatar.cc/150?u=${b.id}`,
          estado:
            b.status === "CONFIRMADA"
              ? "Confirmada"
              : b.status === "PENDIENTE"
              ? "Pendiente"
              : b.status === "FINALIZADA"
              ? "Finalizada"
              : b.status,
          estadoColor:
            b.status === "CONFIRMADA"
              ? "bg-blue-100 text-blue-800"
              : b.status === "PENDIENTE"
              ? "bg-yellow-100 text-yellow-800"
              : b.status === "FINALIZADA"
              ? "bg-green-100 text-green-800"
              : "bg-gray-100 text-gray-800",
          fecha:
            b.startDateTime &&
            new Date(b.startDateTime).toLocaleDateString("es-ES", {
              weekday: "long",
              day: "numeric",
              month: "long",
              year: "numeric",
            }),
          hora:
            b.startDateTime && b.endDateTime
              ? `${new Date(b.startDateTime).toLocaleTimeString("es-ES", {
                  hour: "2-digit",
                  minute: "2-digit",
                })} - ${new Date(b.endDateTime).toLocaleTimeString("es-ES", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}`
              : "",
          lugar: b.specialInstructions || "",
          servicio: b.serviceName
            ? `${b.serviceName} para ${b.petName}`
            : `Servicio para ${b.petName}`,
          precio: b.totalPrice ? `${b.totalPrice.toFixed(2)}€` : "",
          puedeEvaluar: b.status === "FINALIZADA",
        }));
        setReservas(reservasAdaptadas);
      });
  }, []);

  useEffect(() => {
    const ownerId = sessionStorage.getItem('id');
    const token = sessionStorage.getItem('token');
    console.log('Owner ID:', ownerId);
    console.log('Token:', token);

    if (!ownerId) return;

    fetchUserPets(ownerId)
      .then((data) => {
        console.log('Fetched pets:', data);
        setPets(data);
      })
      .catch((error) => console.error('Error al obtener las mascotas:', error));
  }, []);

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setOwnerName(payload.name || 'Usuario');
      } catch (error) {
        console.error('Error al decodificar el token:', error);
      }
    }
  }, []);

  // listen for navbar requests to open the reservation modal
  useEffect(() => {
    function onOpenReservation() {
      setOpenReservationModal(true);
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
            onClick={() => window.location.href = '/owner/book-service'}
          >
            <Plus className="w-5 h-5" /> Nueva Reserva
          </button>
        </div>
      </div>
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
                  <p className="text-base text-gray-600">{reserva.servicio}</p>
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
                <ReviewCard review={{
                  ownerName: reserva.cuidador,
                  comment: reserva.comment,
                  rating: reserva.rating
                }} />
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {pets.map((pet, idx) => {
          const speciesMap = { DOG: 'Perro', CAT: 'Gato' };
          const sizeMap = { SMALL: 'Pequeño', MEDIUM: 'Mediano', LARGE: 'Grande' };

          const defaultImages = {
            DOG: {
              SMALL: 'https://example.com/dog-small.jpg',
              MEDIUM: 'https://example.com/dog-medium.jpg',
              LARGE: 'https://example.com/dog-large.jpg',
            },
            CAT: {
              SMALL: 'https://example.com/cat-small.jpg',
              MEDIUM: 'https://example.com/cat-medium.jpg',
              LARGE: 'https://example.com/cat-large.jpg',
            },
          };

          const petImage =
            (pet && pet.petPhotography) ||
            (defaultImages[pet?.species]?.[pet?.sizeCategory]) ||
            `https://i.pravatar.cc/600?u=pet-${pet?.id || idx}`;

          return (
            <div
              key={pet.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden"
              onClick={() => {
                setEditingPet(pet);
                setOpenEditPet(true);
              }}
            >
              <div className="h-48 bg-gray-300 relative">
                <img
                  src={petImage}
                  alt={pet.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  {pet.name}
                </h3>
                <p className="text-gray-600">Edad: {pet.age} años</p>
                <p className="text-gray-600">Especie: {speciesMap[pet.species]}</p>
                <p className="text-gray-600">Tamaño: {sizeMap[pet.sizeCategory]}</p>
                <p className="text-gray-600">Notas de cuidado: {pet.careNote || 'Ninguna'}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderFavoritos = () => {
    const reviews = reservas?.map(reserva => ({
      id: reserva.id,
      ownerName: reserva.cuidador,
      comment: reserva.comment,
      rating: reserva.rating
    })).filter(review => review.rating > 0) ?? [];

    if (reviews.length === 0) {
      return <p className="text-gray-500">No tienes favoritos aún.</p>;
    }

    return (
      <div className="space-y-4">
        {reviews.map(review => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>
    );
  };

  const handleEditPet = (pet) => {
    setEditingPet(pet);
    setOpenEditPet(true);
  };

  function handleDeletePet(petId) {
    deletePet(petId)
      .then(() => {
        console.log(`Mascota con ID ${petId} eliminada exitosamente.`);
        setPets((list) => list.filter((p) => p.id !== petId));
      })
      .catch((error) => console.error('Error al eliminar la mascota:', error));
  }

  useEffect(() => {
    function handleNavigation(event) {
      const section = event.detail;
      if (section === 'reservas' || section === 'mascotas') {
        setActiveSection(section);
      }
    }

    window.addEventListener('navigate-to-section', handleNavigation);
    return () => {
      window.removeEventListener('navigate-to-section', handleNavigation);
    };
  }, []);

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
              Bienvenido, {ownerName}. Gestiona tus mascotas y reservas
            </p>
          </div>

          {/* Navigation Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 sm:gap-6 mb-8 justify-center">
            {/* Reservar Servicio */}
            <button
              onClick={() => window.location.href = '/owner/book-service'}
              className="p-6 rounded-lg border-2 border-gray-200 bg-white hover:border-gray-300 transition-all text-left"
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
              onClick={() => window.location.href = '/owner/book-service'}
              className={`p-6 rounded-lg border-2 transition-all text-left ${activeSection === 'reservas'
                  ? 'border-gray-900 bg-gray-50'
                  : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
            >
              <div className="flex flex-col items-center text-center">
                <Calendar className="w-12 h-12 text-gray-700 mb-3" />
                <h3 className="text-lg font-semibold text-gray-800 mb-1">Mis Reservas</h3>
                <p className="text-sm text-gray-600">Gestiona tus reservas</p>
              </div>
            </button>

            {/* Mis Mascotas */}
            <button
              onClick={() => setActiveSection('mascotas')}
              className={`p-6 rounded-lg border-2 transition-all text-left ${activeSection === 'mascotas'
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
              className={`p-6 rounded-lg border-2 transition-all text-left ${activeSection === 'favoritos'
                  ? 'border-gray-900 bg-gray-50'
                  : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
            >
              <div className="flex flex-col items-center text-center">
                <Heart className="w-12 h-12 text-gray-700 mb-3" />
                <h3 className="text-lg font-semibold text-gray-800 mb-1">Favoritos</h3>
                <p className="text-sm text-gray-600">Clientes favoritos</p>
              </div>
            </button>
          </div>

          {/* Content Section */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-6">
              {activeSection === 'mascotas'
                ? renderMascotas()
                : activeSection === 'reservas'
                ? renderReservas()
                : renderFavoritos()
              }
            </div>
          </div>

          {/* Modales */}
          <ReservationModal
            open={openReservationModal}
            onClose={() => setOpenReservationModal(false)}
            onSubmit={() => setOpenReservationModal(false)}
          />
          <AddPetModal
            open={openAddPet}
            onClose={() => setOpenAddPet(false)}
            onSubmit={(newPet) => setPets((p) => [newPet, ...p])}
          />
          <EditPetModal
            petData={editingPet} // Cambiado de pet a petData
            open={openEditPet}
            onClose={() => setOpenEditPet(false)}
            onSubmit={(updated) =>
              setPets((list) =>
                list.map((pt) => (pt.id === updated.id ? updated : pt))
              )
            }
            onDelete={(id) =>
              setPets((list) => list.filter((p) => p.id !== id))
            }
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
