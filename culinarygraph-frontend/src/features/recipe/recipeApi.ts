export type DifficultyLevel = 'EASY' | 'MEDIUM' | 'HARD'
export type PublishStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'

export interface RecipeStepDto {
  order: number
  instruction: string
}

export interface RecipeIngredientDto {
  name: string
  quantity: string
  unit: string
  ingredientId?: string | null
  substitution?: string
}

export interface RecipeResponse {
  id: string
  title: string
  description: string
  difficulty: DifficultyLevel
  durationMinutes: number | null
  country: string | null
  region: string | null
  status: PublishStatus
  createdBy: string
  createdAt: string
  updatedAt: string
  steps: RecipeStepDto[]
  ingredients: RecipeIngredientDto[]
  tags: string[]
  originStory: string | null
  associatedTechniqueIds: string[]
  specialDays: string[]
}

export interface CreateRecipeRequest {
  title: string
  description?: string
  difficulty?: DifficultyLevel
  durationMinutes?: number | null
  country?: string
  region?: string
  steps: { order: number; instruction: string }[]
  ingredients: { name: string; quantity?: string; unit?: string; substitution?: string; ingredientId?: string | null }[]
  tags?: string[]
  originStory?: string
  associatedTechniqueIds?: string[]
  specialDays?: string[]
}

import { apiClient } from '../../shared/api/client'

export async function fetchRecipes(): Promise<RecipeResponse[]> {
  return apiClient<RecipeResponse[]>('/recipes')
}

export async function fetchRecipe(id: string): Promise<RecipeResponse> {
  return apiClient<RecipeResponse>(`/recipes/${id}`)
}

export async function createRecipe(body: CreateRecipeRequest): Promise<RecipeResponse> {
  return apiClient<RecipeResponse>('/recipes', {
    method: 'POST',
    body: JSON.stringify(body),
  })
}

export async function updateRecipe(id: string, body: CreateRecipeRequest): Promise<RecipeResponse> {
  return apiClient<RecipeResponse>(`/recipes/${id}`, {
    method: 'PUT',
    body: JSON.stringify(body),
  })
}

export async function deleteRecipe(id: string): Promise<void> {
  return apiClient<void>(`/recipes/${id}`, { method: 'DELETE' })
}
