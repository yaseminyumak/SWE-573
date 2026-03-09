import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createRecipe } from './recipeApi'
import type { CreateRecipeRequest, DifficultyLevel } from './recipeApi'

const DIFFICULTIES: DifficultyLevel[] = ['EASY', 'MEDIUM', 'HARD']

export default function RecipeFormPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('MEDIUM')
  const [durationMinutes, setDurationMinutes] = useState<number | ''>('')
  const [steps, setSteps] = useState<{ order: number; instruction: string }[]>([{ order: 0, instruction: '' }])
  const [ingredients, setIngredients] = useState<{ name: string; quantity: string; unit: string }[]>([
    { name: '', quantity: '', unit: '' },
  ])

  const createMutation = useMutation({
    mutationFn: (body: CreateRecipeRequest) => createRecipe(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recipes'] })
      navigate('/recipes')
    },
  })

  const addStep = () => {
    setSteps((s) => [...s, { order: s.length, instruction: '' }])
  }

  const updateStep = (index: number, instruction: string) => {
    setSteps((s) => s.map((step, i) => (i === index ? { ...step, instruction } : step)))
  }

  const removeStep = (index: number) => {
    setSteps((s) => s.filter((_, i) => i !== index).map((step, i) => ({ ...step, order: i })))
  }

  const addIngredient = () => {
    setIngredients((i) => [...i, { name: '', quantity: '', unit: '' }])
  }

  const updateIngredient = (index: number, field: 'name' | 'quantity' | 'unit', value: string) => {
    setIngredients((i) => i.map((ing, idx) => (idx === index ? { ...ing, [field]: value } : ing)))
  }

  const removeIngredient = (index: number) => {
    setIngredients((i) => i.filter((_, idx) => idx !== index))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const payload: CreateRecipeRequest = {
      title: title.trim(),
      description: description.trim() || undefined,
      difficulty,
      durationMinutes: durationMinutes === '' ? null : Number(durationMinutes),
      steps: steps.filter((s) => s.instruction.trim()).map((s, i) => ({ order: i, instruction: s.instruction.trim() })),
      ingredients: ingredients
        .filter((i) => i.name.trim())
        .map((i) => ({ name: i.name.trim(), quantity: i.quantity.trim() || undefined, unit: i.unit.trim() || undefined })),
    }
    if (payload.steps.length === 0) payload.steps = [{ order: 0, instruction: 'Mix and cook.' }]
    createMutation.mutate(payload)
  }

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">New recipe</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-1">Title *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full px-3 py-2 border rounded dark:bg-gray-800 dark:border-gray-700"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border rounded dark:bg-gray-800 dark:border-gray-700"
          />
        </div>
        <div className="flex gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Difficulty</label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as DifficultyLevel)}
              className="px-3 py-2 border rounded dark:bg-gray-800 dark:border-gray-700"
            >
              {DIFFICULTIES.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Duration (min)</label>
            <input
              type="number"
              min={0}
              value={durationMinutes}
              onChange={(e) => setDurationMinutes(e.target.value === '' ? '' : parseInt(e.target.value, 10))}
              className="w-24 px-3 py-2 border rounded dark:bg-gray-800 dark:border-gray-700"
            />
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium">Steps</label>
            <button type="button" onClick={addStep} className="text-sm text-blue-600 hover:underline">
              + Add step
            </button>
          </div>
          <ul className="space-y-2">
            {steps.map((step, index) => (
              <li key={index} className="flex gap-2">
                <input
                  value={step.instruction}
                  onChange={(e) => updateStep(index, e.target.value)}
                  placeholder={`Step ${index + 1}`}
                  className="flex-1 px-3 py-2 border rounded dark:bg-gray-800 dark:border-gray-700"
                />
                <button
                  type="button"
                  onClick={() => removeStep(index)}
                  disabled={steps.length <= 1}
                  className="px-2 text-red-600 disabled:opacity-40"
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium">Ingredients</label>
            <button type="button" onClick={addIngredient} className="text-sm text-blue-600 hover:underline">
              + Add ingredient
            </button>
          </div>
          <ul className="space-y-2">
            {ingredients.map((ing, index) => (
              <li key={index} className="flex gap-2 flex-wrap">
                <input
                  value={ing.name}
                  onChange={(e) => updateIngredient(index, 'name', e.target.value)}
                  placeholder="Name"
                  className="w-32 px-3 py-2 border rounded dark:bg-gray-800 dark:border-gray-700"
                />
                <input
                  value={ing.quantity}
                  onChange={(e) => updateIngredient(index, 'quantity', e.target.value)}
                  placeholder="Qty"
                  className="w-20 px-3 py-2 border rounded dark:bg-gray-800 dark:border-gray-700"
                />
                <input
                  value={ing.unit}
                  onChange={(e) => updateIngredient(index, 'unit', e.target.value)}
                  placeholder="Unit"
                  className="w-20 px-3 py-2 border rounded dark:bg-gray-800 dark:border-gray-700"
                />
                <button
                  type="button"
                  onClick={() => removeIngredient(index)}
                  disabled={ingredients.length <= 1}
                  className="px-2 text-red-600 disabled:opacity-40"
                >
                  ×
                </button>
              </li>
            ))}
          </ul>
        </div>
        {createMutation.isError && (
          <p className="text-red-600">Failed to create recipe. Try again.</p>
        )}
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={createMutation.isPending || !title.trim()}
            className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700 disabled:opacity-50"
          >
            {createMutation.isPending ? 'Saving…' : 'Create recipe'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/recipes')}
            className="px-4 py-2 rounded border dark:border-gray-600"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
