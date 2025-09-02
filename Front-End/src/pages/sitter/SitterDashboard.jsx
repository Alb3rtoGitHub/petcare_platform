import { useEffect, useState } from 'react'
import { getOpenBookings, acceptBooking, completeBooking } from '../../data/fakeApi.js'

export default function SitterDashboard() {
  const [open, setOpen] = useState([])
  const [mine, setMine] = useState([])

  const refresh = () => {
    const { open: o, mine: m } = getOpenBookings()
    setOpen(o); setMine(m)
  }

  useEffect(() => { refresh() }, [])

  return (
    <div className="grid md:grid-cols-2 gap-4">
      <section className="card">
        <h2 className="text-xl font-semibold mb-2">Solicitudes disponibles</h2>
        <div className="space-y-2">
          {open.length === 0 && <p>No hay solicitudes abiertas.</p>}
          {open.map(b => (
            <div key={b.id} className="border rounded-xl p-3 flex items-center justify-between">
              <div>
                <div className="font-medium">{b.petName} — {b.type}</div>
                <div className="text-sm">{b.date} {b.time}</div>
              </div>
              <button className="btn btn-primary" onClick={() => { acceptBooking(b.id); refresh() }}>Aceptar</button>
            </div>
          ))}
        </div>
      </section>

      <section className="card">
        <h2 className="text-xl font-semibold mb-2">Mis servicios</h2>
        <div className="space-y-2">
          {mine.length === 0 && <p>No has aceptado reservas.</p>}
          {mine.map(b => (
            <div key={b.id} className="border rounded-xl p-3 flex items-center justify-between">
              <div>
                <div className="font-medium">{b.petName} — {b.type}</div>
                <div className="text-sm">{b.date} {b.time}</div>
              </div>
              <button className="btn" onClick={() => { completeBooking(b.id); refresh() }}>Marcar completada</button>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
