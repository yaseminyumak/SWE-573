import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
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

function readAuthenticated() {
  return !!keycloak.authenticated
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(readAuthenticated)

  useEffect(() => {
    const sync = () => setIsAuthenticated(readAuthenticated())

    keycloak.onAuthSuccess = sync
    keycloak.onAuthError = sync
    keycloak.onAuthLogout = sync
    keycloak.onAuthRefreshSuccess = sync
    keycloak.onAuthRefreshError = sync

    // Catch-up after mount (init completed before first paint, but ordering can differ in prod).
    sync()

    return () => {
      keycloak.onAuthSuccess = undefined
      keycloak.onAuthError = undefined
      keycloak.onAuthLogout = undefined
      keycloak.onAuthRefreshSuccess = undefined
      keycloak.onAuthRefreshError = undefined
    }
  }, [])

  const postAuthRedirect = () => {
    const path = window.location.pathname || '/'
    return `${window.location.origin}${path.startsWith('/') ? path : `/${path}`}`
  }

  const login = useCallback(() => {
    keycloak.login({ redirectUri: postAuthRedirect() })
  }, [])

  const register = useCallback(() => {
    keycloak.register({ redirectUri: postAuthRedirect() })
  }, [])

  const logout = useCallback(() => {
    keycloak.logout()
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      keycloak,
      login,
      register,
      logout,
      isAuthenticated,
    }),
    [isAuthenticated, login, register, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
