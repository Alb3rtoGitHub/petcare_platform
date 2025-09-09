export default function CancelModal({ open, onClose, onSubmit }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative overflow-y-auto max-h-[90vh]">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          ×
        </button>
        <h2 className="text-xl font-bold mb-4 text-black">Cancelar Reserva</h2>
        <p className="mb-4 text-black">
          ¿Estás seguro que deseas cancelar esta reserva? Esta acción no se
          puede deshacer.
        </p>
        <div className="flex gap-2">
          <button
            className="flex-1 bg-gray-200 text-gray-800 py-2 rounded font-semibold hover:bg-gray-300 transition-colors"
            onClick={onClose}
          >
            No, volver
          </button>
          <button
            className="flex-1 bg-red-600 text-white py-2 rounded font-semibold hover:bg-red-700 transition-colors"
            onClick={() => {
              onSubmit();
              onClose();
            }}
          >
            Sí, cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
