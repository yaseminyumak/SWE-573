import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createRecipe, updateRecipe, fetchRecipe } from './recipeApi'
import type { CreateRecipeRequest, DifficultyLevel } from './recipeApi'
import { fetchIngredients, fetchTechniques } from '../catalog/catalogApi'
import RelationPicker from '../../shared/components/RelationPicker'
import ImageManager from '../../shared/components/ImageManager'
import { useAuth } from '../../auth/AuthProvider'
import { COUNTRIES } from '../../shared/constants/countries'

const DIFFICULTIES: DifficultyLevel[] = ['EASY', 'MEDIUM', 'HARD']

export default function RecipeFormPage() {
  const { id } = useParams<{ id: string }>()
  const isEdit = !!id
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { keycloak } = useAuth()

  const [title, setTitle] = useState('')
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('MEDIUM')
  const [durationText, setDurationText] = useState('')
  const [country, setCountry] = useState('')
  const [region, setRegion] = useState('')
  const [ingredients, setIngredients] = useState([{ name: '' }])
  const [associatedTechniqueNames, setAssociatedTechniqueNames] = useState<string[]>([])
  const [steps, setSteps] = useState<string[]>([''])
  const [tags, setTags] = useState('')
  const [originStory, setOriginStory] = useState('')

  const { data: catalogIngredients = [] } = useQuery({ queryKey: ['catalog', 'ingredients'], queryFn: fetchIngredients })
  const { data: techniques = [] } = useQuery({ queryKey: ['catalog', 'techniques'], queryFn: fetchTechniques })
  const { data: existing } = useQuery({
    queryKey: ['recipes', id],
    queryFn: () => fetchRecipe(id!),
    enabled: isEdit,
  })

  const ingredientNames = catalogIngredients.map((i) => i.name)
  const techniqueNames = techniques.map((t) => t.name)
  const techniqueNameToId = new Map(techniques.map((t) => [t.name, t.id]))
  const techniqueIdToName = new Map(techniques.map((t) => [t.id, t.name]))

  useEffect(() => {
    if (!existing) return
    setTitle(existing.title)
    setDifficulty(existing.difficulty)
    setDurationText(existing.durationMinutes != null ? String(existing.durationMinutes) : '')
    setCountry(existing.country ?? '')
    setRegion(existing.region ?? '')
    setIngredients(existing.ingredients.length > 0 ? existing.ingredients.map((i) => ({ name: i.name })) : [{ name: '' }])
    setAssociatedTechniqueNames(
      (existing.associatedTechniqueIds ?? []).map((tid) => techniqueIdToName.get(tid) ?? '').filter(Boolean)
    )
    setSteps(existing.steps.length > 0 ? existing.steps.map((s) => s.instruction) : [''])
    setTags((existing.tags ?? []).join(', '))
    setOriginStory(existing.originStory ?? '')
  }, [existing])

  const mutation = useMutation({
    mutationFn: (body: CreateRecipeRequest) =>
      isEdit ? updateRecipe(id!, body) : createRecipe(body),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['recipes'] })
      navigate(isEdit ? `/recipes/${data.id}` : '/recipes')
    },
  })

  const addIng = () => setIngredients((s) => [...s, { name: '' }])
  const updateIng = (i: number, v: string) =>
    setIngredients((s) => s.map((x, idx) => idx === i ? { ...x, name: v } : x))
  const removeIng = (i: number) => setIngredients((s) => s.filter((_, idx) => idx !== i))

  const addStep = () => setSteps((s) => [...s, ''])
  const updateStep = (i: number, v: string) => setSteps((s) => s.map((x, idx) => idx === i ? v : x))
  const removeStep = (i: number) => setSteps((s) => s.filter((_, idx) => idx !== i))

  const parseDuration = (text: string): number | null => {
    const num = parseInt(text.replace(/[^0-9]/g, ''), 10)
    return isNaN(num) ? null : num
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    mutation.mutate({
      title: title.trim(),
      difficulty,
      durationMinutes: parseDuration(durationText),
      country: country && country !== 'Select Country' ? country : undefined,
      region: region.trim() || undefined,
      ingredients: ingredients
        .filter((i) => i.name.trim())
        .map((i) => ({ name: i.name.trim() })),
      steps: steps
        .filter((s) => s.trim())
        .map((s, i) => ({ order: i, instruction: s.trim() })),
      associatedTechniqueIds: associatedTechniqueNames
        .map((n) => techniqueNameToId.get(n))
        .filter((tid): tid is string => tid != null),
      tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
      originStory: originStory.trim() || undefined,
    })
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-6">
      <h1 className="text-xl font-bold text-[#171433]">{isEdit ? 'Edit Recipe' : 'New Recipe'}</h1>
      <hr className="my-3 border-[#d67ec9]" />

      {isEdit && existing?.createdBy === keycloak?.tokenParsed?.preferred_username && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Photos</label>
          <ImageManager entityType="RECIPE" entityId={id!} canEdit={true} />
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required
            placeholder="Enter recipe title"
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#8c2d9c]" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
          <select value={difficulty} onChange={(e) => setDifficulty(e.target.value as DifficultyLevel)}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-white focus:outline-none focus:border-[#8c2d9c]">
            {DIFFICULTIES.map((d) => <option key={d}>{d}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Duration (minutes)</label>
          <input type="number" min={0} value={durationText} onChange={(e) => setDurationText(e.target.value)}
            placeholder="e.g., 30"
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#8c2d9c]" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
          <select value={country || 'Select Country'} onChange={(e) => setCountry(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-white focus:outline-none focus:border-[#8c2d9c]">
            {COUNTRIES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Region</label>
          <input type="text" value={region} onChange={(e) => setRegion(e.target.value)}
            placeholder="e.g., Aegean Region"
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#8c2d9c]" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Ingredients</label>
          <div className="space-y-2">
            {ingredients.map((ing, i) => (
              <div key={i} className="flex gap-2">
                {ingredientNames.length > 0 ? (
                  <select value={ing.name} onChange={(e) => updateIng(i, e.target.value)}
                    className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm bg-white focus:outline-none focus:border-[#8c2d9c]">
                    <option value="">Select ingredient…</option>
                    {ingredientNames.map((n) => <option key={n} value={n}>{n}</option>)}
                  </select>
                ) : (
                  <input type="text" value={ing.name} onChange={(e) => updateIng(i, e.target.value)}
                    placeholder="Ingredient name"
                    className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#8c2d9c]" />
                )}
                <button type="button" onClick={() => removeIng(i)}
                  className="border border-gray-300 rounded px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                  Remove
                </button>
              </div>
            ))}
          </div>
          <button type="button" onClick={addIng}
            className="mt-2 border border-gray-300 rounded px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
            Add Ingredient
          </button>
        </div>

        <RelationPicker
          label="Associated Techniques"
          available={techniqueNames}
          selected={associatedTechniqueNames}
          onAdd={(n) => setAssociatedTechniqueNames((s) => [...s, n])}
          onRemove={(n) => setAssociatedTechniqueNames((s) => s.filter((x) => x !== n))}
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Steps</label>
          <div className="space-y-2">
            {steps.map((step, i) => (
              <div key={i} className="flex gap-2">
                <input type="text" value={step} onChange={(e) => updateStep(i, e.target.value)}
                  placeholder="Step description"
                  className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#8c2d9c]" />
                <button type="button" onClick={() => removeStep(i)}
                  className="border border-gray-300 rounded px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                  Remove
                </button>
              </div>
            ))}
          </div>
          <button type="button" onClick={addStep}
            className="mt-2 border border-gray-300 rounded px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
            Add Step
          </button>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
          <input type="text" value={tags} onChange={(e) => setTags(e.target.value)}
            placeholder="e.g., Vegetarian, Italian, Quick"
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#8c2d9c]" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Origin Story</label>
          <textarea value={originStory} onChange={(e) => setOriginStory(e.target.value)}
            rows={4}
            placeholder="Share the story behind this recipe..."
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#8c2d9c] resize-none" />
        </div>

        {mutation.isError && (
          <p className="text-sm text-red-500">Failed to save. Please try again.</p>
        )}

        <div className="flex gap-3">
          <button type="submit" disabled={mutation.isPending || !title.trim()}
            className="bg-[#8c2d9c] text-white rounded px-5 py-2 text-sm font-medium hover:bg-[#7a2589] disabled:opacity-50 transition-colors">
            {mutation.isPending ? 'Saving…' : isEdit ? 'Save Changes' : 'Create Recipe'}
          </button>
          <button type="button" onClick={() => navigate(-1)}
            className="border border-gray-300 rounded px-5 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}
