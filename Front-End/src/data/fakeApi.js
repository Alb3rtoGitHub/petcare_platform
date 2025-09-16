// Simple almacenamiento en localStorage simulando endpoints
const KEY = 'pc_bookings'
const SITTERS_KEY = 'pc_sitters_pending'

const load = () => JSON.parse(localStorage.getItem(KEY) || '[]')
const save = (arr) => localStorage.setItem(KEY, JSON.stringify(arr))

const loadSitters = () => JSON.parse(localStorage.getItem(SITTERS_KEY) || '[]')
const saveSitters = (arr) => localStorage.setItem(SITTERS_KEY, JSON.stringify(arr))

// Seed inicial
if (!localStorage.getItem(KEY)) {
  save([
    { id: 1, petName: 'Luna', date: '2025-09-03', time: '10:00', type: 'walk', notes: 'Es tímida', status: 'open', sitter: null },
    { id: 2, petName: 'Rocky', date: '2025-09-04', time: '15:00', type: 'care', notes: '', status: 'open', sitter: null }
  ])
}
if (!localStorage.getItem(SITTERS_KEY)) {
  saveSitters([
    { id: 1, name: 'Carla P.', experience: 2 },
    { id: 2, name: 'Miguel R.', experience: 1 }
  ])
}

export function createBooking(b) {
  const arr = load()
  const id = (arr.at(-1)?.id || 0) + 1
  arr.push({ id, status: 'open', sitter: null, ...b })
  save(arr)
  return id
}

export function getBookingsByOwner() {
  // En un sistema real filtraríamos por ownerId. Aquí devolvemos todas como demo.
  return load()
}

export function cancelBooking(id) {
  const arr = load().map(b => b.id === id ? { ...b, status: 'cancelled' } : b)
  save(arr)
}

export function getOpenBookings() {
  // En un sistema real filtraríamos por sitterId para "mine". Aquí, "mine" son las aceptadas.
  const all = load()
  return {
    open: all.filter(b => b.status === 'open'),
    mine: all.filter(b => b.status === 'accepted')
  }
}

export function acceptBooking(id) {
  const name = JSON.parse(localStorage.getItem('pc_user') || '{}')?.name || 'Yo'
  const arr = load().map(b => b.id === id ? { ...b, status: 'accepted', sitter: name } : b)
  save(arr)
}

export function completeBooking(id) {
  const arr = load().map(b => b.id === id ? { ...b, status: 'completed' } : b)
  save(arr)
}

export function getAllBookings() {
  return load()
}

export function getSittersPending() {
  return loadSitters()
}

export function approveSitter(id) {
  const rest = loadSitters().filter(s => s.id !== id)
  saveSitters(rest)
}

export function stats() {
  const all = load()
  return {
    total: all.length,
    completed: all.filter(b => b.status === 'completed').length,
    cancelled: all.filter(b => b.status === 'cancelled').length
  }
}
