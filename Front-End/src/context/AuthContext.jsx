import { createContext, useContext, useEffect, useState } from 'react'

const AuthCtx = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const stored = localStorage.getItem('pc_user')
    if (stored) setUser(JSON.parse(stored))
  }, [])

  const login = (role, name) => {
    const u = { role, name }
    setUser(u)
    localStorage.setItem('pc_user', JSON.stringify(u))
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('pc_user')
  }

  return (
    <AuthCtx.Provider value={{ user, login, logout }}>
      {children}
    </AuthCtx.Provider>
  )
}

export const useAuth = () => useContext(AuthCtx)
