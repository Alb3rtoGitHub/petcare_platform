import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";
import PetService from "../../services/PetService.js";
import { useAuth } from "../../context/AuthContext.jsx";

export default function AddPetModal({ open, onClose, onSubmit }) {
  const { user } = useAuth();
  const [name, setName] = useState("");
  const [species, setSpecies] = useState("");
  const [breed, setBreed] = useState("");
  const [age, setAge] = useState("");
  const [size, setSize] = useState("");
  const [weight, setWeight] = useState("");
  const [specialNeeds, setSpecialNeeds] = useState("");
  const [image, setImage] = useState(""); // stores dataURL or url
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

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
    if (!breed) newErrors.breed = "La raza es obligatoria.";
    if (!age || age <= 0)
      newErrors.age = "La edad debe ser un número positivo.";
    if (!size) newErrors.size = "El tamaño es obligatorio.";
    if (!weight || weight <= 0)
      newErrors.weight = "El peso debe ser un número positivo.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      // Crear objeto de mascota según el formato del backend
      const petData = {
        name,
        species,
        breed,
        age: parseInt(age),
        size,
        weight: parseFloat(weight),
        specialNeeds: specialNeeds || null,
        ownerId: user.id,
      };

      // Si hay imagen, subirla primero
      if (imageFile) {
        const imageUrl = await PetService.uploadPetImage(imageFile);
        petData.imageUrl = imageUrl;
      }

      // Crear la mascota
      const newPet = await PetService.createPet(petData);

      // Llamar al callback del padre con la nueva mascota
      if (onSubmit) {
        onSubmit(newPet);
      }

      // Limpiar formulario
      setName("");
      setSpecies("");
      setBreed("");
      setAge("");
      setSize("");
      setWeight("");
      setSpecialNeeds("");
      setImage("");
      setImageFile(null);
      setPreviewUrl("");
      setErrors({});

      onClose();
    } catch (error) {
      console.error("Error creando mascota:", error);
      setErrors({
        general:
          error.message || "Error al crear la mascota. Inténtalo de nuevo.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <style>{`.hide-scrollbar::-webkit-scrollbar{display:none} .hide-scrollbar{-ms-overflow-style:none; scrollbar-width:none;}`}</style>
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-0 relative overflow-hidden max-h-[90vh]">
        <div className="p-6 overflow-auto max-h-[90vh] hide-scrollbar">
          <button
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            onClick={onClose}
          >
            ×
          </button>
          <h2 className="text-xl font-bold mb-4 text-gray-800">
            Agregar Mascota
          </h2>
          {/* Error general */}
          {errors.general && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">{errors.general}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-800">
                Nombre
              </label>
              <input
                className="w-full border rounded px-3 py-2 bg-white text-gray-800"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setErrors((prev) => {
                    const copy = { ...prev };
                    delete copy.name;
                    return copy;
                  });
                }}
                placeholder="Ej. Luna"
                disabled={loading}
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-800">
                Especie
              </label>
              <select
                className="w-full border rounded px-3 py-2 bg-white text-gray-800"
                value={species}
                onChange={(e) => {
                  setSpecies(e.target.value);
                  setErrors((prev) => {
                    const copy = { ...prev };
                    delete copy.species;
                    return copy;
                  });
                }}
                disabled={loading}
              >
                <option value="">Selecciona una especie</option>
                <option value="DOG">Perro</option>
                <option value="CAT">Gato</option>
                <option value="BIRD">Ave</option>
                <option value="RABBIT">Conejo</option>
                <option value="HAMSTER">Hámster</option>
                <option value="FISH">Pez</option>
                <option value="OTHER">Otro</option>
              </select>
              {errors.species && (
                <p className="text-red-500 text-sm mt-1">{errors.species}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-800">
                Raza
              </label>
              <input
                className="w-full border rounded px-3 py-2 bg-white text-gray-800"
                value={breed}
                onChange={(e) => {
                  setBreed(e.target.value);
                  setErrors((prev) => {
                    const c = { ...prev };
                    delete c.breed;
                    return c;
                  });
                }}
                placeholder="Ej. Golden Retriever"
                disabled={loading}
              />
              {errors.breed && (
                <p className="text-red-500 text-sm mt-1">{errors.breed}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1 text-gray-800">
                  Edad (años)
                </label>
                <input
                  type="number"
                  min="0"
                  className="w-full border rounded px-3 py-2 bg-white text-gray-800"
                  value={age}
                  onChange={(e) => {
                    setAge(e.target.value);
                    setErrors((prev) => {
                      const c = { ...prev };
                      delete c.age;
                      return c;
                    });
                  }}
                  placeholder="3"
                  disabled={loading}
                />
                {errors.age && (
                  <p className="text-red-500 text-sm mt-1">{errors.age}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1 text-gray-800">
                  Peso (kg)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  className="w-full border rounded px-3 py-2 bg-white text-gray-800"
                  value={weight}
                  onChange={(e) => {
                    setWeight(e.target.value);
                    setErrors((prev) => {
                      const c = { ...prev };
                      delete c.weight;
                      return c;
                    });
                  }}
                  placeholder="15.5"
                  disabled={loading}
                />
                {errors.weight && (
                  <p className="text-red-500 text-sm mt-1">{errors.weight}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-800">
                Tamaño
              </label>
              <select
                className="w-full border rounded px-3 py-2 bg-white text-gray-800"
                value={size}
                onChange={(e) => {
                  setSize(e.target.value);
                  setErrors((prev) => {
                    const c = { ...prev };
                    delete c.size;
                    return c;
                  });
                }}
                disabled={loading}
              >
                <option value="">Selecciona un tamaño</option>
                <option value="SMALL">Pequeño</option>
                <option value="MEDIUM">Mediano</option>
                <option value="LARGE">Grande</option>
              </select>
              {errors.size && (
                <p className="text-red-500 text-sm mt-1">{errors.size}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-800">
                Necesidades Especiales (opcional)
              </label>
              <textarea
                className="w-full border rounded px-3 py-2 bg-white text-gray-800 resize-none"
                rows="3"
                value={specialNeeds}
                onChange={(e) => setSpecialNeeds(e.target.value)}
                placeholder="Ej. Medicación diaria, alergias alimentarias..."
                disabled={loading}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-800">
                Imagen (archivo)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full border rounded px-3 py-2 bg-white text-gray-800"
                disabled={loading}
              />
              {previewUrl ? (
                <div className="mt-3 flex items-center gap-3">
                  <img
                    src={previewUrl}
                    alt="preview"
                    className="w-32 h-32 object-cover rounded"
                  />
                  <div className="flex flex-col">
                    <button
                      type="button"
                      className="text-sm text-red-600 hover:underline"
                      onClick={() => {
                        setImageFile(null);
                        // restore fallback preview
                        setPreviewUrl(defaultPreview);
                        setImage("");
                      }}
                    >
                      Quitar imagen
                    </button>
                    <span className="text-xs text-gray-500 mt-2">
                      Puedes subir otra imagen si quieres
                    </span>
                  </div>
                </div>
              ) : (
                <p className="mt-2 text-sm text-gray-500">
                  Si no subes una imagen se usará una imagen temporal.
                </p>
              )}
            </div>
            <div className="pt-2 flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 rounded font-medium"
                disabled={loading}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 bg-green-600 hover:bg-green-700 text-white py-2 rounded font-medium flex items-center justify-center gap-2"
                disabled={loading}
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                {loading ? "Creando..." : "Agregar Mascota"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
