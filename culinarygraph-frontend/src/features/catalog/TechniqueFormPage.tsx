import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createTechnique, updateTechnique, fetchTechnique, fetchIngredients } from './catalogApi'
import type { CreateTechniqueRequest, DifficultyLevel } from './catalogApi'
import RelationPicker from '../../shared/components/RelationPicker'
import ImageManager from '../../shared/components/ImageManager'
import { useAuth } from '../../auth/AuthProvider'
import { COUNTRIES } from '../../shared/constants/countries'

const DIFFICULTIES: DifficultyLevel[] = ['EASY', 'MEDIUM', 'HARD']

export default function TechniqueFormPage() {
  const { id } = useParams<{ id: string }>()
  const isEdit = !!id
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { keycloak } = useAuth()

  const [name, setName] = useState('')
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('MEDIUM')
  const [country, setCountry] = useState('')
  const [region, setRegion] = useState('')
  const [culturalNotes, setCulturalNotes] = useState('')
  const [prerequisites, setPrerequisites] = useState('')
  const [steps, setSteps] = useState<string[]>([''])
  const [selectedIngredientNames, setSelectedIngredientNames] = useState<string[]>([])

  const { data: ingredients = [] } = useQuery({ queryKey: ['catalog', 'ingredients'], queryFn: fetchIngredients })
  const { data: existing } = useQuery({
    queryKey: ['catalog', 'techniques', id],
    queryFn: () => fetchTechnique(id!),
    enabled: isEdit,
  })

  const ingredientNames = ingredients.map((i) => i.name)
  const ingredientNameToId = new Map(ingredients.map((i) => [i.name, i.id]))
  const ingredientIdToName = new Map(ingredients.map((i) => [i.id, i.name]))

  useEffect(() => {
    if (!existing) return
    setName(existing.name)
    setDifficulty(existing.difficulty)
    setCountry(existing.country ?? '')
    setRegion(existing.region ?? '')
    setCulturalNotes(existing.culturalNotes ?? '')
    setPrerequisites(existing.prerequisites ?? '')
    setSteps(existing.steps?.length > 0 ? existing.steps.map((s) => s.instruction) : [''])
    setSelectedIngredientNames(
      (existing.ingredientIds ?? []).map((iid) => ingredientIdToName.get(iid) ?? '').filter(Boolean)
    )
  }, [existing])

  const mutation = useMutation({
    mutationFn: (body: CreateTechniqueRequest) =>
      isEdit ? updateTechnique(id!, body) : createTechnique(body),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['catalog', 'techniques'] })
      navigate(isEdit ? `/catalog/techniques/${data.id}` : '/catalog/techniques')
    },
  })

  const addStep = () => setSteps((s) => [...s, ''])
  const updateStep = (i: number, v: string) => setSteps((s) => s.map((x, idx) => idx === i ? v : x))
  const removeStep = (i: number) => setSteps((s) => s.filter((_, idx) => idx !== i))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    mutation.mutate({
      name: name.trim(),
      difficulty,
      country: country && country !== 'Select Country' ? country : undefined,
      region: region.trim() || undefined,
      culturalNotes: culturalNotes.trim() || undefined,
      prerequisites: prerequisites.trim() || undefined,
      steps: steps
        .filter((s) => s.trim())
        .map((s, i) => ({ order: i, instruction: s.trim() })),
      ingredientIds: selectedIngredientNames
        .map((n) => ingredientNameToId.get(n))
        .filter((tid): tid is string => tid != null),
    })
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-6">
      <h1 className="text-xl font-bold text-[#171433]">{isEdit ? 'Edit Technique' : 'New Technique'}</h1>
      <hr className="my-3 border-[#d67ec9]" />

      {isEdit && existing?.createdBy === keycloak?.tokenParsed?.preferred_username && (
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Photos</label>
          <ImageManager entityType="TECHNIQUE" entityId={id!} canEdit={true} />
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required
            placeholder="Enter technique name"
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
          <label className="block text-sm font-medium text-gray-700 mb-1">Cultural Notes</label>
          <textarea value={culturalNotes} onChange={(e) => setCulturalNotes(e.target.value)}
            rows={3} placeholder="Enter cultural notes"
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#8c2d9c] resize-none" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Prerequisites</label>
          <textarea value={prerequisites} onChange={(e) => setPrerequisites(e.target.value)}
            rows={3} placeholder="Enter prerequisites"
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#8c2d9c] resize-none" />
        </div>

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

        <RelationPicker
          label="Related Ingredients"
          available={ingredientNames}
          selected={selectedIngredientNames}
          onAdd={(n) => setSelectedIngredientNames((s) => [...s, n])}
          onRemove={(n) => setSelectedIngredientNames((s) => s.filter((x) => x !== n))}
        />

        {mutation.isError && (
          <p className="text-sm text-red-500">Failed to save. Please try again.</p>
        )}

        <div className="flex gap-3">
          <button type="submit" disabled={mutation.isPending || !name.trim()}
            className="bg-[#8c2d9c] text-white rounded px-5 py-2 text-sm font-medium hover:bg-[#7a2589] disabled:opacity-50 transition-colors">
            {mutation.isPending ? 'Saving…' : isEdit ? 'Save Changes' : 'Create Technique'}
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
