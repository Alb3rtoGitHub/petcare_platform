import { useEffect, useState } from 'react'
import { getBookingsByOwner, cancelBooking } from '../../data/fakeApi.js'

export default function OwnerBookings() {
  const [items, setItems] = useState([])
  useEffect(() => { setItems(getBookingsByOwner()) }, [])

  const cancel = (id) => {
    cancelBooking(id)
    setItems(getBookingsByOwner())
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Mis reservas</h1>
      <div className="grid gap-3">
        {items.length === 0 && <p>No tienes reservas aún.</p>}
        {items.map(b => (
          <div key={b.id} className="card flex items-start justify-between gap-3">
            <div>
              <div className="font-semibold">{b.petName} — {b.type}</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">{b.date} {b.time}</div>
              {b.notes && <div className="text-sm mt-1">{b.notes}</div>}
              <div className="text-xs mt-1">Estado: <b>{b.status}</b> {b.sitter && `(Cuidador: ${b.sitter})`}</div>
            </div>
            {b.status !== 'cancelled' && <button className="btn" onClick={() => cancel(b.id)}>Cancelar</button>}
          </div>
        ))}
      </div>
    </div>
  )
}
