import { apiClient } from '../../shared/api/client'

export type Season = 'SPRING' | 'SUMMER' | 'FALL' | 'WINTER' | 'YEAR_ROUND'
export type DifficultyLevel = 'EASY' | 'MEDIUM' | 'HARD'
export type PublishStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'

export interface IngredientResponse {
  id: string
  name: string
  description: string
  country: string | null
  region: string
  seasons: Season[]
  substitutes: string[]
  provenanceStory: string | null
  relatedTechniqueIds: string[]
  status: PublishStatus
  createdBy: string
  createdAt: string
  updatedAt: string
}

export interface TechniqueStepDto {
  order: number
  instruction: string
}

export interface TechniqueResponse {
  id: string
  name: string
  description: string
  country: string | null
  region: string
  difficulty: DifficultyLevel
  steps: TechniqueStepDto[]
  ingredientIds: string[]
  culturalNotes: string | null
  prerequisites: string | null
  relatedTechniqueIds: string[]
  status: PublishStatus
  createdBy: string
  createdAt: string
  updatedAt: string
}

export interface CreateIngredientRequest {
  name: string
  country?: string
  region?: string
  seasons?: Season[]
  provenanceStory?: string
  substitutes?: string[]
  relatedTechniqueIds?: string[]
}

export interface CreateTechniqueRequest {
  name: string
  country?: string
  region?: string
  culturalNotes?: string
  prerequisites?: string
  difficulty?: DifficultyLevel
  steps?: { order: number; instruction: string }[]
  ingredientIds?: string[]
  relatedTechniqueIds?: string[]
}

export async function fetchIngredients(): Promise<IngredientResponse[]> {
  return apiClient<IngredientResponse[]>('/catalog/ingredients')
}

export async function fetchIngredient(id: string): Promise<IngredientResponse> {
  return apiClient<IngredientResponse>(`/catalog/ingredients/${id}`)
}

export async function createIngredient(body: CreateIngredientRequest): Promise<IngredientResponse> {
  return apiClient<IngredientResponse>('/catalog/ingredients', {
    method: 'POST',
    body: JSON.stringify(body),
  })
}

export async function updateIngredient(id: string, body: CreateIngredientRequest): Promise<IngredientResponse> {
  return apiClient<IngredientResponse>(`/catalog/ingredients/${id}`, {
    method: 'PUT',
    body: JSON.stringify(body),
  })
}

export async function deleteIngredient(id: string): Promise<void> {
  return apiClient<void>(`/catalog/ingredients/${id}`, { method: 'DELETE' })
}

export async function archiveIngredient(id: string): Promise<IngredientResponse> {
  return apiClient<IngredientResponse>(`/catalog/ingredients/${id}/archive`, { method: 'PUT' })
}

export async function fetchTechniques(): Promise<TechniqueResponse[]> {
  return apiClient<TechniqueResponse[]>('/catalog/techniques')
}

export async function fetchTechnique(id: string): Promise<TechniqueResponse> {
  return apiClient<TechniqueResponse>(`/catalog/techniques/${id}`)
}

export async function createTechnique(body: CreateTechniqueRequest): Promise<TechniqueResponse> {
  return apiClient<TechniqueResponse>('/catalog/techniques', {
    method: 'POST',
    body: JSON.stringify(body),
  })
}

export async function updateTechnique(id: string, body: CreateTechniqueRequest): Promise<TechniqueResponse> {
  return apiClient<TechniqueResponse>(`/catalog/techniques/${id}`, {
    method: 'PUT',
    body: JSON.stringify(body),
  })
}

export async function deleteTechnique(id: string): Promise<void> {
  return apiClient<void>(`/catalog/techniques/${id}`, { method: 'DELETE' })
}

export async function archiveTechnique(id: string): Promise<TechniqueResponse> {
  return apiClient<TechniqueResponse>(`/catalog/techniques/${id}/archive`, { method: 'PUT' })
}

export interface HeritageResponse {
  id: string
  name: string
  country: string
  description: string
  createdBy: string
  createdAt: string
  updatedAt: string
}

export interface CreateHeritageRequest {
  name: string
  country: string
  description: string
}

export async function fetchHeritages(): Promise<HeritageResponse[]> {
  return apiClient<HeritageResponse[]>('/heritage')
}

export async function fetchHeritage(id: string): Promise<HeritageResponse> {
  return apiClient<HeritageResponse>(`/heritage/${id}`)
}

export async function createHeritage(body: CreateHeritageRequest): Promise<HeritageResponse> {
  return apiClient<HeritageResponse>('/heritage', {
    method: 'POST',
    body: JSON.stringify(body),
  })
}

export async function updateHeritage(id: string, body: CreateHeritageRequest): Promise<HeritageResponse> {
  return apiClient<HeritageResponse>(`/heritage/${id}`, {
    method: 'PUT',
    body: JSON.stringify(body),
  })
}

export async function deleteHeritage(id: string): Promise<void> {
  return apiClient<void>(`/heritage/${id}`, { method: 'DELETE' })
}
