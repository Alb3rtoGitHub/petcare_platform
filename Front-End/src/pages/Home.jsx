import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div className="grid md:grid-cols-2 gap-6 items-center">
      <div className="space-y-4">
        <h1 className="text-4xl md:text-5xl font-extrabold">
          Cuidado y paseos para tu mejor amigo 🐶
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Reserva paseos, encuentra cuidadores de confianza y gestiona todo desde un solo lugar.
        </p>
        <div className="flex gap-3">
          <Link to="/login" className="btn btn-primary">Comenzar</Link>
           <Link to="/register/owner" className="btn btn-secondary">
            Registrarme
          </Link>
          <a href="#como-funciona" className="btn">Cómo funciona</a>
        </div>
      </div>
      <div className="card">
        <h2 id="como-funciona" className="text-xl font-semibold mb-2">Flujo básico</h2>
        <ol className="list-decimal ml-5 space-y-2">
          <li>El dueño inicia sesión y crea una reserva.</li>
          <li>Un cuidador acepta la solicitud y coordina horarios.</li>
          <li>El administrador supervisa calidad y conflictos.</li>
        </ol>
      </div>
    </div>
  )
}
