import { useEffect, useState } from 'react'
import { getAllBookings, approveSitter, getSittersPending, stats } from '../../data/fakeApi.js'

export default function AdminDashboard() {
  const [bookings, setBookings] = useState([])
  const [pending, setPending] = useState([])
  const [metrics, setMetrics] = useState({ total: 0, completed: 0, cancelled: 0 })

  const refresh = () => {
    setBookings(getAllBookings())
    setPending(getSittersPending())
    setMetrics(stats())
  }

  useEffect(() => { refresh() }, [])

  return (
    <div className="space-y-6">
      <section className="grid md:grid-cols-3 gap-3">
        <div className="card"><div className="text-sm">Total reservas</div><div className="text-3xl font-bold">{metrics.total}</div></div>
        <div className="card"><div className="text-sm">Completadas</div><div className="text-3xl font-bold">{metrics.completed}</div></div>
        <div className="card"><div className="text-sm">Canceladas</div><div className="text-3xl font-bold">{metrics.cancelled}</div></div>
      </section>

      <section className="card">
        <h2 className="text-xl font-semibold mb-2">Aprobación de cuidadores</h2>
        <div className="space-y-2">
          {pending.length === 0 && <p>No hay solicitudes pendientes.</p>}
          {pending.map(s => (
            <div key={s.id} className="border rounded-xl p-3 flex items-center justify-between">
              <div>
                <div className="font-medium">{s.name}</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Experiencia: {s.experience} años</div>
              </div>
              <button className="btn btn-primary" onClick={() => { approveSitter(s.id); refresh() }}>Aprobar</button>
            </div>
          ))}
        </div>
      </section>

      <section className="card">
        <h2 className="text-xl font-semibold mb-2">Todas las reservas</h2>
        <div className="grid gap-2">
          {bookings.map(b => (
            <div key={b.id} className="border rounded-xl p-3 flex items-center justify-between">
              <div>
                <div className="font-medium">#{b.id} {b.petName} — {b.type}</div>
                <div className="text-sm">{b.date} {b.time} — Estado: <b>{b.status}</b></div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
