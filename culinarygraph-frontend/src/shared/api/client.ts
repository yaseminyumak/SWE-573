import { keycloak } from '../auth/keycloak'

const API_BASE = import.meta.env.VITE_API_BASE ?? '/api'

export async function apiClient<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options?.headers,
  }
  if (keycloak.authenticated && keycloak.token) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${keycloak.token}`
  }
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  })
  if (!res.ok) throw new Error(await res.text().catch(() => res.statusText))
  return res.json() as Promise<T>
}
