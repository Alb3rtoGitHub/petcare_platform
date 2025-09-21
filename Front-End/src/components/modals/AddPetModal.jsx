import { useState, useEffect } from "react";
import { createPets } from "../../services/apiService";

const speciesOptions = [
  { value: "DOG", label: "Perro" },
  { value: "CAT", label: "Gato" },
];
const sizeOptions = [
  { value: "SMALL", label: "Pequeño" },
  { value: "MEDIUM", label: "Mediano" },
  { value: "LARGE", label: "Grande" },
];

export default function AddPetModal({ open, onClose, onSubmit }) {
  const [pets, setPets] = useState([]);
  const [name, setName] = useState("");
  const [species, setSpecies] = useState("");
  const [sizeCategory, setSizeCategory] = useState("");
  const [age, setAge] = useState("");
  const [careNote, setCareNote] = useState("");
  const [image, setImage] = useState(""); // stores dataURL or url
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [errors, setErrors] = useState({});

  const defaultPreview = `https://i.pravatar.cc/300?u=add-${Date.now()}`;

  // ensure preview shows a web image if none selected
  useEffect(() => {
    if (!previewUrl && !image) setPreviewUrl((prev) => prev || defaultPreview);
  }, [previewUrl, image]);

  if (!open) return null;

  function handleFileChange(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (ev) => {
      setPreviewUrl(ev.target.result);
      setImage(ev.target.result);
    };
    reader.readAsDataURL(file);
  }

  function validate() {
    const newErrors = {};
    if (!name) newErrors.name = "El nombre es obligatorio.";
    if (!species) newErrors.species = "La especie es obligatoria.";
    if (!sizeCategory) newErrors.sizeCategory = "El tamaño es obligatorio.";
    if (!age) newErrors.age = "La edad es obligatoria.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function addPet() {
    if (!validate()) return;
    const newPet = {
      name,
      species,
      sizeCategory,
      age: parseInt(age, 10),
      careNote,
      image: image || defaultPreview,
    };
    setPets((prev) => [...prev, newPet]);
    setName("");
    setSpecies("");
    setSizeCategory("");
    setAge("");
    setCareNote("");
    setImage("");
    setPreviewUrl("");
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    const ownerId = sessionStorage.getItem("id");
    const petData = [
      {
        name,
        species,
        sizeCategory,
        age: parseInt(age, 10),
        careNote,
        image: image || defaultPreview,
      },
    ];

    createPets(ownerId, petData)
      .then(() => {
        console.log("Mascota agregada exitosamente.");
        onSubmit(); // Actualiza el OwnerDashboard sin esperar datos
        onClose();
      })
      .catch((error) => console.error("Error al agregar la mascota:", error));
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-0 relative overflow-hidden max-h-[90vh]">
        <div className="p-6 overflow-auto max-h-[90vh] hide-scrollbar">
          <button
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            onClick={onClose}
          >
            ×
          </button>
          <h2 className="text-xl font-bold mb-4 text-gray-800">Agregar Mascota</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-800">
                Nombre
              </label>
              <input
                className="w-full border rounded px-3 py-2 bg-white text-gray-800"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej. Luna"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-800">
                Especie
              </label>
              <select
                className="w-full border rounded px-3 py-2 bg-white text-gray-800"
                value={species}
                onChange={(e) => setSpecies(e.target.value)}
              >
                <option value="">Seleccione una especie</option>
                {speciesOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-800">
                Tamaño
              </label>
              <select
                className="w-full border rounded px-3 py-2 bg-white text-gray-800"
                value={sizeCategory}
                onChange={(e) => setSizeCategory(e.target.value)}
              >
                <option value="">Seleccione un tamaño</option>
                {sizeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-800">
                Edad
              </label>
              <input
                className="w-full border rounded px-3 py-2 bg-white text-gray-800"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                placeholder="Ej. 3"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-800">
                Nota de cuidado
              </label>
              <textarea
                className="w-full border rounded px-3 py-2 bg-white text-gray-800"
                value={careNote}
                onChange={(e) => setCareNote(e.target.value)}
                placeholder="Ej. Alimentar dos veces al día"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-800">
                Imagen
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              />
              {previewUrl && (
                <img
                  src={previewUrl}
                  alt="Vista previa"
                  className="mt-2 w-32 h-32 object-cover rounded"
                />
              )}
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            >
              Agregar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
