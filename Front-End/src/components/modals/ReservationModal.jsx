import { useState, useRef, useEffect } from "react";
import { Calendar, Loader2, AlertCircle } from "lucide-react";
import BookingService from "../../services/BookingService.js";
import SitterService from "../../services/SitterService.js";
import PetService from "../../services/PetService.js";
import { useAuth } from "../../context/AuthContext.jsx";
import { showNotification } from "../NotificationProvider.jsx";

export default function ReservationModal({
  open,
  onClose,
  onSubmit,
  selectedPet = null,
}) {
  const { user } = useAuth();
  const [serviceType, setServiceType] = useState("");
  const [selectedSitter, setSelectedSitter] = useState(null);
  const [sitterQuery, setSitterQuery] = useState("");
  const [showSitterDropdown, setShowSitterDropdown] = useState(false);
  const [hoveredSitter, setHoveredSitter] = useState(null);
  const [previewPos, setPreviewPos] = useState({ top: 0, left: 0 });
  const [selectedPetId, setSelectedPetId] = useState(selectedPet?.id || "");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [scheduledDate, setScheduledDate] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState({
    sitters: false,
    pets: false,
    submit: false,
  });

  // Estados para datos
  const [availableSitters, setAvailableSitters] = useState([]);
  const [userPets, setUserPets] = useState([]);

  const modalRef = useRef(null);

  // Cargar datos cuando se abre el modal
  useEffect(() => {
    if (open) {
      loadSitters();
      loadUserPets();
    }
  }, [open]);

  // Cargar sitters disponibles
  const loadSitters = async () => {
    try {
      setLoading((prev) => ({ ...prev, sitters: true }));
      const sitters = await SitterService.getAvailableSitters();
      setAvailableSitters(sitters.content || []);
    } catch (error) {
      console.error("Error cargando sitters:", error);
      setErrors((prev) => ({
        ...prev,
        sitters: "Error cargando cuidadores disponibles",
      }));
    } finally {
      setLoading((prev) => ({ ...prev, sitters: false }));
    }
  };

  // Cargar mascotas del usuario
  const loadUserPets = async () => {
    try {
      setLoading((prev) => ({ ...prev, pets: true }));
      const pets = await PetService.getPetsByOwner(user.id);
      setUserPets(pets.content || []);
    } catch (error) {
      console.error("Error cargando mascotas:", error);
      setErrors((prev) => ({ ...prev, pets: "Error cargando mascotas" }));
    } finally {
      setLoading((prev) => ({ ...prev, pets: false }));
    }
  };

  // Filtrar sitters basado en búsqueda
  const filteredSitters = availableSitters.filter(
    (sitter) =>
      sitter.user?.name?.toLowerCase().includes(sitterQuery.toLowerCase()) ||
      sitter.description?.toLowerCase().includes(sitterQuery.toLowerCase())
  );

  // Genera opciones de hora
  const timeOptions = Array.from(
    { length: 24 },
    (_, i) => `${i.toString().padStart(2, "0")}:00`
  );

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

  function validate() {
    const newErrors = {};
    if (!serviceType)
      newErrors.serviceType = "El tipo de servicio es obligatorio.";
    if (!selectedSitter) newErrors.sitter = "Selecciona un cuidador.";
    if (!selectedPetId) newErrors.pet = "Selecciona una mascota.";
    if (!scheduledDate) newErrors.scheduledDate = "La fecha es obligatoria.";
    if (!scheduledTime) newErrors.scheduledTime = "La hora es obligatoria.";

    // Validar que la fecha no sea en el pasado
    const selectedDateTime = new Date(`${scheduledDate}T${scheduledTime}`);
    const now = new Date();
    if (selectedDateTime <= now) {
      newErrors.datetime = "La fecha y hora debe ser en el futuro.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    setLoading((prev) => ({ ...prev, submit: true }));
    try {
      // Crear datos de la reserva
      const bookingData = {
        userId: user.id,
        petId: selectedPetId,
        sitterId: selectedSitter.id,
        serviceType,
        scheduledDate,
        scheduledTime,
        notes: notes || null,
        status: "PENDING",
      };

      // Crear la reserva
      const newBooking = await BookingService.createBooking(bookingData);

      // Mostrar notificación de éxito
      showNotification(
        "success",
        "Reserva Creada",
        `Tu reserva de ${getServiceTypeDisplay(
          serviceType
        )} ha sido enviada. El cuidador será notificado.`
      );

      // Notificar al componente padre
      if (onSubmit) {
        onSubmit(newBooking);
      }

      // Limpiar formulario
      setServiceType("");
      setSelectedSitter(null);
      setSitterQuery("");
      setSelectedPetId(selectedPet?.id || "");
      setAddress("");
      setNotes("");
      setScheduledDate("");
      setScheduledTime("");
      setErrors({});

      onClose();
    } catch (error) {
      console.error("Error creando reserva:", error);
      setErrors({
        general:
          error.message || "Error al crear la reserva. Inténtalo de nuevo.",
      });
    } finally {
      setLoading((prev) => ({ ...prev, submit: false }));
    }
  }

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <style>{`.hide-scrollbar::-webkit-scrollbar{display:none} .hide-scrollbar{-ms-overflow-style:none; scrollbar-width:none;}`}</style>
      {/* Contenedor principal sin barra visible */}
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-0 relative overflow-hidden max-h-[90vh]">
        {/* Contenido con scroll interno (scroll oculto) */}
        <div className="p-6 overflow-auto max-h-[90vh] bg-white text-black hide-scrollbar">
          <button
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            onClick={onClose}
          >
            ×
          </button>
          <h2 className="text-xl font-bold mb-4 text-black">Nueva Reserva</h2>

          {/* Error general */}
          {errors.general && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">{errors.general}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-medium mb-1 text-black">
                Tipo de servicio *
              </label>
              <select
                value={serviceType}
                onChange={(e) => {
                  setServiceType(e.target.value);
                  setErrors((prev) => {
                    const c = { ...prev };
                    delete c.serviceType;
                    return c;
                  });
                }}
                className="w-full border rounded px-3 py-2 bg-white text-black"
                disabled={loading.submit}
              >
                <option value="">Selecciona...</option>
                <option value="DOG_WALKING">Paseo de Perros</option>
                <option value="PET_SITTING">Cuidado en Casa</option>
                <option value="DAYCARE">Guardería</option>
                <option value="GROOMING">Peluquería</option>
                <option value="TRAINING">Entrenamiento</option>
                <option value="VETERINARY">Veterinaria</option>
              </select>
              {errors.serviceType && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.serviceType}
                </p>
              )}
            </div>

            {/* Selector de mascota */}
            <div>
              <label className="block font-medium mb-1 text-black">
                Mascota *
              </label>
              {loading.pets ? (
                <div className="flex items-center gap-2 p-3 border rounded">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-gray-600">Cargando mascotas...</span>
                </div>
              ) : userPets.length > 0 ? (
                <select
                  value={selectedPetId}
                  onChange={(e) => {
                    setSelectedPetId(e.target.value);
                    setErrors((prev) => {
                      const c = { ...prev };
                      delete c.pet;
                      return c;
                    });
                  }}
                  className="w-full border rounded px-3 py-2 bg-white text-black"
                  disabled={loading.submit}
                >
                  <option value="">Selecciona una mascota...</option>
                  {userPets.map((pet) => (
                    <option key={pet.id} value={pet.id}>
                      {pet.name} - {pet.species} ({pet.breed})
                    </option>
                  ))}
                </select>
              ) : (
                <div className="p-3 border rounded bg-gray-50">
                  <p className="text-gray-600 text-sm">
                    No tienes mascotas registradas
                  </p>
                </div>
              )}
              {errors.pet && (
                <p className="text-red-500 text-sm mt-1">{errors.pet}</p>
              )}
            </div>
            {/* Selector inteligente de sitters */}
            <div className="relative" ref={modalRef}>
              <label className="block font-medium mb-2 text-black">
                Cuidador *
              </label>

              {loading.sitters ? (
                <div className="flex items-center gap-2 p-3 border rounded">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-gray-600">Cargando cuidadores...</span>
                </div>
              ) : (
                <input
                  type="text"
                  value={sitterQuery}
                  onChange={(e) => {
                    setSitterQuery(e.target.value);
                    setShowSitterDropdown(true);
                    setErrors((prev) => {
                      const c = { ...prev };
                      delete c.sitter;
                      return c;
                    });
                  }}
                  onFocus={() => setShowSitterDropdown(true)}
                  onBlur={() =>
                    setTimeout(() => setShowSitterDropdown(false), 120)
                  }
                  placeholder="Buscar por nombre..."
                  className="w-full border rounded px-3 py-2 bg-white text-black"
                  disabled={loading.submit}
                />
              )}
              {showSitterDropdown && filteredSitters.length > 0 && (
                <ul className="absolute z-40 left-0 right-0 bg-white border rounded mt-1 max-h-40 overflow-auto shadow">
                  {filteredSitters.map((sitter) => (
                    <li
                      key={sitter.id}
                      className="p-2 hover:bg-gray-50 cursor-pointer flex items-center gap-3"
                      onMouseEnter={(e) => {
                        setHoveredSitter(sitter);
                        const rect = e.currentTarget.getBoundingClientRect();
                        setPreviewPos({
                          top: rect.top + rect.height / 2,
                          left: rect.right + 10,
                        });
                      }}
                      onMouseLeave={() => setHoveredSitter(null)}
                      onClick={() => {
                        setSelectedSitter(sitter);
                        setSitterQuery(sitter.user?.name || "Sitter");
                        setShowSitterDropdown(false);
                        setErrors((prev) => {
                          const cpy = { ...prev };
                          delete cpy.sitter;
                          return cpy;
                        });
                      }}
                    >
                      <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200">
                        <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-sm font-medium">
                          {sitter.user?.name?.charAt(0) || "S"}
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-gray-800">
                          {sitter.user?.name || "Sitter"}
                        </div>
                        <div className="text-xs text-gray-500">
                          €{sitter.hourlyRate || 20}/hora -{" "}
                          {sitter.description?.substring(0, 30) ||
                            "Cuidador disponible"}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
              {errors.sitter && (
                <p className="text-red-500 text-sm mt-1">{errors.sitter}</p>
              )}
            </div>

            <div>
              <label className="block font-medium mb-1 text-black">
                Dirección
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Calle, número, ciudad (p. ej. Calle Mayor 10, Madrid)"
                className="w-full border rounded px-3 py-2 bg-white text-black"
              />
            </div>
            <div>
              <label className="block font-medium mb-1 text-black">
                Instrucciones especiales
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Indica alergias, preferencias o instrucciones (p. ej. dejar llave con vecino)"
                rows={3}
                className="w-full border rounded px-3 py-2 bg-white text-black"
                disabled={loading.submit}
              />
            </div>
            <div className="flex gap-2">
              <div className="flex-1">
                <label className="block font-medium mb-1 text-black">
                  Fecha *
                </label>
                <input
                  type="date"
                  value={scheduledDate}
                  min={new Date().toISOString().split("T")[0]} // No permitir fechas pasadas
                  onChange={(e) => {
                    setScheduledDate(e.target.value);
                    setErrors((prev) => {
                      const c = { ...prev };
                      delete c.scheduledDate;
                      delete c.datetime;
                      return c;
                    });
                  }}
                  className="w-full border rounded px-3 py-2 bg-white text-black"
                  disabled={loading.submit}
                />
                {errors.scheduledDate && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.scheduledDate}
                  </p>
                )}
              </div>
              <div className="flex-1">
                <label className="block font-medium mb-1 text-black">
                  Hora *
                </label>
                <select
                  value={scheduledTime}
                  onChange={(e) => {
                    setScheduledTime(e.target.value);
                    setErrors((prev) => {
                      const c = { ...prev };
                      delete c.scheduledTime;
                      delete c.datetime;
                      return c;
                    });
                  }}
                  className="w-full border rounded px-3 py-2 bg-white text-black"
                  disabled={loading.submit}
                >
                  <option value="">Selecciona hora</option>
                  {timeOptions.map((time) => (
                    <option key={time} value={time}>
                      {time}
                    </option>
                  ))}
                </select>
                {errors.scheduledTime && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.scheduledTime}
                  </p>
                )}
              </div>
            </div>

            {/* Error de validación de fecha/hora */}
            {errors.datetime && (
              <div className="text-red-500 text-sm">{errors.datetime}</div>
            )}

            <div className="pt-2 flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 rounded font-medium"
                disabled={loading.submit}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded font-medium flex items-center justify-center gap-2"
                disabled={loading.submit}
              >
                {loading.submit && <Loader2 className="w-4 h-4 animate-spin" />}
                {loading.submit ? "Creando..." : "Crear Reserva"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Preview flotante del sitter */}
      {hoveredSitter && (
        <div
          className="fixed z-50 bg-white border rounded-lg p-3 shadow-lg w-56"
          style={{ top: previewPos.top - 80, left: previewPos.left }}
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-medium">
              {hoveredSitter.user?.name?.charAt(0) || "S"}
            </div>
            <div>
              <div className="font-semibold text-gray-800">
                {hoveredSitter.user?.name || "Sitter"}
              </div>
              <div className="text-sm text-gray-500">
                €{hoveredSitter.hourlyRate || 20}/hora
              </div>
              <div className="text-xs text-gray-400">
                {hoveredSitter.description?.substring(0, 40) ||
                  "Cuidador profesional"}
                ...
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
