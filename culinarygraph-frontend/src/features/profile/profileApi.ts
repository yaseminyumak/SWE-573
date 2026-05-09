import { apiClient } from '../../shared/api/client'

export interface UserProfileResponse {
  username: string
  bio: string | null
}

export function fetchProfile(username: string): Promise<UserProfileResponse> {
  return apiClient<UserProfileResponse>(`/profiles/${username}`)
}

export function updateBio(bio: string): Promise<UserProfileResponse> {
  return apiClient<UserProfileResponse>('/profiles/me/bio', {
    method: 'PUT',
    body: JSON.stringify({ bio }),
  })
}
