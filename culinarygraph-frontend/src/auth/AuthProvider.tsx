import { createContext, useContext, type ReactNode } from 'react'
import { keycloak } from './keycloak'

type AuthContextValue = {
  keycloak: typeof keycloak
  login: () => void
  register: () => void
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

type AuthProviderProps = {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const value: AuthContextValue = {
    keycloak,
    login: () => keycloak.login(),
    register: () => keycloak.register({ redirectUri: window.location.origin + '/' }),
    logout: () => keycloak.logout(),
    isAuthenticated: keycloak.authenticated ?? false,
  }
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
