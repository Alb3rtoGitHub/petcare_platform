import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function Login() {
  const [role, setRole] = useState('owner')
  const [name, setName] = useState('')
  const { login } = useAuth()
  const nav = useNavigate()

  const submit = (e) => {
    e.preventDefault()
    login(role, name || (role === 'owner' ? 'Dueño' : role === 'sitter' ? 'Cuidador' : 'Admin'))
    if (role === 'owner') nav('/owner/book')
    else if (role === 'sitter') nav('/sitter')
    else nav('/admin')
  }

  return (
    <form onSubmit={submit} className="max-w-md mx-auto card space-y-4">
      <h1 className="text-2xl font-bold">Ingresar</h1>
      <label className="block">
        <span className="text-sm">Nombre</span>
        <input className="mt-1 w-full border rounded-xl p-2 bg-transparent" value={name} onChange={e=>setName(e.target.value)} placeholder="Tu nombre" />
      </label>
      <label className="block">
        <span className="text-sm">Rol</span>
        <select className="mt-1 w-full border rounded-xl p-2 bg-transparent" value={role} onChange={e=>setRole(e.target.value)}>
          <option value="owner">Dueño</option>
          <option value="sitter">Cuidador</option>
          <option value="admin">Administrador</option>
        </select>
      </label>
      <button className="btn btn-primary w-full">Entrar</button>
    </form>
  )
}
