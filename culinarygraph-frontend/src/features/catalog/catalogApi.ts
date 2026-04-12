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
  relatedTechniqueNames: string[]
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
  relatedTechniqueNames: string[]
  relatedIngredientNames: string[]
  status: PublishStatus
  createdBy: string
  createdAt: string
  updatedAt: string
}

export interface CreateIngredientRequest {
  name: string
  country?: string
  region?: string
  seasonality?: string
  provenanceStory?: string
  substitutes?: string[]
  relatedTechniqueNames?: string[]
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
  relatedTechniqueNames?: string[]
  relatedIngredientNames?: string[]
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

export async function archiveTechnique(id: string): Promise<TechniqueResponse> {
  return apiClient<TechniqueResponse>(`/catalog/techniques/${id}/archive`, { method: 'PUT' })
}
