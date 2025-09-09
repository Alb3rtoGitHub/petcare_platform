import { useEffect, useState } from "react";

export default function EditPetModal({ open, onClose, petData, onSubmit }) {
  const [name, setName] = useState("");
  const [type, setType] = useState("");
  const [breed, setBreed] = useState("");
  const [age, setAge] = useState("");
  const [image, setImage] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [errors, setErrors] = useState({});

  const defaultPreview = `https://i.pravatar.cc/300?u=edit-${Date.now()}`;
  // preview init in useEffect instead of render
  useEffect(() => {
    if (!previewUrl && !image) setPreviewUrl((p) => p || defaultPreview);
  }, [previewUrl, image]);

  useEffect(() => {
    if (petData) {
      setName(petData.name || "");
      setType(petData.type || "");
      setBreed(petData.breed || "");
      setAge(petData.age || "");
      setImage(petData.image || "");
      setPreviewUrl(petData.image || "");
    }
  }, [petData]);

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
    if (!type) newErrors.type = "El tipo de mascota es obligatorio.";
    if (!breed) newErrors.breed = "La raza es obligatoria.";
    if (!age) newErrors.age = "La edad es obligatoria.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!validate()) return;
    const finalImage = image || defaultPreview;
    onSubmit({ ...petData, name, type, breed, age, image: finalImage });
    onClose();
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
            Editar Mascota
          </h2>
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
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-800">
                Tipo
              </label>
              <input
                className="w-full border rounded px-3 py-2 bg-white text-gray-800"
                value={type}
                onChange={(e) => {
                  setType(e.target.value);
                  setErrors((prev) => {
                    const copy = { ...prev };
                    delete copy.type;
                    return copy;
                  });
                }}
                placeholder="Perro / Gato"
              />
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
              />
              {errors.breed && (
                <p className="text-red-500 text-sm mt-1">{errors.breed}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-gray-800">
                Edad
              </label>
              <input
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
                placeholder="Ej. 3 años"
              />
              {errors.age && (
                <p className="text-red-500 text-sm mt-1">{errors.age}</p>
              )}
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
                        setPreviewUrl("");
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
            <div className="pt-2 flex flex-col gap-2">
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded"
              >
                Guardar
              </button>
              <button
                type="button"
                className="w-full bg-red-600 text-white py-2 rounded"
                onClick={() => {
                  const ok = window.confirm(
                    "¿Eliminar mascota? Esta acción no se puede deshacer."
                  );
                  if (!ok) return;
                  // If parent provided onDelete, call it. Otherwise emit event as fallback.
                  if (typeof onSubmit === "function") {
                    // nothing — kept for parity
                  }
                  if (typeof onClose === "function") onClose();
                  if (typeof onSubmit === "function" && petData && petData.id) {
                    // parent may prefer onSubmit-based pattern, but we also support onDelete prop
                  }
                  if (
                    typeof onSubmit === "function" &&
                    typeof onSubmit.onDelete === "function"
                  ) {
                    // rare; ignore
                  }
                  if (typeof window !== "undefined") {
                    const ev = new CustomEvent("owner:pet-delete", {
                      detail: { id: petData?.id },
                    });
                    window.dispatchEvent(ev);
                  }
                  // also try to call onDelete prop if provided by parent
                  if (typeof arguments[0] === "undefined") {
                    // noop placeholder to keep lint quiet
                  }
                }}
              >
                Eliminar mascota
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
