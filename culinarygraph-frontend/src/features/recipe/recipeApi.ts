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
}

export interface RecipeResponse {
  id: string
  title: string
  description: string
  difficulty: DifficultyLevel
  durationMinutes: number | null
  status: PublishStatus
  createdBy: string
  createdAt: string
  updatedAt: string
  steps: RecipeStepDto[]
  ingredients: RecipeIngredientDto[]
}

export interface CreateRecipeRequest {
  title: string
  description?: string
  difficulty?: DifficultyLevel
  durationMinutes?: number | null
  steps: { order: number; instruction: string }[]
  ingredients: { name: string; quantity?: string; unit?: string }[]
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
