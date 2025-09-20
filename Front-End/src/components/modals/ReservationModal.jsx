import { useState, useRef } from "react";
import { Calendar } from "lucide-react";

export default function ReservationModal({ open, onClose, onSubmit }) {
  const [serviceType, setServiceType] = useState("");
  const [selectedCaretaker, setSelectedCaretaker] = useState(null);
  const [caretakerQuery, setCaretakerQuery] = useState("");
  const [showCaretakerDropdown, setShowCaretakerDropdown] = useState(false);
  const [hoveredCaretaker, setHoveredCaretaker] = useState(null);
  const [previewPos, setPreviewPos] = useState({ top: 0, left: 0 });
  const [pet, setPet] = useState("");
  const [address, setAddress] = useState("");
  const [instructions, setInstructions] = useState("");
  const [startDate, setStartDate] = useState("");
  const [startHour, setStartHour] = useState("");
  const [endDate, setEndDate] = useState("");
  const [endHour, setEndHour] = useState("");
  const [errors, setErrors] = useState({});

  const modalRef = useRef(null);
  const startDateRef = useRef(null);
  const endDateRef = useRef(null);

  // Mock de cuidadores - reemplazar por props o fetch si se desea
  const cuidadores = [
    {
      id: "C1",
      name: "María González",
      avatar: "https://i.pravatar.cc/150?u=C1",
      info: "Especialista en paseos. +200 reseñas",
    },
    {
      id: "C2",
      name: "Carlos Ruiz",
      avatar: "https://i.pravatar.cc/150?u=C2",
      info: "Cuidado a domicilio. Atención 24h",
    },
    {
      id: "C3",
      name: "Ana López",
      avatar: "https://i.pravatar.cc/150?u=C3",
      info: "Experta en gatos. Casa segura",
    },
  ];

  // Genera opciones de hora en punto
  const hourOptions = Array.from(
    { length: 24 },
    (_, i) => `${i.toString().padStart(2, "0")}:00`
  );

  // Calcula cantidad de horas
  function getHourCount() {
    if (!startDate || !startHour || !endDate || !endHour) return 0;
    const start = new Date(`${startDate}T${startHour}`);
    const end = new Date(`${endDate}T${endHour}`);
    const diff = (end - start) / (1000 * 60 * 60);
    return diff > 0 ? diff : 0;
  }

  function validate() {
    const newErrors = {};
    if (!serviceType)
      newErrors.serviceType = "El tipo de servicio es obligatorio.";
    if (!selectedCaretaker) newErrors.cuidador = "Selecciona un cuidador.";
    if (!pet) newErrors.pet = "La mascota es obligatoria.";
    if (!startDate) newErrors.startDate = "La fecha de inicio es obligatoria.";
    if (!startHour) newErrors.startHour = "La hora de inicio es obligatoria.";
    if (!endDate) newErrors.endDate = "La fecha de fin es obligatoria.";
    if (!endHour) newErrors.endHour = "La hora de fin es obligatoria.";
    if (getHourCount() <= 0)
      newErrors.hours =
        "La fecha y hora de fin debe ser posterior a la de inicio.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({
      serviceType,
      caretaker: selectedCaretaker,
      pet,
      address,
      instructions,
      startDate,
      startHour,
      endDate,
      endHour,
      hours: getHourCount(),
    });
    onClose();
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
              >
                <option value="">Selecciona...</option>
                <option value="Paseo Diario">Paseo Diario</option>
                <option value="Cuidado en Casa">Cuidado en Casa</option>
                <option value="Guardería">Guardería</option>
                <option value="Otro">Otro</option>
              </select>
              {errors.serviceType && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.serviceType}
                </p>
              )}
            </div>
            {/* Selector inteligente de cuidadores */}
            <div className="relative" ref={modalRef}>
              <label className="block font-medium mb-2 text-black">
                Cuidador *
              </label>
              <input
                type="text"
                value={caretakerQuery}
                onChange={(e) => {
                  setCaretakerQuery(e.target.value);
                  setShowCaretakerDropdown(true);
                  setErrors((prev) => {
                    const c = { ...prev };
                    delete c.cuidador;
                    return c;
                  });
                }}
                onFocus={() => setShowCaretakerDropdown(true)}
                onBlur={() =>
                  setTimeout(() => setShowCaretakerDropdown(false), 120)
                }
                placeholder="Buscar por nombre..."
                className="w-full border rounded px-3 py-2 bg-white text-black"
              />
              {showCaretakerDropdown && (
                <ul className="absolute z-40 left-0 right-0 bg-white border rounded mt-1 max-h-40 overflow-auto shadow">
                  {cuidadores
                    .filter((c) =>
                      c.name
                        .toLowerCase()
                        .includes(caretakerQuery.toLowerCase())
                    )
                    .map((c) => (
                      <li
                        key={c.id}
                        className="p-2 hover:bg-gray-50 cursor-pointer flex items-center gap-3"
                        onMouseEnter={(e) => {
                          setHoveredCaretaker(c);
                          // calcular posicion aproximada del preview
                          const rect = e.currentTarget.getBoundingClientRect();
                          setPreviewPos({
                            top: rect.top + rect.height / 2,
                            left: rect.right + 10,
                          });
                        }}
                        onMouseLeave={() => setHoveredCaretaker(null)}
                        onClick={() => {
                          setSelectedCaretaker(c.id);
                          setCaretakerQuery(c.name);
                          setShowCaretakerDropdown(false);
                          setErrors((prev) => {
                            const cpy = { ...prev };
                            delete cpy.cuidador;
                            return cpy;
                          });
                        }}
                      >
                        <div className="w-8 h-8 rounded-full overflow-hidden">
                          <img
                            src={c.avatar}
                            alt={c.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-800">
                            {c.name}
                          </div>
                          <div className="text-xs text-gray-500">{c.info}</div>
                        </div>
                      </li>
                    ))}
                </ul>
              )}
              {errors.cuidador && (
                <p className="text-red-500 text-sm mt-1">{errors.cuidador}</p>
              )}
            </div>
            <div>
              <label className="block font-medium mb-1 text-black">
                Mascota *
              </label>
              <input
                type="text"
                value={pet}
                onChange={(e) => {
                  setPet(e.target.value);
                  setErrors((prev) => {
                    const c = { ...prev };
                    delete c.pet;
                    return c;
                  });
                }}
                placeholder="Ej. Luna (Gato) o Max (Perro)"
                className="w-full border rounded px-3 py-2 bg-white text-black"
              />
              {errors.pet && (
                <p className="text-red-500 text-sm mt-1">{errors.pet}</p>
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
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                placeholder="Indica alergias, preferencias o instrucciones (p. ej. dejar llave con vecino)"
                rows={3}
                className="w-full border rounded px-3 py-2 bg-white text-black"
              />
            </div>
            <div className="flex gap-2">
              <div className="flex-1">
                <label className="block font-medium mb-1 text-black">
                  Fecha inicio *
                </label>
                <div className="relative">
                  <input
                    ref={startDateRef}
                    type="date"
                    value={startDate}
                    onChange={(e) => {
                      setStartDate(e.target.value);
                      setErrors((prev) => {
                        const c = { ...prev };
                        delete c.startDate;
                        delete c.hours;
                        return c;
                      });
                    }}
                    placeholder="aaaa-mm-dd"
                    className="w-full border rounded px-3 py-2 pr-10 bg-white text-black"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      startDateRef.current && startDateRef.current.showPicker
                        ? startDateRef.current.showPicker()
                        : startDateRef.current && startDateRef.current.focus()
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                    aria-label="Abrir selector de fecha inicio"
                  >
                    <Calendar className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
                {errors.startDate && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.startDate}
                  </p>
                )}
              </div>
              <div className="flex-1">
                <label className="block font-medium mb-1 text-black">
                  Hora inicio *
                </label>
                <select
                  value={startHour}
                  onChange={(e) => {
                    setStartHour(e.target.value);
                    setErrors((prev) => {
                      const c = { ...prev };
                      delete c.startHour;
                      delete c.hours;
                      return c;
                    });
                  }}
                  className="w-full border rounded px-3 py-2 bg-white text-black"
                >
                  <option value="">--</option>
                  {hourOptions.map((h) => (
                    <option key={h} value={h}>
                      {h}
                    </option>
                  ))}
                </select>
                {errors.startHour && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.startHour}
                  </p>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              <div className="flex-1">
                <label className="block font-medium mb-1 text-black">
                  Fecha fin *
                </label>
                <div className="relative">
                  <input
                    ref={endDateRef}
                    type="date"
                    value={endDate}
                    onChange={(e) => {
                      setEndDate(e.target.value);
                      setErrors((prev) => {
                        const c = { ...prev };
                        delete c.endDate;
                        delete c.hours;
                        return c;
                      });
                    }}
                    placeholder="aaaa-mm-dd"
                    className="w-full border rounded px-3 py-2 pr-10 bg-white text-black"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      endDateRef.current && endDateRef.current.showPicker
                        ? endDateRef.current.showPicker()
                        : endDateRef.current && endDateRef.current.focus()
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                    aria-label="Abrir selector de fecha fin"
                  >
                    <Calendar className="w-5 h-5 text-gray-500" />
                  </button>
                </div>
                {errors.endDate && (
                  <p className="text-red-500 text-sm mt-1">{errors.endDate}</p>
                )}
              </div>
              <div className="flex-1">
                <label className="block font-medium mb-1 text-black">
                  Hora fin *
                </label>
                <select
                  value={endHour}
                  onChange={(e) => {
                    setEndHour(e.target.value);
                    setErrors((prev) => {
                      const c = { ...prev };
                      delete c.endHour;
                      delete c.hours;
                      return c;
                    });
                  }}
                  className="w-full border rounded px-3 py-2 bg-white text-black"
                >
                  <option value="">--</option>
                  {hourOptions.map((h) => (
                    <option key={h} value={h}>
                      {h}
                    </option>
                  ))}
                </select>
                {errors.endHour && (
                  <p className="text-red-500 text-sm mt-1">{errors.endHour}</p>
                )}
              </div>
            </div>
            <div>
              <label className="block font-medium mb-1 text-black">
                Cantidad de horas
              </label>
              <input
                type="text"
                value={getHourCount()}
                readOnly
                className="w-full border rounded px-3 py-2 bg-white text-black"
              />
              {errors.hours && (
                <p className="text-red-500 text-sm mt-1">{errors.hours}</p>
              )}
            </div>
            <div className="pt-2">
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 transition-colors"
              >
                Reservar
              </button>
            </div>
          </form>
        </div>
      </div>
      {/* Preview flotante del cuidador (fuera del modal) */}
      {hoveredCaretaker && (
        <div
          className="fixed z-50 bg-white border rounded-lg p-3 shadow-lg w-56"
          style={{ top: previewPos.top - 80, left: previewPos.left }}
        >
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 rounded-full overflow-hidden">
              <img
                src={hoveredCaretaker.avatar}
                alt={hoveredCaretaker.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <div className="font-semibold text-gray-800">
                {hoveredCaretaker.name}
              </div>
              <div className="text-sm text-gray-500">
                {hoveredCaretaker.info}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
