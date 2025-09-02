import { useState } from 'react'
import { createBooking } from '../../data/fakeApi.js'

export default function BookService() {
  const [form, setForm] = useState({ petName: '', date: '', time: '', type: 'walk', notes: '' })
  const [ok, setOk] = useState('')

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const submit = (e) => {
    e.preventDefault()
    const id = createBooking(form)
    setOk(`Reserva creada #${id}. Puedes verla en "Mis reservas".`)
    setForm({ petName: '', date: '', time: '', type: 'walk', notes: '' })
  }

  return (
    <div className="max-w-xl mx-auto card">
      <h1 className="text-2xl font-bold mb-4">Reservar servicio</h1>
      <form onSubmit={submit} className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <label className="block col-span-2 md:col-span-1">
            <span className="text-sm">Nombre de la mascota</span>
            <input required name="petName" value={form.petName} onChange={change} className="mt-1 w-full border rounded-xl p-2 bg-transparent"/>
          </label>
          <label className="block md:col-span-1">
            <span className="text-sm">Fecha</span>
            <input required type="date" name="date" value={form.date} onChange={change} className="mt-1 w-full border rounded-xl p-2 bg-transparent"/>
          </label>
          <label className="block md:col-span-1">
            <span className="text-sm">Hora</span>
            <input required type="time" name="time" value={form.time} onChange={change} className="mt-1 w-full border rounded-xl p-2 bg-transparent"/>
          </label>
        </div>
        <label className="block">
          <span className="text-sm">Tipo de servicio</span>
          <select name="type" value={form.type} onChange={change} className="mt-1 w-full border rounded-xl p-2 bg-transparent">
            <option value="walk">Paseo</option>
            <option value="care">Cuidado en casa</option>
            <option value="grooming">Baño/Peluquería</option>
          </select>
        </label>
        <label className="block">
          <span className="text-sm">Notas</span>
          <textarea name="notes" value={form.notes} onChange={change} className="mt-1 w-full border rounded-xl p-2 bg-transparent" rows="3" placeholder="Ej. requisitos, salud, etc."/>
        </label>
        <button className="btn btn-primary w-full">Crear reserva</button>
      </form>
      {ok && <p className="mt-3 text-green-600">{ok}</p>}
    </div>
  )
}
