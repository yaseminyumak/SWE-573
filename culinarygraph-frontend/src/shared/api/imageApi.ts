import { keycloak } from '../../auth/keycloak'

const API_BASE = import.meta.env.VITE_API_BASE ?? '/api'

export interface ImageMeta {
  id: string
  filename: string
  contentType: string
  displayOrder: number
  createdAt: string
}

export function imageUrl(id: string): string {
  return `${API_BASE}/images/${id}`
}

export async function fetchImages(entityType: string, entityId: string): Promise<ImageMeta[]> {
  const res = await fetch(`${API_BASE}/images/entity/${entityType}/${entityId}`)
  if (!res.ok) return []
  return res.json()
}

export async function uploadImage(entityType: string, entityId: string, file: File): Promise<ImageMeta> {
  const headers: Record<string, string> = {}
  if (keycloak.authenticated && keycloak.token) {
    headers['Authorization'] = `Bearer ${keycloak.token}`
  }
  const form = new FormData()
  form.append('file', file)
  const res = await fetch(`${API_BASE}/images/${entityType}/${entityId}`, {
    method: 'POST',
    headers,
    body: form,
  })
  if (!res.ok) throw new Error(await res.text().catch(() => res.statusText))
  return res.json()
}

export async function deleteImage(id: string): Promise<void> {
  const headers: Record<string, string> = {}
  if (keycloak.authenticated && keycloak.token) {
    headers['Authorization'] = `Bearer ${keycloak.token}`
  }
  await fetch(`${API_BASE}/images/${id}`, { method: 'DELETE', headers })
}
