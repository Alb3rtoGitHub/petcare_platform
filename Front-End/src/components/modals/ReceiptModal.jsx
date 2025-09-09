export default function ReceiptModal({ open, onClose, data }) {
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
        <h2 className="text-xl font-bold mb-4 text-black">Recibo de Reserva</h2>
        {/* Aquí puedes mostrar los datos del recibo */}
        <div className="space-y-2 text-black">
          <div>
            <span className="font-medium">ID:</span> {data?.id}
          </div>
          <div>
            <span className="font-medium">Servicio:</span> {data?.serviceType}
          </div>
          <div>
            <span className="font-medium">Mascota:</span> {data?.pet}
          </div>
          <div>
            <span className="font-medium">Fecha:</span> {data?.startDate}{" "}
            {data?.startHour} - {data?.endDate} {data?.endHour}
          </div>
          <div>
            <span className="font-medium">Total:</span> {data?.price} €
          </div>
        </div>
      </div>
    </div>
  );
}
