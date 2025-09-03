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
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center px-4">
      <form onSubmit={submit} className="max-w-md w-full card space-y-4 bg-white shadow-lg">
        <h1 className="text-2xl font-bold text-center text-gray-800">Iniciar Sesión</h1>
        <label className="block">
          <span className="text-sm text-gray-600">Nombre</span>
          <input className="mt-1 w-full border border-gray-300 rounded-xl p-3 bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500" value={name} onChange={e=>setName(e.target.value)} placeholder="Tu nombre" />
        </label>
        <label className="block">
          <span className="text-sm text-gray-600">Rol</span>
          <select className="mt-1 w-full border border-gray-300 rounded-xl p-3 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500" value={role} onChange={e=>setRole(e.target.value)}>
            <option value="owner">Dueño</option>
            <option value="sitter">Cuidador</option>
            <option value="admin">Administrador</option>
          </select>
        </label>
        <button className="bg-gray-800 text-white w-full py-3 rounded-xl font-medium hover:bg-gray-700 transition-colors">Entrar</button>
      </form>
    </div>
  )
}
