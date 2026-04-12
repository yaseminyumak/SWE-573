import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createTechnique, fetchIngredients } from './catalogApi'
import type { CreateTechniqueRequest } from './catalogApi'
import RelationPicker from '../../shared/components/RelationPicker'

const COUNTRIES = ['Select Country', 'France', 'Italy', 'Turkey', 'Japan', 'Mexico', 'India', 'China', 'United States', 'Spain', 'Greece', 'Morocco', 'Thailand', 'Korea', 'Other']

export default function TechniqueFormPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const [name, setName] = useState('')
  const [country, setCountry] = useState('')
  const [region, setRegion] = useState('')
  const [culturalNotes, setCulturalNotes] = useState('')
  const [prerequisites, setPrerequisites] = useState('')
  const [steps, setSteps] = useState<string[]>([''])
  const [relatedIngredientNames, setRelatedIngredientNames] = useState<string[]>([])

  const { data: ingredients = [] } = useQuery({ queryKey: ['catalog', 'ingredients'], queryFn: fetchIngredients })
  const ingredientNames = ingredients.map((i) => i.name)

  const mutation = useMutation({
    mutationFn: (body: CreateTechniqueRequest) => createTechnique(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['catalog', 'techniques'] })
      navigate('/catalog/techniques')
    },
  })

  const addStep = () => setSteps((s) => [...s, ''])
  const updateStep = (i: number, v: string) => setSteps((s) => s.map((x, idx) => idx === i ? v : x))
  const removeStep = (i: number) => setSteps((s) => s.filter((_, idx) => idx !== i))

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    mutation.mutate({
      name: name.trim(),
      country: country && country !== 'Select Country' ? country : undefined,
      region: region.trim() || undefined,
      culturalNotes: culturalNotes.trim() || undefined,
      prerequisites: prerequisites.trim() || undefined,
      steps: steps
        .filter((s) => s.trim())
        .map((s, i) => ({ order: i, instruction: s.trim() })),
      relatedIngredientNames,
    })
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-6">
      <h1 className="text-xl font-bold text-[#171433]">Add / Edit Technique</h1>
      <hr className="my-3 border-[#d67ec9]" />

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Enter technique name"
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#8c2d9c]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Country *</label>
          <select
            value={country || 'Select Country'}
            onChange={(e) => setCountry(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm bg-white focus:outline-none focus:border-[#8c2d9c]"
          >
            {COUNTRIES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Region</label>
          <input
            type="text"
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            placeholder="e.g., Aegean Region"
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#8c2d9c]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Cultural Notes</label>
          <textarea
            value={culturalNotes}
            onChange={(e) => setCulturalNotes(e.target.value)}
            rows={3}
            placeholder="Enter cultural notes"
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#8c2d9c] resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Prerequisites</label>
          <textarea
            value={prerequisites}
            onChange={(e) => setPrerequisites(e.target.value)}
            rows={3}
            placeholder="Enter prerequisites"
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#8c2d9c] resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Steps</label>
          <div className="space-y-2">
            {steps.map((step, i) => (
              <div key={i} className="flex gap-2">
                <input
                  type="text"
                  value={step}
                  onChange={(e) => updateStep(i, e.target.value)}
                  placeholder="Step description"
                  className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:border-[#8c2d9c]"
                />
                <button
                  type="button"
                  onClick={() => removeStep(i)}
                  className="border border-gray-300 rounded px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={addStep}
            className="mt-2 border border-gray-300 rounded px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Add Step
          </button>
        </div>

        <RelationPicker
          label="Related Ingredients"
          available={ingredientNames}
          selected={relatedIngredientNames}
          onAdd={(n) => setRelatedIngredientNames((s) => [...s, n])}
          onRemove={(n) => setRelatedIngredientNames((s) => s.filter((x) => x !== n))}
        />

        {mutation.isError && (
          <p className="text-sm text-red-500">Failed to save. Please try again.</p>
        )}

        <div>
          <button
            type="submit"
            disabled={mutation.isPending || !name.trim()}
            className="bg-[#8c2d9c] text-white rounded px-5 py-2 text-sm font-medium hover:bg-[#7a2589] disabled:opacity-50 transition-colors"
          >
            {mutation.isPending ? 'Saving…' : 'Save'}
          </button>
        </div>
      </form>
    </div>
  )
}
