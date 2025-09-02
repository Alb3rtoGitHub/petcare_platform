import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export default function Navbar() {
  const { user, logout } = useAuth()
  return (
    <header className="border-b border-gray-200 dark:border-gray-800">
      <nav className="mx-auto max-w-6xl p-4 flex items-center gap-4">
        <Link to="/" className="text-2xl font-bold">
          <span className="text-primary">Pet</span>Care
        </Link>
        <div className="ml-auto flex items-center gap-3">
          {!user && <Link className="btn btn-primary" to="/login">Ingresar</Link>}
          {user && (
            <>
              {user.role === 'owner' && (
                <>
                  <Link to="/owner/book" className="btn">Reservar</Link>
                  <Link to="/owner/bookings" className="btn">Mis reservas</Link>
                </>
              )}
              {user.role === 'sitter' && (
                <Link to="/sitter" className="btn">Panel cuidador</Link>
              )}
              {user.role === 'admin' && (
                <Link to="/admin" className="btn">Admin</Link>
              )}
              <button className="btn" onClick={logout}>Salir</button>
            </>
          )}
        </div>
      </nav>
    </header>
  )
}
